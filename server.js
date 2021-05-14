const path = require('path');
const http = require('http');
const express = require('express');
const socketio = require('socket.io');
const formatMessage = require('./utils/messages');
const { userJoin, getCurrentUsers, userLeave, getRoomUsers } = require('./utils/users')

const app = express();
const server = http.createServer(app);
const io = socketio(server);

app.use(express.static(path.join(__dirname, 'public')));

const appName = 'Raizen Chat App';


io.on('connection', socket => {

    socket.on('typing', function (data) {
        socket.broadcast.emit('typing', data);
    });
   


    socket.on('joinRoom', ({ username, room }) => {
        const user = userJoin(socket.id, username, room);
        socket.join(user.room)



        // Welcome current user
        socket.emit('message', formatMessage(appName, 'Welcome to Raizen Chat App'));

        // Broadcast when user connects
        socket.broadcast.to(user.room).emit('message', formatMessage(appName, `${user.username} has join the chat`));

        io.to(user.room).emit('roomUsers', {
            room: user.room,
            users: getRoomUsers(user.room)
        })

    })
    


    //Listen for chat Messages
    socket.on('chatMessage', msg => {
        const user = getCurrentUsers(socket.id);
        io.to(user.room).emit('message', formatMessage(user.username, msg));
        
    })

    
    

    // Run when client disconnected
    socket.on('disconnect', () => {
        const user = userLeave(socket.id);

        if (user) {
            io.to(user.room).emit('message', formatMessage(appName, `${user.username} has left the chat`));

            io.to(user.room).emit('roomUsers', {
                room: user.room,
                users: getRoomUsers(user.room)
            })
        }

    })
})




const PORT = 3000 || process.env.PORT;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
