import * as THREE from "https://esm.sh/three";
import { OrbitControls } from "https://esm.sh/three/addons/controls/OrbitControls.js";
import { GLTFLoader } from "https://esm.sh/three/examples/jsm/loaders/GLTFLoader";
import * as CameraUtils from "https://esm.sh/three/examples/jsm/utils/CameraUtils";
import { gsap, Power4 } from "https://esm.sh/gsap";
import { EventEmitter } from "https://esm.sh/events";

const FILES = {
  desertFile: "./img/desert33.glb",
  forestFile: "./img/forest33.glb",
  noiseFile: "./img/noise_1.jpg" };

const ASSETS = {};

document.addEventListener("DOMContentLoaded", () => new App());

class App {
  constructor() {
    this.winWidth = window.innerWidth;
    this.winHeight = window.innerHeight;
    this.raycaster = new THREE.Raycaster();
    this.mouse = new THREE.Vector2();
    this.clock = new THREE.Clock();
    this.time = 0;
    this.deltaTime = 0;
    this.isInTransition = false;
    this.portalHover = false;
    this.loadAssets();
  }

  async loadAssets() {
    ASSETS.desertScene = await this.loadModel(FILES.desertFile);
    ASSETS.forestScene = await this.loadModel(FILES.forestFile);
    ASSETS.noiseMap = await this.loadTexture(FILES.noiseFile);
    this.initApp();
  }

  loadModel(file) {
    const loaderModel = new GLTFLoader();
    return new Promise(resolve => {
      loaderModel.load(file, gltf => {
        resolve(gltf.scene);
      });
    });
  }

  loadTexture(file) {
    const textureLoader = new THREE.TextureLoader();
    return new Promise(resolve => {
      textureLoader.load(file, texture => {
        texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
        resolve(texture);
      });
    });
  }

  initApp() {
    this.createWorlds();
    this.createRenderer();
    this.createControls();
    this.createListeners();
    this.onWindowResize();
    this.loop();
  }

  createWorlds() {
    this.desertWorld = new World(ASSETS.desertScene, "desert");
    this.forestWorld = new World(ASSETS.forestScene, "forest");

    this.desertWorld.addListener("moveToPortalComplete", () =>
    this.onMoveToPortalComplete());

    this.forestWorld.addListener("moveToPortalComplete", () =>
    this.onMoveToPortalComplete());

    this.desertWorld.addListener("moveToOriginComplete", () =>
    this.onMoveToOriginComplete());

    this.forestWorld.addListener("moveToOriginComplete", () =>
    this.onMoveToOriginComplete());


    this.currentWorld = this.forestWorld;
    this.otherWorld = this.desertWorld;

    // portalWorldStart and portalWorldEnd are virtual object in each world, they define where to position, scale and rotate the initial and final transforms of the virtual world during the camera transition.
    this.desertWorld.setTransitionTransforms(
    this.forestWorld.portalWorldStart,
    this.forestWorld.portalWorldEnd);

    this.forestWorld.setTransitionTransforms(
    this.desertWorld.portalWorldStart,
    this.desertWorld.portalWorldEnd);


    this.otherWorld.placeToStart();
    this.currentWorld.reset();
  }

  // used once the camera reaches the portal. The virtual world becomes the main one and vice versa
  switchWorlds() {
    const w = this.otherWorld;
    this.otherWorld = this.currentWorld;
    this.currentWorld = w;

    this.otherWorld.placeToStart();
    this.currentWorld.reset();

    this.onWindowResize();
  }

  /* 
  The transition is done in 3 steps :
  1 - the cameras moves towards the portal + the virtual world moves to portalWorldEnd
  2 - When the camera reaches the portal, main world and virtual world are switched
  3 - The cameras move back to their start position. Main world transform are moved back to their origin : scale = 1, rotation = 0, position = 0 
  */
  moveCameraToPortal() {
    this.isInTransition = true;
    this.controls.enabled = false;
    this.currentWorld.moveCameraToPortal();
    this.otherWorld.moveWorldToEnd();
  }

  onMoveToPortalComplete() {
    this.switchWorlds();
    this.currentWorld.moveWorldAndCameraToOrigin();
  }

  onMoveToOriginComplete() {
    this.controls.object = this.currentWorld.camera;
    this.controls.target = this.currentWorld.cameraTarget.position;
    this.isInTransition = false;
    this.controls.enabled = true;
  }

  createRenderer() {
    const canvas = document.querySelector("canvas.webgl");
    this.renderer = new THREE.WebGLRenderer({
      canvas,
      alpha: true,
      antialias: true,
      preserveDrawingBuffer: true });


    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.toneMapping = THREE.CineonToneMapping;
    this.renderer.localClippingEnabled = true;
  }

  createControls() {
    this.controls = new OrbitControls(
    this.currentWorld.camera,
    this.renderer.domElement);

    this.controls.minDistance = 0;
    this.controls.maxDistance = 50;
    this.controls.maxPolarAngle = Math.PI / 2 + 0.1;
    this.controls.enabled = true;
  }

