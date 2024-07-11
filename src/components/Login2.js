import React from 'react'
import { useState } from 'react';
import './style.css';
import { useNavigate, Routes, Route, NavLink } from "react-router-dom";
import PropTypes from 'prop-types';
import fetchConfig from './Config';
//const baseUrl = process.env.REACT_APP_API_BASE_URL;


  async function LoginUser(credentials) {
    const config = await fetchConfig();
    return fetch(`${config.backend_url}/login`,{
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(credentials)
    }).then(data => data.json())

  }
  const Login2 = ({setToken}) => {


    
  const navigate=useNavigate();
  const [name, setName] = useState()
  const [password, setPassword] = useState()
  

  const handleSubmit = async (e) => {
      e.preventDefault()
      const token = await LoginUser({
          name,
          password
      })
      
      setToken(token)
      navigate('/folder', { state: { token } });
  }



  return (
   <>
   <nav class="nav">
        <i class="uil uil-bars navOpenBtn"></i>
        <NavLink to='/login'>EasyTester</NavLink>
    </nav>
    
   <div class="loginbody">
    <div class="wrapper">
    <form onSubmit={handleSubmit} class="loginform">
      <h2 class="loginh2">Login</h2>
      <div class="input-field">
      <input type="text" id="name" name="name" 
      value={name} onChange={(e)=>setName(e.target.value)} required/>
        <label>User Name</label>
      </div>
      <div class="input-field">
      <input type="password" id="password" name="password"
      value={password} onChange={(e)=>setPassword(e.target.value)}  required/>
      <label>Password</label>
      </div>
      <div class="forget">
        <label for="remember">
          <input type="checkbox" id="remember"></input>
          <p>Remember me(WIP)</p>
        </label>
        <a href="#">Forgot password?</a>
      </div>
      <button class="loginbutton" type="submit">Log In</button>
      <div class="register">
        <p>Don't have an account? <NavLink to='/sign_up'>Sign up!</NavLink></p>
      </div>
    </form>
  </div>
  </div>
    </>
  )
}
Login2.propTypes = {
  setToken: PropTypes.func.isRequired
}
export default Login2
