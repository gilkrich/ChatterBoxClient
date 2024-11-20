import { useState } from 'react'
import './App.css'
import io from 'socket.io-client'
import Chat from './Chat'
import { Route, Routes } from 'react-router-dom';
import Layout from './Layout';
import Signup from './Signup';
import Login from './Login';
import Chatshomepage from './Chatshomepage';


const socket = io.connect("http://localhost:3014")

function App() {

  //  const [ username ,setusername ] = useState('')
  //  const [ room ,setroom ] = useState('')


  //  const join = async () =>{
     
  //   if (username!=''&&room!='') {
  //     socket.emit("join_room" ,room)
  //   }

  //  }

  return (
    <>
           <Routes>
        <Route path='/' element={<Layout/>}>
        <Route path='/chatsroom' element={<Chatshomepage/>}></Route>
        <Route path='/' element={<Login/>}></Route>
        <Route path='/sign' element={<Signup/>}></Route>
        <Route path='/chat' element={<Chat/>}></Route>
        </Route>
      </Routes>
    </>
  )
}

export default App
