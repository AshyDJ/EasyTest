import { Routes, Route } from "react-router-dom";
import Home from "./components/Home";
import Succ from "./components/Succ";
import { useState } from "react";
import Testui from "./components/Testui";
import File from "./components/File";
import Navbar2 from "./components/Navbar2";
import Login2 from "./components/Login2";
import Sign_up2 from "./components/Sign_up2";
import Report from "./components/Report";

function setToken(userToken)
{
  console.log("userToken=",userToken)
  sessionStorage.setItem('token',JSON.stringify(userToken))
}

function App() {
 
  return (
    <>

    <Routes>
      <Route path='/' element={<Home />} />
      <Route path='/sign_up' element={<Sign_up2 />} />
      <Route path='/login' element={<Login2 setToken={setToken}/>} />
      <Route path='/folder' element={<Succ />} />
      <Route path='/folder/:file' element={<File />} />
      <Route path='/folder/:file/testpad/:jfile' element={<Testui />} />
      <Route path='/report' element={<Report />} />
    </Routes>
    </>
  );
}

export default App;

//
/*
<Navbar2 />
    <Routes>
      <Route path='/' element={<Home />} />
      <Route path='/sign_up' element={<Sign_up2 />} />
      <Route path='/login' element={<Login2 setToken={setToken}/>} />
      <Route path='/folder' element={<Succ />} />
      <Route path='/folder/:file' element={<File />} />
      <Route path='/folder/:file/testpad/:jfile' element={<Testui />} />
    </Routes>
    


    background: url("https://images.pexels.com/photos/236380/pexels-photo-236380.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"), #000;
*/