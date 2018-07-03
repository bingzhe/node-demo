var net = require('net');

var server = net.createServer(socket=>{
    socket.on('data', data=>{
        socket.write(data);
        console.log(socket);
    });
});

server.listen(8888);