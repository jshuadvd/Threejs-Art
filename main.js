/* ==================== [ Global Variables ] ==================== */

var scene, camera, renderer, aspectRatio;
var stats;
var composer, effect, clock;

/* ==================== [ Audio Context ] ==================== */

var ctx = new AudioContext();
var audio = document.getElementById('player');

audio.play();
audio.volume = 1;
// audio.crossOrigin = "anonymous";

var audioSrc = ctx.createMediaElementSource(audio);
var analyser = ctx.createAnalyser();

audioSrc.connect(analyser);
audioSrc.connect(ctx.destination);

// frequencyBinCount tells you how many values you'll receive from the analyser
var frequencyData = new Uint8Array(analyser.frequencyBinCount);
analyser.getByteFrequencyData(frequencyData);
console.log(frequencyData);


/* ==================== [ Set Scene & Camera ] ==================== */

scene = new THREE.Scene();
aspectRatio = window.innerWidth / window.innerHeight;
camera = new THREE.PerspectiveCamera(75, aspectRatio, 0.1, 100);
// camera.target = new THREE.Vector3( 10, 10, 10 );

// Set the DOM
renderer = new THREE.WebGLRenderer({
	antialias: true
});
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setClearColor("#000000");
document.body.appendChild(renderer.domElement);

/* ==================== [ Camera Position ] ==================== */

camera.position.z = 10;
camera.position.y = 0;

/* ==================== [ Point Lights ] ==================== */

// var spotLight = new THREE.SpotLight(0xffffff, .2, 1000, Math.PI/3, 0.001);
//     spotLight.position.copy( camera.position );
//     spotLight.position.z = 10;
//     spotLight.position.y = 45;
//     spotLight.position.x = 50;
//     spotLight.castShadow = true;
//     spotLight.shadowMapWidth = 1024;
//     spotLight.shadowMapHeight = 1024;
//     spotLight.shadowCameraNear = 1;
//     spotLight.shadowCameraFar = 1000;
//     camera.add(spotLight);
//     scene.add(camera);

var pointLightBlue = new THREE.PointLight("#00ccff", 5, 100, 2);
pointLightBlue.position.set(-10, -40, -10);
scene.add(pointLightBlue);

// var pointLightWhite = new THREE.PointLight( "#ffffff", 1, 0, 1 );
// // pointLightWhite.position.set( -10, 160, -10 );
// pointLightWhite.position.set( 0, 0, 1 );
// scene.add(pointLightWhite);
// camera.add(pointLightWhite);

// var pointLightPink = new THREE.PointLight( "#EE567C", 5, 100, 10 );
// pointLightPink.position.set( 1, 0, -5 );
// scene.add(pointLightPink);

var pointLight = new THREE.PointLight("#A805FA", 2, 100, 40);
pointLight.position.set(40, 0, 40);
scene.add(pointLight);

// var sphereSize = 5;
// var pointLightHelper = new THREE.PointLightHelper( pointLight, sphereSize );
// scene.add( pointLightHelper );

var pointLight2 = new THREE.PointLight("#07FAA0", 2, 100, 30);
pointLight2.position.set(-40, 0, -40);
scene.add(pointLight2);

// var sphereSize = 5;
// var pointLightHelper = new THREE.PointLightHelper( pointLight2, sphereSize );
// scene.add( pointLightHelper );


/* ==================== [ Particles ] ==================== */

// var texture = new Image();
// texture.src = 'https://s3-us-west-2.amazonaws.com/s.cdpn.io/82015/snowflake.png';

// var material = new THREE.ParticleBasicMaterial( { map: new THREE.Texture(texture) } );

// var particleCount = 0, particleSystem, particles;
// var texture = THREE.ImageUtils.loadTexture('images/particle.png');


