import React, { useEffect,useState } from 'react';
import { Routes, Route, NavLink } from "react-router-dom";
import Testui from './Testui';
import { useParams } from 'react-router-dom';
import Navbar2 from './Navbar2';

const baseUrl = process.env.REACT_APP_API_BASE_URL;
const File = () => {
  



    const [data, setData] = useState(null);
    const [files, setFiles] = useState([]);
    var result; 
    const { file } = useParams();

    const fetchData = async () => {
      try {
          const response = await fetch(`${baseUrl}/folder/${file}/readfolderData`);
          result = await response.json();
          setData(result);
          setFiles(result);
          console.log(typeof(result));
        } catch (error) {
          console.error('Error fetching data:', error);
        }
      }
      const fetchfolderData = async () => {
        try {
            const response = await fetch(`${baseUrl}/folder/${file}`);
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

  const handleAddFile = (e) => {
    e.preventDefault();
    var filedata={
        fname:newFile,
        type:type
    };
    filearr.push(filedata);
    
    fetch(`${baseUrl}/folder/${file}/savefileData`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(filedata)
    });
    fetchData();
    setNewFile('');
    setType('');
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
        <li><span key={index}>
          <NavLink to={`/folder/${file}/testpad/${filearr}`}> {filearr}</NavLink>
        </span></li>
      ))
      }
      </ul>
      <div class="file-folder-wrapper">
      <form class='folder-file-form' onSubmit={handleAddFile}>
        <h2>Create New File</h2>
        <div class="input-field-folder-file">
        <input
          type="text"
          value={newFile}
          onChange={(e) => setNewFile(e.target.value)}
           required
        /><br />
        <label>Enter new file name</label>
      </div>
      <button className='folder-file-button' type="submit">Add Folder</button>
    </form>
    </div>
    </div>
    </div>
</>
);
};

export default File;
