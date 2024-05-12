import * as THREE from 'three';
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls.js'

let renderer;
let scene;
let camera;
let planeMaterial;
let plane;
let paddleMaterial;
let paddleGeometry;
let rightPaddle;
let leftPaddle;
let sphereGeo;
let sphereMaterial;
let sphere;
let controls;
let clock;
let delta;



//assigned
let boardWidth = 30;
let boardHeight = 15;
let halfBoardWidth = boardWidth / 2;
let halfBoardHeight = boardHeight / 2;
let thickness = 0.25;
let paddleLength = 2;
let paddleWidth = 0.4;
let halfPaddleLength = paddleLength / 2;
let distance = 1;
let radius = 0.2;
let paddleSpeed = 10;

//perspective camera
let fov = 40;
let near = 0.1;
let far = 1000;

//Paddle moves
let leftPaddleMoveUp = false;
let leftPaddleMoveDown = false;
let rightPaddleMoveUp = false;
let rightPaddleMoveDown = false;

function initScene() {
    renderer = new THREE.WebGLRenderer({canvas: document.getElementById('canvas'), antialias: true});
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);
    renderer.setClearColor(0x0000FF);
    renderer.shadowMap.enabled = true;
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(
            fov,
            window.innerWidth / window.innerHeight,
            near,
            far
            );
    camera.position.set(0, -45, 15);
    camera.lookAt(0, 0, 0);
    controls = new OrbitControls(camera, renderer.domElement);
}

function initPlane(){
    planeGeo =  new THREE.PlaneGeometry(boardWidth, boardHeight,);
    planeMaterial = new THREE.MeshStandardMaterial({
        color: 0xFFFFFF,
        side: THREE.DoubleSide});
    plane = new THREE.Mesh(planeGeo, planeMaterial);
    plane.receiveShadow = true;
    scene.add(plane);
}

function initBall(){
    sphereGeo = new THREE.SphereGeometry(radius);
    sphereMaterial = new THREE.MeshStandardMaterial({color: 0xFF0000});
    sphere = new THREE.Mesh(sphereGeo, sphereMaterial);
    sphere.castShadow = true;
    scene.add(sphere);
    sphere.position.set(0, 0, radius);
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
}

function initLights(){
    //ambient
    ambientLight = new THREE.AmbientLight(0xFFFFFF, 0.7);
    scene.add(ambientLight);
    //Hemisphere
    hemisphereLight = new THREE.HemisphereLight(0xFFFFFF, 0x003300);
    scene.add(hemisphereLight);
    //directional
    directionLight = new THREE.DirectionalLight(0xFFFFFF/2, 0.7);
    directionLight.position.set(0, 0, radius/2);
    directionLight.castShadow = true;
    scene.add(directionLight);
}


function init(){
    initScene();
    initPlane();
    initLights();
    initPaddle();
    initBall();
}

function handleKeyDown(event){
    switch (event.code){
        case 'ArrowUp':
            rightPaddleMoveUp = true;
            break;
        case 'ArrowDown':
            rightPaddleMoveDown = true;
            break;
        case 'KeyW':
            leftPaddleMoveUp = true;
            break;
        case 'KeyS':
            leftPaddleMoveDown = true;
            break;
    }
}

function handleKeyUp(event){
    switch (event.code){
        case 'ArrowUp':
            rightPaddleMoveUp = false;
            break;
        case 'ArrowDown':
            rightPaddleMoveDown = false;
            break;
        case 'KeyW':
            leftPaddleMoveUp = false;
            break;
        case 'KeyS':
            leftPaddleMoveDown = false;
            break;
    }
}

function onWindowResize(){
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

function addEventListners(){
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    window.addEventListener('resize', onWindowResize);
}

function initVariables(){
    clock = new THREE.Clock();
}

function updatePaddles(){
    delta = clock.getDelta();
    if (leftPaddleMoveUp){
        leftPaddle.position.y += paddleSpeed * delta;
        leftPaddle.position.y = Math.min(halfBoardHeight - halfPaddleLength, leftPaddle.position.y);
    }
    if (leftPaddleMoveDown){
        leftPaddle.position.y -= paddleSpeed * delta;
        leftPaddle.position.y = Math.max(-halfBoardHeight + halfPaddleLength, leftPaddle.position.y);
    }
    if (rightPaddleMoveUp){
        rightPaddle.position.y += paddleSpeed * delta;
        rightPaddle.position.y = Math.min(halfBoardHeight - halfPaddleLength, rightPaddle.position.y);
    }
    if (rightPaddleMoveDown){
        rightPaddle.position.y -= paddleSpeed * delta;
        rightPaddle.position.y = Math.max(-halfBoardHeight + halfPaddleLength, rightPaddle.position.y);
    }
}

function updateBall(){
    ballVelocity
}

let     randomAngle = Math.random() * Math.PI * 2; //random angle in radians

function updateBall(){
    ballVelocity.set(Math.cos(randomAngle) * randomSpeed, Math.sin(randomAngle) * randomSpeed);
    sphere.position.x += ballVelocity.x * delta;
    sphere.position.y += ballVelocity.y * delta;
    if (sphere.position.y >= halfBoardHeight - radius || sphere.position.y <= -halfBoardHeight + radius) {
        ballVelocity.y *= -1;
    }
    if (sphere.position.x >= halfBoardWidth - radius || sphere.position.x <= -halfBoardWidth + radius) {
        ballVelocity.x *= -1;
    }
}

function animateGame(){
    updatePaddles();
    controls.update();
    renderer.render(scene, camera);
}

function play(){
    initVariables();
    init();
    addEventListners();
    renderer.setAnimationLoop(animateGame);
}

play();

// function animateGame(){
//     updatePaddles();
//     controls.update();
//     renderer.render(scene, camera);
// }

// function play(){
//     initVariables();
//     init();
//     addEventListners();
//     renderer.setAnimationLoop(animateGame);
// }