// particleCount = 20000,
// particles = new THREE.Geometry();
// var pMaterial = new THREE.ParticleBasicMaterial({
//   color: 0xFFFFFF,
//   size: 0.5
//  });
//
// for (var i = 0; i < particleCount; i++) {
//     var pX = Math.random() * 500 - 250,
//         pY = Math.random() * 500 - 250,
//         pZ = Math.random() * 500 - 250,
//         particle = new THREE.Vector3(pX, pY, pZ);
//
//     particles.vertices.push(particle);
// }
//
// particleSystem = new THREE.ParticleSystem(particles, pMaterial);
// scene.add(particleSystem);

// var particle = new THREE.Geometry();
// var texture = THREE.ImageUtils.loadTexture("images/particle.png");
// var pMaterial = new THREE.PointsMaterial({
//     size: 100,
//     map: texture,
//     blending: THREE.AdditiveBlending,
//     depthTest: !1,
//     transparent: !0,
//     opacity: 1
// })
//
//     pMaterial.particleHue = Math.random(),
//     pMaterial.color = new THREE.Color(16777215),
//     pMaterial.color.setHSL(pMaterial.particleHue, 1, 1);
//
//
//
// var particles = new THREE.Points(particle, pMaterial);
//     particles.position.z = -500;
//     particles.sortParticles = !1;
//     scene.add(particles);

/* ==================== [ Post Processing ] ==================== */

// var composer = new THREE.EffectComposer( renderer );
// composer.addPass( new THREE.RenderPass( scene, camera ) );
//
// var effect = new THREE.ShaderPass( THREE.DotScreenShader );
// effect.uniforms[ 'scale' ].value = 30;
// composer.addPass( effect );
//
// var effect = new THREE.ShaderPass( THREE.RGBShiftShader );
// effect.uniforms[ 'amount' ].value = 0.01;
// effect.renderToScreen = true;
//
// composer.addPass( effect );
// composer.addPass( effect );
//
// var glitch = new THREE.GlitchPass(100);
// glitch.renderToScreen = true;
// composer.addPass(glitch);

composer = new THREE.EffectComposer(renderer);
composer.addPass(new THREE.RenderPass(scene, camera));

effect = new THREE.ShaderPass(THREE.FilmShader);
effect.uniforms['time'].value = 0.0;
effect.uniforms['nIntensity'].value = 0.4;
effect.uniforms['sIntensity'].value = 0.9;
effect.uniforms['sCount'].value = 800;
effect.uniforms['grayscale'].value = 0.6;
composer.addPass(effect);

// var dot = new THREE.ShaderPass( THREE.DotScreenShader );
// dot.uniforms[ 'scale' ].value = 400;
// dot.uniforms[ 'tDiffuse' ].value = 40;
// dot.uniforms[ 'tSize' ].value = new THREE.Vector2( 256, 256 );
//
// composer.addPass(dot);

// var kaleidoPass = new THREE.ShaderPass(THREE.KaleidoShader);
// kaleidoPass.uniforms['sides'].value = 6;
// kaleidoPass.uniforms['angle'].value = 45 * Math.PI / 180;
//
// composer.addPass(kaleidoPass);

// var mirror = mirrorPass = new THREE.ShaderPass( THREE.MirrorShader );
// composer.addPass(mirror);

var glitch = new THREE.GlitchPass(100);
composer.addPass(glitch);

var tv = new THREE.ShaderPass( THREE.BadTVShader );
tv.uniforms[ "distortion" ].value = 1;
tv.uniforms[ "distortion2" ].value = .01;
// tv.uniforms[ "time" ].value = 1.5;
tv.uniforms[ "speed" ].value = 8.8;
tv.uniforms[ "rollSpeed" ].value = 0.8;
composer.addPass(tv);

// var staticPass = new THREE.ShaderPass( THREE.StaticShader );
// staticPass.uniforms[ "amount" ].value = 0.15;
// staticPass.uniforms[ "size" ].value = 1.0;
// staticPass.uniforms[ "time" ].value = 4.5;
// composer.addPass(staticPass);


var effect1 = new THREE.ShaderPass(THREE.RGBShiftShader);
effect1.uniforms['amount'].value = 0.005;
effect1.renderToScreen = true;
composer.addPass(effect1);

// add a timer
clock = new THREE.Clock;

