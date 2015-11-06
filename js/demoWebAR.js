// Setup three.js WebGL renderer
var renderer = new THREE.WebGLRenderer( { antialias: true } );

// Append the canvas element created by the renderer to document body element.
renderer.domElement.style.transform = "scaleX(-1)";
document.body.appendChild( renderer.domElement );

//Create a three.js scene
var scene = new THREE.Scene();

//Create a three.js camera
var camera = new THREE.PerspectiveCamera( 110, window.innerWidth / window.innerHeight, 2, 10000 );
scene.add(camera);

//Apply AR headset positional data to camera.
var controls = new THREE.ARControls( camera );

//Apply AR stereo rendering to renderer
var effect = new THREE.AREffect( renderer );
effect.setSize( window.innerWidth, window.innerHeight );

/*
Create, position, and add 3d objects
*/
var pi = 3.141592653589793238;

var geometry = new THREE.DodecahedronGeometry(10);
var material = new THREE.MeshNormalMaterial();
material.side = THREE.DoubleSide;
var dodecahedron = new THREE.Mesh( geometry, material );
dodecahedron.position.z = -20;
scene.add(dodecahedron);

var tetrahedron = new THREE.Mesh(new THREE.TetrahedronGeometry(10), new THREE.MeshBasicMaterial({color: 0xEE0443, wireframe: true}));
var tetrahedronIncrement = 0;
var z = Math.sin(-3/2*pi/1000*tetrahedronIncrement)*40;
var x = Math.cos(-3/2*pi/1000*tetrahedronIncrement)*40;
tetrahedron.position.set(x, 0, z);
scene.add(tetrahedron);

var introMesh = new THREE.Mesh(new THREE.PlaneBufferGeometry(40, 20),
  new THREE.MeshBasicMaterial( {color: 0xffffff, transparent: true, opacity: 1, side: THREE.DoubleSide,
    map: THREE.ImageUtils.loadTexture('test.png')} ));
introMesh.position.z = -20;
introMesh.position.x = -20;
scene.add(introMesh);

var cubes = [];
for (var i = 0; i < 10; i++) {
  cubes[i] = new THREE.Mesh(new THREE.BoxGeometry(10, 10, 10), new THREE.MeshBasicMaterial({color: 0x0443EE}));
  cubes[i].position.z = i*(-20) + 100;
  cubes[i].position.x = i*(-20);
  scene.add(cubes[i]);
}

var floor = new THREE.Mesh( new THREE.PlaneBufferGeometry( 1000, 1000, 1, 1 ), new THREE.MeshBasicMaterial( { color: 0x404040, side: THREE.DoubleSide } ) );
floor.rotation.x = pi/2;
floor.position.y = -50;
scene.add( floor );

/*
Request animation frame loop function
*/
function animate() {
  // Apply any desired changes for the next frame. In this case, we rotate our object.
  dodecahedron.rotation.x += 0.01;
  dodecahedron.rotation.y += 0.005;

  tetrahedron.rotation.x += 0.01;
  tetrahedronIncrement++;
  if (tetrahedronIncrement >= 1000) {
    tetrahedronIncrement = 0;
  }
  var z = Math.sin(-2*pi/1000*tetrahedronIncrement)*40;
  var x = Math.cos(-2*pi/1000*tetrahedronIncrement)*40;
  tetrahedron.position.set(x, 0, z);

  //Update AR headset position and apply to camera.
  controls.update();

  // Render the scene through the AREffect.
  effect.render( scene, camera );
  requestAnimationFrame( animate );
}

animate();	// Kick off animation loop

/*
Listen for click event
*/
document.body.addEventListener( 'click', doClickStuff);

function doClickStuff(event) {
  effect.setFullScreen(true);

  if (typeof window.screen.orientation !== 'undefined' && typeof window.screen.orientation.lock === 'function') {
    window.screen.orientation.lock('landscape-primary');
  }
}

/*
Listen for keyboard events
*/
function onkey(event) {
  event.preventDefault();

  if (event.keyCode == 90) { // z
    controls.resetSensor(); //zero rotation
  } else if (event.keyCode == 70 || event.keyCode == 13) { //f or enter
    effect.setFullScreen(true) //fullscreen
  }
};
window.addEventListener("keydown", onkey, true);

/*
Handle window resizes
*/
function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  effect.setSize( window.innerWidth, window.innerHeight );
}
window.addEventListener( 'resize', onWindowResize, false );
