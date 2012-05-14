var worker = (function() {

var primes = {}; 

function isPrime(n) {
	var limit = Math.sqrt( n );
	//for (var i = 0, _l = primes.length; i < _l; ++i) {
	for (var i in primes) { 
		if (i > limit)
			return true;
		if (n % i === 0)
			return false;
	}
	return true;
};

function addPrime(n) {
	if (!primes[n]) {
		primes[n] = true;
		send( n );
	}
}

var low = -1, high = 1;
function genPrimes() {
	var gen1 = low - (low % 6) - 1;
	var gen2 = gen1 + 2;
	while( gen1 < low || gen2 < high ) {
		gen1 += 6;
		gen2 += 6;
		if ( isPrime( gen1 ) )
			addPrime( gen1 );
		if ( isPrime( gen2 ) )
			addPrime( gen2 );
	}
	flushBuffer();
	launched = false;
};

/***************/
/* Worker part */
/***************/
var launched = false;
var run = genPrimes;
var buffer = [];

function send(data) {
	buffer.push( data );
	if ( buffer.length >= 10 ) {
		postMessage( buffer );
		buffer = [];
	}
}

function flushBuffer() {
	postMessage( buffer );
	buffer = [];
}

var w = {
	onmessage: function(e) {
		if (!launched) {
			var msg = e.data;
			if (msg.type === 'p') // updates primes
			{
				for (var i = 0, _l = msg.data.length; i < _l; ++i)
				{
					primes[ msg.data[i] ] = true;
				}
			} else if (msg.type === 'o')
			{
				launched = true;
				low = msg.low;
				high = msg.high;
				run();
			}
		}
	},
};

return w;
})();

self.onmessage = worker.onmessage;

