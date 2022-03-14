# Socket.io chat

Contains Client and Server for a simple socket.io based react app.

You can start client and server independently, or just serve the static build from the client app via express server.


### Serve Client
By default, the client connects against localhost:8080:
```bash
    cd client
    npm run start
```

You can provide a custom host via `REACT_APP_SOCKET_SERVER`, and a custom port via `REACT_APP_SOCKET_PORT`.

On OSX, you can use
```bash
    npm run start-osx
```
To use your en0 IPv4 address for that.

### Start Server

start the server on port `8080`:
```bash
    cd ..
    npm run start-server
```

or use a custom port:
```bash
    PORT=3456 npm run start-server
```

### Serve static build

simply build the client
```bash
    cd client
    npm run build
```

and the server will host it on the provided PORT.