# CAS Demo
1. Add `127.0.0.1   openeval.gatech.edu` to `hosts` file (`c:\Windows\System32\Drivers\etc\hosts` on Windows and `/etc/hosts` on UNIX).
2. Go to `login.gatech.edu` and log out.
3. Start the server (requires Node.js):
```bash
git clone https://github.com/GalMunGral/cas-demo.git && cd temp && npm install && npm start
```
3. Visit `http://openeval.gatech.edu` (No HTTPS)
