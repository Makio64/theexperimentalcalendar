Array.prototype.remove = function(element) {
  for (var i = 0; i < this.length; i++) {
    if (this[i] == element) { this.splice(i,1); }
  }
};

$.fn.preloadImages = function(callback) {
  checklist = this.toArray();
  this.each(function() {
    $('<img>').attr({ src: this }).load(function() {
      checklist.remove($(this).attr('src'));
      if (checklist.length == 0) { callback(); }
    });
  });
};