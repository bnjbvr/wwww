const PORT = 1337;
const RANGE_COMPUTE = 1000;
const LIMIT = 100000;
var sio = require('socket.io').listen( PORT );

workers = [];
primes = {2:true, 3:true};
countOfPrimes = 0;

formerLow = 2;
formerHigh = formerLow + RANGE_COMPUTE;

function sendOrder(socket)
{
    console.log('Sending client an order for ' + formerLow + ' / ' + formerHigh);
    socket.emit('order', {low: formerLow, high: formerHigh});
    formerLow = formerHigh;
    formerHigh += RANGE_COMPUTE;
}

sio.sockets.on('connection', function(socket) {
    console.log('New client');
    // workers.push( socket ); // TODO add to workers list with id?

    socket.on('primes', function(data) {
        for (var n in data) {
            if(!primes[data[n]]) {
                countOfPrimes++;
            }
            primes[data[n]] = true;
        }
        if (data[n] > LIMIT) {
            console.log('Over ' + LIMIT + ' numbers have been computed, stop : ' + JSON.stringify(primes));
            return;
        }
        sendOrder(socket);
    });

    socket.on('disconnect', function() {
        console.log('Client disconnected.');
        // TODO remove from clients list
    });

    sendOrder(socket);
});
