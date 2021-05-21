const chatForm = document.getElementById('chat-form');
const roomName = document.getElementById('room-name');
const userList = document.getElementById('users');

let privateMessage = "";
let privateChat = "";
var private = false;




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
    chatMe(message);


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

function chatMe(message){
    var user = message.username;
    if (user == username) {
        $('.privateRoom').append(` <small class='type'>${message.username}&nbsp;<span class='text-info'>${message.time}</span></small> <div class="you">
        <p class="text">${message.text}</p>
      </div>`)
      } else {
        $('.privateRoom').append(` <small class='type1'>${message.username}&nbsp;<span class='text-info'>${message.time}</span></small> <div class="others mt-1">
        <p class="text1">${message.text}</p>
      </div>`)
      }
}





//Add Room name

function outputRoomName(room){
    roomName.innerText = room;
}

// function outputRoomUsers(users){
//     $('#users').empty();

//     userList.innerHTML = `${users.map(user=> `<li><span><img src="https://image.freepik.com/free-vector/man-avatar-profile-round-icon_24640-14046.jpg" alt="" class="fluid rounded-circle mr-3 mb-4 mt-3 id" height="50" width="50"></span><i class="fa fa-circle mr-2 text-success" aria-hidden="true"><br></i><p class='btn btn-outline-info mt-3 username' ><input type='hidden' value='${user.id}' id='friends'>${user.username}</p></li>`).join('')}`;
// }

function outputRoomUsers(users) {
    $('.userlist').empty()
    users.forEach((user) => {
        if (username == user.username) {
            $('.userlist').append(`<li class="p-2 text-dark mt-2" username="${user.username}" userid="${user.id}" style="border-radius:5rem;width:fit-content;background-color:white;"><small class='text-muted'>You -</small>&nbsp;${user.username}<i class="fa fa-circle ml-2 text-success" aria-hidden="true"></i></li>`);
        } else {
            $('.userlist').append(`<li class="p-2 mt-2 private" username="${user.username}" userid="${user.id}" style="border-radius:5rem;width:fit-content;"><i class="fas fa-user-friends"></i><input type='hidden' id='idOther' value='${user.id}'>&nbsp;<button id='btn-fr' class='btn-fr' style='border:none;background-color:transparent;'>${user.username}</button><i class="fa fa-circle text-sucess" aria-hidden="true"></i></li>`);
        }
    });
}













//Someone is typing
var timeout;
var typing = false

function timeoutFunction() {
    typing = false;
    socket.emit("typing", false);
}

$('#msg').keyup(function() {
    typing = true;
    socket.emit('typing', username + ' is typing');
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

