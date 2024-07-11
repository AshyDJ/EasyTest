var express=require("express");
const cors = require("cors");
const bcrypt = require('bcryptjs');
var bodyParser=require("body-parser");
var session = require('express-session');
var cookieParser = require('cookie-parser');
const crypto = require("crypto");
const fs = require('fs');
const path = require('path');


//Backend folders
//const folderPath1 = path.join(__dirname, 'data_folder');
//const folderPath2 = path.join(__dirname, 'json_folder');

//Storage Desktop FOlder 
const folderPath1 = path.dirname(__dirname)+"/Storage/data_folder";
const folderPath2 = path.dirname(__dirname)+"/Storage/json_folder";

//GEtting config backend url api's ip

const app=express();

app.get('/config', (req, res) => {
  fs.readFile(path.join(path.dirname(__dirname), '/public/config.json'), 'utf8', (err, data) => {
      if (err) {
          return res.status(500).send('Error reading config file');
      }
      res.json(JSON.parse(data));
  });
});






app.use(express.json());
app.use(cors());
app.use(bodyParser.json());
app.use(express.static('test'));
app.use(bodyParser.urlencoded({
extended:true
}))
app.use(cookieParser());
app.use(session({
  secret: "me123",
  resave:false,
  saveUninitialized:false,
  cookie: {
    secure: false,
    maxAge: 1000*60*60*24
  }
}));


var ip = require("ip");
console.dir ( ip.address() );


app.get("/", (req, resp) => {
    if(req.session.user)
      return resp.json({valid: true, username: req.session.user})
});


//USER REGISTRATION
app.post("/sign_up", async (req, resp) => {
var name=req.body.name
var email=req.body.email
var pwd=req.body.password

var data={
"name":name,
"email":email,
"password":pwd
};


const finished = (error) => {
    if (error) {
      console.log(error);
      return;
    }
  }

const emailCheck=(json)=>{
    var i;
    for(i in json)
        {
            if(json[i].email===email)
                return true;
        }
        return false;
    }
    const nameCheck=(json)=>{
        var i;
        for(i in json)
            {
                if(json[i].name===name)
                    return true;
            }
            return false;
        }

//fs.readFile("C:/Users/altas/Desktop/myapp/backend/Users/users.json", async function (err, data1) {
    fs.readFile(path.dirname(__dirname)+"/Storage/Users/users.json", async function (err, data1) {  
    var json = JSON.parse(data1);

if(emailCheck(json) || nameCheck(json))//Same Userid  or email exists
    {
        
        //can send response here sayin it exists
            req.body.name="";
            req.body.email="";
            req.body.password="";
            return resp.send(req.body);
            
    }
    else
    {
       
        const saltRounds = 10; // Number of salt rounds for bcrypt
        const hashedPassword = await bcrypt.hash(data.password, saltRounds);
        data.password = hashedPassword;
        req.body.password=data.password;

        json.push(data);
        fs.writeFile(path.dirname(__dirname)+"/Storage/Users/users.json", JSON.stringify(json,null,2), finished);
    }

//send response
req.session.user = data;
resp.send(req.body);
});
});


//USER LOGIN

app.post("/login", async (req, resp) => {
  var { name, password } = req.body;
  var token;
  
    fs.readFile(path.dirname(__dirname)+"/Storage/Users/users.json", async function (err, data1) { 
    var json = JSON.parse(data1);
    var json_nm,json_pwd;
 //User name not found
 const nameCheck=(json)=>{
    var i;
    for(i in json)
        {
            if(json[i].name===name)
                {
                json_nm=json[i].name;
                json_pwd=json[i].password;
                return true;
                }
        }
        return false;
    }
    if(!nameCheck(json))
        {
            return resp.status(402).send("User name not found");
        }
    else//User name found
    {   
        const PasswordMatch = await bcrypt.compare(password, json_pwd);
        
        if (!PasswordMatch) {
            return resp.status(401).send("Wrong password");
          } else {
              req.session.user = req.body.name;
              console.log(req.session.user)
               token = crypto.randomBytes(64).toString('hex');
            resp.status(200).send({token:token,user_name:name});
          }
    }
    
});
  });
  /*
  app.use('/login',  (req, res) => {
    var name=req.body.name;
    var password=req.body.password;
    console.log(req.body);
    res.send({
        token: 'test123'
    })
})


*/
let lastModified = new Date();
app.get('/folder/:file/testpad/:jfile/get-last-modified', (req, res) => {
  res.json({ lastModified });
});



