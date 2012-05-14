var worker = new Worker('worker.js');

var results = [];

// Allows to kill the worker is user closes the window.
window.onunload = function() {
	worker.terminate();
};

worker.onmessage = function(e) {
	if (e.data.length === 0)
		return;

	var recvPrimes = e.data.reduce(function(a,b) { return a + ' ' + b; });
	document.getElementById('primes').textContent += recvPrimes + ' ';
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

new Order(1, 10); // starts the worker

