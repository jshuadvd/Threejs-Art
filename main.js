// Set scene and camera
var scene = new THREE.Scene();
var aspectRatio = window.innerWidth / window.innerHeight;
var camera = new THREE.PerspectiveCamera(75, aspectRatio, 0.1, 1000);

// Set the DOM
var renderer = new THREE.WebGLRenderer({antialias:true});
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


// Render function
var render = function() {
    requestAnimationFrame(render);


    //composer.render();
    renderer.render(scene,camera);
}

render();
