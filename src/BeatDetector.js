var BeatDetector = function(binCount, options) {

	var that = this;

	options = options || {};

	this.beat = 0;
	this.level = 0;
	this.bpm = 0;
	this.onBeat = null;

	var levelHistory = [];
	var beats = [];

	if(!binCount) {
		throw 'BeatDetector: must specify binCount. \
			Tip: this is the value of Analyser.frequencyBinCount';
	}

	var MAX_BMP = options.maxBMP || 60000/200; // i.e. 200 beats per minute
	var MIN_BEAT_VOL = options.minBeatVol || 50;
	var BEAT_SIZE = options.beatSize || 10;
	var COMPUTE_BPM = options.computeBpm || true;
	var MINUTE = 60000; // in millis... yeah, you get it

	this.update = function(byteFrequency, currentTime) {
        var s = 0, bc = binCount;
        for(var i = 0; i < bc; i++) {
            var f = byteFrequency[i];
            // as Felix says on line 271-273
            // http://www.airtightinteractive.com/demos/js/uberviz/audioanalysis/js/AudioHandler.js
            f *= 1 + (i/bc)/2;
            s += f;
        }

        s = s / bc;

        if(s <= levelHistory[0] && levelHistory.length > BEAT_SIZE+1 && s > MIN_BEAT_VOL) {
            if(levelHistory[0] > levelHistory[BEAT_SIZE]) {
                onBeat(currentTime);
                if(COMPUTE_BPM) computeBpm();
            } else {
            	that.beat = 0;
            }
        }

        levelHistory.unshift(s);
        this.level = s;
    }

    var onBeat = function(t) {
    	var bl = beats.length;
        if(bl == 0) {
            beats.push({ t: t, d: t * 1000 });
        } else {
            var bd = (t - beats[bl-1].t) * 1000;
            if(bd > MAX_BMP) {
            	that.beat = 1;
                beats.push({ t: t, d: bd });
                if(this.onBeat) this.onBeat(beats);
            } else {
            	that.beat = 0;
            }
        }
    }

    var computeBpm = function() {
        var bl =  beats.length, ab = 0;
        for(var i = 0; i < bl; i++) {
            ab += beats[i].d;
        }
        that.bpm = (MINUTE / (ab / bl)) | 0;
    }
}