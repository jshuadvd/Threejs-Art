// Set scene and camera
var scene = new THREE.Scene();
var aspectRatio = window.innerWidth / window.innerHeight;
var camera = new THREE.PerspectiveCamera(75, aspectRatio, 0.1, 100);
camera.target = new THREE.Vector3( 10, 10, 10 );

// var controls = new THREE.OrbitControls( camera, renderer);


// Set the DOM
var renderer = new THREE.WebGLRenderer({ antialias:true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setClearColor("#000000");
document.body.appendChild(renderer.domElement);

// Move the camera
camera.position.z = 10;
camera.position.y = 0;

// Point Lights

var pointLightBlue = new THREE.PointLight( "#00ccff", 5, 100, 2 );
pointLightBlue.position.set( -10, -40, -10 );
scene.add(pointLightBlue);

// var pointLightBlue = new THREE.PointLight( "#ffffff", 1, 0, 1 );
// pointLightBlue.position.set( -10, 20, -10 );
// scene.add(pointLightBlue);

// var pointLightPink = new THREE.PointLight( "#EE567C", 5, 100, 10 );
// pointLightPink.position.set( 1, 0, -5 );
// scene.add(pointLightPink);

var pointLight = new THREE.PointLight( "#A805FA", 100, 1000, 40 );
pointLight.position.set( 40, 0, 40 );
scene.add(pointLight);

var sphereSize = 5;
var pointLightHelper = new THREE.PointLightHelper( pointLight, sphereSize );
scene.add( pointLightHelper );

var pointLight2 = new THREE.PointLight( "#07FAA0", 100, 1000, 30 );
pointLight2.position.set( -40, 0, -40 );
scene.add(pointLight2);

var sphereSize = 5;
var pointLightHelper = new THREE.PointLightHelper( pointLight2, sphereSize );
scene.add( pointLightHelper );

var quantity = 50;
var shapes = [];

for (var i = 0; i < quantity; i++) {

    if(Math.random() < 0.5){
      var geometry = new THREE.RingGeometry( 50, 50, 18);
      //var geometry = new THREE.RingGeometry( 20, 150, 18);

        //var geometry = new THREE.TorusKnotGeometry( 10, 3, 100, 16 );
    }
    else {
      //var geometry = new THREE.RingGeometry( 4, 40, 3);


      // var geometry = new THREE.RingGeometry( 1, 5, 6 );
      // var material = new THREE.MeshBasicMaterial( { color: 0xffff00,
      //   side: THREE.DoubleSide } );
      // var mesh = new THREE.Mesh( geometry, material );
      // scene.add( mesh );

      // var points = [];
      // for ( var j = 0; j < 10; j++ ) {
      // 	points.push( new THREE.Vector3( Math.sin( j * 0.2 ) * 15 + 50, 0, ( j - 5 ) * 2 ) );
      //
      // }
      // var geometry = new THREE.LatheGeometry( points );
      // var material = new THREE.MeshBasicMaterial( { color: 0xffff00 } );
      // var lathe = new THREE.Mesh( geometry, material );
      // scene.add( lathe );
    }

    if(i % 7 === 0) {
        var material = new THREE.MeshPhongMaterial( { color: "#ffffff"} );
    }
    else if(i % 2 === 0){
        var material = new THREE.MeshPhongMaterial( { color: "#666666"} );
    }
    else {
        var material = new THREE.MeshPhongMaterial( { color: "#333333"} );
    }

    var mesh = new THREE.Mesh(geometry, material);
    mesh.position.z = -i * 2;
    mesh.rotation.z = i;
    shapes.push(mesh);
    scene.add(mesh);
}

// Variables
var u_time = 0;

// Render function
var render = function() {
    requestAnimationFrame(render);
    u_time++;

    for (var i = 0; i < quantity; i++) {

        // Set rotation change of shapes
        shapes[i].position.z += 0.2;
        shapes[i].rotation.z += 0;
        shapes[i].scale.x = 1 + Math.sin(i + u_time * 0.1) * 0.05;
        shapes[i].scale.y = 1 + Math.sin(i + u_time * 0.1) * 0.05;

        var change = 1.5 + Math.sin(u_time * 0.5) * 0.5;

        // Set wireframe & width
        if(Math.random() < change){
            shapes[i].material.wireframe = true;
            shapes[i].material.wireframeLinewidth = Math.random() * 2;
        }
        else {
            shapes[i].material.wireframe = false;
        }

        if(shapes[i].position.z > 10){
            shapes[i].position.z = -70;
            shapes[i].rotation.z = i;
        }
    }

    // Set Point light Intensity & Position
    pointLight.intensity = Math.abs(Math.sin(u_time * 0.2) * 2);
    pointLight2.intensity = Math.abs(Math.cos(u_time * 0.2) * 2);
    pointLight.position.z = Math.abs(Math.sin(u_time * 0.02) * 30);
    pointLight2.position.z = Math.abs(Math.cos(u_time * 0.02) * 30);

    //composer.render();
    renderer.render(scene, camera);
}

render();
