//client-side js
//gets data from server

//socket io msg catcher{state, time, id} for line & button
var socket = io();



var enterBtn = document.getElementById("enter");

enterBtn.addEventListener("click", () => {

  if (handle.value === "") {
    handle.setCustomValidity("Please enter a user name.");
  }else if(roomInput.value === ""){
    roomInput.setCustomValidity("Please enter a room name.");
  } else {
    // roomInput.setCustomValidity("");
    
    // onclick="location.href='http://localhost:3000/main.html';"
    // console.log(handle.value);
    // console.log(roomInput.value);
  
  
    JoinRoom();
    document.getElementById("landing").remove();
    document.getElementById("page-footer").style.bottom = 1;
  
    // this.remove();
    document.getElementById("main").style.display = "block";
  }
})

var btn = $('#btn');
var link_ID = '';
var input = document.getElementById("url");

btn.click(function(event) {
  if(input.value === "" || YouTubeGetID(input.value) === null){
    alert("Enter a valid YouTube link.");
  }else{
    link_ID = YouTubeGetID(input.value);
    // player.videoId = link_ID;
    mydata = {state: 'newVideo', time: 0, id: link_ID, room: roomInput.value};
    socket.emit('event', mydata, mydata.room);
    console.log(link_ID);
  }
});


socket.on('event', msg => {
  if(msg.state == 'newVideo'){
    console.log(player.videoId)
    console.log("PLS WORK")
    console.log(msg.room)
    // pauseVideo();
    loadVideoById(msg.id); //...fixed the problem
  }else if(msg.state == 'play'){
    //seek ahead in video
    if(Math.abs(msg.time - player.getCurrentTime()) > 1){
      seekTo(msg.time); //calls yt seekto function
    }
    console.log(msg.room)
    seekTo(msg.time);
    playVideo();
  }else if(msg.state == 'pause'){
    console.log("WORK!")
    pauseVideo();
  }
});


initBtns();

function initBtns(){
  var playButton = $('#playVideo');
  var pauseButton = $('#pauseVideo');
  
  //send to server on click
  playButton.click(function (event){
    console.log("play")
    mydata = {state: 'play', time: player.getCurrentTime(), room: roomInput.value};
    console.log(mydata);
    //socket.emit('send-message', message, room);
    socket.emit('event', mydata, mydata.room);
  });

  pauseButton.click(function (event){
    console.log("pause")
    mydata = {state: 'pause', time: player.getCurrentTime(), room: roomInput.value};
    console.log(mydata);
    socket.emit('event',mydata, mydata.room);
  });
}

//https://stackoverflow.com/a/51870158
function YouTubeGetID(url){
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
   var player;//4096 × 3072
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
     console.log(event.data)
     if (event.data == YT.PlayerState.PLAYING && !done) {
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
 
  //  var pgb = document.querySelector('#progressbar');  
  //  var pgs = document.querySelector('#sqaure');  
  //  var line = document.querySelector('#line');  
   progessBarLoop();

   async function progessBarLoop() {
    // var Pcontainer = $('#progress-container');
    // var end = $('#totalTime');
    var line = $('#progress-bar');
    var indicator = $('#progress-indicator');

    // var currTime = player.playerInfo.currentTime == 0 ? 0 : player.getCurrentTime();
    // var videoLength = player.getDuration();
    
    //https://stackoverflow.com/questions/32540213/get-width-of-part-of-progress-bar-clicked-and-do-calculation-of-seconds
    line.click(function(event) {
      // var divOffset = $(this).offset();
      // var seekTo = (event.pageX - divOffset.left)/player.getDuration() * 740; //*740
        var $this = $(this);
    
        // to get part of width of progress bar clicked
        var widthclicked = event.pageX - $this.offset().left;
        var totalWidth = $this.width(); // can also be cached somewhere in the app if it doesn't change
    
        // do calculation of the seconds clicked
        var calc = (widthclicked / totalWidth) * player.getDuration(); // get the percent of bar clicked and multiply in by the duration
        var calc_fix = calc.toFixed();
        var seekTo = convert_time(calc_fix);
    
        console.log(seekTo + " - " + widthclicked);


      // if line clicked, then seek time & play
      var mydata = {state: 'play', time: calc_fix, room: roomInput.value};
      socket.emit('event',mydata, mydata.room);
      // console.log(seekTo);
    });

    setInterval(function(){
        if(player == null || line == null){
            return;
        }; 
          //update text
          document.querySelector("#currTime").innerHTML = convert_time(player.getCurrentTime().toFixed());
          document.querySelector("#totalTime").innerHTML = convert_time(player.getDuration().toFixed());       

          var ratio = (player.getCurrentTime()/player.getDuration()) * 100; //70
          // end.css("margin-left", $(window).width() - line.width() - 400);
          if( player.getCurrentTime() != player.getDuration()){
            indicator.css("left", ratio.toString() + "%"); 
          }
          console.log(player.getCurrentTime()); 
        }, 1000);
   }


   function seekTo(seconds){
     player.seekTo(seconds);
   }

   function loadVideoById(id){
     player.loadVideoById(id);
   }

   function convert_time(seconds) {
    // var s = seconds,
    // h = Math.floor(s/3600);
    // s -= h*3600;
    // var m = Math.floor(s/60);
    // s -= m*60;

    // if(seconds >= "3600") {
    //     return "0" + h + ":" + (m < 10 ? "0" + m : m) + ":" + (s < 10 ? "0" + s : s);
    // } else {
    //     return (m < 10 ? "0" + m : m) + ":" + (s < 10 ? "0" + s : s);
    // }
    return new Date(seconds * 1000).toISOString().substr(11, 8)
}

let copyR = document.getElementById("copyright");
copyR.prepend("© Y-SYNC " + new Date().getFullYear());


