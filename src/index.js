import * as THREE from 'three';

let camera, scene, renderer;
let geometry, material, mesh, light;

let initResolve;
const initPromise = new Promise((resolve) => { initResolve = resolve });

const init = () => {
  camera = new THREE.PerspectiveCamera( 70, window.innerWidth / window.innerHeight, 0.01, 10 );
  camera.position.z = 1;

  scene = new THREE.Scene();

  geometry = new THREE.SphereGeometry(0.2, 20, 20);
  material = new THREE.MeshLambertMaterial({
    color: 0x888888
  });
  // material = new THREE.MeshNormalMaterial();

  mesh = new THREE.Mesh(geometry, material);
  scene.add(mesh);

  renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.getElementsByTagName('body')[0].appendChild(renderer.domElement);


  light = new THREE.PointLight();
  light.position.set(1, 1, 1)
  const ambientLight = new THREE.AmbientLight(0xf0f0f0);
  scene.add(ambientLight);
  scene.add(light);

  console.log('loaded')
  initResolve();
  animate();
}

const animate = () => {
  requestAnimationFrame(animate);
  mesh.rotation.y += 0.01;
  renderer.render(scene, camera);
}


window.onload = init;
