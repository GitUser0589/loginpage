const express = require('express');
const mysql = require('mysql')
const cors = require('cors')

const app = express()

const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: '',
    database: 'gym_sched'
})

const allowedOrigins = ['http://localhost:5174']; // Replace with your frontend origin
const corsOptions = {
  origin: allowedOrigins
};
app.get('/', (re, res)=> {
    return res.json("From Backend side");
})

app.listen(8081, ()=> {
    console.log("listening");
})