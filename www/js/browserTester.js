(function () {
  $('#calendar .entry').each(function () {
    if(!$.browser.chrome) {
      $(this).find('.tooltip').html('Sorry this experiment only works on <a href="http://google.com/chrome">Chrome</a>');
      $(this).find('a').attr('href', "").css('cursor', 'default');
      $(this).click(function() { return false; });
    }
  });
}());