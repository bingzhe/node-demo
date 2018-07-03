var events = require('events');
var net = require('net');

var channel = new events.EventEmitter();
channel.clients = {};
channel.subscriptions = {};

channel.on('join', function (id, client) {
    this.clients[id] = client;
    this.subscriptions[id] = function (senderId, message) {
        if (id != senderId) {
            this.clients[id].write(message);
        }
    };

    this.on('broadcast', this.subscriptions[id]);
});

channel.on('leave', function (id) {
    channel.removeListener('broadcast', this.subscriptions[id]);
    channel.emit('broadcast', id, id + 'has left the chat.\n');
});

channel.on('shutdown', () => {
    channel.emit('broadcast', '', 'Chat has shut down.\n');
    channel.removeAllListeners('broadcast');
});
var server = net.createServer(client => {
    var id = client.remoteAddress + ':' + client.remotePort;
    channel.emit('join', id, client);
    console.log('connect');

    // client.on('connection', () => {
    // });

    client.on('data', data => {
        console.log('data');
        data = data.toString();

        console.log(data);
        if (data == 'shutdown\r\n') {

            channel.emit('broadcast', id, data);
        }
        channel.emit('broadcast', id, data);
    })

    client.on('close', () => {
        channel.emit('leave', id);
    })

});

server.listen(8888, () => {
    console.log("server start");
});
