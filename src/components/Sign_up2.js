
import React from 'react'
import { useState } from 'react'
import './style.css';
import { NavLink, useNavigate } from 'react-router-dom';
import fetchConfig from './Config';
//const baseUrl = process.env.REACT_APP_API_BASE_URL;

const Sign_up2 = () => {
  
    const [name,setName]=useState("");
    const[email,setEmail]=useState("");
    const[password,setPassword]=useState("");

    const handleOnSubmit=async(e)=>{
        e.preventDefault();
        const config = await fetchConfig();
        let result=await fetch(
            `${config.backend_url}/sign_up`,{
                method:"POST",
                body:JSON.stringify({name,email,password}),
                headers:{
                    'Content-Type': 'application/json'
                }
            }
        )
        result=await result.json();
        console.warn(result);
        if(result){
            setEmail("");
            setName("");
            setPassword("");
        }
    }    



  return (
    <>
    <nav class="nav">
        <i class="uil uil-bars navOpenBtn"></i>
        <NavLink to='/login'>EasyTester</NavLink>
    </nav>

       <div class="loginbody">
     <div class="wrapper">
    <form onSubmit={handleOnSubmit} class="loginform">
      <h2 class="loginh2">Sign up</h2>
      <div class="input-field">
      <input type="text" id="name" name="name" 
   value={name} onChange={(e)=>setName(e.target.value)} required/>
        <label>Enter your User Name</label>
      </div>
        <div class="input-field">
        <input type="email"  id="email" name="email"
    value={email} onChange={(e)=>setEmail(e.target.value)}  required/>
        <label>Enter your  email</label>
      </div>
      <div class="input-field">
      <input type="password"  id="password" name="password"
   value={password} onChange={(e)=>setPassword(e.target.value)}  required/>
        <label>Enter your password</label>
      </div>
      <button type="submit" class="loginbutton">Sign Up</button>
      <div class="register">
        <p>Have an Account? <NavLink to='/login'>Login!</NavLink></p>
      </div>
    </form>
    
  </div>
  </div>
    </>
  );
}

export default Sign_up2
