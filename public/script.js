// Query DOM
var socket = io();
const enterBtn = document.getElementById("enter");
const inputURL = document.getElementById("url");
const submitURLButton = $('#btn');
var link_ID = '';


enterBtn.addEventListener("click", () => {
  if (handle.value === "") {
    handle.setCustomValidity("Please enter a user name.");
  } else if (roomInput.value === "") {
    roomInput.setCustomValidity("Please enter a room name.");
  } else {
    JoinRoom();
    document.getElementById("landing").remove();
    document.getElementById("page-footer").style.bottom = 1;
    document.getElementById("main").style.display = "block";
  }
})


submitURLButton.click(function (event) {
  if (inputURL.value === "" || YouTubeGetID(inputURL.value) === null) {
    alert("Enter a valid YouTube link.");
  } else {
    link_ID = YouTubeGetID(inputURL.value);
    const mydata = {
      state: 'newVideo',
      time: 0,
      id: link_ID,
      room: roomInput.value
    };
    socket.emit('event', mydata, mydata.room);
  }
});


socket.on('event', msg => {
  if (msg.state === 'newVideo') {
    loadVideoById(msg.id);
  } else if (msg.state === 'play') {
    if (Math.abs(msg.time - player.getCurrentTime()) > 1) {
      seekTo(msg.time);
    }
    seekTo(msg.time);
    playVideo();
  } else if (msg.state === 'pause') {
    pauseVideo();
  }
});


initializeButtons();

function initializeButtons() {
  const playButton = $('#playVideo');
  const pauseButton = $('#pauseVideo');

  playButton.click(function (event) {
    const mydata = {
      state: 'play',
      time: player.getCurrentTime(),
      room: roomInput.value
    };
    socket.emit('event', mydata, mydata.room);
  });

  pauseButton.click(function (event) {
    const mydata = {
      state: 'pause',
      time: player.getCurrentTime(),
      room: roomInput.value
    };
    socket.emit('event', mydata, mydata.room);
  });
}

//https://stackoverflow.com/a/51870158
function YouTubeGetID(url) {
  let re = /^(https?:\/\/)?((www\.)?(youtube(-nocookie)?|youtube.googleapis)\.com.*(v\/|v=|vi=|vi\/|e\/|embed\/|user\/.*\/u\/\d+\/)|youtu\.be\/)([_0-9a-z-]+)/i;
  return url.match(re) === null ? null : url.match(re)[7];
}

//https://developers.google.com/youtube/iframe_api_reference

// 2. This code loads the IFrame Player API code asynchronously.
var tag = document.createElement('script');
tag.src = "https://www.youtube.com/iframe_api";
var firstScriptTag = document.getElementsByTagName('script')[0];
firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

// 3. This function creates an <iframe> (and YouTube player)
//    after the API code downloads.
var player; //4096 × 3072
function onYouTubeIframeAPIReady() {
  player = new YT.Player('player', {
    height: $("#video-container").height(),
    width: $("#video-container").width(),
    videoId: link_ID, //link_ID 'nhY1s6CZziE'
    events: {
      'onReady': onPlayerReady,
      'onStateChange': onPlayerStateChange
    },
    playerVars: {
      'playsinline': 1,
      //take out some youtube stuff https://developers.google.com/youtube/player_parameters
      'controls': 0,
      'disablekb': 1,
      'modestbranding': 1,
      'rel': 0,
      'showinfo': 0,
      'autoplay': 0,
      // 'pointer-events': none,
    },
  });
}

// 4. The API will call this function when the video player is ready.
function onPlayerReady(event) {
  //set size of progess bar 
  // $('#line').css("width",player.getDuration());
  //  event.target.playVideo();
}

// 5. The API calls this function when the player's state changes.
//    The function indicates that when playing a video (state=1),
//    the player should play for six seconds and then stop.
var done = false;

function onPlayerStateChange(event) {
  if (event.data === YT.PlayerState.PLAYING && !done) {
    setTimeout(stopVideo, 60000);
    done = true;
  }
}

function playVideo() {
  player.playVideo();
}

function stopVideo() {
  player.stopVideo();
}

function pauseVideo() {
  player.pauseVideo();
}


updateProgress();

async function updateProgress() {
  const progressBar = $('#progress-bar');
  const progressIndicator = $('#progress-indicator');

  //https://stackoverflow.com/questions/32540213/get-width-of-part-of-progress-bar-clicked-and-do-calculation-of-seconds
  progressBar.click(function (event) {
    const $this = $(this);

    const widthclicked = event.pageX - $this.offset().left;
    const totalWidth = $this.width();

    const calculatedProgress = (widthclicked / totalWidth) * player.getDuration();
    const calculatedProgressRounded = calculatedProgress.toFixed();

    const mydata = {
      state: 'play',
      time: calculatedProgressRounded,
      room: roomInput.value
    };
    socket.emit('event', mydata, mydata.room);
  });

  setInterval(function () {
    if (player === null || progressBar === null) {
      return;
    };
    document.querySelector("#currTime").innerHTML = convert_time(player.getCurrentTime().toFixed());
    document.querySelector("#totalTime").innerHTML = convert_time(player.getDuration().toFixed());

    const progressRatio = (player.getCurrentTime() / player.getDuration()) * 100;
    if (player.getCurrentTime() !== player.getDuration()) {
      progressIndicator.css("left", progressRatio.toString() + "%");
    }
  }, 1000);
}

function seekTo(seconds) {
  player.seekTo(seconds);
}

function loadVideoById(id) {
  player.loadVideoById(id);
}

function convert_time(seconds) {
  return new Date(seconds * 1000).toISOString().substr(11, 8)
}

const copyRight = document.getElementById("copyright");
copyRight.prepend("© Y-SYNC " + new Date().getFullYear());