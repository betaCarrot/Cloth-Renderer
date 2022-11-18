import * as THREE from 'three';
import { OrbitControls } from 'OrbitControls';
import { OBJLoader } from 'ObjLoader';
import { mergeVertices } from 'BufferGeometryUtils';
import { GUI } from "gui";

const gui = new GUI();

const scene = new THREE.Scene();
scene.background = new THREE.Color(0.9, 0.9, 0.9);
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

const renderer = new THREE.WebGLRenderer();
const controls = new OrbitControls(camera, renderer.domElement);
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const material = new THREE.ShaderMaterial({
    uniforms: {
        type: { value: 1 },
        light: { value: 15.0 }
    },
    vertexShader: document.getElementById('vertexShader').textContent,
    fragmentShader: document.getElementById('fragmentShader').textContent
});

const params = {
    fabric_type: 1,
    light: 15.0,
    mesh: 'bunny'
}

gui.add(params, 'fabric_type', { linen: 0, silk: 1, polyester_front: 2, polyester_back: 3, cross_color_silk: 4, velvet: 5 });
gui.add(params, 'light', 0, 30);
gui.add(params, 'mesh', { bunny: 'bunny', cactus: 'cactus', curtain: 'curtain', pillow: 'pillow', sy: 'sy' });

let mesh;
const loader = new OBJLoader();
loadMesh();

let lastMesh = 'bunny';

window.addEventListener("resize", onWindowResize, false);
function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize(window.innerWidth, window.innerHeight);
}

camera.position.z = 5;

function loadMesh() {
    scene.clear();
    loader.load(
        // resource URL
        'models/' + params.mesh + '.obj',
        // called when resource is loaded
        function (obj) {
            mesh = obj.children[0];
            mesh.material = material;
            mesh.geometry.deleteAttribute("normal");
            mesh.geometry = mergeVertices(mesh.geometry);
            mesh.geometry.computeVertexNormals();
            scene.add(mesh);
            controls.reset();
            camera.position.z = 5;
        },
        // called when loading is in progresses
        function (xhr) {

        },
        // called when loading has errors
        function (error) {

            console.log(error);

        }
    );

}

function animate() {
    requestAnimationFrame(animate);
    if (typeof mesh !== 'undefined') {
        mesh.material.uniforms.type.value = params.fabric_type;
        mesh.material.uniforms.light.value = params.light;
        if (lastMesh != params.mesh) {
            console.log("change");
            loadMesh();
            lastMesh = params.mesh;
        }
    }
    renderer.render(scene, camera);
};

animate();