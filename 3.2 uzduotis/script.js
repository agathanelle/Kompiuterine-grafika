$(function () {
	var scene = new THREE.Scene();
	var renderer = createRenderer();
	var camera = addCamera();
    var queen = addQueen();
    var cameradolly = addBasicCamera();
    var cameraabove = addBasicCamera();

    cameraabove.position.x=15;
	cameraabove.position.y=100;
    cameraabove.position.z=0;
    
    var step = 0;
    camera.lookAt(scene.position);
    scene.add(createPlane());
    scene.add(queen);
    queen.position.x = -20;
    queen.position.y = 0.05;
    queen.position.z = 35;
    scene.add(addSpotLight());
    scene.add(addAmbientLight());
    
    $("#WebGL-output").append(renderer.domElement);
    
    var cameraControls = new THREE.TrackballControls(camera, renderer.domElement);
    var controls = new function()
    {
        this.freeCamera = false;
        this.Letter = 'A';
        this.Number = '1';
        this.cameraNumber = 0;
        this.oldX = -20;
        this.oldY = 0.05;
        this.oldZ = 35;
        this.oldLetter = 0;
        this.oldNumber = 0;
        
        this.moved = false;
        this.dolly = false;
        this.above = false;
        this.QueenPosition = function()
        {
            step = 0;
            this.moved = true;
            this.dolly = false;
        }
        this.DollyZoom = function()
        {
            this.dolly = true;
            this.above = false;
            this.moved = false;
        }

        this.Above = function()
        {
            this.above = true;
            this.dolly = false;
            this.moved = false;
        }
        this.Stop = function()
        {
            camera.fov = 45;
            this.dolly = false;
            this.moved = false;
            this.above = false;
            this.freeCamera = false;
        }

    }
    menu();
    render();
    
	function render() {
        if(controls.moved) 
        {
            queenPosition(controls.Letter, controls.Number);
        }
        if(controls.dolly)
        {
            dollyZoom();
        }
        if(controls.above) aboveCamera();
        if(controls.freeCamera)
        {
            controls.above = false;
            controls.dolly = false;
            cameraControls.update();
        } 
        renderer.render(scene, camera);
        requestAnimationFrame(render); 
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
		plane.position.x=15;
		plane.position.y=0;
		plane.position.z=0;
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
		FOV(camera);
		return camera;
    }
    
    function FOV(camera)
    {
        camera.position.x = 0;
		camera.position.y = 100;
        camera.position.z = 50;
    }

    function dollyZoom()
    {
        camera.lookAt(queen.position);
            if(camera.position.y > 0 && camera.position.y < 300)
            {
                var x = queen.position.x - camera.position.x;
                var y = camera.position.y - queen.position.y;
                var z = queen.position.z - camera.position.z;
                camera.position.x += (queen.position.x - camera.position.x)/100;
                camera.position.y += (camera.position.y - queen.position.y)/100;
                camera.position.z += (queen.position.z - camera.position.z)/100;
                cameradolly.position.x = camera.position.x;
                cameradolly.position.y = camera.position.y;
                cameradolly.position.z = camera.position.z;
                var distance = Math.sqrt(z*z+x*x+y*y);
                var width = window.innerHeight/15;
                camera.fov = (2 * Math.atan(width / (2 * distance))) * 180 / Math.PI;
                camera.updateProjectionMatrix();
            }
            else
            {
                var x = queen.position.x - camera.position.x;
                var y = camera.position.y - queen.position.y;
                var z = queen.position.z - camera.position.z;
                camera.position.x = (queen.position.x - camera.position.x)/100;
                camera.position.y = (camera.position.y - queen.position.y)/100;
                camera.position.z = (queen.position.z - camera.position.z)/100;
                var distance = Math.sqrt(z*z+x*x+y*y);
                var width = window.innerHeight/15;
                camera.fov = (2 * Math.atan(width / (2 * distance))) * 180 / Math.PI;
                camera.updateProjectionMatrix();
            }
    }

    function aboveCamera()
    {
        camera.position.x=15.5;
		camera.position.y=75;
        camera.position.z=0.9;
        camera.lookAt(queen.position);
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
        return queen;
    }

    function addBasicCamera()
    {
        var geometry = new THREE.SphereGeometry( 5, 32, 32 );
        var material = new THREE.MeshLambertMaterial({color: 0x00000F, transparent:false});
        var basic = new THREE.Mesh(geometry, material);
        return basic;
    }

    function queenPosition(letter, number)
    {
        const letters = 'ABCDEFGH';
        var letternumber = letters.indexOf(letter.toUpperCase());
        if(letternumber < 0) return;
        if(number < 0 || number > 8) return;
        number--;
        queen.position.x = controls.oldX + 10*((letternumber-controls.oldLetter)*step);
        queen.position.y = 0.05;
        queen.position.z = controls.oldZ - 10*((number-controls.oldNumber)*step);
        if(step < 1)step=step+0.01;
        else
        {
            controls.oldX = queen.position.x;
            controls.oldY = queen.position.y;
            controls.oldZ = queen.position.z;
            controls.oldLetter = letternumber;
            controls.oldNumber = number;
            controls.moved = false;
            return; 
        }
    }

	function menu()
	{
        var gui = new dat.GUI();
        gui.add(controls, 'freeCamera').name('Free use camera');
        gui.add(controls, 'Letter').name('Letter').listen();
        gui.add(controls, 'Number').name('Number').listen();
        gui.add(controls, 'QueenPosition').name('Move Queen');
        gui.add(controls, 'Above').name('Above');
        gui.add(controls, 'DollyZoom').name('Dolly Zoom');
        gui.add(controls, 'Stop').name('Stop');
    }
});