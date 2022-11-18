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
    light: 15.0
}

gui.add(params, 'fabric_type', { linen: 0, silk: 1, polyester_front: 2, polyester_back: 3, cross_color_silk: 4, velvet: 5 });
gui.add(params, 'light', 0, 30);

const loader = new OBJLoader();
let mesh;
loader.load(
    // resource URL
    'models/sy.obj',
    // called when resource is loaded
    function (obj) {
        mesh = obj.children[0];
        mesh.material = material;
        mesh.geometry.deleteAttribute("normal");
        console.log(mesh.geometry);
        mesh.geometry = mergeVertices(mesh.geometry);
        mesh.geometry.computeVertexNormals();
        console.log(mesh.geometry);
        scene.add(mesh);
    },
    // called when loading is in progresses
    function (xhr) {

    },
    // called when loading has errors
    function (error) {

        console.log(error);

    }
);

camera.position.z = 5;


window.addEventListener("resize", onWindowResize, false);
function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize(window.innerWidth, window.innerHeight);
}

function animate() {
    requestAnimationFrame(animate);
    mesh.material.uniforms.type.value = params.fabric_type;
    mesh.material.uniforms.light.value = params.light;
    renderer.render(scene, camera);
};

animate();