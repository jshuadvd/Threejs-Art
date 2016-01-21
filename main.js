/* ==================== [ Global Variables ] ==================== */

var scene, camera, renderer, aspectRatio;
var stats;
var composer, effect, clock;
var backMesh;


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

console.log(audioSrc);
console.log(audioSrc.context.currentTime);
console.log(frequencyData);

console.log(analyser.fftSize); // 2048 by default
console.log(analyser.frequencyBinCount); // will give me 1024 data points

analyser.fftSize = 64;
console.log(analyser.frequencyBinCount); // fftSize/2 = 32 data points


/* ==================== [ Set Scene & Camera ] ==================== */

scene = new THREE.Scene();
// scene.fog = new THREE.Fog(0x000000, 0, 1200);
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

camera.position.z = 15;
camera.position.y = 0;

/* ==================== [ Point Lights ] ==================== */

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

var light2 = new THREE.PointLight( 0xFFFFFF, 1, 100 );
scene.add( light2 );
light2.position.z = 1000;

var pointLight2 = new THREE.PointLight("#07FAA0", 2, 100, 30);
pointLight2.position.set(-40, 0, -40);
scene.add(pointLight2);

/* ==================== [ Particles ] ==================== */

var getCamera = function() {
	return camera;
}

// var texture = new Image();
// texture.src = 'https://s3-us-west-2.amazonaws.com/s.cdpn.io/82015/snowflake.png';
// texture.src = './images/particle.png';
//var material = new THREE.ParticleBasicMaterial( { map: new THREE.Texture(texture) } );

var particleCount = 0, particleSystem, particles;
THREE.ImageUtils.crossOrigin = '';
var texture = THREE.ImageUtils.loadTexture('./images/particle.png');
//console.log(texture);


particleCount = 20000,
particles = new THREE.Geometry();
var pMaterial = new THREE.PointCloudMaterial({
  color: 0xFFFFFF,
	map: texture,
	blending: THREE.AdditiveBlending,
	depthTest: false,
	depthWrite: false,
	transparent: true,
	opacity: 0.3,
	side: THREE.DoubleSide,
  size: 1.2
});

for (var i = 0; i < particleCount; i++) {
    var pX = Math.random() * 500 - 250,
        pY = Math.random() * 500 - 250,
        pZ = Math.random() * 500 - 250,
        particle = new THREE.Vector3(pX, pY, pZ);

    particles.vertices.push(particle);
}

particleSystem = new THREE.ParticleSystem(particles, pMaterial);
particleSystem.sortParticles = false;
particleSystem.frustumCulled = false;
scene.add(particleSystem);


/* ==================== [ Light Beams ] ==================== */

var beamRotationSpeed = 0.003;
var BEAM_COUNT = 360;
var beamGeometry = new THREE.PlaneBufferGeometry(1, 500, 10, 1);
beamGroup = new THREE.Object3D();
beamMaterial = new THREE.MeshBasicMaterial({
	opacity: 0.02,
	transparent: true,
});

for (var i = 0; i <= BEAM_COUNT; ++i) {
	var beam = new THREE.Mesh(beamGeometry, beamMaterial);
	beam.doubleSided = true;
	beam.rotation.x = Math.random() * Math.PI;
	beam.rotation.y = Math.random() * Math.PI;
	beam.rotation.z = Math.random() * Math.PI;
	beamGroup.add(beam);
}
scene.add(beamGroup);
beamGroup.translateZ( -5 );

/* ==================== [ Cubes ] ==================== */

var doStrobe = false;
var doShake = false;
var strobeOn = false;
var beatTime = 30;

THREE.ImageUtils.crossOrigin = '';
var imgTextureStripes2 = THREE.ImageUtils.loadTexture( "./images/stripes2.jpg" );
imgTextureStripes2.wrapS = imgTextureStripes2.wrapT = THREE.RepeatWrapping;
imgTextureStripes2.repeat.set( 100, 100 );
backMaterial2 = new THREE.MeshBasicMaterial( {
	map:imgTextureStripes2
} );

