var Song = (function() {

    function Song(url, audioContext) {
        this.url = url;
        this.audioContext = audioContext;
        this.loadedSignal = new signals.Signal();
        this.onLoadProgressSignal = new signals.Signal();
    }

    Song.prototype.constructor = Song;

    Song.prototype.load = function(){
        if(this.buffer){
            this.onSoundLoaded();
            return;
        }
        var self = this;

        // Load asynchronously
        this.request = new XMLHttpRequest();
        this.request.open("GET", this.url, true);
        this.request.responseType = "arraybuffer";
        
        this.request.onload = function() {
            self.audioContext.decodeAudioData(self.request.response, function(buffer) {
                var arrayBuff = self.request.response;
                self.buffer = buffer;
                self.onSoundLoaded();
            }, self.onError);
        }

        this.request.onprogress = function(e){
            self.onLoadProgressSignal.dispatch(e.loaded / e.total);
        }

       this.request.send();
    }

    Song.prototype.onError = function(){
        
    };

    Song.prototype.onSoundLoaded = function(){
        this.loaded = true;
        this.loadedSignal.dispatch(this.songId);
    }

    return Song;

})();
