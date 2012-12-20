<!DOCTYPE html>
<html lang="en">
    <!--
        Hello and welcome in the source code of
        The Christmas Experiments Project
        - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
        - The sources are avaible on GitHub : https://github.com/ipfix/theexperimentalcalendar

        -------------- VVVVV ! 

        @authors
            - Aurelien Gantier : http://www.arlg.me
            - Catherine Uhlrich : http://catherineuhlrich.com/

        ---- GIT : https://github.com/arlg/VVVVV
  -->
    <head>
        <title>The Christmas Experiments - VVVVV !</title>
        <meta charset="utf-8">
        <meta name="author" content="Aurelien Gantier / Catherine Uhlrich">
        <meta name="description" content="VVVVV ! a game made with love by Aurélien Gantier and Catherine Uhlrich for The Christmas Experiments.">
        <meta property="og:title" content="The Christmas Experiments - VVVVV !"/>
        <meta property="og:type" content="website"/>
        <meta property="og:url" content="http://christmasexperiments.com/19/"/>
        <meta property="og:image" content="http://christmasexperiments.com/img/512-App-Icon.png"/>
        <meta property="og:site_name" content="The Christmas Experiments - VVVVV !"/>
        <meta property="og:description" content="VVVVV ! a game made with love by Aurélien Gantier and Catherine Uhlrich for The Christmas Experiments."/>
        <link rel="Shortcut Icon" type="image/ico" href="../img/favicon.png" />
        <link rel="Shortcut Icon" type="image/png" href="../img/favicon.png" />
        <link rel="stylesheet" href="../css/reset.css" type="text/css" media="screen">
        <link rel="stylesheet" href="../css/content.css" type="text/css" media="screen">
        <link rel="stylesheet" href="../css/header.css" type="text/css" media="screen">
    </head>
    <body style="overlow:hidden">
        <header style="border-bottom:solid 1px #EEE">
            <div class="center">
                <h1><a href="/" title="The Christmas Experiments - Home">TCE</a></h1>
                <h2 style="font-size: 0.7em;">
                        Day 19 - VVVVV ! by <a href="http://twitter.com/AurelienG" target='_blank' title="Follow Aurelien on Twitter">Aurélien Gantier</a> and <a href="http://twitter.com/catlrh" target='_blank' title="Follow Catherine on Twitter">Catherine Uhlrich</a>
                </h2>
                <ul id="share">
                    <li id="google"><a href="/" title="Share this Christmas Experiment on google+">G</a></li>
                    <li id="twitter"><a href="/" title="Share this Christmas Experiment on twitter">T</a></li> 
                    <li id="facebook"><a href="/" title="Share this Christmas Experiment on facebook">F</a></li>                   
                </ul>
            </div>
        </header>
        <iframe style="top:50px" src="http://www.arlg.me/vvvvv"></iframe>
        <script type="text/javascript" src="http://code.jquery.com/jquery-latest.js"></script>
        <script type="text/javascript" src="../js/header.js"></script>
        <script type="text/javascript">
            var EXP = window.EXP || {};
            EXP.Main = {
                init: function() {

                  if(/Android|webOS|iPhone|iPad|iPod|BlackBerry/i.test(navigator.userAgent)) {
                      
                     window.location.href="http://www.arlg.me/vvvvv";

                     this.removeToolBar();
                  }
                },

                removeToolBar: function() {
                  setTimeout(scrollTo, 0, 0, 1);
                }

            };

            $(window).ready(function() {
                EXP.Main.init();
            });
        </script>

  <script type="text/javascript">

  var _gaq = _gaq || [];
  _gaq.push(['_setAccount', 'UA-36772924-1']);
  _gaq.push(['_trackPageview']);

  (function() {
    var ga = document.createElement('script'); ga.type = 'text/javascript'; ga.async = true;
    ga.src = ('https:' == document.location.protocol ? 'https://ssl' : 'http://www') + '.google-analytics.com/ga.js';
    var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(ga, s);
  })();

</script>
    </body>
</html>