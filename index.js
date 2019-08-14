const request = require('request');
const express = require('express');
const { parseString: parseXML } = require('xml2js');
const { getUserInfoById } = require('./user');

const app = express();

const CALLBACK_URL = 'http://buzzport.gatech.edu/landing';

app.get('/login', (req, res) => {
  res.redirect(`https://login.gatech.edu/cas/login?service=${
    encodeURIComponent(CALLBACK_URL)
  }`);
});

app.get('/landing', (req, res) => {
  let ticket = req.query.ticket;
  console.log('Got ticket:', ticket);

  let validation_url = `https://login.gatech.edu/serviceValidate?service=${
    encodeURIComponent(CALLBACK_URL)
  }&ticket=${
    ticket
  }`;

  request(validation_url, (err, response, body) => {
    parseXML(body, (err, result) => {
      if (err) {
        console.log(err);
        return;
      }
      if (result['cas:serviceResponse']['cas:authenticationSuccess']) {

        let username = result['cas:serviceResponse']['cas:authenticationSuccess'][0]['cas:user'][0];
        getUserInfoById(username).then(info => {
          res.send(`<pre>${JSON.stringify(info, undefined, 2)}</pre>`);
        })

      } else {
        res.send(`
          <h3>You are logged out</h3>
          <a href="/login">Go to Login Page</a>
        `);
      }
    });
  });
});

app.get('*', (req, res) => res.redirect('/landing'));
app.listen(80, () => console.log('Listening on port 80'));
