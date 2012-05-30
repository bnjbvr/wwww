self.requestFileSystemSync = self.webkitRequestFileSystemSync ||
                             self.requestFileSystemSync;
self.BlobBuilder = self.BlobBuilder ||
                   self.WebKitBlobBuilder || self.MozBlobBuilder;

function makeRequest(url) {
  try {
    var xhr = new XMLHttpRequest();
    xhr.open('GET', url, false); // Note: synchronous
    xhr.responseType = 'arraybuffer';
    xhr.send();
    return xhr.response;
  } catch(e) {
    return "XHR Error " + e.toString();
  }
}

function onError(e) {
  postMessage('ERROR: ' + e.toString());
}

onmessage = function(e) {
  var data = e.data;

  // Make sure we have the right parameters.
  if (!data.fileName || !data.url || !data.type) {
    return;
  }

  try {
    var fs = requestFileSystemSync(TEMPORARY, 1024 * 1024 /*1MB*/);

    postMessage('Got file system.');

    var fileEntry = fs.root.getFile(data.fileName, {create: true});

    postMessage('Got file handle.');

    var writer = fileEntry.createWriter();
    writer.onerror = onError;
    writer.onwrite = function(e) {
      postMessage('Write complete!');
      postMessage(fileEntry.toURL());
    };

    var bb = new BlobBuilder();
    bb.append(makeRequest(data.url)); // Append the arrayBuffer XHR response.

    postMessage('Begin writing');

    writer.write(bb.getBlob(data.type));
	
	postMessage('Oooooops.');
	postMessage(fileEntry.toURL());
  } catch (e) {
	postMessage('Oops.');
    onError(e);
  }
};