import React, { useState, useEffect } from 'react';
//import './report.css'; Note have to fix the css to not affect the testui table
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


  <button id="generate" onClick={loadData}>
*/
  return (
    <>
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
      <button id="generate" >
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
};

export default Report;