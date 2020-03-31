const generateMessage = (username,color,text)=>{
    return {
        username,
        text,
        createdAt:new Date().getTime(),
        color
    }
}

const getLocation = (username,color,url)=>{
    return {
        username,
        url,
        createdAt:new Date().getTime(),
        color
    }
}

module.exports={
    generateMessage,
    getLocation
}