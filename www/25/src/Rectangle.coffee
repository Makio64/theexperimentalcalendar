class Rectangle

	constructor:(@x,@y,@width,@height)->
		@bottom = @y+@height;
		@right = @x+@width
		return