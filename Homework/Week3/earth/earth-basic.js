EarthApp = function () 
{
	Sim.App.call(this);
}

EarthApp.prototype = new Sim.App();

EarthApp.prototype.init = function(param) 
{
	// Call superclass init code to set up scene,
	// renderer, default camera
	Sim.App.prototype.init.call(this, param);

	// Create the Earth and add it to our sim
	var earth = new Earth();
	earth.init();
	this.addObject(earth);

	var sun = new Sun();
	sun.init();
	this.addObject(sun);
}

Earth = function()
{
	Sim.Object.call(this);
}

Earth.prototype = new Sim.Object();

Earth.prototype.init = function()
{
	// Create a group to contain Earth and Clouds
	var earthGroup = new THREE.Object3D();

	this.setObject3D(earthGroup);

	this.createGlobe();
	this.createClouds();
}

Earth.prototype.createGlobe = function () {
	// Create our Earth with nice texture - normal map 
	// for elevation, specular highlights
	var surfaceMap = THREE.ImageUtils.loadTexture("/images/earth_surface_2048.jpg");
	var normalMap = THREE.ImageUtils.loadTexture("/images/earth_normal_2048.jpg");
	var specularMap = THREE.ImageUtils.loadTexture("/images/earth_specular_2048.jpg");

	var shader = THREE.ShaderLib[ "normalmap" ];
	uniforms = THREE.UniformsUtils.clone( shader.uniforms );

	uniforms["tNormal"].texture = normalMap;
	uniforms["tDiffuse"].texture = surfaceMap;
	uniforms["tSpecular"].texture = specularMap;

	uniforms["enableDiffuse"].value = true;
	uniforms["enableSpecular"].value = true;

	var shaderMaterial = new THREE.ShaderMaterial({
		fragmentShader: shader.fragmentShader,
		vertexShader: shader.vertexShader,
		uniforms: uniforms,
		lights: true
	});

	var globeGeometry = new THREE.SphereGeometry(1, 32, 32);

	globeGeometry.computeTangents();
	var globeMesh = new THREE.Mesh(globeGeometry, shaderMaterial);

	globeMesh.rotation.z = Earth.TILT;

	this.object3D.add(globeMesh);

	this.globeMesh = globeMesh;
}

Earth.prototype.createClouds = function()
{
	var cloudsMap = THREE.ImageUtils.loadTexture("/images/earth_clouds_1024.png");
	var cloudsMaterial = new THREE.MeshLambertMaterial({ color: 0xffffff, map: cloudsMap, transparent: true });

	var cloudsGeometry = new THREE.SphereGeometry(Earth.CLOUDS_SCALE, 32, 32);
	cloudsMesh = new THREE.Mesh(cloudsGeometry, cloudsMaterial);
	cloudsMesh.rotation.z = Earth.TILT;

	this.object3D.add(cloudsMesh);

	this.cloudsMesh = cloudsMesh;
}

Earth.prototype.update = function()
{
	this.globeMesh.rotation.y += Earth.ROTATION_Y;
	this.cloudsMesh.rotation.y += Earth.CLOUDS_ROTATION_Y;
	Sim.prototype.update.call(this);
}

Earth.ROTATION_Y = 0.0025;
Earth.TILT = 0.41;
Earth.CLOUDS_SCALE = 1.005;
Earth.CLOUDS_ROTATION_Y = Earth.ROTATION_Y * 0.95;

Sun = function () {
	Sim.Object.call(this);
}

Sun.prototype = new Sim.Object();

Sun.prototype.init = function()
{
	var light = new THREE.PointLight( 0xffffff, 2, 100 );
	light.position.set(-10, 0, 20);

	this.setObject3D(light);
}