import React from 'react'
import { useContext ,useEffect,useState} from 'react'
import { createContext } from 'react'
import axios from 'axios'
import io from 'socket.io-client'
export const Context  = createContext({})

const Usercontext = ({children}) => {
    const [refresh,setrefresh] = useState(false)
    const [currentuser,setcurrentuser] = useState('')
    const [currentroom, setcurrentroom] = useState('')

    const socket = io.connect("http://localhost:3014")
 
    useEffect(()=>{
         async function checktoken() {
          if (sessionStorage.getItem('token')) {
            const token = sessionStorage.getItem("token")
            const founduser = await axios.post('http://localhost:3014/users/finduser',{token:token})
            setcurrentuser(founduser.data)
            socket.emit('join_room',founduser.data.rooms)
          }else{
            setcurrentuser('')
          }
         }

         checktoken()
    },[refresh])

  return (
    <Context.Provider value={{socket,refresh,setrefresh,currentuser,currentroom,setcurrentroom}}>
        {children}
    </Context.Provider>
  )
}

export default Usercontext
