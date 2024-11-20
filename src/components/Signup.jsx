import React, { useState } from 'react'
import './signup.css'
import TextField from '@mui/material/TextField';
import axios from 'axios'
import { useNavigate ,Link} from 'react-router-dom';
import { useContext } from 'react';
import { Context } from './Usercontext';



const Signup = () => {
  const navigate = useNavigate()
  const {refresh,setrefresh} = useContext(Context)
  const [email,setemail] = useState('')
  const [phone,setphone] = useState('')
  const [username,setusername] = useState('')
  const [password,setpassword] = useState('')
  const [verify,setverify] = useState('')

 async function signup(e) {
    e.preventDefault()
    if (password==verify&&password!=''&&verify!='') {
      const createduser = await axios.post("http://localhost:3014/users/register",{email:email,phone:phone,username:username,password:password})
      sessionStorage.setItem('token',createduser.data.token)
          setrefresh(!refresh)
          navigate('/chatsroom')
    }else{
      console.log("passwords dont match");
    }
   }

  return (
    <div className='main-signup-page'>
        <div className='signup-container'>
        <div className='signup-form-container'>
            <h1>Sign-up</h1>
            <form className='signup-form' onSubmit={(e)=>signup(e)}>
            <TextField id="outlined-basic" onChange={(e)=>{setemail(e.target.value)}} label="Email" type='email' variant="outlined" style={{width:'300px'}} size='small'/>
            <TextField id="outlined-basic" onChange={(e)=>{setphone(e.target.value)}} label="Phone" variant="outlined" style={{width:'300px'}} size='small'/>
            <TextField id="outlined-basic" onChange={(e)=>{setusername(e.target.value)}} label="Username" variant="outlined" style={{width:'300px'}} size='small'/>
            <TextField id="outlined-basic" onChange={(e)=>{setpassword(e.target.value)}} label="Password" variant="outlined" style={{width:'300px'}} size='small'/>
            <TextField id="outlined-basic" onChange={(e)=>{setverify(e.target.value)}} label="Verify Password" variant="outlined" style={{width:'300px'}} size='small'/>
            <button className='sign-up-button'>Create-User</button>
            </form>
            <p>Already have a user? <Link to={'/'}>Sign in here</Link></p>
        </div>
        <div className='signup-info-container'>
<img src="https://png.pngtree.com/png-vector/20220526/ourmid/pngtree-online-registration-or-sign-up-login-for-account-on-smartphone-app-png-image_4740836.png" alt="" width='240px'/>
        </div>
        </div>
    </div>
  )
}

export default Signup
