const request = require('request');
const express = require('express');
const { parseString: parseXML } = require('xml2js');
const { getUserInfoById } = require('./user');

const app = express();

const CALLBACK_URL = 'http://openeval.gatech.edu/landing';

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
          // console.log(info)
          res.send(`
            <h1>${info[0].displayName.split(',').reverse().join(' ')}</h1>
            <h2>${info[0].title}, ${info[0].ou}</h2>
            ${info[0].postOfficeBox ? `<p>P.O. Box: ${info[0].postOfficeBox}</p>` : ''}
            ${info[0].telephoneNumber ? `<p>Phone Number: ${info[0].telephoneNumber}</p>` : ''}
            <b>Raw Data:</b>
            <pre>${JSON.stringify(info, undefined, 2)}</pre>
          `)
        }, (reason) => {
          console.log(reason);
          res.send(`<p>${reason}</p>`);
        })

      } else {
        res.send(`
          <h1>Please Log In</h1>
          <a href="/login">Go to Login Page</a>
        `);
      }
    });
  });
});

app.get('*', (req, res) => res.redirect('/landing'));
app.listen(80, () => console.log('Listening on port 80'));
