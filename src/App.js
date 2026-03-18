import React, { useEffect, useMemo, useState } from 'react';
import Plot from 'react-plotly.js';
import './App.css';

const AUTHORS = [
  {
    name: 'Xiaohang Yu',
    href: 'https://people.epfl.ch/xiaohang.yu?lang=en',
  },
  {
    name: 'Ti Wang',
    href: 'https://xiu-cs.github.io/',
  },
  {
    name: 'Mackenzie Weygandt Mathis',
    href: 'https://www.mackenziemathislab.org/',
  },
];

const DEMO_GROUPS = [
  {
    id: 'sheep',
    title: 'Demo 1 · Sheep',
    imageSrc: `${process.env.PUBLIC_URL}/static/3d_predictions/sheep/000000102614_sheep_input.png`,
    lapSrc: `${process.env.PUBLIC_URL}/static/3d_predictions/sheep/000000102614_sheep_baseline_render.png`,
    meshSrc: `${process.env.PUBLIC_URL}/static/3d_predictions/sheep/000000102614_sheep_baseline.obj`,
    camera: { eye: { x: 1.65, y: 1.1, z: 0.8 } },
  },
  {
    id: 'horse',
    title: 'Demo 2 · Horse',
    imageSrc: `${process.env.PUBLIC_URL}/static/3d_predictions/ride_horse/000000209383_horse_input.png`,
    lapSrc: `${process.env.PUBLIC_URL}/static/3d_predictions/ride_horse/000000209383_horse_baseline_render.png`,
    meshSrc: `${process.env.PUBLIC_URL}/static/3d_predictions/ride_horse/000000209383_horse_baseline.obj`,
    camera: { eye: { x: -1.0, y: -1.0, z: -1 } },
  },
  {
    id: 'cos',
    title: 'Demo 3 · Cow',
    imageSrc: `${process.env.PUBLIC_URL}/static/3d_predictions/cow/000000378628_cow_input.png`,
    lapSrc: `${process.env.PUBLIC_URL}/static/3d_predictions/cow/000000378628_cow_baseline_render.png`,
    meshSrc: `${process.env.PUBLIC_URL}/static/3d_predictions/cow/000000378628_cow_baseline.obj`,
    camera: { eye: { x: -1.0, y: -1.0, z: -1 } },
  },  {
    id: 'zebra',
    title: 'Demo 4 · Zebra',
    imageSrc: `${process.env.PUBLIC_URL}/static/3d_predictions/zebra/000000315905_zebra_input.png`,
    lapSrc: `${process.env.PUBLIC_URL}/static/3d_predictions/zebra/000000315905_zebra_baseline_render.png`,
    meshSrc: `${process.env.PUBLIC_URL}/static/3d_predictions/zebra/000000315905_zebra_baseline.obj`,
    camera: { eye: { x: -1.0, y: -1.0, z: -1 } },
  },
];

const plotConfig = {
  responsive: true,
  displaylogo: false,
  scrollZoom: true,
  modeBarButtonsToRemove: ['toImage', 'lasso3d', 'select3d', 'orbitRotation', 'tableRotation'],
};

const DEFAULT_MESH_CAMERA = {
  eye: { x: 1.5, y: 1.15, z: 0.85 },
  up: { x: 0, y: 0, z: 1 },
  center: { x: 0, y: 0, z: 0 },
};

const meshAxisTemplate = {
  title: '',
  showgrid: false,
  zeroline: false,
  showticklabels: false,
  showbackground: false,
  showspikes: false,
  visible: false,
};

function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen((current) => !current);
  };

  return (
    <nav className="navbar" role="navigation" aria-label="main navigation">
      <div className="navbar-brand">
        <button
          type="button"
          className={`navbar-burger${isMenuOpen ? ' is-active' : ''}`}
          aria-label="menu"
          aria-expanded={isMenuOpen}
          onClick={toggleMenu}
        >
          <span aria-hidden="true"></span>
          <span aria-hidden="true"></span>
          <span aria-hidden="true"></span>
        </button>
      </div>
      <div className={`navbar-menu${isMenuOpen ? ' is-active' : ''}`}>
        <div className="navbar-start navbar-links">
          <a className="navbar-item" href="https://www.mackenziemathislab.org">
            <span className="icon">
              <i className="fas fa-home"></i>
            </span>
          </a>
          <div className="navbar-item has-dropdown is-hoverable">
            <span className="navbar-link">Our Related Research</span>
            <div className="navbar-dropdown">
              <a className="navbar-item" href="https://github.com/AdaptiveMotorControlLab/FMPose3D">
                FMPose3D
              </a>
              <a className="navbar-item" href="https://github.com/DeepLabCut/DeepLabCut">
                DeepLabCut
              </a>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}

