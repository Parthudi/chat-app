//addUser, removeUser, getUser, getUsersInRoom
const users = []

//clean the data
const addUser = ({ id , username , room}) => {
    username = username.trim().toLowerCase()
    room     = room.trim().toLowerCase()

//valid the data
    if( !username || !room) {
        return {
            error : 'username/room cannot be empty'
        }
    }

   const roomData = room.toUpperCase(); 
   let newRoom = {}

   if(roomData.includes("KAMAL")){
       room = "dr.kamal";
        newRoom["doctor"] = ({
                name:"dr.kamal"
            })
   }else if(roomData.includes("DILIP")){
       room = "dr.dilip";
        newRoom["doctor"] = ({
            name:"dr.dilip"
        })
   }else if(roomData.includes("DEVI")){
        room = "dr.devi";
        newRoom["doctor"] = ({
            name:"dr.devi"
        })
       
   }else if(roomData.includes("NARESH")){
       room = "dr.naresh";
        newRoom["doctor"] = ({
            name:"dr.naresh"
        })
    }else if(roomData.includes("INDIRA")){
        room = "de.indira";
        newRoom["doctor"] = ({
            name:"dr.indira"
        })
        
    }else if(roomData.includes("KAMINI")){
        room = "dr.kamini";
        newRoom["doctor"] = ({
            name:"dr.kamini"
        })
        
    }else if(roomData.includes("RAMAKANTA")){
        room = "dr.ramakanta";
        newRoom["doctor"] = ({
            name:"dr.ramakanta"
        })
        
    }else if(roomData.includes("DEEPAK")){
        room = "dr.deepak";
        newRoom["doctor"] = ({
            name:"dr.deepak"
        })
        
    }else if(roomData.includes("MOHIT")){
        room = "dr.mohit";
        newRoom["doctor"] = ({
            name:"dr.mohit"
        })
        
    }else if(roomData.includes("RUKHMABAI")){
        room = "dr.rukhmabai";
        newRoom["doctor"] = ({
            name:"dr.rukhmabai"
        })
        
    }else{
        return {
            error: 'Doctor doesnot exist'
        }
    }

//check the existing user
    const existingUser = users.find((user) => {
        return user.room === room && user.username === username
    })

    if(existingUser) {
        return {
            error: 'Username Already Exist Use Different UserName'
        }
    }

//store user
    const moreUser = users.find((user) => {
        return user.room === room && users.length >=3
    })

    if(moreUser) {
        return {
            error: 'Doctor is busy With another Customer!! Please Come Back Later'
        }
    }

const user = {id, username, room}
            users.push(user)
            return{ user }
 }
 
const removeUser = (id) => {
    const index = users.findIndex((user) =>  user.id === id)

        if(index !== -1) {
             return users.splice(index, 1)[0]
        }
}

const getUser = (id) => {
    return users.find((user) => user.id === id )

}

const getUsersInRoom = (room) => {

    room = room.toLowerCase().trim()
    return users.filter((user) =>   user.room === room)
    }


module.exports = {
    addUser, 
    removeUser, 
    getUser, 
    getUsersInRoom
}