import * as THREE from 'three';

let camera, scene, renderer;
let geometry, material, mesh;

let input, body, canvasHeight, canvasWidth;

let initResolve;

const HEIGHT_OFFSET = 100;
const WIDTH_OFFSET = 15;
const initPromise = new Promise((resolve) => { initResolve = resolve });

const init = () => {
  camera = new THREE.PerspectiveCamera( 70, window.innerWidth / window.innerHeight, 0.01, 10 );
  camera.position.z = 1;

  scene = new THREE.Scene();

  geometry = new THREE.SphereGeometry(0.2, 20, 20);
  material = new THREE.MeshLambertMaterial({
    color: 0x888888
  });

  mesh = new THREE.Mesh(geometry, material);
  scene.add(mesh);

  renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  body = document.getElementsByTagName('body')[0]
  body.appendChild(renderer.domElement);


  const light = new THREE.PointLight();
  light.position.set(1, 1, 1)
  const ambientLight = new THREE.AmbientLight(0xf0f0f0);
  scene.add(ambientLight);
  scene.add(light);

  console.log('loaded')
  initResolve();
  animate();

  const submit = document.getElementById('submit');
  input = document.getElementById('words');
  submit.onclick = writeToCanvas;
}

const animate = () => {
  requestAnimationFrame(animate);
  mesh.rotation.y += 0.01;
  renderer.render(scene, camera);
}

const writeToCanvas = (e) => {
  const text = input.value;
  console.log('text:', text);
  const canvas = createCanvas(text);
  // const canvas = document.getElementById('text_renderer');
  const textImg = getTextImg(canvas, text);
  drawTexture(textImg);
  download();
}

const reset = () => {
  const removeWrapper = document.getElementById('size-check');
  const removeCanvas = document.getElementById('text-canvas');
  removeWrapper && removeWrapper.remove();
  removeCanvas && removeCanvas.remove();
}

const createCanvas = text => {
  reset();
  debugger
  const wrapper = document.createElement('div');
  wrapper.id = 'size-check';
  wrapper.setAttribute('style', 'font: 60px sans-serif; display: inline-block');
  wrapper.innerHTML = text;
  body.appendChild(wrapper);
  const el = document.getElementById('size-check');
  const rect = el.getBoundingClientRect();

  const canvas = document.createElement('canvas');
  canvasWidth = rect.width + 2 * WIDTH_OFFSET;
  canvasHeight = rect.height + HEIGHT_OFFSET;
  canvas.width = canvasWidth;
  canvas.height = canvasHeight;
  canvas.id = 'text-canvas';
  canvas.setAttribute('style', `width: ${canvasWidth}px; height: ${canvasHeight}px; display: block`);
  body.appendChild(canvas);
  const canvasEl = document.getElementById('text-canvas');
  return canvasEl;
}

const getTextImg = (canvas, text) => {
  const ctx = canvas.getContext('2d');
  ctx.fillStyle = '#AAAAAA';
  ctx.fillRect(0, 0, canvasWidth, canvasHeight);
  ctx.fillStyle = '#FF0000';
  ctx.font = '60px sans-serif';
  ctx.fillText(text, WIDTH_OFFSET, canvasHeight - (HEIGHT_OFFSET * .66));
  const textImg = canvas.toDataURL('image/png');
  console.log('image url:', textImg);
  return textImg;
}

const drawTexture = image => {
  const texture = new THREE.TextureLoader().load(image);
  texture.wrapS = THREE.ClampToEdgeWrapping;
  texture.wrapT = THREE.ClampToEdgeWrapping;
  material.map = texture;
  material.needsUpdate = true;
}

const download = () => {

}

window.onload = init;
