const ldap = require('ldapjs');

module.exports.getUserInfoById = function(id) {
  return new Promise((resolve, reject) => {
    const client = ldap.createClient({
      url: 'ldap://whitepages.gatech.edu:389'
    });
  
    client.bind('', '', (err) => {
      if (err) {
        console.log('error: ', err);
        client.unbind();
        return
      }
      client.search('dc=whitepages,dc=gatech,dc=edu', {
        filter: `(uid=${id})` ,
        scope: 'sub' // See https://github.com/ldapjs/node-ldapjs/issues/295
      }, (err, res) => {
        if (err) {
          console.log('error: ', err);
          client.unbind();
          return
        }
        let result = [];
        res.on('searchEntry', (entry) => {
          result.push(entry.object);
        });
        res.on('error', (err) => {
          console.error('error: ' + err.message);
          client.unbind();
        });
        res.on('end', () => {
          if (result.length > 0) {
            resolve(result);
          } else {
            reject('Search failed');
          }
          client.unbind();
        });
      });
    });
  });
}
  

