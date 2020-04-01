const socket = io()

//Grabbing from dom
const $form = document.querySelector('form')
const $sendmsg = document.querySelector('#sendmsg')
const $mymsg = document.querySelector('#mymsg')
const $sendloc = document.querySelector('#sendloc')
const $messages = document.querySelector('#messages')
const $sidebar = document.querySelector('#sidebar')

//Get Templates
const messageTemplate = document.querySelector('#message-template').innerHTML
const locationTemplate = document.querySelector('#location-template').innerHTML
const sidebarTemplate = document.querySelector('#sidebar-template').innerHTML
//Get address bar query string
const {username,room} = Qs.parse(location.search,{ignoreQueryPrefix:true})

console.log('username:',username)
console.log('room:',room)

//Autoscroll
const autoscroll = () => {
    // New message element
    const $newMessage = $messages.lastElementChild

    // Height of the new message
    const newMessageStyles = getComputedStyle($newMessage)
    const newMessageMargin = parseInt(newMessageStyles.marginBottom)
    const newMessageHeight = $newMessage.offsetHeight + newMessageMargin

    // Visible height
    const visibleHeight = $messages.offsetHeight

    // Height of messages container
    const containerHeight = $messages.scrollHeight

    // How far have I scrolled?
    const scrollOffset = $messages.scrollTop + visibleHeight

    if (containerHeight - newMessageHeight <= scrollOffset) {
        $messages.scrollTop = $messages.scrollHeight
    }
}

//Listening to events
socket.on('connected',()=>{
    console.log('New User Connected')
})

socket.on('roomData',({room,users})=>{
    const html = Mustache.render(sidebarTemplate,{room,users})
    $sidebar.innerHTML = html;
})

socket.on('message',({username,createdAt,text,color})=>{
    const html = Mustache.render(messageTemplate,{username,color,text,createdAt:moment(createdAt).format('h:mm a')})
    $messages.insertAdjacentHTML('beforeend',html)
    autoscroll()
})

socket.on('location',({username,createdAt,url,color})=>{
    const html = Mustache.render(locationTemplate,{username,color,createdAt:moment(createdAt).format('h:mm a'),url})
    $messages.insertAdjacentHTML('beforeend',html)
    autoscroll()
})

//Sending events to server
socket.emit('join',{username,room},(error)=>{
    if(error){
        console.log(error)
        location.href='/'
    }
})

$form.addEventListener('submit',(e)=>{
    e.preventDefault()
    $sendmsg.setAttribute('disabled','disabled')
    socket.emit('sendMessage',$mymsg.value,(status)=>{
        $sendmsg.removeAttribute('disabled')
        $mymsg.value=''
        $mymsg.focus()
        console.log(status)
    })
})

$sendloc.addEventListener('click',()=>{
    $sendloc.setAttribute('disabled','disabled')
    var flag=true
    navigator.geolocation.getCurrentPosition((position)=>{
       flag=false 
        socket.emit('sendLocation',{
            latitude:position.coords.latitude,
            longitude:position.coords.longitude
        },(status)=>{
            $sendloc.removeAttribute('disabled')
            console.log(status)
        })
    })
    setTimeout(()=>{
        if(flag){
            $sendloc.removeAttribute('disabled')
            return console.log('Location permissions Denied !')
        }
    },5000)
})