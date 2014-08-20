var UserStream = function() {

	var video = document.createElement('video');
	var videoAspect = 1;
	video.autoplay = true;

	var stream, getMediaCallback, currentSource = 0;

    var sources = [];

	var options = {
        audio: false,
        video: {
        }
    };

	navigator.getUserMedia  = navigator.getUserMedia ||
                              navigator.webkitGetUserMedia ||
                              navigator.mozGetUserMedia ||
                              navigator.msGetUserMedia;

    var gotSources = function (sourceInfos) {

        var ci = 1, lastId;
        for (var i = 0; i != sourceInfos.length; ++i) {
            var sourceInfo = sourceInfos[i];

            if (sourceInfo.kind === 'video') {

                sources.push({
                    'id': sourceInfo.id, 
                    'label': sourceInfo.label || 'camera ' + ci++,
                    'front': (sourceInfo.facing == 'user' || sourceInfo.facing == '') ? true : false
                });
            }

            lastId = sourceInfo.id;
        }

        // options.video.optional = [ { sourceId: lastId } ];
        options.video.optional = [ { sourceId: sources[0].id } ];

        navigator.getUserMedia(options, onMedia, onError);
    }

    var onMedia = function(s) {

    	stream = s;
        video.src = window.URL.createObjectURL(stream);
        video.play();

        video.addEventListener('metadata', function(e) {
            console.log(e);
        });

        video.addEventListener('canplaythrough', function() {
        	var aw = Math.max(1, video.videoWidth / video.videoHeight);
        	var ah = Math.max(1, video.videoHeight / video.videoWidth);

        	// setInfo([AppVersion, video.videoWidth, video.videoHeight, aw.toPrecision(2), ah.toPrecision(2), resolution].join(", "));

        	getMediaCallback(video, aw, ah, sources[currentSource]);
        }, false);
    }

    var onError = function(e) { 
    	console.log('getUserMedia error:', e);
    }

    this.getNextMedia = function(callback) {
    	getMediaCallback = callback;

        if (!!stream) {
            video.src = null;
            stream.stop();
        }

        if (sources.length > 0 || typeof MediaStreamTrack === 'undefined') {

            currentSource += 1;
            if(currentSource >= sources.length) currentSource = 0;

            console.log('reloading from source', currentSource, sources[currentSource].id);

            options.video.optional = [ { sourceId: sources[currentSource].id } ];

            navigator.getUserMedia(options, onMedia, onError);

        } else {
            MediaStreamTrack.getSources(gotSources);
        }
    }
}











