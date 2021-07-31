// import * as io from 'socket.io-client';

// <!-- https://youtu.be/ZKEqqIO7n-k -->


// Query DOM

// const joinRoomButton = document.getElementById("room-button");
const sendbtn = document.getElementById("send");

var messageInput = document.getElementById("message");

var handle = document.getElementById("handle");
var roomInput = document.getElementById("room-input");

var btn = document.getElementById('send');
var output = document.getElementById('output');
var feedback = document.getElementById('feedback');



socket.on('connect', () => {
    let randRoom = Math.random().toString(36).substring(7);
    displayMessage("connect", socket);
    const room = roomInput.defaultValue = randRoom;
    socket.emit('join-room', room, message => {
        // displayMessage("join", room);
    });
})

socket.on('receive-msg', (message, userName) => {
    data = {handle: userName, msg: message};
    displayMessage("msg", data);
})

socket.on('typing', (userName) => {
    displayMessage("typing", userName)
});


sendbtn.addEventListener("click", e => {
    e.preventDefault();
    sendMsg();
});

function sendMsg() {
    const message = messageInput.value;
    const room = roomInput.value;
    const userName = handle.value;

    console.log(message);
    if (message === "") return;

    socket.emit('send-message', message, room, userName);
    document.getElementById('chat-window').scrollTop = document.getElementById('chat-window').scrollHeight;
    
    messageInput.value = "";
}

function JoinRoom(){
    room = roomInput.value;
    socket.emit('join-room', room, message => {
        displayMessage("join", room);
    });
    // displayMessage("You joined room: " + roomInput.value);
}

messageInput.addEventListener('keypress',  function(event){
    if (event.key === 'Enter'){
        sendMsg();
    }else{
        room = roomInput.value;
        socket.emit('typing', handle.value, room);
    }
})



function displayMessage(action, data) {
    feedback.innerHTML = '';
    if(action === "connect"){
        output.innerHTML += '<p><strong> You connected with id: ' + data.id;
    }else if(action === "msg"){
        output.innerHTML += '<p><strong>' + data.handle + ': </strong>' + data.msg + '</p>';
    }else if(action === "typing"){
        feedback.innerHTML = '<p><em>' + data + ' is typing a message...</em></p>';
    }else if(action === "join"){
        output.innerHTML += '<p><strong>' + 'You joined room:  </strong>' + data + '</p>';
    }
}


const button = document.querySelector('#emoji-button');
const picker = new EmojiButton();

button.addEventListener('click', () => {
  picker.togglePicker(button);
  
});

  picker.on('emoji', emoji => {
    messageInput.value += emoji;
  });



// let count = 0; 
// setInterval(() => {
//     socket.emit('ping', ++count); //socket.volatile to ignore missed messages
// }, 1000)

// document.addEventListener('keydown', e => {
//     if(e.target.matches('input')) return;

//     if(e.key === 'c') socket.connect();
//     if(e.key === 'd') socket.disconnect();
// })

