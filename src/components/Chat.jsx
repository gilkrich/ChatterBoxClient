import React, { useEffect, useState } from 'react'
import './chat.css'
import { useContext } from 'react'
import { Context } from './Usercontext'

const Chat = () => {
  const { socket } = useContext(Context)
  const [ messege ,setmessege] = useState('')
  const [messeges,setmesseges] = useState([])
  const [ username ,setusername ] = useState('')
  const [ room ,setroom ] = useState('')

  const join = async () =>{
     
    if (username!=''&&room!='') {
      socket.emit("join_room" ,room)
    }

   }

  useEffect(()=>{
    socket.on("recive_messege",(data)=>{
      setmesseges((prevMessages) => [...prevMessages, data]);
        }) 

  },[socket])

 async function sendmessege() {
     if (messege!='') {
        const fullmessege = {
            room : room ,
            username : username , 
            messege : messege
        } 

        await socket.emit("send_messege",fullmessege)

        setmesseges((prevMessages) => [...prevMessages, fullmessege]);
     }
  }



  return (
    <div className='chat-page'>
       <div>
          <h1>hello</h1>
          <input type="text" placeholder='name' onChange={(e)=>{setusername(e.target.value)}}/>
          <input type="text" placeholder='room' onChange={(e)=>{setroom(e.target.value)}}/>
          <button onClick={()=>join()}>join</button>
         </div>
           <h1>contact name</h1>
           <div className='chat-main-body'>
             {messeges.map((item,index)=>(
                <p color='black'>
                    {item.messege}
                </p>
             ))}
           </div>
           <div className='chat-input'>
               <input type="text" placeholder='messege' onChange={(e)=>setmessege(e.target.value)}/>
               <button onClick={()=>sendmessege()}>send</button>
           </div>
    </div>
  )
}

export default Chat
