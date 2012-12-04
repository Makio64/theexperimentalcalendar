/*
**	Author: Guillaume Gouessan - guillaumegouessan.com
*/

var Tree = (function() {

	/*---------------------------------------------------
	Constructor
	---------------------------------------------------*/
	function Tree(color, nbIterations, maxBranches, respawnValue) {
		this.respawnValue = respawnValue;
		RunningObject.call(this);

		this.treeColor = color;
		this.branches = [];
		this.branches.push(new THREE.Vector3(0,0,0));
		this.nbIterations = nbIterations || 10;
		this.maxBranches = maxBranches || 5;

		this.addSegment(this.branches[0].clone(), 1, Math.PI * 0.5, 1, 1, 0);
		var nbBranches;
		var branchChances;
		for(var i = 0; i < this.nbIterations; i++){
			nbBranches = this.branches.length;
			branchChances = i / this.nbIterations;
			for(var j = 0; j < nbBranches; j++){
				this.addSegment(this.branches[j].clone(), 0.5, Math.PI * 0.5 + Math.random() * 0.8 - 0.4, (this.nbIterations - i) / this.nbIterations, (this.nbIterations - (i+1)) / this.nbIterations, j);
				if(Math.random() * branchChances < 0.3 && nbBranches < this.maxBranches){
					this.branches.push(this.branches[j].clone());
				}
			}
		}
	}

	Tree.prototype = new RunningObject();
	Tree.prototype.constructor = Tree;

	// --------------------------------------------------------------------------------------
	// Add a branch
	// --------------------------------------------------------------------------------------
	Tree.prototype.addSegment = function(origin, length, angle, radius, radius2, index) {
		var geometry = new THREE.Geometry();
		var material = new THREE.LineBasicMaterial({color: this.treeColor, opacity: 1, linewidth: radius * 10});
		var destination = new THREE.Vector3();

		destination.x = origin.x + Math.random() - 0.5;
		destination.y = origin.y + length;
		destination.z = origin.z + Math.random() - 0.5;

		geometry.vertices.push(origin);
		geometry.vertices.push(destination);

		var line = new THREE.Line( geometry, material, 0);
		this.add(line);
		this.branches[index].set(destination.x, destination.y, destination.z);
	};

	return Tree;

})();
