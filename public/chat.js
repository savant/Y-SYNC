// Query DOM
const sendButton = document.getElementById("send");
const userHandle = document.getElementById("handle");

const roomInput = document.getElementById("room-input");
const messageInput = document.getElementById("message");
const typingFeedback = document.getElementById("feedback");
const chatOutput = document.getElementById("output");

socket.on("connect", () => {
  const randRoom = Math.random().toString(36).substring(7);
  displayMessage("connect", socket);
  const room = (roomInput.defaultValue = randRoom);
  socket.emit("join-room", room, (message) => {
    // displayMessage("join", room);
  });
});

socket.on("receive-msg", (message, userName) => {
  const data = {
    userHandle: userName,
    msg: message,
  };
  displayMessage("msg", data);
});

socket.on("typing", (userName) => {
  displayMessage("typing", userName);
});

sendButton.addEventListener("click", (e) => {
  e.preventDefault();
  sendMessage();
});

function sendMessage() {
  const message = messageInput.value;
  const room = roomInput.value;
  const userName = userHandle.value;

  if (message === "") return;

  socket.emit("send-message", message, room, userName);
  document.getElementById("chat-window").scrollTop =
    document.getElementById("chat-window").scrollHeight;

  messageInput.value = "";
}

function JoinRoom() {
  const room = roomInput.value;
  socket.emit("join-room", room, (message) => {
    displayMessage("join", room);
  });
}

messageInput.addEventListener("keypress", function (event) {
  if (event.key === "Enter") {
    sendMessage();
  } else {
    const room = roomInput.value;
    socket.emit("typing", userHandle.value, room);
  }
});

function displayMessage(action, data) {
  typingFeedback.innerHTML = "";
  if (action === "connect") {
    chatOutput.innerHTML += "<p><strong> You connected with id: " + data.id;
  } else if (action === "msg") {
    chatOutput.innerHTML +=
      "<p><strong>" + data.userHandle + ": </strong>" + data.msg + "</p>";
  } else if (action === "typing") {
    typingFeedback.innerHTML =
      "<p><em>" + data + " is typing a message...</em></p>";
  } else if (action === "join") {
    chatOutput.innerHTML +=
      "<p><strong>" + "You joined room:  </strong>" + data + "</p>";
  }
}
