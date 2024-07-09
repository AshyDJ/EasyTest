import React, { useEffect, useState } from 'react';
import './testui.css';

const Status = ({active_users, fetchActiveUsers,Phase}) => {
    function getToken()
{
  const tokenString = sessionStorage.getItem('token')
  const userToken = JSON.parse(tokenString)
  return userToken
}
const token=getToken();


  useEffect(() => {
    fetchActiveUsers(Phase);
  }, [Phase]); // Fetch data once when component mounts

  

  const display_users = () => {
    console.log(active_users);
    
    return active_users.map((a_user, index) => (
      <div key={index}>
        <p> <span className={a_user.phase ? "edit-phase-color" : "log-phase-color"}>
        &#10687;</span>
            <b>{a_user.user}</b>: {a_user.folder} &gt; {a_user.file}</p>
      </div>
    ));
  };

  return (
    <div className='user-scrollable'>
      {display_users()}
    </div>
  );
};

export default Status;
