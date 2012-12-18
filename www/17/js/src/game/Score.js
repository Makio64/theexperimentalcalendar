/**
 * Score
 * @constructor
 */
function Score()
{
	this.value = 0;
	this._scoreElmt = $("#score span").not(".slices");
}

Score.prototype.draw = function()
{
	if(!this._locked)
		this._scoreElmt.text(this.value);
};
Score.prototype.lock = function ()
{
	this._locked = true;
};

Score.prototype.unlock = function ()
{
	this._locked = false;
};