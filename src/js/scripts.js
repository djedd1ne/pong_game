import * as THREE from 'three';
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls.js';
import {GUI} from 'dat.gui';
import * as colors from './theme.js';

let Keyboard = {
    ArrowUp: false,
    ArrowDown: false,
    W: false,
    S: false
}
//Rendrer instance anti-aliasing activated
const renderer = new THREE.WebGLRenderer({antialias: true});
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.shadowMap.enabled = true;
renderer.setClearColor();

//Plane
const planeGeometry = new THREE.PlaneGeometry