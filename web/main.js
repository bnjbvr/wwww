var worker = new Worker('worker.js');

var results = [];

// Allows to kill the worker is user closes the window.
window.onunload = function() {
	worker.terminate();
};

document.wwww = document.wwww || {};
wwww = document.wwww;
wwww.work = function(data) {
    if (data.low && data.high) {
        new Order(data.low, data.high);
    }
}

worker.onmessage = function(e) {
    var recv = e.data;
    if (recv.type === 'p')
    {
	    //var recvPrimes = recv.primes.reduce(function(a,b) { return a + ' ' + b; });
	    //document.getElementById('primes').textContent += recvPrimes + ' ';
        console.log('Transmitting primes to master...');
        wwww.emit('primes', recv.primes);
    }

    if (recv.type === 't')
    {
        time = (recv.endTime - recv.beginTime);
        console.log('Time to compute : ' + time + 'ms, which is ' + time/1000 + 'seconds.');
    }
};

worker.onerror = function(e) {
	console.log('[WRK-ERR] Error in worker thread, line ' + e.lineno +
			' : ' + e.message);
};

// Sends the order to compute prime numbers in [low, high]. Values returned may be
// slightly above high.

// The server gives limit values to the web page ; web worker computes the primes in
// the interval, then sends the new values to the server.
// TODO bind server logic and Order.
Order = function Order(low, high) {
	worker.postMessage({"type":"o", "low": low, "high": high});
}

// Once the server has received values, it keeps all web workers informed, by sending
// them the new primes computed. This function should be called whenever the server
// received new primes.
// TODO bind server logic and Primes
Primes = function Primes(primes) {
	worker.postMessage({"type":"p", "data":primes});
}

