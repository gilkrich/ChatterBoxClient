import React, { useState } from 'react'
import './login.css'
import TextField from '@mui/material/TextField';
import axios from 'axios'
import { useNavigate ,Link} from 'react-router-dom';
import { useContext } from 'react';
import { Context } from './Usercontext';
const Login = () => {
     const navigate = useNavigate()
    const [email,setemail] = useState('')
    const [password,setpassword] = useState('')
    const {refresh,setrefresh} = useContext(Context)

    async function login(e) {
        e.preventDefault()
        const usertoken = await axios.post('http://localhost:3014/users/login',{email:email,password:password})
       if (usertoken) {
        sessionStorage.setItem('token',usertoken.data.token)
          setrefresh(!refresh)
          navigate('/chatsroom')
       }
    }

  return (
    <div className='main-signup-page'>
        <div className='signup-container'>
        <div className='login-form-container'>
            <h1>Login</h1>
            <form className='login-form' onSubmit={(e)=>login(e)}>
            <TextField id="outlined-basic" onChange={(e)=>{setemail(e.target.value)}} label="Email" type='email' variant="outlined" style={{width:'300px'}} size='small'/>
            <TextField id="outlined-basic" onChange={(e)=>{setpassword(e.target.value)}} label="Password" variant="outlined" style={{width:'300px'}} size='small'/>
            <button className='login-button'>Login</button>
            </form>
            <p>Dont have a user? <Link to={'/sign'}>Create one here</Link></p>
        </div>
        <div className='signup-info-container'>
{/* <img src="https://png.pngtree.com/png-vector/20220526/ourmid/pngtree-online-registration-or-sign-up-login-for-account-on-smartphone-app-png-image_4740836.png" alt="" width='240px'/> */}
        </div>
        </div>
    </div>
  )
}

export default Login
