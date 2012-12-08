fs     = require 'fs'
spawn  = require('child_process').spawn
exec   = require('child_process').exec
flour  = require 'flour'

task 'setup', ->
	console.log 'Installing the dependencies...'
	exec 'bower install', (err, stdout, stderr) ->
		console.log stdout

task 'build:dev', ->
    compile 'src/main.coffee', 'app/assets/js/main.js'

task 'build:prod', ->
    bundle [
      'vendor/jquery/index.js',
      'vendor/tween/index.js',
      'vendor/headtrackr/headtrackr.js',
      'vendor/threejs/index.js',
      'vendor/CopyShader/index.js',
      'vendor/ConvolutionShader/index.js',
      'vendor/FilmShader/index.js',
      'vendor/MaskPass/index.js',
      'vendor/EffectComposer/index.js'
      'vendor/RenderPass/index.js',
      'vendor/ShaderPass/index.js',
      'vendor/FilmPass/index.js',
      'vendor/VignetteShader/index.js',
      'vendor/buzz/index.js',
      'src/main.coffee'
    ], 'app/assets/js/main.js'

task 'build', ->
	console.log 'Building the sources...'
	invoke 'build:dev'

task 'watch', ->
    invoke 'build'
    watch 'src/main.coffee', -> invoke 'build'