// Set scene and camera
var scene = new THREE.Scene();
var aspectRatio = window.innerWidth / window.innerHeight;
var camera = new THREE.PerspectiveCamera(75, aspectRatio, 0.1, 1000);

// Set the DOM
var renderer = new THREE.WebGLRenderer({ antialias:true });
renderer.setSize(window.innerWidth,window.innerHeight);
renderer.setClearColor("#000000");
document.body.appendChild(renderer.domElement);

// Move the camera
camera.position.z = 10;
camera.position.y = 0;

// Point Lights
var pointLight = new THREE.PointLight( "#A805FA", 10, 100 );
pointLight.position.set( 0, 0, 20 );
scene.add(pointLight);

var pointLight2 = new THREE.PointLight( "#07FAA0", 10, 100 );
pointLight2.position.set( 0, 0, -20 );
scene.add(pointLight2);

var quantity = 50;
var shapes = [];

for (var i = 0; i < quantity; i++) {

    if(Math.random() < 0.5){
        var geometry = new THREE.RingGeometry( 4, 40, 3 );
    }
    else {
        var geometry = new THREE.RingGeometry( 3, 40, 5 );
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
        shapes[i].rotation.z += 0.02;
        shapes[i].scale.x = 1 + Math.sin(i + u_time * 0.1) * 0.07;
        shapes[i].scale.y = 1 + Math.sin(i + u_time * 0.1) * 0.07;

        var change = 0.5 + Math.sin(u_time * 0.05) * 0.5;

        // Set wireframe & width
        if(Math.random() < change){
            shapes[i].material.wireframe = true;
            shapes[i].material.wireframeLinewidth = Math.random() * 3;
        }
        else {
            shapes[i].material.wireframe = false;
        }

        if(shapes[i].position.z > 10){
            shapes[i].position.z = -70;
            shapes[i].rotation.z=i;
        }
    }

    // Set Point light Intensity
    pointLight.intensity = Math.abs(Math.sin(u_time * 0.2) * 2);
    pointLight2.intensity = Math.abs(Math.cos(u_time * 0.2) * 2);
    pointLight.position.z = Math.abs(Math.sin(u_time * 0.02) * 30);
    pointLight2.position.z = Math.abs(Math.cos(u_time * 0.02) * 30);

    //composer.render();
    renderer.render(scene,camera);
}

render();