backMesh2 = new THREE.Mesh( new THREE.SphereGeometry( 1900, 30, 20 ), backMaterial2  );
backMesh2.scale.x = -1;
scene.add( backMesh2 );
backMesh2.visible = false;


function Box() {
	this.posn = new THREE.Vector3();
	this.rotation = new THREE.Vector3();
	this.speed = getRand(3, 20);
	this.init();
}

Box.ORIGIN = new THREE.Vector3();
Box.MAX_DISTANCE = 1000;
Box.INIT_POSN_RANGE = 500;
Box.FRONT_PLANE_Z = 1000;
Box.BACK_PLANE_Z = -1000;

Box.prototype.init = function() {
	this.posn.copy(Box.ORIGIN);
	this.posn.x = getRand(-Box.INIT_POSN_RANGE,Box.INIT_POSN_RANGE);
	this.posn.y = getRand(-Box.INIT_POSN_RANGE,Box.INIT_POSN_RANGE);
	this.posn.z = Box.BACK_PLANE_Z;
	this.rotation.x = (Math.random() * 360 ) * Math.PI / 180;
	this.rotation.y = (Math.random() * 360 ) * Math.PI / 180;
	this.rotation.z = (Math.random() * 360 ) * Math.PI / 180;
};

Box.prototype.update = function() {
	this.posn.z += this.speed * sketchParams.cubeSpeed ;
	this.rotation.x += 0.03;
	this.rotation.y += 0.01;

	if(this.posn.z > Box.FRONT_PLANE_Z) {
		this.init();
	}
};

// returns random number within a range
function getRand(minVal, maxVal) {
	return minVal + (Math.random() * (maxVal - minVal));
}

var cubesize = 1000;
var BOX_COUNT;
var geometry = new THREE.CubeGeometry(cubesize, cubesize, cubesize);
cubeHolder = new THREE.Object3D();

THREE.ImageUtils.crossOrigin = '';
imgTextureStripes = THREE.ImageUtils.loadTexture( "./images/stripes2.jpg" );
cubeMaterial  = new THREE.MeshPhongMaterial( {
	ambient: 0x111111,
	color: 0x666666,
	specular: 0x999999,
	shininess: 30,
	shading: THREE.FlatShading,
	map:imgTextureStripes
});

for(i = 0; i < BOX_COUNT; i++) {
	var box = new Box();
	console.log(box);
	boxes.push(box);
	var cube = new THREE.Mesh(geometry, cubeMaterial);
	cube.position = box.posn;
	cube.rotation = box.rotation;
	cube.ox = cube.scale.x = Math.random() * 1 + 1;
	cube.oy = cube.scale.y = Math.random() * 1 + 1;
	cube.oz = cube.scale.z = Math.random() * 1 + 1;
	cubeHolder.add(cube);
}
scene.add(cubeHolder);

/* ==================== [ Mini Geometries ] ==================== */



/* ==================== [ Post Processing ] ==================== */

composer = new THREE.EffectComposer(renderer);
composer.addPass(new THREE.RenderPass(scene, camera));

effect = new THREE.ShaderPass(THREE.FilmShader);
effect.uniforms['time'].value = 2.0;
effect.uniforms['nIntensity'].value = 0.4;
effect.uniforms['sIntensity'].value = 0.9;
effect.uniforms['sCount'].value = 1800;
effect.uniforms['grayscale'].value = 0.8;
composer.addPass(effect);

var dot = new THREE.ShaderPass( THREE.DotScreenShader );
dot.uniforms[ 'scale' ].value = 400;
dot.uniforms[ 'tDiffuse' ].value = 40;
dot.uniforms[ 'tSize' ].value = new THREE.Vector2( 256, 256 );
dot.enabled = false;
composer.addPass(dot);