function Hero() {
  return (
    <section className="hero">
      <div className="hero-body">
        <div className="container is-max-desktop">
          <div className="columns is-centered">
            <div className="column has-text-centered">
              <h1 className="title is-1 publication-title">
                PRIMA: Boosting Animal Mesh Recovery with Biological Priors and Test-Time Adaptation
              </h1>
              <div className="is-size-5 publication-authors">
                {AUTHORS.map((author) => (
                  <span className="author-block" key={author.name}>
                    <a href={author.href}>{author.name}</a>
                    <sup>1</sup>
                  </span>
                ))}
              </div>
              <div className="is-size-5 publication-authors">
                <span className="author-block">
                  <sup>1</sup>EPFL
                </span>
              </div>
              <div className="publication-links">
                <span className="link-block">
                  <a href="#demo" className="external-link button is-normal is-rounded is-dark">
                    <span className="icon">
                      <i className="fas fa-play"></i>
                    </span>
                    <span>Demo</span>
                  </a>
                </span>
                <span className="link-block">
                  <a href="#results" className="external-link button is-normal is-rounded is-dark">
                    <span className="icon">
                      <i className="fas fa-images"></i>
                    </span>
                    <span>Overview</span>
                  </a>
                </span>
                <span className="link-block">
                  <a href="#BibTeX" className="external-link button is-normal is-rounded is-dark">
                    <span className="icon">
                      <i className="fas fa-quote-right"></i>
                    </span>
                    <span>BibTeX</span>
                  </a>
                </span>
              </div>
              <p className="publication-note">
                The demo section currently presents multiple representative PRIMA examples, each including
                input image, overlap visualization, and interactive 3D mesh.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Abstract() {
  return (
    <section className="section">
      <div className="container is-max-desktop">
        <div className="columns is-centered has-text-centered">
          <div className="column is-four-fifths">
            <h2 className="title is-3">Abstract</h2>
            <div className="abstract-text">
              <p>
                We present <strong>PRIMA</strong> (Priors for Mesh Adaptation), a framework for robust 3D
                quadruped mesh recovery under severe species and pose imbalance. Existing animal reconstruction
                methods often regress toward mean shapes and poses due to limited 3D supervision and long-tailed
                species distributions, resulting in poor generalization to underrepresented animals and rare
                articulations.
              </p>
              <p>
                PRIMA addresses this challenge through three key contributions. First, it incorporates
                <strong> biological priors </strong>
                through BioCLIP embeddings to inject semantic and morphological knowledge into the reconstruction
                process, enabling more accurate and generalizable shape prediction across diverse quadrupeds.
                Second, it introduces a <strong>test-time adaptation</strong> strategy that refines SMAL
                predictions using 2D reprojection constraints together with auxiliary keypoint guidance,
                improving pose and shape estimation while enabling the generation of high-quality pseudo-3D
                annotations from existing 2D datasets. Third, leveraging this TTA framework, PRIMA constructs
                <strong> Quadruped3D</strong>, a large-scale pseudo-3D dataset that covers diverse species and
                pose variations to systematically improve model performance.
              </p>
              <p>
                Extensive experiments on Animal3D, CtrlAni3D, Quadruped80K, and Animal Kingdom show strong
                performance, especially on underrepresented species and challenging poses. The project highlights
                the value of biological priors and adaptation-driven data expansion for scalable, generalizable
                animal mesh recovery.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

const buildMeshTrace = (mesh) => ({
  type: 'mesh3d',
  x: mesh.vertices.map((vertex) => vertex[0]),
  y: mesh.vertices.map((vertex) => vertex[1]),
  z: mesh.vertices.map((vertex) => vertex[2]),
  i: mesh.faces.map((face) => face[0]),
  j: mesh.faces.map((face) => face[1]),
  k: mesh.faces.map((face) => face[2]),
  color: mesh.color,
  opacity: 1,
  flatshading: false,
  hoverinfo: 'skip',
  showscale: false,
  lighting: {
    ambient: 0.55,
    diffuse: 0.85,
    specular: 0.25,
    roughness: 0.75,
    fresnel: 0.1,
  },
  lightposition: { x: 100, y: 120, z: 180 },
});

const buildMeshLayout = (camera) => ({
  margin: { l: 0, r: 0, t: 0, b: 0 },
  scene: {
    xaxis: meshAxisTemplate,
    yaxis: meshAxisTemplate,
    zaxis: meshAxisTemplate,
    bgcolor: '#ffffff',
    aspectmode: 'data',
    dragmode: 'turntable',
    camera: camera || DEFAULT_MESH_CAMERA,
  },
  paper_bgcolor: 'white',
  plot_bgcolor: 'white',
  showlegend: false,
});

const lockCameraToZAxis = (candidateCamera, referenceCamera = DEFAULT_MESH_CAMERA) => {
  const baseEye = referenceCamera.eye || DEFAULT_MESH_CAMERA.eye;
  const eye = {
    ...baseEye,
    ...(candidateCamera?.eye || {}),
  };
  const center = {
    ...(referenceCamera.center || DEFAULT_MESH_CAMERA.center),
    ...(candidateCamera?.center || {}),
  };

  const baseXyRadius = Math.hypot(baseEye.x, baseEye.y) || 1;
  const baseDistance = Math.hypot(baseEye.x, baseEye.y, baseEye.z) || 1;
  const candidateDistance = Math.hypot(eye.x, eye.y, eye.z) || baseDistance;
  const scale = candidateDistance / baseDistance;
  const lockedXyRadius = baseXyRadius * scale;
  const azimuth = Math.atan2(eye.y, eye.x || 0);

  return {
    eye: {
      x: lockedXyRadius * Math.cos(azimuth),
      y: lockedXyRadius * Math.sin(azimuth),
      z: baseEye.z * scale,
    },
    up: { x: 0, y: 0, z: 1 },
    center,
  };
};

const extractCameraFromRelayout = (eventData) => {
  if (!eventData) {
    return null;
  }

  if (eventData['scene.camera']) {
    return eventData['scene.camera'];
  }

  const eyeX = eventData['scene.camera.eye.x'];
  const eyeY = eventData['scene.camera.eye.y'];
  const eyeZ = eventData['scene.camera.eye.z'];

  if (eyeX === undefined && eyeY === undefined && eyeZ === undefined) {
    return null;
  }

  return {
    eye: {
      x: eyeX,
      y: eyeY,
      z: eyeZ,
    },
    center: {
      x: eventData['scene.camera.center.x'],
      y: eventData['scene.camera.center.y'],
      z: eventData['scene.camera.center.z'],
    },
    up: {
      x: eventData['scene.camera.up.x'],
      y: eventData['scene.camera.up.y'],
      z: eventData['scene.camera.up.z'],
    },
  };
};

const getCameraAzimuthDegrees = (camera) => {
  const eye = camera?.eye || DEFAULT_MESH_CAMERA.eye;
  const azimuth = Math.atan2(eye.y, eye.x) * (180 / Math.PI);
  return (azimuth + 360) % 360;
};

const buildCameraFromAzimuth = (azimuthDegrees, referenceCamera, currentCamera = referenceCamera) => {
  const baseEye = referenceCamera.eye || DEFAULT_MESH_CAMERA.eye;
  const baseDistance = Math.hypot(baseEye.x, baseEye.y, baseEye.z) || 1;
  const currentEye = currentCamera?.eye || baseEye;
  const currentDistance = Math.hypot(currentEye.x, currentEye.y, currentEye.z) || baseDistance;
  const scale = currentDistance / baseDistance;
  const xyRadius = (Math.hypot(baseEye.x, baseEye.y) || 1) * scale;
  const angle = azimuthDegrees * (Math.PI / 180);

  return {
    eye: {
      x: xyRadius * Math.cos(angle),
      y: xyRadius * Math.sin(angle),
      z: baseEye.z * scale,
    },
    up: { x: 0, y: 0, z: 1 },
    center: referenceCamera.center || DEFAULT_MESH_CAMERA.center,
  };
};

const rgbToCssColor = (channels) => {
  if (!channels || channels.length < 3) {
    return '#a6bddb';
  }

  const [r, g, b] = channels.map((value) => {
    const normalized = value <= 1 ? value * 255 : value;
    return Math.max(0, Math.min(255, Math.round(normalized)));
  });

  return `rgb(${r}, ${g}, ${b})`;
};

const rotateMeshToZUp = (vertices) => (
  vertices.map(([x, y, z]) => [x, -z, y])
);

const normalizeMeshVertices = (vertices) => {
  if (!vertices.length) {
    return vertices;
  }

  const mins = [Infinity, Infinity, Infinity];
  const maxs = [-Infinity, -Infinity, -Infinity];

  vertices.forEach((vertex) => {
    vertex.forEach((value, axisIdx) => {
      mins[axisIdx] = Math.min(mins[axisIdx], value);
      maxs[axisIdx] = Math.max(maxs[axisIdx], value);
    });
  });

  const center = mins.map((minValue, axisIdx) => (minValue + maxs[axisIdx]) / 2);
  const scale = Math.max(...maxs.map((maxValue, axisIdx) => maxValue - mins[axisIdx]), 1);

  return vertices.map((vertex) => (
    vertex.map((value, axisIdx) => (value - center[axisIdx]) / scale)
  ));
};

const parseObjMesh = (text) => {
  const vertices = [];
  const faces = [];
  let meshColor = null;

  text.split(/\r?\n/).forEach((line) => {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) {
      return;
    }

    if (trimmed.startsWith('v ')) {
      const parts = trimmed.split(/\s+/).slice(1).map(Number);
      vertices.push(parts.slice(0, 3));
      if (!meshColor && parts.length >= 6) {
        meshColor = rgbToCssColor(parts.slice(3, 6));
      }
      return;
    }

    if (!trimmed.startsWith('f ')) {
      return;
    }

    const indices = trimmed
      .split(/\s+/)
      .slice(1)
      .map((token) => {
        const vertexIndex = Number.parseInt(token.split('/')[0], 10);
        if (!Number.isFinite(vertexIndex)) {
          return null;
        }
        return vertexIndex > 0 ? vertexIndex - 1 : vertices.length + vertexIndex;
      })
      .filter((vertexIndex) => Number.isInteger(vertexIndex));

    if (indices.length < 3) {
      return;
    }

    for (let idx = 1; idx < indices.length - 1; idx += 1) {
      faces.push([indices[0], indices[idx], indices[idx + 1]]);
    }
  });

  if (!vertices.length || !faces.length) {
    throw new Error('OBJ file does not contain a renderable mesh');
  }

  return {
    vertices: normalizeMeshVertices(rotateMeshToZUp(vertices)),
    faces,
    color: meshColor || '#a6bddb',
  };
};

const loadMeshFromObj = async (url) => {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Failed to fetch mesh file: ${response.status}`);
  }

  const text = await response.text();
  return parseObjMesh(text);
};

function MeshViewerCard({ title, mesh, camera }) {
  const trace = useMemo(() => buildMeshTrace(mesh), [mesh]);
  const referenceCamera = useMemo(
    () => lockCameraToZAxis(camera || DEFAULT_MESH_CAMERA),
    [camera]
  );
  const initialAngle = useMemo(
    () => getCameraAzimuthDegrees(referenceCamera),
    [referenceCamera]
  );
  const [lockedCamera, setLockedCamera] = useState(referenceCamera);
  const [rotationAngle, setRotationAngle] = useState(initialAngle);
  const layout = useMemo(() => buildMeshLayout(lockedCamera), [lockedCamera]);

  useEffect(() => {
    setLockedCamera(referenceCamera);
    setRotationAngle(initialAngle);
  }, [initialAngle, referenceCamera]);

  const handleRelayout = (eventData) => {
    const nextCamera = extractCameraFromRelayout(eventData);
    if (!nextCamera) {
      return;
    }

    const nextLockedCamera = lockCameraToZAxis(nextCamera, referenceCamera);
    setLockedCamera(nextLockedCamera);
    setRotationAngle(getCameraAzimuthDegrees(nextLockedCamera));
  };

  const handleAngleChange = (event) => {
    const nextAngle = Number(event.target.value);
    setRotationAngle(nextAngle);
    setLockedCamera(buildCameraFromAzimuth(nextAngle, referenceCamera, lockedCamera));
  };

  return (
    <div className="pose-card">
      <h3 className="title is-5 pose-card-title">{title}</h3>
      <div className="pose-plot-wrapper">
        <Plot
          data={[trace]}
          layout={layout}
          config={plotConfig}
          className="pose-plot"
          style={{ width: '100%', height: '100%' }}
          useResizeHandler
          onRelayout={handleRelayout}
        />
      </div>
      <div className="mesh-angle-control">
        <div className="mesh-angle-header">
          <span>Rotation Around Z</span>
          <span>{Math.round(rotationAngle)}deg</span>
        </div>
        <input
          type="range"
          min="0"
          max="360"
          step="1"
          value={rotationAngle}
          onChange={handleAngleChange}
          className="mesh-angle-slider"
          aria-label="Rotate mesh around z axis"
        />
      </div>
    </div>
  );
}

function ImageCard({ title, imageSrc }) {
  return (
    <div className="pose-card">
      <h3 className="title is-5 pose-card-title">{title}</h3>
      <div className="pose-card-image">
        <img src={imageSrc} alt={title} className="pose-image" />
      </div>
    </div>
  );
}

function DemoGroup({ demo }) {
  const [mesh, setMesh] = useState(null);
  const [meshLoading, setMeshLoading] = useState(true);
  const [meshError, setMeshError] = useState('');

  useEffect(() => {
    let isMounted = true;

    const loadMesh = async () => {
      setMeshLoading(true);
      setMeshError('');

      try {
        const nextMesh = await loadMeshFromObj(demo.meshSrc);
        if (isMounted) {
          setMesh(nextMesh);
        }
      } catch (error) {
        if (isMounted) {
          setMeshError(error?.message || 'Failed to load mesh preview');
        }
      } finally {
        if (isMounted) {
          setMeshLoading(false);
        }
      }
    };

    loadMesh();

    return () => {
      isMounted = false;
    };
  }, [demo.meshSrc]);

  return (
    <div className="demo-group">
      {meshLoading && (
        <p className="pose-status pose-loading">Loading interactive mesh preview...</p>
      )}
      {meshError && (
        <p className="pose-status pose-error">Mesh preview could not be loaded: {meshError}</p>
      )}
      <div className="pose-viewers-grid three-up">
        <ImageCard title="Input Image" imageSrc={demo.imageSrc} />
        <ImageCard title="Overlap image" imageSrc={demo.lapSrc} />
        {mesh ? (
          <MeshViewerCard title="3D Mesh" mesh={mesh} camera={demo.camera} />
        ) : (
          <div className="pose-card">
            <h3 className="title is-5 pose-card-title">3D Mesh</h3>
            <p className="pose-status pose-loading">Loading mesh...</p>
          </div>
        )}
      </div>
    </div>
  );
}

function App() {
  return (
    <div className="app">
      <Navbar />
      <Hero />
      <Abstract />

      <section className="section" id="demo">
        <div className="container is-max-desktop">
          <div className="columns is-centered">
            <div className="column is-full-width">
              <h2 className="title is-3">Demo</h2>
              <p className="pose-viewer-intro">
                Each demo includes an input image, overlap rendering, and an interactive mesh viewer.
              </p>
              <div className="demo-groups-grid">
                {DEMO_GROUPS.map((demo) => (
                  <DemoGroup key={demo.id} demo={demo} />
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="section" id="results">
        <div className="container is-max-desktop">
          <div className="columns is-centered">
            <div className="column is-full-width">
              <h2 className="title is-3">Overview</h2>
              <div className="results-container">
                <div className="result-image-wrapper">
                  <img
                    src={`${process.env.PUBLIC_URL}/static/images/teaser.png`}
                    alt="Temporary PRIMA training overview"
                    className="result-image"
                  />
                  <p className="figure-caption">
                    <strong> Overview of PRIMA.</strong>  Due to the unbalanced distribution of 3D animal
                          training data, vanilla networks often suffer from mean regression bias, yielding
                          implausible meshes that collapse toward the average shape of majority species
                          (e.g., a ”dog-like” zebra in Wrong prediction). We propose to inject biological taxonomies and keypoint-aware tokens as strong inductive biases into the
                          latent space. This semantic anchoring effectively constrains the search space,
                          shifting the model from a biased global prior to a precise conditional posterior
                          (PRIMA prediction). Notably, even before test-time adaptation, PRIMA significantly outperforms baselines in alignment and joint accuracy (right). Our
                          Test-Time Adaptation loop further refines these parameters for instance-specific
                          precision.
                  </p>
                </div>
                <div className="result-image-wrapper">
                  <img
                    src={`${process.env.PUBLIC_URL}/static/images/stage3.png`}
                    alt="Temporary PRIMA inference overview"
                    className="result-image"
                  />
                  <p className="figure-caption">
                    <strong>Overview of the proposed three-stage training framework. </strong> The
proposed methodology consists of an alternating three-stage training paradigm.
Stage 1, warm-up training, leverages available 3D datasets and a 2D dataset to
initialize the model parameters. Stage 2, per-instance refinement, then optimizes
pose and shape parameters under 2D keypoint supervision to construct pseudo
Ground Truth (pGT) SMAL parameters for the Quadruped2D dataset. Finally,
Stage 3, loop-back retraining, performs a subsequent retraining phase that incorporates the refined instances together with the original 3D datasets, thereby
further enhancing model performance.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="section" id="BibTeX">
        <div className="container is-max-desktop content">
          <h2 className="title">BibTeX</h2>
          <pre><code>{`@misc{yu_prima,
  title={PRIMA: Boosting Animal Mesh Recovery with Biological Priors and Test-Time Adaptation},
  author={Xiaohang Yu and Ti Wang and Mackenzie Weygandt Mathis},
  note={EPFL project page. Update publication year, venue, and links when available.}
}`}</code></pre>
        </div>
      </section>
    </div>
  );
}

export default App;
