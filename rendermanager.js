import * as THREE from 'three';

import {OrbitControls} from 'https://cdn.jsdelivr.net/npm/three@0.118/examples/jsm/controls/OrbitControls.js';


export class RenderManager {
    constructor() {
        this._Initialize();
    }

    async _Initialize() {
        this.renderer = new THREE.WebGLRenderer({
            antialias: true,
        });
        this.renderer.shadowMap.enabled = true;
        this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        this.renderer.setPixelRatio(window.devicePixelRatio);
        this.renderer.setSize(window.innerWidth, window.innerHeight);

        document.body.appendChild(this.renderer.domElement);

        window.addEventListener('resize', () => {
            this._OnWindowResize();
        }, false);

        // -------------- Shaders --------------
        this.GlassVertexShader = await this._loadFile("shaders/glass.vertexshader");
        this.GlassFragmentShader = await this._loadFile("shaders/glass.fragmentshader");

        
        this._SetupScene();
    }

    _SetupScene(){
        this._scene = new THREE.Scene();

        // solid color
        this._scene.background = new THREE.Color( "#e6e2e2" );
        // cubemap
        // this._SetBgCubemap();

        // -------------- Camera --------------
        const fov = 75;
        const aspect = window.innerWidth / window.innerHeight;
        const near = 0.1;
        const far = 1000.0;
        this.camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
        // this.camera.position.set(75, 20, 0);

        this.camera.position.z = 3;
        this.camera.position.y = 0.5;

        // -------------- Lights --------------
        this.directionalLight = new THREE.DirectionalLight("#ffffff", 1.0);

        this.directionalLight.castShadow = true;
        this.directionalLight.shadow.bias = -0.001;
        this.directionalLight.shadow.mapSize.width = 2048;
        this.directionalLight.shadow.mapSize.height = 2048;
        this.directionalLight.shadow.camera.near = 0.01;
        this.directionalLight.shadow.camera.far = 100.0;
        this.directionalLight.shadow.camera.left = 100;
        this.directionalLight.shadow.camera.right = -100;
        this.directionalLight.shadow.camera.top = 100;
        this.directionalLight.shadow.camera.bottom = -100;

        // light.position.set(20, 100, 10);
        this.directionalLight.position.set(-2, 10, 0);
        this.directionalLight.target.position.set(0, 0, 0);
        this._scene.add(this.directionalLight);
        this._scene.add(this.directionalLight.target);

        // const light = new THREE.AmbientLight(0x101010);
        // this._scene.add(light);

        const controls = new OrbitControls(
        this.camera, this.renderer.domElement);
        controls.target.set(0, 0, 0);
        controls.update();

        this._AddSceneObjects();
        this._Animate();
    }

    _AddSceneObjects(){
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
        this._scene.add( cube );

        const plane = new THREE.Mesh(
            new THREE.PlaneGeometry(10, 10),
            new THREE.MeshStandardMaterial({ color: "#ffffff" })
        );
        plane.rotation.x = -Math.PI / 2;
        plane.position.y = -1;
        plane.receiveShadow = true;
        this._scene.add(plane);
    }

    _SetBgCubemap(){
        const loader = new THREE.CubeTextureLoader();
        const texture = loader.load([
            './resources/posx.jpg',
            './resources/negx.jpg',
            './resources/posy.jpg',
            './resources/negy.jpg',
            './resources/posz.jpg',
            './resources/negz.jpg',
        ]);
        this._scene.background = texture;
    }

    _OnWindowResize() {
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
    }

    _Animate() {
        requestAnimationFrame(() => {
            this.renderer.render(this._scene, this.camera);
            this._Animate();
        });
    }

    _loadFile(filePath) {
        return new Promise((resolve) => {
            const loader = new THREE.FileLoader();

            loader.load(filePath, (data) => {
                resolve(data);
            });
        });
    }
}