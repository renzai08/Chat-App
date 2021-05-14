const chatForm = document.getElementById('chat-form');
const roomName = document.getElementById('room-name');
const userList = document.getElementById('users');

const {username , room} = Qs.parse(location.search, {
    ignoreQueryPrefix: true
})



const socket = io();




socket.emit('joinRoom', { username, room});


socket.on('roomUsers', ({room, users}) =>{
    outputRoomName(room);
    outputRoomUsers(users);
})



socket.on('message', message => {
    console.log(message);
    outputMessage(message);


})

// Messages

chatForm.addEventListener('submit', (e) =>{
    e.preventDefault();

    const msg = e.target.elements.msg.value;
    socket.emit('chatMessage',msg);

    e.target.elements.msg.value = '';
    e.target.elements.msg.focus();

})

// Output message
function outputMessage(message) {

var user = message.username;
  if (user == username) {
    $('.chat-message').append(` <small class='type'>${message.username}&nbsp;<span class='text-info'>${message.time}</span></small> <div class="you">
    <p class="text">${message.text}</p>
  </div>`)
  } else {
    $('.chat-message').append(` <small class='type1'>${message.username}&nbsp;<span class='text-info'>${message.time}</span></small> <div class="others mt-1">
    <p class="text1">${message.text}</p>
  </div>`)
  }
}

//Add Room name

function outputRoomName(room){
    roomName.innerText = room;
}

function outputRoomUsers(users){
    $('#users').empty();
    userList.innerHTML = `${users.map(user=> `<li><i class="fa fa-circle mr-2 text-success" aria-hidden="true"><br></i>${user.username}</li>`).join('')}`;
}

var timeout;
var typing = false

function timeoutFunction() {
    typing = false;
    socket.emit("typing", false);
}

$('#msg').keyup(function() {
    typing = true;
    socket.emit('typing', 'Someone is typing');
    clearTimeout(timeout);
    timeout = setTimeout(timeoutFunction, 1000);
});

socket.on('typing', function(data) {
    if (data) {
        $('#typing').html(data);
    } else {
        $('#typing').html("");
    }
});