import React from 'react'
import { useNavigate} from "react-router-dom";
import { NavLink } from 'react-router-dom'
import Folder from './Folder';
import fetchConfig from './Config';
//const baseUrl = process.env.REACT_APP_API_BASE_URL;
function getToken()
{
  const tokenString = sessionStorage.getItem('token')
  const userToken = JSON.parse(tokenString)
  return userToken
}


const Succ = () => {
  const navigate=useNavigate();
  
 const removeToken =  async (e) => {
  //const config = await fetchConfig();
  fetch(`${process.env.REACT_APP_BACKEND_URL}/clear_User_status`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({user:token.user_name}),
  });

  sessionStorage.removeItem('token')
  navigate('/login') 
 }


  const token=getToken();
  console.log("Token=",token);
  if(!token){
      return(<div>
        <h1>Session Over, Login again</h1>
        <NavLink to='/login'>Login</NavLink>
      </div>)
  }
  else{
   return(
    <>
    <Folder />
    </>
   )
}
}

export default Succ