app.post("/folder/:file/testpad/:jfile/saveData", async (req, resp) => {
  const Data=req.body;
  var filename=req.params.file;
  var jfilename=req.params.jfile;
  //console.log(path.join(folderPath2+"/"+filename,jfilename));
  lastModified = new Date();
   saveData(Data, path.join(folderPath2+"/"+filename,jfilename));
   resp.send("saved")
});

const saveData = (tableData, file) => {
   const finished = (error) => {
     if (error) {
       console.log(error);
       return;
     }
   }
  
   const jsondata = JSON.stringify(tableData, null, 2);
   fs.writeFile(file, jsondata, finished);

   console.log("SAVE DATA OVERR");
 };
 

const readData = (file, callback) => {
   fs.readFile(file, 'utf8', (err, data) => {
       if (err) {
           console.log("Error reading file:", err);
           callback(err, null);
       } else {
           try {
               const jsonData = JSON.parse(data);
               callback(null, jsonData);
           } catch (parseError) {
               console.log("Error parsing JSON:", parseError);
               callback(parseError, null);
           }
       }
   });
};
/*
app.get("/file/:test", (req, resp) => {
  
    var x=req.params.test;
    console.log(x);
    resp.send('<h1>HEllo</h1>'+x);
});

app.get("/file", (req, resp) => {
  
  resp.send('<h1>HEllo</h1>');
});
*/
app.get("/folder/:file/testpad/:jfile", (req, resp) => {  
  var jfilename=req.params.jfile;
  resp.send(`<h1>HEllo</h1>${jfilename}`);
});
app.post("/folder/:file/savefileData", async (req, resp) => {
  var filename=req.params.file;
  console.log("filename",filename)
  const Data=req.body;
  const finished = (error) => {
    if (error) {
      console.log(error);
      return;
    }
  }
  fs.writeFile(path.join(folderPath2+"/"+filename,Data.fname+".json"), '', finished);
  fs.writeFile(path.join(folderPath1+"/"+filename,Data.fname+"_Log.json"), '', finished);
   //saveData(Data, path.join(folderPath1,Data.fname+".json"));
   resp.send("saved")
});

app.get("/folder/:file/readfolderData", async (req, resp) => {
  var filename=req.params.file;
  
  fs.readdir(folderPath2+"/"+filename, (err, files) => {
    
    if (err) {
      console.log(err);
      resp.status(500).send('Unable to read the folder');
      return;
    }
    // Filter out only .json files
    // const jsonFiles = files.filter(file => path.extname(file) === '.json');
    // Send the names of the JSON files as the response
    const alljsonFiles=files;//
    resp.json(alljsonFiles);
  });
});

app.get("/readfolderData2", async (req, resp) => {
  fs.readdir(folderPath2, (err, files) => {
    
    if (err) {
      console.log(err);
      resp.status(500).send('Unable to read the folder');
      return;
    }
    // Filter out only .json files
    // const jsonFiles = files.filter(file => path.extname(file) === '.json');
    // Send the names of the JSON files as the response
    const alljsonFiles=files;
    resp.json(alljsonFiles);
  });
});


app.get("/folder/:file", (req, resp) => {  
  var filename=req.params.file;
  console.log("mine:",filename);
  resp.send(`<h1>HEllo</h1>${filename}`);
});

app.post("/savefolderData", async (req, resp) => {
  const Data=req.body;
  const finished = (error) => {
    if (error) {
      console.log(error);
      return;
    }
  }
  fs.mkdirSync(path.join(folderPath2,Data.foldname));
  fs.mkdirSync(path.join(folderPath1,Data.foldname));
   //saveData(Data, path.join(folderPath1,Data.fname+".json"));
   resp.send("saved")
});



//Log commiting and loading


