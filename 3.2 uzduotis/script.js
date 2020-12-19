$(function () {
	var scene = new THREE.Scene();
	var renderer = createRenderer();
	var camera = addCamera();
    var queen = addQueen();
    camera.lookAt(scene.position);
    console.log(scene.position);
    scene.add(createPlane());
    scene.add(queen);
	scene.add(addAmbientLight());
    scene.add(addSpotLight());
	$("#WebGL-output").append(renderer.domElement);
	var cameraControls = new THREE.TrackballControls(camera, renderer.domElement);
    //menu();
	render();
	
	function render() {
		renderer.render(scene, camera);
		requestAnimationFrame(render);
		cameraControls.update(); 
		
	}
	function createRenderer()
	{
		var renderer = new THREE.WebGLRenderer();
		renderer.setClearColor(0xEEEEEE);
		renderer.setSize(window.innerWidth, window.innerHeight);
		renderer.shadowMapEnabled = true;
		return renderer;
	}
	function createPlane()
	{
		var planeGeometry = new THREE.PlaneGeometry(80,80);
		var planeMaterial = new THREE.MeshBasicMaterial({map: THREE.ImageUtils.loadTexture("board.png"), side: THREE.DoubleSide});
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

    function addQueen()
    {
        var points = [
            //crown
            new THREE.Vector2(0, 11.05),
            new THREE.Vector2(0.12, 11.01),
            new THREE.Vector2(0.25, 11),
            new THREE.Vector2(0.45, 10.96),
            new THREE.Vector2(0.5, 10.5),
            new THREE.Vector2(0.45, 10.42),
            new THREE.Vector2(0.35, 10.30),
            new THREE.Vector2(0.30, 10.18),
            new THREE.Vector2(0.25, 10.05),
            new THREE.Vector2(0.25, 9.9),
            //start of crown
            new THREE.Vector2(0.58, 9.63),
            new THREE.Vector2(1, 9.5),
            new THREE.Vector2(1.25, 9.75),
            new THREE.Vector2(2, 10),
            new THREE.Vector2(1.5, 9.67),
            new THREE.Vector2(1.2, 9.18),
            //transition
            new THREE.Vector2(1.1, 9.0),
            new THREE.Vector2(0.8, 7.8),

            //first ring
            new THREE.Vector2(1,7.8),
            new THREE.Vector2(1.2,7.6),
            new THREE.Vector2(1,7.4),
            //transition
            new THREE.Vector2(0.8,7.4),
            new THREE.Vector2(0.8,7.0),
            //second ring
            new THREE.Vector2(1,7.0),
            new THREE.Vector2(1.4,6.8),
            new THREE.Vector2(1,6.6),
            //third ring
            new THREE.Vector2(1,6.5),
            new THREE.Vector2(1.6,6.5),
            new THREE.Vector2(2,6.3),
            new THREE.Vector2(1.6,6.1),
            //end of rings
            new THREE.Vector2(0.7,6.1),
            new THREE.Vector2(0.7,5.0),
            new THREE.Vector2(0.9,3.2),
            //next step
            new THREE.Vector2(1.5,3.2),
            new THREE.Vector2(2.2, 3.0),
            new THREE.Vector2(2,2.5),
            new THREE.Vector2(2,2.3),
            new THREE.Vector2(3.4,1.3),
            new THREE.Vector2(3.7,1.0),
            new THREE.Vector2(4.1, 0),
            new THREE.Vector2(0,0)
        ];
        var queenpoint = [];
        for(var i = 0; i < points.length; i++)
        {
            queenpoint.push(points[i]);
        }
        var latheGeometry = new THREE.LatheGeometry(queenpoint, 12);
        var material = new THREE.MeshLambertMaterial({color: 0xfffff0, transparent: false});
        var queen = new THREE.Mesh(latheGeometry, material);
        queen.position.x = 10;
		queen.position.y = 0.05;
		queen.position.z = 35;
        return queen;
    }
	function menu()
	{
		var gui = new dat.GUI();
		gui.add(controls, 'count', 2, 25).step(1).name('Laiptu skaicius').onChange(controls.redraw);
		gui.add(controls, 'angleDifference', -360, 360).step(1).name('Posukio kampas').onChange(controls.redraw);
		gui.add(controls, 'stairHeight', 8, 30).step(1).name('Laiptų aukstis').onChange(controls.redraw);
	}
});