  createListeners() {
    window.addEventListener("resize", this.onWindowResize.bind(this));
    document.addEventListener("mousemove", this.onMouseMove.bind(this), false);
    document.addEventListener("touchmove", this.onTouchMove.bind(this), false);
    document.addEventListener("mousedown", this.onMouseDown.bind(this), false);
  }

  loop() {
    this.deltaTime = this.clock.getDelta();
    this.time += this.deltaTime;

    // apply visual effects on the portal at each frame
    this.currentWorld.portal.loop(this.deltaTime);

    this.render();

    if (this.controls && this.controls.enabled) this.controls.update();

    // make sure cameras of both worlds are at the exact same position
    this.syncCameras();

    window.requestAnimationFrame(this.loop.bind(this));
  }

  render() {
    // virtual world is rendered on a texture at each frame just before rendering the main world

    // align virtual camera to main world's portal corners
    this.currentWorld.portal.updateCorners();
    const { bottomLeft, bottomRight, topLeft } = this.currentWorld.portal.corners;
    CameraUtils.frameCorners(this.otherWorld.camera, bottomLeft, bottomRight, topLeft, false);

    // store main render target
    const currentRenderTarget = this.renderer.getRenderTarget();
    // render virtual scene through portal
    this.renderer.setRenderTarget(this.currentWorld.portal.renderTarget);
    this.renderer.render(this.otherWorld.scene, this.otherWorld.camera);
    // reuse main render target
    this.renderer.setRenderTarget(currentRenderTarget);
    // render main world
    this.renderer.render(this.currentWorld.scene, this.currentWorld.camera);
  }

  syncCameras() {
    this.otherWorld.camera.position.copy(this.currentWorld.camera.position);
    this.otherWorld.camera.quaternion.copy(this.currentWorld.camera.quaternion);
    this.otherWorld.cameraTarget.position.copy(
    this.currentWorld.cameraTarget.position);

  }

  raycast() {
    this.raycaster.setFromCamera(this.mouse, this.currentWorld.camera);
    var intersects = this.raycaster.intersectObjects([
    this.currentWorld.portalPlane]);


    // mouse over portal
    if (intersects.length > 0) {
      this.currentWorld.portal.effectMultiplier = 2;
      this.portalHover = true;
    } else {
      this.currentWorld.portal.effectMultiplier = 1;
      this.portalHover = false;
    }
  }

  onWindowResize() {
    this.winWidth = window.innerWidth;
    this.winHeight = window.innerHeight;
    this.renderer.setSize(this.winWidth, this.winHeight);
    this.currentWorld.camera.aspect = this.winWidth / this.winHeight;
    this.currentWorld.camera.updateProjectionMatrix();
  }

  onMouseDown(event) {
    if (this.portalHover && !this.isInTransition) this.moveCameraToPortal();
  }

  onMouseMove(event) {
    const x = event.clientX / this.winWidth * 2 - 1;
    const y = -(event.clientY / this.winHeight * 2 - 1);
    this.updateMouse(x, y);
    this.raycast();
  }

  onTouchMove(event) {
    if (event.touches.length == 1) {
      event.preventDefault();
      const x = event.touches[0].pageX / this.winWidth * 2 - 1;
      const y = -(event.touches[0].pageY / this.winHeight * 2 - 1);
      this.updateMouse(x, y);
      this.raycast();
    }
  }

  updateMouse(x, y) {
    this.mouse.x = x;
    this.mouse.y = y;
  }}


// WORLD

class World extends EventEmitter {
  constructor(scene, name) {
    super();
    this.scene = scene;
    this.name = name;
    this.camera = new THREE.PerspectiveCamera(60, this.winWidth / this.winHeight, 0.1, 150);
    this.camera.position.set(0, 0, 30);
    this.scene.add(this.camera);

    this.transitionDuration = 1.5;
    this.processModel();
  }

  processModel() {
    this.holder = this.scene.getObjectByName("holder");
    this.portalPlane = this.scene.getObjectByName("portal");
    this.portal = new Portal(this.portalPlane);

    // an empty object placed in the start position of the other world (before the camera start moving inside the portal)
    this.portalWorldStart = this.scene.getObjectByName("portalWorldStart");
    // an empty object placed at the target position of the other world (when the camera reaches the portal)
    this.portalWorldEnd = this.scene.getObjectByName("portalWorldEnd");

    // virtual object used as a target for the camera to look at
    this.cameraTarget = new THREE.Object3D();
  }

  setTransitionTransforms(startObject, endObject) {
    this.startPosition = startObject.position.clone();
    this.startScale = startObject.scale.clone();
    this.startQuaternion = startObject.quaternion.clone();

    this.endPosition = endObject.position.clone();
    this.endScale = endObject.scale.clone();
    this.endQuaternion = endObject.quaternion.clone();
  }

  reset() {
    this.holder.position.set(0, 0, 0);
    this.holder.scale.set(1, 1, 1);
    this.holder.quaternion.identity();
  }

