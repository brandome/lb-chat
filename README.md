# Socket.io chat

Contains Client and Server for a simple socket.io based react app.

You can start client and server independently, or just serve the static build from the client app via express server.
To do so, simply do
```bash
    cd client
    npm run build
```

and then
```bash
    cd ..
    npm run start-server
```

or use 
```bash
    PORT=3456 npm run start-server
```

to run it on given port `3456`.
