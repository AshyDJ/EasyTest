import React from 'react'
import { useState, useEffect } from 'react';
import { useNavigate, Routes, Route } from "react-router-dom";
import { useLocation } from 'react-router-dom';
import { NavLink } from 'react-router-dom'
import Testui from './Testui';
import File from './File';
import Folder from './Folder';
import Navbar2 from './Navbar2';
const baseUrl = process.env.REACT_APP_API_BASE_URL;
function getToken()
{
  const tokenString = sessionStorage.getItem('token')
  const userToken = JSON.parse(tokenString)
  return userToken
}







const Succ = ({ route }) => {
  const navigate=useNavigate();
 
 const removeToken =  (e) => {
{
  fetch(`${baseUrl}/clear_User_status`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({user:token.user_name}),
  });

  sessionStorage.removeItem('token')
  navigate('/login') 
}
 }

  
  //const location = useLocation();
  //const { token } = location.state || {};
  const token=getToken();
  console.log("Token=",token);
  if(!token){
      return(<div>
        <h1>Session Over, Login again</h1>
        <NavLink to='/login'>Login</NavLink>
      </div>)
  }
  else{
    /*
  return (
    <div>
      <h1>Your Test Pad site</h1>
      <h1>User:{token.user_name}</h1>
      <button onClick={removeToken}>Logout</button>
    </div>
  )
    */
   return(
    <>
    <Folder />
    <br></br>
    <button onClick={removeToken}>Logout</button>
    </>
   )
}
}

export default Succ

/*
fetch('http://192.168.250.90:5000/saveLogData', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify(testData)
});

*/