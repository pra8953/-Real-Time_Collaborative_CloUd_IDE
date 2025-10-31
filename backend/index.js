require('dotenv').config();
const express = require('express');
const app = express();
const PORT = process.env.PORT || 3600;
const dbConnect = require('./config/db');
const cors = require('cors');
const indexRoute = require('./routes/indexRoute');


// db connection 
dbConnect();

// origin allow
app.use(cors());

// requesting parsing
app.use(express.json());


// routing

app.use('/api',indexRoute);

app.get('/',(req,res)=>{
    res.send("Backend is live!!")
})

app.listen(PORT,()=>{
    console.log(`running http://localhost:${PORT}`);
})