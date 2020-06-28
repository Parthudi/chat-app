const socket = io()

//elements
const messageHere     = document.querySelector('#message-here')
const form         = document.querySelector('#myForm')
const messageee = document.querySelector('#inpu')
const button       = document.querySelector('#btn')
const locationbar = document.querySelector('#location')

//templates
const templateMessage  = document.querySelector('#template-message').innerHTML
const templateLocation = document.querySelector('#template-location').innerHTML
const sidebarTemplate  = document.querySelector('#slidebar-template').innerHTML
//options
const {username, room} = Qs.parse(location.search, { ignoreQueryPrefix: true})

const autoScroll = () => {
    //new message element
    const newMessage = messageHere.lastElementChild

    //height of new message
    const newMessageStyles = getComputedStyle(newMessage)
    const newMessageMargin = parseInt(newMessageStyles.marginBottom)
    const newMessageHeight = newMessage.offsetHeight + newMessageMargin

    //visible height
    const visibleHeight = messageHere.offsetHeight

    //height of messages container
    const containerHeight = messageHere.scrollHeight

    //how far have i scrolled
    const scrollOffset = messageHere.scrollTop + visibleHeight

    if( containerHeight - newMessageHeight  <= scrollOffset ) {

        messageHere.scrollTop = messageHere.scrollHeight          //if we want the user to always scroll down this one is enough
    }
}

socket.on('message' , (comein) => {
    console.log(comein)

   const html = Mustache.render(templateMessage, {
        username: comein.username,
        mymessage: comein.text,
        CreatedAt: moment(comein.CreatedAt).format('h:mm a')
    })
    messageHere.insertAdjacentHTML('beforeend', html)  
    autoScroll()
})

socket.on('locationMessage', (locationCatch) => {
    console.log(locationCatch)

    const html = Mustache.render(templateLocation , {
        username: locationCatch.username,
        url : locationCatch.url,
        LocationTime: moment(locationCatch.CreatedAt).format('h:mm a') 
       
    })
    messageHere.insertAdjacentHTML('beforeend', html)
    autoScroll()
})

socket.on('roomData', ({room, user}) => {
    const html = Mustache.render(sidebarTemplate, {
        room,
        users: user,
    })
    document.querySelector('#sidebar').innerHTML = html

})
form.addEventListener('submit' , (e) => {
     e.preventDefault()

     //disable button
     button.setAttribute('disabled', 'disabled')
     
     const finalmessage = document.querySelector('#inpu').value

     messageee.value = ''
     messageee.focus()

      socket.emit('SendMessage', finalmessage , (error) => {
         //enable button
         button.removeAttribute('disabled')

         if(error) {
             return console.log('error occured')
         }
         console.log('message delivered')
     })
 })



locationbar.addEventListener('click', () => {
//disable location button
    locationbar.setAttribute('disabled', 'disabled')

    if(!navigator.geolocation) {
        console.log('geolocation is not supported on your browser')
    }

    navigator.geolocation.getCurrentPosition((position) => {
        
        socket.emit('SendLocation', {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
        }, (sucesslocation)=> {
               return console.log(sucesslocation)
        })
 //enable location button
        locationbar.removeAttribute('disabled')
    })
})

socket.emit('join' , { username, room }, (error) => {
    if(error) {
        alert(error)
        location.href = '/'
    }
}) 