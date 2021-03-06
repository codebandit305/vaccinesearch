const path = require('path');
const fs = require('fs');
const fetch = require('node-fetch');
const bodyParser = require('body-parser');
const express = require('express');
const request = require('request');
const nodemailer = require('nodemailer');
require("dotenv").config();


const app = express();
const port = 8000;
const URL = 'https://www.vaccinespotter.org/api/v0/states/NY.json';

// const indexRoutes = require(__dirname + '/server/routes/routes');
// app.use('/', indexRoutes);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static(path.join(__dirname, 'views')));

setInterval(() =>
    fetch(URL)
        .then(res => res.json())
        .then(res => {

            const output = JSON.stringify(res, null, 2);

            fs.writeFile('vaccinesearch/models/vaccine-data.json', output, (err) => {
                if (err) {
                    console.log(err);
            }

        });
    console.log("NYS Vaccine Data updated on " + new Date());
}), 300000);


app.get('/', function (req, res) {
    res.sendFile(__dirname + "/views/index.html")
})

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  next();
});

app.get('/search', function (req, res) {
    res.sendFile(__dirname + "/views/pages/search.html");
})

app.get('/contact', (req, res)=> {
    res.sendFile(__dirname + "/views/pages/contact.html");
})

app.post('/contact', function(req, res) {
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
              user: process.env.EMAIL,
              pass: process.env.PASSWD
        }
    })

    const mailOptions = {
        from: req.body.email,
        to: 'jon.legasa@gmail.com',
        subject: req.body.subject,
        text: req.body.message
    }

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            // console.log(error);
            res.send('error');
        } else {
            // console.log('Email Sent');
            res.send("success")
        }
    });

})

app.get('/about', function (req, res) {
    res.sendFile(__dirname + "/views/pages/about.html");
})

app.get('/api', function (req, res) {
    res.sendFile(__dirname + "/models/vaccine-data.json")
})


app.listen(port, () => {
  console.log(`Web app listening at http://localhost:${port}`);
})
