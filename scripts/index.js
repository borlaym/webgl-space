import THREE from 'three';
var TURN_SPEED = Math.PI / 8;
var scene, camera, renderer, spaceTexture;
var geometry, redMaterial, spaceMaterial, mesh, light, ambient, sphere, background;
var relativeX, relativeY;
var timestamp = new Date();
var loader = new THREE.JSONLoader();

init();
animate();

function init() {
	relativeX = 0;
	relativeY = 0;
	scene = new THREE.Scene();

	camera = new THREE.PerspectiveCamera( 50, window.innerWidth / window.innerHeight, 0.01, 10000 );
	spaceTexture = THREE.ImageUtils.loadTexture('../textures/dark-space-texture.png');
	redMaterial = new THREE.MeshLambertMaterial( { color: 0x3f3f3f } );
	redMaterial.side = THREE.DoubleSide;
	redMaterial.transparent = true;

	spaceMaterial = new THREE.MeshBasicMaterial();
	spaceMaterial.map = spaceTexture;
	spaceMaterial.side = THREE.DoubleSide;

	loader.load('../models/cockpit.js', function (geometry, mat) {
		geometry.scale.x = 15;
		geometry.scale.y = 15;
		geometry.scale.z = 15;
		geometry.rotateY(Math.PI / 2)
		mesh = new THREE.Mesh( geometry, redMaterial);
		scene.add(mesh);
	});

	sphere = new THREE.SphereGeometry(2000, 100, 100);
	background = new THREE.Mesh(sphere, spaceMaterial);
	scene.add(background);

	ambient = new THREE.AmbientLight(0x404040);
	scene.add(ambient);

	light = new THREE.SpotLight(0xffffff);
	light.position.set(-20, 5, 5);
	scene.add(light);

	renderer = new THREE.WebGLRenderer();
	renderer.setSize( window.innerWidth, window.innerHeight );

	document.body.appendChild( renderer.domElement );

	document.body.addEventListener('mousemove', function (e) {
		var x, y, screenWidth, screenHeight, offsetX, offsetY;
		x = e.clientX;
		y = e.clientY;
		screenWidth = window.innerWidth;
		screenHeight = window.innerHeight;
		offsetX = x - screenWidth / 2;
		offsetY = y - screenHeight / 2;
		relativeX = offsetX / (screenWidth / 2);
		relativeY = offsetY / (screenHeight / 2);
	});


}

function animate() {
	var now = new Date();
	var d = now - timestamp;
	timestamp = now;
	requestAnimationFrame( animate );
	camera.rotation.x -= (relativeY * TURN_SPEED * d / 1000);
	camera.rotation.y -= (relativeX * TURN_SPEED * d / 1000);
	if (mesh) mesh.rotation.x = camera.rotation.x;
	if (mesh) mesh.rotation.y = camera.rotation.y;
	renderer.render( scene, camera );
}
