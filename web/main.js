const LIMIT = 10000;

var worker = new Worker('worker.js');

var i = 0;

var results = [];

// Allows to kill the worker is user closes the window.
window.onunload = function() {
	worker.terminate();
};

worker.onmessage = function(e) {
	var recvPrimes = e.data.reduce(function(a,b) { return a + ' ' + b; });

	if (++i > LIMIT) {
		// Force closes the worker if we got over the LIMIT
		worker.terminate();
	}

	document.getElementById('primes').textContent += recvPrimes + ' ';
};

worker.onerror = function(e) {
	console.log('[WRK-ERR] Error in worker thread, line ' + e.lineno +
			' : ' + e.message);
};

worker.postMessage('go'); // starts the worker
console.log('[MAIN] End of main.');

