/*
**	Author: Guillaume Gouessan - guillaumegouessan.com
*/

var SongPlayer = (function() {

	function SongPlayer() {

		this.audioContext = new (window.AudioContext || window.webkitAudioContext)();

		this.songs = [];
		this.currentSongIndex = 0;
		this.loop = false;
		this.songDuration = 0;
		this.allValues = [];
		this.firstSongLoading = true;
		this.events =  {
			songStarted: new signals.Signal(),
			songCompleted: new signals.Signal()
		}

		this.analyser = this.audioContext.createAnalyser();
		this.analyser.fftSize = 1024;
		this.analyser.smoothingTimeConstant = 0.1;
		this.analyser.connect(this.audioContext.destination);

		this.data = new Uint8Array(128);
	};
    
    	SongPlayer.prototype.constructor = SongPlayer;

    	/*========================================================
    	    PLAYLIST MANAGEMENT
    	========================================================*/
    	/*------------------------------------
    	Public  */
    	SongPlayer.prototype.addSong = function(title, artist, url){
            var id = this.songs.length;
            var player = new Song({ songId:id, songTitle:title, artistName:artist, url:url }, this.audioContext);
            player.loadedSignal.add(this._onLoaded, this);
            this.songs.push(player);
            return player;
        }

       	SongPlayer.prototype.loadFirstSong = function(){
    		this.currentSongIndex = 0;
    		var firstSong = this.songs[this.currentSongIndex];
    		firstSong.onLoadProgressSignal.add(this.firstSongLoadingProgress.bind(this));
    		firstSong.load();
        	};

    	SongPlayer.prototype.playSong = function(index){
        	this._stop();
        	this.currentSongIndex = index;
		this.songs[index].load();
        	this.events.songStarted.dispatch();
    	};

    	SongPlayer.prototype.playNextSong = function(){
   	     this.playSong((this.currentSongIndex + 1) % this.songs.length);
    	};

    	SongPlayer.prototype.playCurrentSong = function(){
		this.playSong(this.currentSongIndex);
   	};

    	SongPlayer.prototype.stop = function(){
        	this._stop();
    	};

    	SongPlayer.prototype.replaySong = function(){
		this.playSong(this.currentSongIndex);
    	};

    	/*------------------------------------
    	Privates  */
    	SongPlayer.prototype._onLoaded = function(id){
		this._play(id);
	};

	SongPlayer.prototype._play = function(id){
        console.log( "play" );
		clearTimeout(this.completeTimeout);
		this.audioSource = this.audioContext.createBufferSource();
		this.audioSource.buffer = this.songs[this.currentSongIndex].buffer;
		this.songDuration = this.audioSource.buffer.duration;
		this.audioBufferSource = this.audioSource;
		this.audioSource.buffer = this.songs[id].buffer;
		this.audioSource.connect(this.analyser);
		this.audioSource.loop = this.loop;
		this.audioSource.noteOn(0);
		this.completeTimeout = setTimeout(function(){this._onSongComplete();}.bind(this), this.audioSource.buffer.duration * 1000);

	};

	SongPlayer.prototype._stop = function(){
		clearTimeout(this.completeTimeout);
		if(this.audioSource){
			this.audioSource.disconnect(this.analyser);
			this.audioSource.noteOff(0);
			this.audioSource = null;
		}
	};


	SongPlayer.prototype._onSongComplete = function(){
		if(this.loop && this.audioSource){ // in case of loop we launch de complete timer again
			this.completeTimeout = setTimeout(function(){this._onSongComplete();}.bind(this), this.audioSource.buffer.duration * 1000);
		}
		else if(this.audioSource){
			this.playNextSong();
		}
		this.events.songCompleted.dispatch();
	};

    	/*========================================================
    		SOUND DATAS / SPECTRUM
    	========================================================*/
	SongPlayer.prototype.getSoundData = function(frequency) {
		this.analyser.smoothingTimeConstant = 0.1;
		if(frequency){
			this.analyser.getByteFrequencyData(this.data);
		}
		else{
			this.analyser.getByteTimeDomainData(this.data);
		}
		return this.data;
	};

    SongPlayer.prototype.getSoundDataAverageHigh = function(startRatio) {
        this.analyser.smoothingTimeConstant = 0.1;
        this.analyser.getByteFrequencyData(this.data);
        var start = Math.round(this.data.length * (startRatio || 0.3));
        var length = this.data.length - start;
        var average = 0;
        for (var i = start; i < this.data.length; ++i) {
            average += this.data[i];
        }
        return average / length;
    };

    SongPlayer.prototype.getSoundDataAverage = function() {
        this.analyser.smoothingTimeConstant = 0.1;
        this.analyser.getByteFrequencyData(this.data);
        var average = 0;
        for (var i = 0, lgth = this.data.length; i < lgth; ++i) {
            average += this.data[i];
        }

        var fixedAverage = (average / lgth) == 0 ? 1 : (average / lgth);
        
        return fixedAverage;
    };

    SongPlayer.prototype.getSoundDataIntensity = function() {
        var fixedAverage = this.getSoundDataAverage();
        var i = 0;
        var totalSongAverage = 0;

        if(this.allValues.length > 20) {
            this.allValues.shift();
            this.allValues.push(fixedAverage);
        }else {
            this.allValues.push(fixedAverage);
        }

        for (i = 0; i < this.allValues.length; i++) {
            totalSongAverage += this.allValues[i];
        };

        return (totalSongAverage/this.allValues.length).toFixed();
    };

    /*========================================================
        VOLUME
    ========================================================*/
    SongPlayer.prototype.volumeTo = function(value) {
        this.audioBufferSource.gain.value = value;
    };

    SongPlayer.prototype.mute = function() {
        this.audioBufferSource.gain.value = 0;
    };

    SongPlayer.prototype.unmute = function() {
        this.audioBufferSource.gain.value = 1;
    };

    /*========================================================
        GETTERS - SETTERS
    ========================================================*/
    SongPlayer.prototype.getSongCurrentTime = function() {
        return this.audioContext.currentTime;
    };

    return SongPlayer;
})();
