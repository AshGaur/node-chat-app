const express = require('express')
const http = require('http')
const path = require('path')
const socketio = require('socket.io')
const port = process.env.PORT || 3000
const app = express()
const server = http.createServer(app)
const io = socketio(server)
const Filter = require('bad-words')
const {generateMessage,getLocation} = require('./utils/chat-room-methods')
const publicdirpath = path.join(__dirname,'../public/')
const {addUser,getUser,removeUser,getUsersInRoom,getRooms} = require('./utils/chat-room-users')

app.use(express.static(publicdirpath))

const color = ['aquamarine','blanchedalmond','darkseagreen','coral','cyan']
var i=0
io.on('connection',(socket)=>{
    socket.emit('rooms',{
        rooms:getRooms()
    })
    
    socket.on('join',({username,room},callback)=>{
        
        const {error} = addUser({
            id:socket.id,
            username,
            room,
            color:color[i]
        })
        i++
        i=i>=color.length?0:i
        if(error){
            return callback(error)
        }
        socket.join(room)
        socket.broadcast.to(room).emit('message',generateMessage('System','lightgray',`${username} has joined the chat`))
        io.to(room).emit('roomData', {
            room,
            users: getUsersInRoom(room)
        })
        callback()
    })

    socket.on('sendMessage',(text,callback)=>{
        const {user,error}= getUser(socket.id)
        const filter = new Filter()
        if(filter.isProfane(text)){
            return callback({error:'Message cannot contain Profanity'})
        }
        if(error){
            return callback(error)
        }
        io.to(user.room).emit('message',generateMessage(user.username,user.color,text))
        callback('Message Delivered !')
    })
    
    socket.on('sendLocation',({latitude,longitude},callback)=>{
        if(!latitude || !longitude){
            return callback({error:'Cannot fetch location'})
        }
        const {user,error} = getUser(socket.id)
        if(error){
            return callback(error)
        }
        io.to(user.room).emit('location',getLocation(user.username,user.color,`https://google.com/maps?q=${latitude},${longitude}`))
        callback('Location Shared')
    })

    socket.on('disconnect',()=>{
        const {user} = removeUser(socket.id)
        if(user){
            io.to(user.room).emit('roomData', {
                room: user.room,
                users: getUsersInRoom(user.room)
            })
            return io.to(user.room).emit('message',generateMessage('System','lightgray',`${user.username} has left the chat !`))
        }
        
    })

})

server.listen(port,()=>{
    console.log('Server up and running on port:',port)
})