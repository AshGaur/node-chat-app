const users = []

const addUser = ({id,username,room,color})=>{
    if(!username || !room){
        return {
            error:'Username and room required !'
        }
    }
    const existuser = users.find((user)=>user.username===username)
    if(existuser){
        return {
            error:'User already exists !'
        }
    }
    username = username.trim().toLowerCase()
    room = room.trim().toLowerCase()
    const user = {id,username,room,color}
    users.push(user)
    return {user}
}

const removeUser = (id)=>{
    const index = users.findIndex((user)=>user.id === id)
    if(index==-1){
        return {
            error:'User doesn\'t exist'
        }
    }
    const user = users.splice(index,1)[0]
    return {user}
}

const getUser = (id)=>{
    const user = users.find((user)=>user.id===id)
    if(!user){
        return {
            error:'User not found'
        }
    }
    return {user}
}

const getUsersInRoom = (room)=>{
    const users_in_room = users.filter((user)=>user.room===room)
    return users_in_room
}

const getRooms = ()=>{
    const strings = Array.from(new Set(users.map((user)=>user.room)))
    const rooms = []
    strings.forEach((string)=>{
        rooms.push({
            room:string
        }) 
    })
    return rooms
}

module.exports={
    addUser,
    removeUser,
    getUser,
    getUsersInRoom,
    getRooms
}

// addUser({
//     id:10,
//     username:'Ashutosh',
//     room:'Alwar'
// })

// addUser({
//     id:10,
//     username:'dsfgf',
//     room:'asdas'
// })

// addUser({
//     id:10,
//     username:'jhyj',
//     room:'Alwar'
// })

// addUser({
//     id:10,
//     username:'tyu',
//     room:'cvbn'
// })

// addUser({
//     id:10,
//     username:'ioupy',
//     room:'567'
// })

// addUser({
//     id:10,
//     username:'kigghj',
//     room:'Alwar'
// })

// getRooms()

// const userone = {
//     id:10,
//     username:'Ashutosh',
//     room:'Alwar'
// }

// const usertwo = {
//     id:20,
//     room:'Disabled'
// }

// const {user,error} = addUser(userone)
// console.log(user,error)

// console.log(addUser(userone))
// console.log(addUser(usertwo))

// console.log(getUser(10))
// console.log(removeUser(10))
// console.log(getUsersInRoom('Alwar'))