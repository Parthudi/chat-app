                                        //we cannot use "socket.io" & "express" at same time so we will refactore 'express' little bit //
const path = require('path')
const http = require('http')
const express = require('express')
const socketio = require('socket.io')
const Filter  = require('bad-words')
const {generateMessage, generateLocationMessage} = require('./utils/messages')
const {addUser, removeUser, getUser,  getUsersInRoom} = require('./utils/users')

const app = express()                                                                             //this will generate a new application
const server = http.createServer(app)
const io = socketio(server)                                    //socket takes only raw http server so we have to refactore express ...

const port = process.env.PORT || 3000 

const publicDirectoryPath = path.join(__dirname, '../public') 

app.use(express.static(publicDirectoryPath))

//server(emit) -> client(receive) -> countUpdated    
//client(emit) -> server(receive) -> increment     
  //(connection & disconnect) are build in events 
                                               //socket=client info//
io.on('connection', (socket) => {
        console.log('new connectection')
                                                                  //server will send this data to client that connected/
       
         socket.on('join', ({username, room}, callback )=> {
                
                const {error, user} = addUser({ id: socket.id, username, room})

                if(error) {
                        return callback(error)
                }
                socket.join(user.room)

                socket.emit('message', generateMessage('Admin', 'Welcome'))
        
                 socket.broadcast.to(user.room).emit('message', generateMessage(user.username, user.username+ ' has joined!!') )

                 io.to(user.room).emit('roomData', {
                         room: user.room,
                         user : getUsersInRoom(user.room)
                 })
                 callback()
        })

//listener for sending message 
        socket.on('SendMessage', (finalmessage, callback) => {

                const user = getUser(socket.id) 

                const filter = new Filter()

                if(filter.isProfane(finalmessage)){
                      return  callback('bad-words not allowed')
                }

                io.to(user.room).emit('message', generateMessage(user.username, finalmessage))
                callback()
        })  
//listener for sending location        
        socket.on('SendLocation', (objcapture, callback) => {

           const user = getUser(socket.id)

           io.to(user.room).emit('locationMessage',  generateLocationMessage( user.username, 'https://google.com/maps?q='+objcapture.latitude+','+objcapture.longitude))
           callback('location delivered !!!')
        })

     
       
//listener for disconnecting
        socket.on('disconnect', () => {

                const user = removeUser(socket.id)

                if(user) {

                        io.to(user.room).emit('message', generateMessage('Admin', user.username+ ' had left the chat'))

                        io.to(user.room).emit('roomData', {
                                room: user.room,
                                user : getUsersInRoom(user.room)
                        })
                }
         })

})
server.listen( port, () => {
        console.log('server is running on ' +port)
})












/*  socket.emit('countUpdated', count)                   //and to send a message from sever to client we use socket.emit method
        socket.on('increment', () => {
                count++
         // socket.emit('countUpdated', count)  //this will get updated for single user that is connected to server
         io.emit('countUpdated', count)         //this will get updated for all the user that are connected
        }) */ 