/*
**	Author: Guillaume Gouessan - guillaumegouessan.com
*/

var Snowman = (function() {

	/*---------------------------------------------------
	Constructor
	---------------------------------------------------*/
	function Snowman() {
		THREE.Object3D.call(this);
		var geom = new THREE.SphereGeometry(1,8,8);
		var geomDistort = new THREE.SphereGeometry(1,8,8);
		var material = new THREE.MeshBasicMaterial({color:0xFFFFFF});
		var distortShader = DistortionShader;


		this.distortUniformsBody = THREE.UniformsUtils.clone( distortShader.uniforms );
		this.distortUniformsLegs = THREE.UniformsUtils.clone( distortShader.uniforms );

		var distortMaterialBody = new THREE.ShaderMaterial( {
			vertexShader: distortShader.vertexShader,
			fragmentShader: distortShader.fragmentShader,
			uniforms: this.distortUniformsBody,
			lights: false,
			fog: false
		} );

		var distortMaterialLegs = new THREE.ShaderMaterial( {
			vertexShader: distortShader.vertexShader,
			fragmentShader: distortShader.fragmentShader,
			uniforms: this.distortUniformsLegs,
			lights: false,
			fog: false
		} );

		this.headContainer = new THREE.Object3D();
		this.add(this.headContainer);


		this.head = new THREE.Mesh(geom, material);
		this.body = new THREE.Mesh(geomDistort, distortMaterialBody);
		this.legs = new THREE.Mesh(geomDistort, distortMaterialLegs);

		this.head.scale.x = this.head.scale.y = this.head.scale.z = 0.2;
		this.body.scale.x = this.body.scale.y = this.body.scale.z = 0.35;
		this.legs.scale.x = this.legs.scale.y = this.legs.scale.z = 0.5;

		this.legs.position.y = .5;
		this.body.position.y = 1;
		this.headContainer.position.y = 1.45;

		this.headContainer.add(this.head);
		this.add(this.body);
		this.add(this.legs);

		var eyeMaterial = new THREE.MeshBasicMaterial({color:0x000000});

		var eyeleft = new THREE.Mesh(geom, eyeMaterial);
		var eyeright = new THREE.Mesh(geom, eyeMaterial);

		eyeleft.scale.x = eyeleft.scale.y = eyeleft.scale.z = eyeright.scale.x = eyeright.scale.y = eyeright.scale.z = 0.02;

		this.headContainer.add(eyeleft);
		this.headContainer.add(eyeright);

		eyeleft.position.y = eyeright.position.y = 0.05;
		eyeleft.position.x = Math.sin(Math.PI * 0.15) * 0.2;
		eyeright.position.x = Math.sin(-Math.PI * 0.15) * 0.2;
		eyeleft.position.z = eyeright.position.z = Math.cos(Math.PI * 0.15) * 0.2;

		var noseGeom = new THREE.CylinderGeometry(0.03, 0.01, 0.3);
		var noseMaterial = new THREE.MeshBasicMaterial({color: 0xff8a00, side: THREE.DoubleSide});
		var nose = new THREE.Mesh(noseGeom, noseMaterial);

		this.headContainer.add(nose);
		nose.position.y = eyeleft.position.y - 0.06;
		nose.position.z = 0.4;
		nose.rotation.x = -Math.PI * 0.5;

		this.armGeom = new THREE.Geometry();
		this.armGeom.vertices.push(new THREE.Vector3(0, 0, 0));
		this.armGeom.vertices.push(new THREE.Vector3(0.25, 0.1, 0));
		this.armGeom.vertices.push(new THREE.Vector3(0.3, 0.5, 0));

		var armMaterial = new THREE.LineBasicMaterial({color: 0x000000, linewidth: 10});

		this.leftArm = new THREE.Line(this.armGeom, armMaterial);
		this.leftArm.position.x = 0.2;
		this.leftArm.position.y = this.body.position.y + 0.2;
		this.add(this.leftArm);

		this.rightArm = new THREE.Line(this.armGeom, armMaterial);
		this.rightArm.position.x = -0.2;
		this.rightArm.position.y = this.body.position.y + 0.2;
		this.rightArm.rotation.y = Math.PI;
		this.add(this.rightArm);

	}

	Snowman.prototype = new THREE.Object3D();
	Snowman.prototype.constructor = Snowman;

	/*---------------------------------------------------
	Animations (kinda)
	---------------------------------------------------*/
	Snowman.prototype.pumpItUp = function() {
		this.armGeom.vertices[1].y = 0.1;
		this.armGeom.vertices[2].y = 0.5;

		this.armGeom.vertices[2].x = 0.3 + Math.random() * 0.2 - 0.1;
		this.armGeom.verticesNeedUpdate = true;
	};

	Snowman.prototype.headBang = function() {
		var scale = 1 + Math.random() * 0.6;
		this.headContainer.scale.set(scale, scale, scale);
		this.headContainer.rotation.y = Math.random() * (Math.PI * 0.25) - (Math.PI * 0.125);
		this.distortUniformsBody["amplitude"].value = 0.2;
		this.distortUniformsLegs["amplitude"].value = 0.2;

		this.legs.position.x = Math.random() * 0.3 - 0.15;
	};

	Snowman.prototype.resetCrazyness = function() {
		this.distortUniformsBody["amplitude"].value = 0.1;
		this.distortUniformsLegs["amplitude"].value = 0.1;
	};

	/*---------------------------------------------------
	Update
	---------------------------------------------------*/
	Snowman.prototype.update = function() {

		if(this.armGeom.vertices[1].y > 0){
			this.armGeom.vertices[1].y -= 0.01;
			this.armGeom.vertices[2].y -= 0.01;
			this.armGeom.verticesNeedUpdate = true;
		}

		if(this.headContainer.scale.x > 1){
			this.headContainer.scale.addScalar((1 - this.headContainer.scale.x) * 0.1);
		}

		if(this.headContainer.rotation.y != 0){
			this.headContainer.rotation.y += -this.headContainer.rotation.y * 0.1;
		}

		if(this.legs.position.x){
			this.legs.position.x += -this.legs.position.x * 0.1;
		}

		this.distortUniformsBody["time"].value += 0.1;
		this.distortUniformsLegs["time"].value += 0.2;
		this.headContainer.position.x = Math.cos(this.distortUniformsBody["time"].value * 1.5) * 0.02;

	};


	return Snowman;

})();
