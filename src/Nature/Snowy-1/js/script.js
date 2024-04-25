const container = document.getElementById("container");
let clock = new THREE.Clock();
const gui = new dat.GUI();

let scene, camera, renderer, material;
let settings = { fps: 30, parallaxVal: 1 };
let videoElement;

async function init() {
  renderer = new THREE.WebGLRenderer({
    antialias: false,
  });
  renderer.setSize(window.innerWidth, window.innerHeight, 2);
  container.appendChild(renderer.domElement);
  scene = new THREE.Scene();
  camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);

  material = new THREE.ShaderMaterial({
    uniforms: {
      u_tex0: { type: "t" },
      u_time: { value: 0, type: "f" },
      u_depth: { value: 0.5, type: "f" },
      u_width: { value: 0.3, type: "f" },
      u_speed: { value: 0.6, type: "f" },
      u_layers: { value: 50, type: "i" },
      u_blur_intensity: { value: 0.3, type: "f" },
      u_texture_fill: { value: true, type: "b" },
      u_post_processing: { value: true, type: "b" },
      u_mouse: { value: new THREE.Vector4(), type: "v4" },
      u_resolution: { value: new THREE.Vector2(window.innerWidth, window.innerHeight), type: "v2" },
      u_tex0_resolution: { value: new THREE.Vector2(window.innerWidth, window.innerHeight), type: "v2" },
    },
    vertexShader: `
          varying vec2 vUv;        
          void main() {
              vUv = uv;
              gl_Position = vec4( position, 1.0 );    
          }
        `,
  });
  material.fragmentShader = await (await fetch("shaders/snow.frag")).text();

  new THREE.TextureLoader().load("media/mountain-surrounded-with-fog-1772973.jpg", function (tex) {
    material.uniforms.u_tex0_resolution.value = new THREE.Vector2(tex.image.width, tex.image.height);
    material.uniforms.u_tex0.value = tex;
  });

  const quad = new THREE.Mesh(new THREE.PlaneGeometry(2, 2, 1, 1), material);
  scene.add(quad);
}

window.addEventListener("resize", function (e) {
  renderer.setSize(window.innerWidth, window.innerHeight, 2);

  material.uniforms.u_resolution.value = new THREE.Vector2(window.innerWidth, window.innerHeight);
});

function render() {
  setTimeout(function () {
    requestAnimationFrame(render);
  }, 1000 / settings.fps);

  //reset every 6hr
  if (clock.getElapsedTime() > 21600) clock = new THREE.Clock();
  material.uniforms.u_time.value = clock.getElapsedTime();

  renderer.render(scene, camera);
}

init();
render();
createWebUI();

//sucrose api
function SucrosePropertyListener(name, val) {
  switch (name) {
    case "blurIntensity":
      material.uniforms.u_blur_intensity.value = val.value;
      break;
    case "layers":
      material.uniforms.u_layers.value = val.value;
      break;
    case "depth":
      material.uniforms.u_depth.value = val.value;
      break;
    case "width":
      material.uniforms.u_width.value = val.value;
      break;
    case "speed":
      material.uniforms.u_speed.value = val.value;
      break;
    case "mediaSelect":
      {
        let ext = getExtension(val.value);
        disposeVideoElement(videoElement);
        material.uniforms.u_tex0.value?.dispose();
        if (ext == "jpg" || ext == "jpeg" || ext == "png") {
          new THREE.TextureLoader().load(val.folder + "/" + val.value, function (tex) {
            material.uniforms.u_tex0.value = tex;
            material.uniforms.u_tex0_resolution.value = new THREE.Vector2(tex.image.width, tex.image.height);
          });
        } else if (ext == "webm") {
          videoElement = createVideoElement(val.folder + "/" + val.value);
          let videoTexture = new THREE.VideoTexture(videoElement);
          videoElement.addEventListener(
            "loadedmetadata",
            function (e) {
              material.uniforms.u_tex0_resolution.value = new THREE.Vector2(
                videoTexture.image.videoWidth,
                videoTexture.image.videoHeight
              );
            },
            false
          );
          material.uniforms.u_tex0.value = videoTexture;
        }
      }
      break;
    case "mediaScaling":
      material.uniforms.u_texture_fill.value = [false, true][val.value];
      break;
    case "postProcessingChk":
      material.uniforms.u_post_processing.value = val.value;
      break;
    case "parallaxIntensity":
      settings.parallaxVal = val.value;
      break;
    case "fpsLock":
      settings.fps = val.value ? 30 : 60;
      break;
    case "debug":
      if (val.value) gui.show();
      else gui.hide();
      break;
  }
}

