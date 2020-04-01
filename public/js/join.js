const socket = io()

socket.on('rooms',({rooms})=>{
    const html = Mustache.render(formTemplate,{rooms})
    $formdiv.innerHTML = html
})

const {username,room} = Qs.parse(location.search,{ignoreQueryPrefix:true})

if(username && room){
    location.href=`/chat-room-home.html?username=${username}&room=${room}`
} 

const $formdiv = document.querySelector('#formdiv')


const formTemplate = document.querySelector('#form-template').innerHTML
