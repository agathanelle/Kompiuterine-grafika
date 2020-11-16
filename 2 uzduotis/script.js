$(function () {
	var scene = new THREE.Scene();
	var renderer = createRenderer();
	var camera = addCamera();
	var width = 10;
	
	camera.lookAt(scene.position);
    scene.add(createPlane());

	var stairs = new THREE.Object3D();
	
	var controls = new function() {
		this.count = 10;
		this.radius = 5;
		this.gap = 1;
		
		this.supportRadius = 0.5;
		this.rotation = 7;
		this.angleDifference = 0;
		this.stairHeight = 10;
		this.railRadius = 0.3;
		this.railHeight = 4;
		
		this.redraw = function(){

			controls.rotation = controls.angleDifference / (controls.count - 1);
			controls.gap = controls.stairHeight/controls.count;
			scene.remove(stairs);
			stairs = createStairCase();
			scene.add(stairs);
		}
	}
	
	controls.rotation = controls.angleDifference / (controls.count - 1);
	controls.gap = controls.stairHeight/controls.count;
	stairs = createStairCase();
	scene.add(stairs);
	scene.add(addAmbientLight());
	scene.add(addSpotLight());
	$("#WebGL-output").append(renderer.domElement);
	var cameraControls = new THREE.TrackballControls(camera, renderer.domElement);
	menu();
	render();
	
	function render() {
		renderer.render(scene, camera);
		requestAnimationFrame(render);
		cameraControls.update(); 
		
	}
	function createRenderer()
	{
		var renderer = new THREE.WebGLRenderer();
		renderer.setClearColorHex(0xEEEEEE);
		renderer.setSize(window.innerWidth, window.innerHeight);
		renderer.shadowMapEnabled = true;
		return renderer;
	}
	function createPlane()
	{
		var planeGeometry = new THREE.PlaneGeometry(100,100);
		var planeMaterial = new THREE.MeshBasicMaterial({color: 0xcccccc});
		var plane = new THREE.Mesh(planeGeometry,planeMaterial);
		
		plane.rotation.x=-0.5*Math.PI;
		plane.position.x=15
		plane.position.y=0
		plane.position.z=0
		plane.receiveShadow = true;
		return plane;
	}

	function addSpotLight()
	{
		var spotLight = new THREE.SpotLight( 0xffffff );
		spotLight.position.set( -40, 60, -10 );
		spotLight.castShadow = true;
		return spotLight;
	}

	function addAmbientLight()
	{
		var ambiColor = "#0C0C0C";
		var ambientLight = new THREE.AmbientLight(ambiColor);
		return ambientLight;
	}
	function addCamera()
	{
		var camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
		camera.position.x = -30;
		camera.position.y = 40;
		camera.position.z = 30;
		return camera;
	}
	function drawStair(width, height){
		var shape = new THREE.Shape();
		shape.moveTo(0, -height / 1.5);
		shape.lineTo(-width / 5, -height / 1.5);
		shape.quadraticCurveTo(-width/2, 0, -width / 4, height/1.5);
		shape.bezierCurveTo(0, height/1.5, width /2, 0, width/2, -height/1.5);
		shape.lineTo(0, -height / 1.5);
		return shape;
	}

	function createStair(){
		var settings = {
			amount: 0.5,
			bevelThickness: 0.25,
			bevelSize: 0.5,
			bevelSegments: 10,
			bevelEnabled: true,
			curveSegments: 10
		};

		var step = new THREE.ExtrudeGeometry(drawStair(10, 5), settings); 
		var material = new THREE.MeshLambertMaterial({ color: 0xF2CF9D });
		var mesh = new THREE.Mesh( step, material ) ;
		mesh.rotation.z = Math.PI / 2;	
		
		return mesh;
	}

	function createStairCase(){
		var stairs = new THREE.Object3D();
		var metalicMaterial = new THREE.MeshPhongMaterial({color: 0x7A7F80, side: THREE.DoubleSide});
		var verticalGeometry = new THREE.CylinderGeometry(controls.supportRadius, controls.supportRadius, (controls.gap + controls.supportRadius)*3, 100);
		var horizontalGeometry = new THREE.CubeGeometry(controls.supportRadius*8, controls.supportRadius, controls.supportRadius * 7);
		var nextX = 0;
		var nextY = 0;
		var pointsForRails = [];

		for (var i = 0; i < controls.count; i++){
			var firstStep = createStair();
			firstStep.castShadow = true;		
			
			if (i % 2 == 0) {
				//kaire
				firstStep.position.y = controls.gap *1.5;
				firstStep.rotation.x = Math.PI/2;
			} else {
				//desine
				firstStep.position.y = controls.gap ;
				firstStep.rotation.x = -Math.PI / 2;
			}
			var tube = createTube(railPoints(), 10, controls.railRadius, 10, metalicMaterial);
			var step = new THREE.Object3D();
			step.add(firstStep);
			step.add(createVerticalSupport(verticalGeometry, metalicMaterial));
			step.add(createHorizontalSupport(horizontalGeometry, metalicMaterial));
			step.add(tube);
			
			step.position.y = i * controls.gap * 2;
			step.position.x = nextX;
			step.position.z = nextY;
			step.rotation.y = (Math.PI / 180 * controls.rotation) * i;
		
			var railX = nextX + (width / 2 + controls.railRadius * 4) * Math.sin( -1 * (Math.PI / 180 * controls.rotation) * i);
			var railY = i * 2* controls.gap  + controls.railHeight + controls.gap;
			var railZ = nextY + -1 * (width / 2 + controls.railRadius * 4) * Math.cos(-1 *(Math.PI / 180 * controls.rotation) * i);
			pointsForRails.push(new THREE.Vector3(railX, railY, railZ ));
			
			step.name = 'step';
			stairs.add(step);

			nextX = nextX + (controls.radius / 2 + controls.supportRadius) * Math.cos(-(Math.PI / 180 * controls.rotation) * i);
			nextY = nextY + (controls.radius / 2 + controls.supportRadius) * Math.sin(-(Math.PI / 180 * controls.rotation) * i);
			if (i == controls.count - 1) step.add(addSecondFloor());
		}
		var straightTube = createTube(pointsForRails, 100, controls.railRadius, 30, metalicMaterial);
		stairs.add(straightTube);
		return stairs;
	}
	function createTube(points, tubularSegment, radius, radialSegments, material)
	{
		var tubeGeometry = new THREE.TubeGeometry(new THREE.SplineCurve3(points), tubularSegment, radius, radialSegments, false);
		var mesh = new THREE.Mesh(tubeGeometry, material);
		return mesh;
	}
	function createHorizontalSupport(geometry, material)
	{
		var horizontalSupport = new THREE.Mesh(geometry, material);
		horizontalSupport.castShadow = true;		
		horizontalSupport.position.x = (controls.radius / 2 + controls.supportRadius) / 2;
		horizontalSupport.position.y = controls.gap - controls.supportRadius / 2;
		return horizontalSupport;
	}
	function createVerticalSupport(geometry, material)
	{
		var verticalSupport = new THREE.Mesh(geometry, material);
		verticalSupport.castShadow = true;		
		verticalSupport.position.x = controls.radius / 2 + controls.supportRadius;
		verticalSupport.position.y = controls.gap + (controls.gap + controls.supportRadius) / 2 - controls.supportRadius;
		return verticalSupport;
	}
	function railPoints()
	{
		var points = [];
		points.push(new THREE.Vector3(0, controls.gap + controls.railRadius, (-width / 4)));
		points.push(new THREE.Vector3(0, controls.gap + controls.railRadius,  (-width / 2)));
		points.push(new THREE.Vector3(0, controls.gap + controls.railHeight, (-width / 2 - controls.railRadius * 4)));
		return points;
	}
	function addSecondFloor()
	{
		var geometry = new THREE.PlaneGeometry(10,10);
		var material = new THREE.MeshBasicMaterial({color:0x2A3439});
		var plane = new THREE.Mesh(geometry, material);
		plane.position.x = 5 + controls.radius / 2 + controls.supportRadius;
		plane.position.y = 0.5 + controls.gap*2 + controls.supportRadius - controls.supportRadius;
		plane.rotation.x=-0.5*Math.PI;
		plane.receiveShadow  = true;
		return plane;
	}

	function menu()
	{
		var gui = new dat.GUI();
		gui.add(controls, 'count', 2, 30).step(1).name('Laiptu skaicius').onChange(controls.redraw);
		gui.add(controls, 'angleDifference', -180, 180).step(1).name('Posukio kampas').onChange(controls.redraw);
		gui.add(controls, 'stairHeight', 5, 30).step(1).name('Laiptų aukstis').onChange(controls.redraw);
	}
});