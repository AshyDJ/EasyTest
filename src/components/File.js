import React, { useEffect,useState } from 'react';
import { Routes, Route, NavLink } from "react-router-dom";
import Testui from './Testui';
import { useParams } from 'react-router-dom';
import Navbar2 from './Navbar2';
import fetchConfig from './Config';
//const baseUrl = process.env.REACT_APP_API_BASE_URL;
const File = () => {
  



    const [data, setData] = useState(null);
    const [files, setFiles] = useState([]);
    var result; 
    const { file } = useParams();

    const fetchData = async () => {
      //const config = await fetchConfig();
      try {
          const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/folder/${file}/readfolderData`);
          result = await response.json();
          setData(result);
          setFiles(result);
          console.log(typeof(result));
        } catch (error) {
          console.error('Error fetching data:', error);
        }
      }
      const fetchfolderData = async () => {
        //const config = await fetchConfig();
        try {
            const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/folder/${file}`);
            result = await response.json();
            setData(result);
            console.log(typeof(result));
          } catch (error) {
            console.error('Error fetching data:', error);
          }
        }

    useEffect(() => {  
        fetchfolderData();
        fetchData();
    },[]);
    


  const [newFile, setNewFile] = useState('');
  const [type, setType] = useState('');
  var filearr=[];

  const handleCreateFile = async (e) => {
    e.preventDefault();
    var filedata={
        fname:newFile,
        type:type
    };
    const index = filearr.indexOf(filedata);
    filearr.splice(index, 1);
    //const config = await fetchConfig();
    fetch(`${process.env.REACT_APP_BACKEND_URL}/folder/${file}/savefileData`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(filedata)
    });

    setNewFile('');
    setType('');
    fetchData();
  };


  const handleDeleteFile = async (e) => {
    e.preventDefault();
    // eslint-disable-next-line no-restricted-globals
    if(!confirm(`Are you sure you want to delete ${newFile} permanently?`))
      return;
    var filedata={
        fname:newFile,
        type:type
    };
    //const config = await fetchConfig();
    const response=await fetch(`${process.env.REACT_APP_BACKEND_URL}/folder/${file}/deletefileData`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(filedata)
    });
    if(response.status==404)
      alert("File Not Found");
    
    setNewFile('');
    setType('');
    fetchData();
  };


//Checks if session token is present for a user otherwise gotta login, sorta janky way to do
  function getToken()
  {
    const tokenString = sessionStorage.getItem('token')
    const userToken = JSON.parse(tokenString)
    return userToken
  }
  const token=getToken();
  if(!token){
    return(<div>
      <h1>Session Over, Login again</h1>
      <NavLink to='/login'>Login</NavLink>
    </div>);
  }


  return (
    <>
    <div className='folder-file-body'>
     <Navbar2 />
     <div class="list">
      <h2>{file}</h2>
      <h2>Test Files:</h2>
      <ul>

      {
      files.map((filearr, index) => (
        <li>
        <span key={index}>
         <NavLink to={`/folder/${file}/testpad/${filearr}`}> {filearr}</NavLink>
        </span>
        </li>
      ))
      }
      </ul>
      <div class="file-folder-wrapper">
      <form class='folder-file-form'>
        <div class="input-field-folder-file">
        <input
          type="text"
          value={newFile}
          onChange={(e) => setNewFile(e.target.value)}
           required
        /><br />
        <label>Enter file name</label>
      </div>
      <button className='folder-file-button' onClick={handleCreateFile}>Create File</button>
      <button className='folder-file-button' onClick={handleDeleteFile}>Delete File</button>
    </form>
    </div>
    </div>
    </div>
</>
);
};

export default File;
