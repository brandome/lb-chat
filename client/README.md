### Socket.io shape drawing client

To run the client against the local server with a fixed IP, run

```bash
    REACT_APP_IP=$(ifconfig en0 inet | egrep 'inet' | cut -d: -f2 | awk '{ print $2 }'); npm start
```