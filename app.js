const express = require('express');
const cors = require('cors');
const bodyParser = require ('body-parser');
const dbConnection = require('./utils/dbConfig');
const port = 8000;
const app = express();

//dbconnection
dbConnection() 

// routes import
const licenseRouter = require('./routes/licenseRouter');

app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());
app.use(cors());

// routing
app.use('/api/licenses',licenseRouter);



app.listen(port,()=>{
    console.log(`app is running on http://localhost:${port}`);
})
