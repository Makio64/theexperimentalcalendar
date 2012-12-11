(function () {
  $('#calendar .entry').each(function () {
    if(!$.browser.chrome && $(this).hasClass('chromeOnly')) {
      $(this).find('.tooltip').html('SORRY YOU NEED GOOGLE CHROME TO SEE THIS EXPERIMENT');
      $(this).find('a').attr('href', "").css('cursor', 'default');
      $(this).click(function() { return false; });
    }
  });
}());