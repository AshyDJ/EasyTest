import React, { useState, useEffect } from 'react';
import Navbar2 from './Navbar2';
//import './style.css'; //Note have to fix the css to not affect the testui table
const Report = () => {

  const [versions, setVersions] = useState([]);
  const [files, setFiles] = useState([]);
  const [users, setUsers] = useState([]);
  const [testCases, setTestCases] = useState([]);
  const [dataLog, setDataLog] = useState([]);
  const [data, setData] = useState([]);
  const [rowCount, setRowCount] = useState(0);
/*
  useEffect(() => {
    loadVersions();
    loadUsers();
  }, []);

  const loadVersions = async () => {
    const response = await fetch('./storage/testcases');
    const folders = await response.json();
    const versions = folders.map(folder => folder.name);
    setVersions(versions);
  };

  const loadFiles = async (version) => {
    const response = await fetch(./storage/testcases/${version});
    const files = await response.json();
    const fileNames = files.map(file => file.name);
    setFiles(fileNames);
  };

  const loadUsers = () => {
    // implement user loading logic here
  };

  const loadTestCases = async (version, file) => {
    const response = await fetch(`http://192.168.250.90:5000/folder/${version}/${file}/loadData`);
    const testCases = await response.json();
    setTestCases(testCases);
  };

  const loadData = () => {
    // implement data loading logic here
  };

  const loadLogs = () => {
    // implement logs loading logic here
  };


 //Actua return to be used
 
  return (
    <>
    <Navbar2 />
    <div class='report-body'>
    <div class="filter-container">
      <select id="version">
        {versions.map((version, index) => (
          <option key={index} value={version}>
            {version}
          </option>
        ))}
      </select>
      <select id="file">
        {files.map((file, index) => (
          <option key={index} value={file}>
            {file}
          </option>
        ))}
      </select>
      <select id="user">
        {users.map((user, index) => (
          <option key={index} value={user}>
            {user}
          </option>
        ))}
      </select>
      <select id="testCase">
        {testCases.map((testCase, index) => (
          <option key={index} value={testCase}>
            {testCase}
          </option>
        ))}
      </select>
       <button id="generate" onClick={loadData}>
        Generate Report
      </button>
    </div>
    
     <div class="table-title">
     <table class="table-fill">
     <thead>
     <tr>
     <th class="text-left">Version</th>
      <th class="text-left">File</th>
      <th class="text-left">Test Case</th>
      <th class="text-left">Status</th> 
      <th class="text-left">Error Code</th>
      <th class="text-left">User</th>
      <th class="text-left">Timestamp</th>
      </tr>
      </thead>
      <tbody class="table-hover">
      <tr>
      </tr>  
      </tbody>
      </table>
      </div>
      </div>
      </>
  );
  */
 return(
<>
<Navbar2 />
<body className='report-body'>
  <h1>JAREDDAPROGRAMMER</h1>
  <div class="filter-container">
    <label for="version">Version:</label>
    <select id="version">
      <option>Version 1.1</option>
      <option>Version 1.2</option>
      <option>Version 1.3</option>
    </select>
    <label for="file">File:</label>
    <select id="file">
        <option>e2e</option>
    <option>kekW</option>
    <option>Screen</option>
    </select>
    <label for="testCase">Test Case:</label>
    <select id="testCase">
       <option>e2e</option>
    <option>kekW</option>
    <option>Screen</option>
    </select>
    <label for="status">Status:</label>
    <select id="status">
      <option value="">All</option>
      <option value="pass">Pass</option>
      <option value="fail">Fail</option>
    </select>
    <label for="errorCode">Error Code:</label>
    <input type="text" id="errorCode" />
    <label for="user">User:</label>
    <select id="user">
       <option></option>
    <option>Ashish</option>
    <option>Joshua</option>
    </select>
    <label for="timestamp">Timestamp:</label>
    <input type="date" id="timestamp" />
    <button id="generate">Apply Filter</button>
  </div>
  <div class="table-title">
    
</div>
<table class="table-fill">
<h3> WIP </h3>
<thead>
<tr>
<th class="text-left">Version</th>
<th class="text-left">File</th>
<th class="text-left">Test Case</th>
<th class="text-left">Status</th> 
<th class="text-left">Error Code</th>
<th class="text-left">User</th>
<th class="text-left">Timestamp</th>
</tr>
</thead>
<tbody class="table-hover">
<tr>
<td class="text-left">1.0</td>
<td class="text-left">eg file </td>
<td class="text-left">Opening</td>
<td class="text-left">Pass</td>
<td class="text-left">0</td>
<td class="text-left">Loni</td>
<td class="text-left">06-01-2021</td> 
</tr>
<tr>
<td class="text-left">1.0</td>
<td class="text-left">eg file </td>
<td class="text-left">Opening</td>
<td class="text-left">Pass</td>
<td class="text-left">0</td>
<td class="text-left">Loni</td>
<td class="text-left">06-01-2021</td> 
</tr>
<tr>
<td class="text-left">1.0</td>
<td class="text-left">eg file </td>
<td class="text-left">Opening</td>
<td class="text-left">Pass</td>
<td class="text-left">0</td>
<td class="text-left">Loni</td>
<td class="text-left">06-01-2021</td> 
</tr>
<tr>
<td class="text-left">1.0</td>
<td class="text-left">eg file </td>
<td class="text-left">Opening</td>
<td class="text-left">Pass</td>
<td class="text-left">0</td>
<td class="text-left">Loni</td>
<td class="text-left">06-01-2021</td> 
</tr>  
 

</tbody>
</table>

</body>



</>
 );
};

export default Report;