  placeToStart() {
    this.holder.position.copy(this.startPosition);
    this.holder.scale.copy(this.startScale);
    this.holder.quaternion.copy(this.startQuaternion);
  }

  moveWorldToEnd() {
    // used to keep some distance between cam and other world during transition
    const duration = this.transitionDuration;
    const ease = Power4.easeIn;

    gsap.to(this.holder.position, {
      duration,
      ease,
      x: this.endPosition.x,
      y: this.endPosition.y,
      z: this.endPosition.z });


    gsap.to(this.holder.scale, {
      duration,
      ease,
      x: this.endScale.x,
      y: this.endScale.y,
      z: this.endScale.z });


    gsap.to(this.holder.quaternion, {
      duration,
      ease,
      x: this.endQuaternion.x,
      y: this.endQuaternion.y,
      z: this.endQuaternion.z,
      w: this.endQuaternion.w });

  }

  moveWorldAndCameraToOrigin() {
    // used to replace the world to its origin after entering the portal
    const duration = this.transitionDuration;
    const ease = Power4.easeOut;

    // move World, reset scale and rotation

    gsap.to(this.holder.position, {
      duration,
      ease,
      x: 0,
      y: 0,
      z: 0 });


    gsap.to(this.holder.scale, {
      duration,
      ease,
      x: 1,
      y: 1,
      z: 1 });


    gsap.to(this.holder.quaternion, {
      duration,
      ease,
      x: 0,
      y: 0,
      z: 0,
      w: 1 });


    // move camera target

    gsap.to(this.cameraTarget.position, {
      duration,
      ease,
      x: 0,
      y: 0,
      z: 0 });


    // move Camera

    gsap.to(this.camera.position, {
      duration,
      ease,
      x: 0,
      y: 0,
      z: 40,
      onUpdate: () => {
        this.camera.lookAt(this.cameraTarget.position);
      },
      onComplete: () => {
        this.emit("moveToOriginComplete");
      } });

  }

  moveCameraToPortal() {
    const duration = this.transitionDuration;
    const ease = Power4.easeIn;

    const dir = new THREE.Vector3();
    this.portalPlane.getWorldDirection(dir);
    const pos = new THREE.Vector3().copy(
    this.portalPlane.position.clone().add(dir.multiplyScalar(3)));


    gsap.to(this.cameraTarget.position, {
      duration,
      ease,
      x: this.portalWorldEnd.position.x,
      y: this.portalWorldEnd.position.y,
      z: this.portalWorldEnd.position.z });


    gsap.to(this.camera.position, {
      duration,
      ease,
      x: pos.x,
      y: pos.y,
      z: pos.z,
      onUpdate: () => {
        this.camera.lookAt(this.cameraTarget.position);
      },
      onComplete: () => {
        this.emit("moveToPortalComplete");
      } });


    gsap.to(this.portal, {
      duration,
      ease: Power4.easeIn,
      effectIntensity: 0,
      onComplete: () => {
        this.portal.effectIntensity = 1;
      } });

  }}


// PORTAL

class Portal {
  constructor(plane) {
    this.plane = plane;
    this._effectIntensity = 1;
    this._effectMultiplier = 1;
    this.time = 0;

    const fragmentShader = document.getElementById("fragmentShader").
    textContent;
    const vertexShader = document.getElementById("vertexShader").textContent;

    this.renderTarget = new THREE.WebGLRenderTarget(2048, 2048, {
      type: THREE.HalfFloatType });


    this.plane.material = new THREE.ShaderMaterial({
      uniforms: {
        map: { value: this.renderTarget.texture },
        noiseMap: { value: ASSETS.noiseMap },
        time: { value: 0 },
        effectIntensity: { value: this.effectIntensity },
        effectMultiplier: { value: this.effectMultiplier } },

      vertexShader: vertexShader,
      fragmentShader: fragmentShader });


    this.corners = {
      bottomLeft: new THREE.Vector3(),
      bottomRight: new THREE.Vector3(),
      topLeft: new THREE.Vector3() };

  }

  updateCorners() {
    const { min, max } = this.plane.geometry.boundingBox;
    this.plane.localToWorld(this.corners.bottomLeft.set(min.x, min.y, 0));
    this.plane.localToWorld(this.corners.bottomRight.set(max.x, min.y, 0));
    this.plane.localToWorld(this.corners.topLeft.set(min.x, max.y, 0));
  }

  set effectIntensity(v) {
    this._effectIntensity = v;
    this.plane.material.uniforms.effectIntensity.value = this._effectIntensity;
  }

  get effectIntensity() {
    return this._effectIntensity;
  }

  set effectMultiplier(v) {
    if (v == this._effectMultiplier) return;
    this._effectMultiplier = v;

    gsap.to(this.plane.material.uniforms.effectMultiplier, {
      duration: 1,
      ease: Power4.easeOut,
      value: v });

  }

  get effectMultiplier() {
    return this._effectMultiplier;
  }

  loop(deltaTime) {
    this.time += deltaTime * this.effectMultiplier;
    this.plane.material.uniforms.time.value = this.time;
  }}