
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
        const config = await fetchConfig();
        console.log("fetch data called from folder file");
    try {
        const response = await fetch(`${config.backend_url}/readfolderData2`);
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
    




  const handleAddfolder = async (e) => {
    e.preventDefault();
    var folderdata={
        foldname:newfolder,
    };
    folder.push(folderdata);
    const config = await fetchConfig();
    
    fetch(`${config.backend_url}/savefolderData`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(folderdata)
    });
    fetchData();
    setNewfolder('');
    
  };
/*
<h2>Tests:</h2>
      {
      folders.map((folder, index) => (
        <div key={index}>
          <NavLink to={`/folder/file`}>{index+1}. {folder}</NavLink>
        </div>
      ))
      }
      

*/


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
    <form class="folder-file-form" onSubmit={handleAddfolder}>
    <h2>Create New Folder</h2>
    <div class="input-field-folder-file">
      <input
        type="text"
        value={newfolder}
        onChange={(e) => setNewfolder(e.target.value)}
        required
      />
      <label>Enter new Folder name</label>
      </div>
      <button className='folder-file-button' type="submit">Add Folder</button>
    </form>
    </div>
  </div>
  </div>
  </>
);
};

export default Folder