/* ==================== [ Stats ] ==================== */

stats = new Stats();
stats.domElement.style.position = 'absolute';
stats.domElement.style.left = '0px';
stats.domElement.style.top = '0px';
document.body.appendChild(stats.domElement);

/* ==================== [ Shapes ] ==================== */

var quantity = 40;
var shapes = [];


for (var i = 0; i < quantity; i++) {

	if (Math.random() < 0.5) {
		var geometry = new THREE.RingGeometry(4, 40, 3);

		// var geometry = new THREE.RingGeometry( 30, 30, 18);
		// camera.position.z = 60;

		// var geometry = new THREE.RingGeometry( 20, 150, 18);

		// var geometry = new THREE.RingGeometry( 20, 150, 18);

		// var geometry = new THREE.TorusKnotGeometry( 10, 3, 100, 16 );
	} else {
		// var geometry = new THREE.RingGeometry( 4, 40, 3);


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

	if (i % 7 === 0) {
		var material = new THREE.MeshPhongMaterial({
			color: "#ffffff"
		});
	} else if (i % 2 === 0) {
		var material = new THREE.MeshPhongMaterial({
			color: "#666666"
		});
	} else {
		var material = new THREE.MeshPhongMaterial({
			color: "#333333"
		});
	}

	var mesh = new THREE.Mesh(geometry, material);
	mesh.position.z = -i * 3;
	// mesh.rotation.z = i;
	shapes.push(mesh);
	scene.add(mesh);
}


function refRate() {

  curTime = Date.now();
  delta = curTime - oldTime;

  if (delta > interval) {
    oldTime = curTime - (delta % interval);
    updateSize();
  }

}

// Variables
var u_time = 0;

/* ==================== [ Render Function ] ==================== */

var render = function () {
	requestAnimationFrame(render);
	// var timer = Date.now() * 0.0010;
	// camera.lookAt(scene.position);
	u_time++;

	for (var i = 0; i < quantity; i++) {

		// Set rotation change of shapes
		shapes[i].position.z += 0.2;
		shapes[i].rotation.z += 0;
		shapes[i].scale.x = 1 + Math.sin(i + u_time * 0.1) * 0.05;
		shapes[i].scale.y = 1 + Math.sin(i + u_time * 0.1) * 0.05;
		// shapes[i].scale.y = 120 + Math.tan(i + u_time * 5.0) * 0.5;
		// shapes[i].scale.x = 120 + Math.tan(i + u_time * 5.0) * 0.5;

		var change = 1.5 + Math.sin(u_time * 0.5) * 0.5;

		// Set wireframe & width
		if (Math.random() < change) {
			shapes[i].material.wireframe = false;
			shapes[i].material.wireframeLinewidth = Math.random() * 2;
		} else {
			shapes[i].material.wireframe = false;
		}

		if (shapes[i].position.z > 10) {
			shapes[i].position.z = -70;
			shapes[i].rotation.z = i;
		}
	}

	// Set Point light Intensity & Position
	pointLight.intensity = Math.abs(Math.sin(u_time * 0.2) * 2);
	pointLight2.intensity = Math.abs(Math.cos(u_time * 0.2) * 2);
	pointLight.position.z = Math.abs(Math.sin(u_time * 0.02) * 30);
	pointLight2.position.z = Math.abs(Math.cos(u_time * 0.02) * 30);

	// camera.rotation.y = 90 * Math.PI / 180;
	// camera.rotation.z = frequencyData[20] * Math.PI / 180;
	// camera.rotation.x = frequencyData[100] * Math.PI / 180;
	// console.log(frequencyData);



	renderer.render(scene, camera);
  composer.render();

	// var pCount = particleCount;
	//   while (pCount--) {
	//       var particle = particles.vertices[pCount];
	//       particle.y = Math.random() * 500 - 250;
	//       particleSystem.geometry.vertices.needsUpdate = true;
	//   }
	//   particleSystem.rotation.y += 0.001;
	//   particleSystem.rotation.z += 0.005;

}
stats.update();
render();
