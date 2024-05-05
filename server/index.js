const express = require('express');
const cookieParser=require('cookie-parser');
require('./utils/frequentDomainList');
var path = require('path');

//controllers
const homeRoute=require('./controller/homeRoute'); 
const modelRoute=require('./controller/modelRoute');

const app = express();

const PORT = 3000;

app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(cookieParser());

app.use((req,res,next)=>{
    console.log(`${req.method}: ${req.url}`);
    next();
})

//all routes
app.use('/',homeRoute);
app.use('/api/model',modelRoute);


app.listen(PORT, () => {
    console.log(`Server Started at PORT: ${PORT}`);
});