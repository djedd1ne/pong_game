import * as THREE from 'three';
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls.js';
import {GUI} from 'dat.gui';

/********** <vars> **********/
let boardWidth = 15;
let boardHeight = 7.5;
let halfBoardWidth = boardWidth / 2;
let halfBoardHeight = boardHeight / 2;
let thickness = 0.25;
let paddleLength = 2;
let paddleWidth = 0.4;
let halfPaddleLength = paddleLength / 2;
let distance = 1;
let radius = 0.2;
let keyStep = 0.1;
//perspective camera
let fov = 40;
let near = 0.1;
let far = 1000;
//
let orbitRadius = 15;
let orbitAngle = Math.PI / 16;
let orbitY = orbitRadius * Math.cos(orbitAngle);
//

/********** Objects **********/
let renderer;
let scene;
let camera;
let planeGeometry;
let planeMaterial;
let plane;
let ambientLight;
let hemisphereLight;
let directionLight;
let paddleMaterial;
let paddleGeometry;
let paddle;
let rightPaddle;
let leftPaddle;
let sphereGeo;
let sphereMaterial;
let sphere;
let orbit;
let spotlight;
let axeHelper;
let clock;
let delta;
let ticks;
let timer;
let gameTime;
let controls;

//keyboard
let keys = {
    ArrowUp: false,
    ArrowDown: false,
    w: false,
    s: false,
}


function initScene() {
    renderer = new THREE.WebGLRenderer({antialias: true});
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0x0000FF);
    renderer.shadowMap.enabled = true;
    document.body.appendChild(renderer.domElement);
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(
            fov,
            window.innerWidth / window.innerHeight,
            near,
            far
            );
    //orbit = new OrbitControls(camera, renderer.domElement);
    camera.position.set(0, -15, 10);
    camera.lookAt(0, 0, 0);
    controls = new OrbitControls(camera, renderer.domElement);
    //orbit.update();
}

function initPlane(){
    planeGeo =  new THREE.PlaneGeometry(boardWidth, boardHeight,);
    planeMaterial = new THREE.MeshStandardMaterial({
        color: 0xFFFFFF,
        side: THREE.DoubleSide});
    plane = new THREE.Mesh(planeGeo, planeMaterial);
    scene.add(plane);
    plane.receiveShadow = true;
}

function initBall(){
    sphereGeo = new THREE.SphereGeometry(radius);
    sphereMaterial = new THREE.MeshStandardMaterial({color: 0xFF0000});
    sphere = new THREE.Mesh(sphereGeo, sphereMaterial);
    sphere.castShadow = true;
    scene.add(sphere);
    sphere.position.set(0, 0, 0.5);
}

function initPaddle(){
    paddleGeometry = new THREE.BoxGeometry(paddleWidth, paddleLength, thickness);
    paddleMaterial =  new THREE.MeshBasicMaterial({color: 0x00FF00});
    leftPaddle = new THREE.Mesh(paddleGeometry, paddleMaterial);
    rightPaddle = new THREE.Mesh(paddleGeometry, paddleMaterial);
    rightPaddle.position.set(halfBoardWidth - distance,0, thickness/2);
    leftPaddle.position.set(-(halfBoardWidth - distance),0, thickness/2);
    leftPaddle.castShadow = true;
    leftPaddle.receiveShadow = true;
    rightPaddle.castShadow = true;
    rightPaddle.receiveShadow = true;
    scene.add(leftPaddle);
    scene.add(rightPaddle);
};

function initLights(){
    //ambient
    ambientLight = new THREE.AmbientLight(0xFFFFFF, 0.7);
    scene.add(ambientLight);
    //Hemisphere
    hemisphereLight = new THREE.HemisphereLight(0xFFFFFF, 0x003300);
    scene.add(hemisphereLight);
    //directional
    directionLight = new THREE.DirectionalLight(0xFFFFFF/2, 0.7);
    directionLight.position.set(0, 0, 10);
    directionLight.castShadow = true;
    scene.add(directionLight);
}

function init() {
    initScene();
    initPlane();
    initLights();
    initPaddle();
    initBall();
}

function onKeyDown(e){
    if (e.key in keys) {
        keys[e.key] = true;
    }
}

function onKeyUp(e){
    if (e.key in keys) {
        keys[e.key] = false;
    }
}

function onWindowResize(){
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

function eventListners(){
    window.addEventListener('keydown', onKeyDown);
    window.addEventListener('keyup', onKeyUp);
    window.addEventListener('resize', onWindowResize);
}

function movePaddles(){
    if (keys.ArrowUp && !keys.ArrowDown && rightPaddle.position.y < halfBoardHeight - halfPaddleLength - keyStep){
        rightPaddle.position.lerp(new THREE.Vector3(rightPaddle.position.x, rightPaddle.position.y + keyStep, rightPaddle.position.z), 1);
    }
    if (keys.ArrowDown && !keys.ArrowUp && leftPaddle.position.y > halfBoardHeight + halfPaddleLength + keyStep){
        rightPaddle.position.lerp(new THREE.Vector3(rightPaddle.position.x, rightPaddle.position.y - keyStep, rightPaddle.position.z), 1);
    }
    if (keys.w && !keys.s && leftPaddle.position.y < halfBoardHeight - halfPaddleLength - keyStep){
        leftPaddle.position.lerp(new THREE.Vector3(leftPaddle.position.x, leftPaddle.position.y + keyStep, leftPaddle.position.z), 1);
    }
    if (keys.s && !keys.w && leftPaddle.position.y > -halfBoardHeight + halfPaddleLength + keyStep){
        rightPaddle.position.lerp(new THREE.Vector3(leftPaddle.position.x, leftPaddle.position.y - keyStep, leftPaddle.position.z), 1);
    }
}

/*function playGame(){
    movePaddles();
}*/

function animateGame(){
    delta = clock.getDelta();
    ticks = Math.round(delta * 150);
    for (let i = 0; i < ticks; i++)
        movePaddles();
    controls.update();
    renderer.render(scene, camera);
}
function initVariables(){
    clock = new THREE.Clock();
    delta = 0;
    ticks = 0;
    timer = null;
    gameTime = 0;
}

initVariables();
init();
eventListners();
renderer.setAnimationLoop(animateGame);
