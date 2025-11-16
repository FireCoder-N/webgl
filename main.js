import * as THREE from 'three';

// ===================  Renderer =================== 
const renderer = new THREE.WebGLRenderer( { antialias: true } );
renderer.setSize( window.innerWidth, window.innerHeight );
renderer.setAnimationLoop( animate );
document.body.appendChild( renderer.domElement );

renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;

// ===================  Shaders ===================
const GlassVertexShader = await loadFile("shaders/glass.vertexshader");
console.log(GlassVertexShader);


// ===================  Scene =================== 
const scene = new THREE.Scene();
scene.background = new THREE.Color( "#e6e2e2ff" );

const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );
// camera.lookAt(0.01,0,0);

const directionalLight = new THREE.DirectionalLight( 0xffffff, 1 );
directionalLight.castShadow = true;
directionalLight.position.set(-2, 10, 0);
directionalLight.target.position.set(0, 0, 0);
scene.add( directionalLight );
scene.add( directionalLight.target );


const geometry = new THREE.SphereGeometry( 1, 32, 32);
const material = new THREE.MeshStandardMaterial( { color: "#00ff00" } );
// const GlassMaterial = new THREE.ShaderMaterial( {
// 	uniforms: {
// 		time: { value: 1.0 },
// 		resolution: { value: new THREE.Vector2() }
// 	},
// 	vertexShader: document.getElementById( 'vertexShader' ).textContent,
// 	fragmentShader: document.getElementById( 'fragmentShader' ).textContent
// } );

const cube = new THREE.Mesh( geometry, material );
cube.castShadow = true;
scene.add( cube );

const plane = new THREE.Mesh(
	new THREE.PlaneGeometry(10, 10),
	new THREE.MeshStandardMaterial({ color: "#ffffff" })
);
plane.rotation.x = -Math.PI / 2;
plane.position.y = -1;
plane.receiveShadow = true;
scene.add(plane);


camera.position.z = 3;
camera.position.y = 0.5;

function animate() {

	// cube.rotation.x += 0.01;
	// cube.rotation.y += 0.01;

	renderer.render( scene, camera );

}

function loadFile(filePath) {
    return new Promise((resolve) => {
        const loader = new THREE.FileLoader();

        loader.load(filePath, (data) => {
            resolve(data);
        });
    });
}