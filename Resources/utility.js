var utility = {};

// Download any file. The path folder in which the file to be downloaded must exsists.
utility.downloadOneFile = function(url, filepath, callBack) {

	var c = Titanium.Network.createHTTPClient();

	if(null != callBack) {
		c.onerror = function(e) {
			Ti.API.info('MyApp: Download failed: url= ' + url + ' Error=' + e.error);
			callBack('CONNECTION_ERROR');
		};

		c.onload = function(e) {

			if(Titanium.Platform.name === 'android') {

				// On android HTTPClient will not save the file to disk. So have to hack around it
				Ti.API.info('MyApp: (Andoid) Downloaded this file from server:.' + filepath);
				var f = Titanium.Filesystem.getFile(filepath);
				f.write(c.responseData);
			}

			callBack(c.status);
		};
	}

	c.open('GET', url);

	if(null != filepath && Titanium.Platform.name !== 'android') {
		Ti.API.info('MyApp:  (iOS) Downloaded this file from server:.' + filepath);
		c.file = Titanium.Filesystem.getFile(filepath);
	}

	c.send();
};

utility.downloadMultiFile = function(downloadQueue, callBack_DisplayFile) {

	// var downloadQueue = [];
	var queueIndex = 0;

	var processQueue = function() {

		if(queueIndex < downloadQueue.length) {

			// report download progress to the progress bar on AppList Page
			// downloadProgress_callback(downloadQueue.length + 1, queueIndex + 1);
			MyAppGlob.imagePathToShow = downloadQueue[queueIndex].filepath;
			callBack_DisplayFile();
			
			utility.downloadOneFile(downloadQueue[queueIndex].url, downloadQueue[queueIndex].filepath, processQueue);
			queueIndex++;
			// processQueue();

		} else {
			var alertDialog = Titanium.UI.createAlertDialog({
				title : '',
				message : 'Download finished',
				buttonNames : ['OK']
			});
			alertDialog.show();
		}

	};
	processQueue();
};