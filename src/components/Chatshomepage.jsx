import React, { useState, useEffect } from 'react'
import './chatshomepage.css'
import axios from 'axios'
import io from 'socket.io-client'
import { useContext } from 'react';
import chatbackground from './images/defaultChatBackground.jpg'
import whiteChatBox from './images/whiteChatImg.png'
import message from './images/message.png'
import { Context } from './Usercontext';
const Chatshomepage = () => {
  const { currentuser, socket, refresh, setrefresh } = useContext(Context)
  const [searchinfo, setsearchname] = useState('')
  const [searchfind, setsearchfind] = useState('')
  const [currentchat, setcurrentchat] = useState('')
  const [messageinput, setmessageinput] = useState('')
  const [currentroom, setcurrentroom] = useState('')
  const [currentroomName, setcurrentroomName] = useState('')
  const [friendSearchBox, setFriendSearchBox] = useState(false)


  useEffect(() => {
    socket.on('recive_messege', (data) => {
      console.log(data);
      setcurrentchat((prev) => [...prev, { message: data.messageinput, author: data.author, messageTime: data.messageTime }])

    })
  }, [socket, currentroom])



  async function getroom(roomnumber) {
    try {
      const response = await axios.post('http://localhost:3014/rooms/getroom', { roomnumber: roomnumber })
      setcurrentchat(response.data.messages);
      setcurrentroom(response.data._id)
      setcurrentroomName(response.data.participants[0] == currentuser.username ? response.data.participants[1] : response.data.participants[0])
    } catch (err) {
      console.log(err.response.data);
    }
  }


  async function search() {
    if (searchinfo != '') {
      try {
        const response = await axios.post('http://localhost:3014/rooms/checkuser', { searchinfo: searchinfo })
        setsearchfind(response.data.username);
      } catch (err) {
        console.log(err.response.data);
      }
    }
  }

  function messageSendTime() {
    const currentDate = new Date()
    const hourStamp = currentDate.getHours()
    const minutesStamp = currentDate.getMinutes()
    const messageTime = `${hourStamp}:${minutesStamp}`
    return messageTime;
  }





  function findname(arr) {
    if (arr[0] == currentuser.username) {
      return 1
    } else {
      return 0
    }
  }


  async function createroom() {
    try {
      const response = await axios.post('http://localhost:3014/rooms/createroom', { loggeduser: currentuser.username, newfriend: searchfind })
      console.log('room created');
    } catch (err) {
      console.log(err.response.data);
    }
  }





  // async function sendmessage(roomnumber) {  
  //     try{
  //       // console.log(roomnumber);
  //       // const response  = await axios.post('http://localhost:3014/rooms/getroom',{roomnumber:roomnumber})
  //       const response  = await axios.post('http://localhost:3014/messages/newmes',{room:roomnumber,newmessage:messageinput})
  //       await socket.emit('send_messege',{room:roomnumber,messageinput:messageinput})
  //       setmessageinput('')
  //     }catch(err){
  //       console.log(err.response);
  //     }   
  // }

  async function sendmessage(roomnumber) {
    try {
      const promises = [
        axios.post('http://localhost:3014/messages/newmes', { room: roomnumber, newmessage: messageinput, author: currentuser.email, messageTime: messageSendTime() }),
        new Promise((resolve, reject) => {
          socket.emit('send_messege', { room: roomnumber, messageinput: messageinput, author: currentuser.email, messageTime: messageSendTime() }, (error) => {
            if (error) {
              console.log(error);
              reject(error);
            } else {
              resolve();
            }
          });
        })
      ];
      await Promise.all(promises);
      setmessageinput('');
    } catch (err) {
      console.log(err.response);
    }
  }






  return (
    <div className='main-chat-homepage'>

      <div className='chats-list-container'>
        {friendSearchBox && <div className='chats-search-container'>
          <h5 >add friend</h5>
          <input type="text" onChange={(e) => { setsearchname(e.target.value) }} />
          <button onClick={() => search()}>+</button>
        </div>}
        {searchfind != '' && <div className='add-friend-container'>
          <div className='add-friend-user-container'>
            <img className='room-image' src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSyQXWV25mzwg-gyg_Xu4l3p6NkLHtP8MhHGg&usqp=CAU" alt="" />
            {searchfind}
          </div>
          <button onClick={() => createroom()}>add</button>
        </div>}
        <div className='chats-groups'>
          <div className='chat-room-tooltip'>
            <h2>Chats</h2>
            <div className='add-friend-button' onClick={() => setFriendSearchBox(!friendSearchBox)}><img src={whiteChatBox} alt="" style={{ height: '25px' }} /></div>
          </div>
          <div className='chats-rooms-list'>
            {currentuser != '' && currentuser?.rooms.map((item, index) => (
              // <p key={index} onClick={()=>{getroom(item._id)}}>{item.participants[findname(item.participants)]}</p>
              <div className='chat-room' key={index} onClick={() => { getroom(item._id) }}>
                <img className='room-image' src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSyQXWV25mzwg-gyg_Xu4l3p6NkLHtP8MhHGg&usqp=CAU" alt="" />
                {item.participants[findname(item.participants)]}
              </div>
            ))}
          </div>
        </div>
      </div>



      <div className={currentchat ? 'chat-container' : 'chat-container-not-choosen'}>
        {currentchat && <div className='main-chat'>
          <div className='chat-name-box'>
            <p className='chat-name'>{currentroomName}</p>
          </div>
          <div className='chatbox'>
            {currentchat != '' && currentchat.map((item, index) => (
              <div key={index} className={item.author == currentuser.email ? 'selfMessageBubble' : 'incomingMessageBubble'}>
                <p className='message-text'>{item.message}</p>
                <p className='time-stamp'>{item.messageTime}</p>
              </div>
            ))}-
          </div>
          <div className='message-bar'>
            <textarea name="" id="" className='message-input' value={messageinput} onChange={(e) => setmessageinput(e.target.value)}></textarea >
            {/* <input className='message-input' type="text" value={messageinput} onChange={(e) => setmessageinput(e.target.value)} /> */}
            <button onClick={() => { sendmessage(currentroom) }} className='send-message-button'><img src={message} alt="" style={{ height: '2vh' }} /></button>
          </div>
        </div>}

        {!currentchat && <div className='chat-not-choosen'>
          <div>
            <h1>Chat not choosen</h1>
          </div>
        </div>}

      </div>


    </div>
  )
}

export default Chatshomepage
