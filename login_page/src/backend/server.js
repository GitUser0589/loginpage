const express = require('express');
const mysql = require('mysql')
const cors = require('cors')

const app = express()
app.use(cors())

const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "gym_sched"
})

app.options('localhost:3000/customer', (req, res) => {
  res.setHeader('Access-Control-Allow-Methods', 'POST'); // Allow POST method
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type'); // Allow Content-Type header
  res.sendStatus(200); // Send successful response
});

app.get('/', (re, res)=> {
    return res.json("from backend side");
})

app.get('/gym', (req, res)=> {
    const sql = "SELECT * FROM gym";
    db.query(sql, (err, data)=> {
        if(err) return res.json(err);
        return res.json(data);
    })
})

app.get('/customer', (req, res)=> {
    const sql = "SELECT * FROM customer";
    db.query(sql, (err, data)=> {
        if(err) return res.json(err);
        return res.json(data);
    })
})

app.listen(3000, ()=> {
    console.log("listening.");
})