//web
function createWebUI() {
  let snow = gui.addFolder("Snow");
  let bg = gui.addFolder("Background");
  let misc = gui.addFolder("More");
  snow.open();
  bg.open();
  misc.open();
  snow.add(material.uniforms.u_layers, "value", 0, 200, 1).name("Layers");
  snow.add(material.uniforms.u_depth, "value", 0, 10, 0.01).name("Depth");
  snow.add(material.uniforms.u_width, "value", 0, 10, 0.01).name("Width");
  snow.add(material.uniforms.u_speed, "value", 0, 10, 0.01).name("Speed");
  bg.add(
    {
      picker: function () {
        document.getElementById("filePicker").click();
      },
    },
    "picker"
  ).name("Change Background");
  bg.add(material.uniforms.u_blur_intensity, "value", 0, 1, 0.01).name("Blur");
  bg.add(settings, "parallaxVal", 0, 5, 1).name("Parallax");
  bg.add(material.uniforms.u_texture_fill, "value").name("Scale to Fill");
  bg.add(material.uniforms.u_post_processing, "value").name("Post Processing");
  misc.add(settings, "fps", 15, 120, 15).name("FPS");
  misc
    .add(
      {
        sucrose: function () {
          window.open("https://github.com/Taiizor/Sucrose");
        },
      },
      "sucrose"
    )
    .name("Try It On Your Desktop!");
  misc
    .add(
      {
        source: function () {
          window.open("https://github.com/Taiizor/Store/tree/develop/src/Nature/Snowy-1");
        },
      },
      "source"
    )
    .name("Source Code");
  gui.close();
}

document.getElementById("filePicker").addEventListener("change", function () {
  if (this.files[0] === undefined) return;
  let file = this.files[0];
  if (file.type == "image/jpg" || file.type == "image/jpeg" || file.type == "image/png") {
    disposeVideoElement(videoElement);
    material.uniforms.u_tex0.value?.dispose();

    new THREE.TextureLoader().load(URL.createObjectURL(file), function (tex) {
      material.uniforms.u_tex0.value = tex;
      material.uniforms.u_tex0_resolution.value = new THREE.Vector2(tex.image.width, tex.image.height);
    });
  } else if (file.type == "video/mp4" || file.type == "video/webm") {
    disposeVideoElement(videoElement);
    material.uniforms.u_tex0.value?.dispose();

    videoElement = createVideoElement(URL.createObjectURL(file));
    let videoTexture = new THREE.VideoTexture(videoElement);
    videoElement.addEventListener(
      "loadedmetadata",
      function (e) {
        material.uniforms.u_tex0_resolution.value = new THREE.Vector2(
          videoTexture.image.videoWidth,
          videoTexture.image.videoHeight
        );
      },
      false
    );
    material.uniforms.u_tex0.value = videoTexture;
  }
});

//parallax
document.addEventListener("mousemove", function (event) {
  if (settings.parallaxVal == 0) return;

  const x = (window.innerWidth - event.pageX * settings.parallaxVal) / 90;
  const y = (window.innerHeight - event.pageY * settings.parallaxVal) / 90;

  container.style.transform = `translateX(${x}px) translateY(${y}px) scale(1.09)`;
});

//helpers
function getExtension(filePath) {
  return filePath.substring(filePath.lastIndexOf(".") + 1, filePath.length) || filePath;
}

function createVideoElement(src) {
  let htmlVideo = document.createElement("video");
  htmlVideo.src = src;
  htmlVideo.muted = true;
  htmlVideo.loop = true;
  htmlVideo.play();
  return htmlVideo;
}

//ref: https://stackoverflow.com/questions/3258587/how-to-properly-unload-destroy-a-video-element
function disposeVideoElement(video) {
  if (video != null && video.hasAttribute("src")) {
    video.pause();
    video.removeAttribute("src"); // empty source
    video.load();
  }
}