// var kaleidoPass = new THREE.ShaderPass(THREE.KaleidoShader);
// kaleidoPass.uniforms['sides'].value = 3;
// kaleidoPass.uniforms['angle'].value = 45 * Math.PI / 180;
// composer.addPass(kaleidoPass);

var mirror = mirrorPass = new THREE.ShaderPass( THREE.MirrorShader );
// mirror.uniforms[ "tDiffuse" ].value = 1.0;
// mirror.uniforms[ "side" ].value = 3;
mirror.enabled = false;
composer.addPass(mirror);


var glitch = new THREE.GlitchPass(64);
glitch.uniforms[ "tDiffuse" ].value = 1.0;
glitch.uniforms[ 'seed' ].value = Math.random() * 5;
glitch.uniforms[ 'byp' ].value = 0;
// glitch.goWild = true;
composer.addPass(glitch);

var superPass = new THREE.ShaderPass(THREE.SuperShader);
superPass.uniforms.vigDarkness.value = 1;
superPass.uniforms.vigOffset.value =  1.3;
superPass.uniforms.glowSize.value = 2;
superPass.uniforms.glowAmount.value = 1;
composer.addPass( superPass );

var tv = new THREE.ShaderPass( THREE.BadTVShader );
tv.uniforms[ "distortion" ].value = 1;
tv.uniforms[ "distortion2" ].value = .01;
// tv.uniforms[ "time" ].value = 1.5;
tv.uniforms[ "speed" ].value = 8.8;
tv.uniforms[ "rollSpeed" ].value = 0.8;
composer.addPass(tv);

var staticPass = new THREE.ShaderPass( THREE.StaticShader );
staticPass.uniforms[ "amount" ].value = 0.15;
staticPass.uniforms[ "size" ].value = 1.0;
staticPass.uniforms[ "time" ].value = 4.5;
composer.addPass(staticPass);

var effect1 = new THREE.ShaderPass(THREE.RGBShiftShader);
effect1.uniforms['amount'].value = 0.003;
effect1.renderToScreen = true;
composer.addPass(effect1)

// add a timer
clock = new THREE.Clock;

/* ==================== [ Confetti ] ==================== */

var leaves = 10000;
var planes = [];

// Plane particles
var planePiece = new THREE.PlaneBufferGeometry(1, 1, 1, 1);
var planeMat = new THREE.MeshPhongMaterial({
	color: 0xffffff * 0.4,
	shininess: 0.2,
	specular: 0xffffff,
	//envMap: textureCube,
	side: THREE.DoubleSide
});

var rand = Math.random;

