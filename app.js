const path = require('path');
const fs = require('fs');
const fetch = require('node-fetch');
const bodyParser = require('body-parser');
const express = require('express');
const request = require('request');


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

            const test = JSON.stringify(res, null, 2);

            fs.writeFile('models/vaccine-data.json', test, (err) => {
                if (err) {
                    console.log(err);
            }

        });
    console.log("Updated");
}), 30000);


app.get('/', function (req, res) {
    res.sendFile(__dirname + "/views/index.html")
})

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  next();
});

app.get('/api', (req, res) => {
  request(
    { url: 'https://www.vaccinesnearyou.com/api' },
    (error, response, body) => {
      if (error || response.statusCode !== 200) {
        return res.status(500).json({ type: 'error', message: err.message });
      }

      res.json(JSON.parse(body));
    }
  )
});

app.get('/search', function (req, res) {
    res.sendFile(__dirname + "/views/pages/search.html")
})

app.get('/contact', function (req, res) {
    res.sendFile(__dirname + "/views/pages/contact.html")
})

app.get('/about', function (req, res) {
    res.sendFile(__dirname + "/views/pages/about.html")
})

app.get('/api', function (req, res) {
    res.sendFile(__dirname + "/models/vaccine-data.json")
})


app.listen(port, () => {
  console.log(`Web app listening at http://localhost:${port}`);
})
