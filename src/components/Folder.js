
import React, { useEffect,useState } from 'react';
import { Routes, Route, NavLink } from "react-router-dom";
import Navbar2 from './Navbar2';
import fetchConfig from './Config';

//const baseUrl = process.env.REACT_APP_API_BASE_URL;
const Folder = () => {

    const [data, setData] = useState(null);
    const [folders, setfolders] = useState([]);
    const [newfolder, setNewfolder] = useState('');
    const [type, setType] = useState('');
    var folder=[];
    var result; 
    
    const fetchData = async () => {
        //const config = await fetchConfig();
        console.log("fetch data called from folder file");
    try {
        const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/readfolderData2`);
        result = await response.json();
        setData(result);
        setfolders(result);
        console.log(typeof(result));
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    }

    useEffect(() => {         
        fetchData();
    },[]);
    




  const handleCreateFolder = async (e) => {
    e.preventDefault();
    var folderdata={
        foldname:newfolder,
    };
    folder.push(folderdata);
    //const config = await fetchConfig();
    
    fetch(`${process.env.REACT_APP_BACKEND_URL}/savefolderData`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(folderdata)
    });
    setNewfolder('');
    fetchData();
  };


  const handleDeleteFolder = async (e) => {
    e.preventDefault();
    // eslint-disable-next-line no-restricted-globals
    if(!confirm(`Are you sure you want to delete ${newfolder} permanently?`))
      return;

    var folderdata={
        foldname:newfolder,
    };
    folder.push(folderdata);
    //const config = await fetchConfig();
    
    const response=await fetch(`${process.env.REACT_APP_BACKEND_URL}/deletefolderData`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(folderdata)
    });
    if(response.status==409)
    alert(`First delete ${newfolder}'s contents`)
    else if(response.status==404)
    alert(`Folder Not Found`)
    setNewfolder('');
    fetchData();
  };

return (
  <>
  
  <div className='folder-file-body'>
  <Navbar2 />
  <div class="list">
  <h2>Folders:</h2>
  <ul>
  {
    folders.map((folder, index) => (
      <li><span key={index}>
        <NavLink to={`/folder/${folder}`}>{folder}</NavLink>
      </span></li>
    ))
    } </ul>
  <div class="file-folder-wrapper">
    <form class="folder-file-form">
    <div class="input-field-folder-file">
      <input
        type="text"
        value={newfolder}
        onChange={(e) => setNewfolder(e.target.value)}
        required
      />
      <label>Enter Folder name</label>
      </div>
      <button className='folder-file-button' onClick={handleCreateFolder}>Create Folder</button>
      <button className='folder-file-button' onClick={handleDeleteFolder}>Delete Folder</button>
    </form>
    </div>
  </div>
  </div>
  </>
);
};

export default Folder
