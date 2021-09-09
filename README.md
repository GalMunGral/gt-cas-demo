# GT Login Service Demo
1. Add `127.0.0.1   openeval.gatech.edu` to `hosts` file:
  - Windows: `c:\Windows\System32\Drivers\etc\hosts` 
  - Unix/Linux: `/etc/hosts`
2. Go to https://login.gatech.edu and log out.
3. Start the server: `cd temp && npm install && npm start`
3. Visit http://openeval.gatech.edu (HTTP, not HTTPS)

## Issues
[ldapjs](https://github.com/ldapjs/node-ldapjs) currently doesn't support Windows: https://github.com/ldapjs/node-ldapjs/issues/79