for (i = 0; i < leaves; i++) {
	plane = new THREE.Mesh(planePiece, planeMat);
	plane.rotation.set(rand(), rand(), rand());
	plane.rotation.dx = rand() * 0.1;
	plane.rotation.dy = rand() * 0.1;
	plane.rotation.dz = rand() * 0.1;

	plane.position.set(rand() * 150, 0 + rand() * 300, rand() * 150);
	plane.position.dx = (rand() - 0.5);
	plane.position.dz = (rand() - 0.5);
	scene.add(plane);
	planes.push(plane);
}

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
		// geometry.position = 0;

		// var geometry = new THREE.RingGeometry( 30, 30, 18);
		// camera.position.z = 60;

		// var geometry = new THREE.RingGeometry( 20, 150, 18);

		// var geometry = new THREE.RingGeometry( 20, 150, 18);

		// var geometry = new THREE.TorusKnotGeometry( 10, 3, 100, 16 );
	}

	else {

	  //var geometry = new THREE.RingGeometry( 4, 40, 3);

		// var geometry = new THREE.RingGeometry( 30, 30, 18);

		// var geometry = new THREE.RingGeometry( 1, 5, 6 );
		// var material = new THREE.MeshBasicMaterial( { color: 0xffff00,
		//   side: THREE.DoubleSide } );
		// var mesh = new THREE.Mesh( geometry, material );
		// scene.add( mesh );

		// var points = [];
		// for ( var j = 0; j < 10; j++ ) {
		// 	points.push( new THREE.Vector3( Math.sin( j * 0.2 ) * 15 + 50, 0, ( j - 5 ) * 2 ) );
		// }
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

// function refRate() {
//   curTime = Date.now();
//   delta = curTime - oldTime;
//
//   if (delta > interval) {
//     oldTime = curTime - (delta % interval);
//     updateSize();
//   }
//
// }

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
			// if (shapes[i] / 2 === 0) {
			// 	turnOnMirror();
			// }
		}
		else {
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

	var pCount = particleCount;
	  while (pCount--) {
			var camz = getCamera().position.z;
      var particle = particles.vertices[pCount];
      particle.y = Math.random() * 500 - 250;
			//particleSystem.vertices[i].z = camz  +  Math.random()*600 + 200 ;
      particleSystem.geometry.vertices.needsUpdate = true;
	  }

	  particleSystem.rotation.y += -0.001;
	  particleSystem.rotation.z += 0.005;

		var normLevel = 0.2;
		beamGroup.rotation.x += beamRotationSpeed;
		beamGroup.rotation.y += beamRotationSpeed;
		beamMaterial.opacity = Math.min(normLevel * 0.4, 0.6);
		camera.rotation.z += 0.003;

		if (doShake) {
		var maxshake = 60;

		var shake = normLevel * maxshake ;
		camera.position.x = Math.random()*shake - shake/2;
		camera.position.y = Math.random()*shake - shake/2;
		}

	camera.rotation.z += 0.003;
	// camera.rotation.y += 0.005;
	// camera.rotation.x -= 0.003;
	//camera.rotation.z += 0.03;

	if (doStrobe){
	strobeOn = !strobeOn;
		if (strobeOn){
			light2.intensity = 2;
		}
		else {
			light2.intensity = 0.5;
		}
	}
	else {
		light2.intensity = 0.2;
	}

	// flash background on level threshold
	if (normLevel > 0.5 ){
		renderer.setClearColor ( 0xFFFFFF );
		backMesh2.visible = true;
	}
	else{
		renderer.setClearColor ( 0x000000 );
		backMesh2.visible = false;
	}

	// show stripes for 6 frames on beat
	backMesh2.visible = beatTime < 6;

	for(var i = 0; i < BOX_COUNT; i++) {
	boxes[i].update();
  }

	for (var i = 0; i < leaves; i++) {
		plane = planes[i];
		plane.rotation.x += plane.rotation.dx;
		plane.rotation.y += plane.rotation.dy;
		plane.rotation.z += plane.rotation.dz;
		plane.position.y -= 2;
		plane.position.x += plane.position.dx;
		plane.position.z += plane.position.dz;
		if (plane.position.y < 0) plane.position.y += 500;
	}

	// var mirrorTimes = [32.0, 96.0, 136.0, 214.0];

	if (audioSrc.context.currentTime > 32) {
		mirror.enabled = true;
	}
	if (audioSrc.context.currentTime > 96) {
		mirror.enabled = false;
	}
	if (audioSrc.context.currentTime > 136) {
		mirror.enabled = true;
	}
	if (audioSrc.context.currentTime > 214) {
		mirror.enabled = false;
	}
	// var songTimes = [16.0, 48.0, 80.0, 112.0, 144.0, 160.0];
	// var dotTimes = [17.0, 49.0, 81.0, 113.0, 145.0, 161.0];
	// // console.log(songTimes.length);
	// for (var i = 0; i < songTimes.length; i++) {
	// 	if (audioSrc.context.currentTime > songTimes[i]) {
	// 		dot.enabled = true;
	// 	}
	// 	if (audioSrc.context.currentTime > dotTimes[i]) {
	// 		dot.enabled = false;
	// 	}
	// 	//console.log(songTimes[i]);
	// }


	// console.log(audioSrc.context.currentTime);
stats.update();
}

render();
