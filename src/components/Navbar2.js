import React, { useEffect, useState } from 'react';
import './style.css'; // Ensure this path is correct
import { NavLink } from 'react-router-dom'

const Navbar2 = () => {

  useEffect(() => {
    const sidebar = document.querySelector(".sidebar");
    const closeBtn = document.querySelector("#btn");
    const searchBtn = document.querySelector(".bx-search");

    if (closeBtn && searchBtn && sidebar) {
      const handleToggle = () => {
        sidebar.classList.toggle("open");
        menuBtnChange();
      };

      closeBtn.addEventListener("click", handleToggle);
      searchBtn.addEventListener("click", handleToggle);

      function menuBtnChange() {
        if (sidebar.classList.contains("open")) {
          closeBtn.classList.replace("bx-menu", "bx-menu-alt-right");
        } else {
          closeBtn.classList.replace("bx-menu-alt-right", "bx-menu");
        }
      }

      // Cleanup event listeners on component unmount
      return () => {
        closeBtn.removeEventListener("click", handleToggle);
        searchBtn.removeEventListener("click", handleToggle);
      };
    }
  }, []); // Empty dependency array to run once when the component mounts

  function getToken()
  {
    const tokenString = sessionStorage.getItem('token')
    const userToken = JSON.parse(tokenString)
    return userToken
  }
  const token=getToken();
  



  return (
    <>
    <head>
  <meta charset="UTF-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <link rel="stylesheet" href="style.css" />
    <link rel="stylesheet" href="https://unicons.iconscout.com/release/v4.0.0/css/line.css" />
   <link href='https://unpkg.com/boxicons@2.0.7/css/boxicons.min.css' rel='stylesheet' />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  </head>
  
      <div className="sidebar">
  <div className="logo-details">
      <div className="logo_name"><NavLink to='/'>EasyTester</NavLink></div>
      <i className='bx bx-menu' id="btn" ></i>
  </div>
  <ul className="nav-list">
    <li>    
        <i className='bx bx-search' ></i>
       <input type="text" placeholder="Search..."></input>
       <span className="tooltip">Search</span>
    </li>
    <li>
    <NavLink to='/login'>
       <i className='bx bx-user' ></i>
       <span className="links_name">User</span>
       </NavLink>
     <span className="tooltip">User</span>
   </li>
   <li>
   <NavLink to='/folder'>
       <i className='bx bx-folder' ></i>
       <span className="links_name">Repository</span>
       </NavLink>
     <span className="tooltip">Repository</span>
   </li>  
   <li>
   <NavLink to='/report'>
       <i className='bx bxs-report' ></i>
       <span className="links_name">Reports</span>
       </NavLink>
     <span className="tooltip">Reports</span>
   </li>   
  
   <li className="profile">
       <div className="profile-details">
         <div className="name_job">
           <div className="name"> {token ? token.user_name : ''}</div>
           <div className="job">SocIT </div>
         </div>
       </div>
       
   </li>
  </ul>
</div>

      
    </>
  );
};

export default Navbar2;
