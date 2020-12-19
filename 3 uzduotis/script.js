$(function () {
	var scene = new THREE.Scene();
	var renderer = createRenderer();
	var camera = addCamera();
    var radius = 10;
    var dots = 10000;
    var dif = 0.7;
	
    camera.lookAt(scene.position);
    var sphere = new THREE.Object3D();
    var spGroup = new THREE.Object3D();
    
    createSphere();

	scene.add(addAmbientLight());
	scene.add(addSpotLight());
	$("#WebGL-output").append(renderer.domElement);
	var cameraControls = new THREE.TrackballControls(camera, renderer.domElement);
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

	function createSphere()
	{
        var x, y, z;
        var points = [];
            for (var i = 0; i < dots; i++) {
                x = -radius+ Math.random()*radius*2;
                y = -radius+ Math.random()*radius*2;
                z = -radius+ Math.random()*radius*2;
               
                var oneside = Math.pow(x,2)+Math.pow(y,2)+Math.pow(z,2);
                var otherside = Math.pow(radius,2);

                if(oneside <= otherside)
                {
                    points.push(new THREE.Vector3(x, y, z));
                } 
            }

            var material = new THREE.MeshBasicMaterial({color: 0xff0000, transparent: false});
            points.forEach(function (point) {

                var spGeom = new THREE.SphereGeometry(0.1);
                var spMesh = new THREE.Mesh(spGeom, material);
                spMesh.position = point;
                spGroup.add(spMesh);
            });
            scene.add(spGroup);
            var sphereGeometry = new THREE.ConvexGeometry(points);
            var faceVertexUvs = sphereGeometry.faceVertexUvs[0];
            for(var i = 0; i < faceVertexUvs.length;i++)
            {
                var vertex;
                var uvs = faceVertexUvs[i];
                var face = sphereGeometry.faces[i];
                for(var j = 0; j < 3; j++)
                {
                    if (j === 0){
                        vertex = sphereGeometry.vertices[face.a].clone().normalize();
                        x = vertex.x;
                        y = vertex.y;
                        z = vertex.z;
                      }
                      if (j === 1){
                        vertex = sphereGeometry.vertices[face.b].clone().normalize();
                        x = vertex.x;
                        y = vertex.y;
                        z = vertex.z;
                      }
                      if (j === 2){
                        vertex = sphereGeometry.vertices[face.c].clone().normalize();
                        x = vertex.x;
                        y = vertex.y;
                        z = vertex.z;
                }
                uvs[ j ].x = 0.5 + ((Math.atan2(z, x)) / (2 * Math.PI));
                uvs[ j ].y = 0.5 - Math.asin(y)  / Math.PI;
            }
            if (Math.abs(uvs[0].x - uvs[1].x) > dif || Math.abs(uvs[1].x - uvs[2].x) > dif || Math.abs(uvs[2].x - uvs[0].x) > dif){
                if (uvs[0].x > dif) {
                  uvs[0].x = uvs[0].x - 1;
                }
                if (uvs[1].x > dif){
                 uvs[1].x = uvs[1].x - 1;
                }
                if (uvs[2].x > dif){
                  uvs[2].x = uvs[2].x - 1;
                }
            }
        }
            mesh = createMesh(sphereGeometry);
            sphere.add(mesh);
            scene.add(sphere);
    }
    function createMesh(geom) {
        var meshMaterial = new THREE.MeshBasicMaterial({map:THREE.ImageUtils.loadTexture("board.png")});
        meshMaterial.side = THREE.DoubleSide;
        var wireFrameMat = new THREE.MeshBasicMaterial({color: 0x228B22});
        wireFrameMat.wireframe = true;

        var mesh = THREE.SceneUtils.createMultiMaterialObject(geom, [meshMaterial, wireFrameMat]);

        return mesh;
    }
    
});