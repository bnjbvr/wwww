var worker = (function() {

var primes = [2, 3];

function isPrime(n) {
	var limit = Math.sqrt( n );
	for (var i = 0, _l = primes.length; i < _l; ++i) {
		if (primes[i] > limit)
			return true;
		if (n % primes[i] === 0)
			return false;
	}
	return true;
};

function addPrime(n) {
	primes.push( n );
	send( n );
}

function genPrimes() {
	var gen1 = -1, gen2 = 1;
	while( true ) {
		gen1 += 6;
		gen2 += 6;
		if ( isPrime( gen1 ) )
			addPrime( gen1 );
		if ( isPrime( gen2 ) )
			addPrime( gen2 );
	}
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

var w = {
	onmessage: function(e) {
		if (!launched) {
			launched = true;
			run();
		}
	},
};

return w;
})();

self.onmessage = worker.onmessage;