app.post("/folder/:file/testpad/:jfile/saveLogData", async (req, resp) => {
    const Data=req.body;
    var jfilename=req.params.jfile;
    var filename=req.params.file;
    var jfilename_Log=(jfilename.substring(0,jfilename.lastIndexOf(".")))+"_Log.json";
    //console.log(path.join(folderPath1+"/"+filename,jfilename_Log));
     saveData(Data, path.join(folderPath1+"/"+filename,jfilename_Log));
     
     resp.send("saved")
  });



  app.post("/folder/:file/testpad/:jfile/loadLogData", async (req, resp) => {
    console.log("Check!")
    var jfilename=req.params.jfile;
    var filename=req.params.file;
    var jfilename_Log = (jfilename.substring(0, jfilename.lastIndexOf("."))) + "_Log.json";
    //console.log(path.join(folderPath1 + "/" + filename, jfilename_Log));
  
    if (!jfilename_Log) {
      return resp.status(400).send("jfilename not set");
    }
    readData(path.join(folderPath1 + "/" + filename, jfilename_Log), (err, data) => {
      if (err) {
        return resp.status(500).send("Error reading data");
      } else {
        return resp.json(data);
      }
    });
    
  });
  


  app.get("/folder/:file/testpad/:jfile/loadData", async (req, res) => {
    var jfilename=req.params.jfile;
    var filename=req.params.file;
    console.log("Load called?",filename,jfilename);
    if (!jfilename) {
      return res.status(400).send("jfilename not set");
    }
     readData(path.join(folderPath2+"/"+filename,jfilename), (err, data) => {
         if (err) {
             res.status(500).send("Error reading data");
         } else {
             res.json(data);
         }
     });
  });



  let activeUsers = [];
  let flag=0;
app.post('/User_status', async(req,resp)=>{
  const {phase, user, url } = req.body;
  const decodedUrl = decodeURIComponent(url);
  const segments = decodedUrl.split('/');
  let version,file;

for(let i=0;i<activeUsers.length;i++)
{
if(activeUsers[i].user===user)
  {
    version = segments[2];
    file = segments[segments.length - 1];

    activeUsers[i]={phase:phase, user, folder:version, file };
    console.log(activeUsers);
    flag=1;
    break;
  }
}
if(flag===0)
{
activeUsers.push({phase:phase,user:user,folder:version,file:file});
}
flag=0;

resp.send(activeUsers);
});


app.post('/clear_User_status', async(req,resp)=>{
  const {user} = req.body;
  
  for(let i=0;i<activeUsers.length;i++)
  {
  if(activeUsers[i].user===user)
    {
      activeUsers.splice(i,1);
      break;
    }
  }
  resp.status(200);
  });

  app.post('/folder/:file/testpad/:jfile/updateRadio', async(req,resp)=>{
    var filename=req.params.file;
    var jfilename=req.params.jfile;

 
    var testlog=req.body[0].testlog;
    var rowlog=req.body[0].rowlog;
    var value=req.body[0].radio;
    var error=req.body[0].err;

    console.log(testlog,rowlog,value)

    var jfilename_Log = (jfilename.substring(0, jfilename.lastIndexOf("."))) + "_Log.json";
    //console.log(path.join(folderPath1 + "/" + filename, jfilename_Log));
  
    if (!jfilename_Log) {
      return resp.status(400).send("jfilename not set");
    }
    readData(path.join(folderPath1 + "/" + filename, jfilename_Log), (err, data) => {
      if (err) {
        return resp.status(500).send("Error reading data");
      } 
      else 
      {
        console.log("Updating",data.length);
        for(let i=0;i<data.length;i++)
          if(data[i].testLog==testlog)
            for(let j=0;j<data[i].data.length;j++)
                if(data[i].data[j].row==rowlog)
                  {data[i].data[j].value=value;data[i].data[j].errorCode=error;break;}
        console.log("saveData called");
        saveData(data, path.join(folderPath1 + "/" + filename, jfilename_Log));
        resp.status(200).send("Data updated successfully");
      }
    });
      

    });








app.listen(5000 ,() =>{
  console.log("Connected to Port");
  });
