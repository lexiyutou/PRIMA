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
    title: 'Sheep',
    imageSrc: `${process.env.PUBLIC_URL}/static/3d_predictions/sheep/000000102614_sheep_input.png`,
    lapSrc: `${process.env.PUBLIC_URL}/static/3d_predictions/sheep/000000102614_sheep_baseline_render.png`,
    meshSrc: `${process.env.PUBLIC_URL}/static/3d_predictions/sheep/000000102614_sheep_baseline.obj`,
    camera: { eye: { x: 1.65, y: 1.1, z: 0.8 } },
  },
  {
    id: 'horse',
    title: 'Dressage horse with rider',
    imageSrc: `${process.env.PUBLIC_URL}/static/3d_predictions/ride_horse/000000209383_horse_input.png`,
    lapSrc: `${process.env.PUBLIC_URL}/static/3d_predictions/ride_horse/000000209383_horse_baseline_render.png`,
    meshSrc: `${process.env.PUBLIC_URL}/static/3d_predictions/ride_horse/000000209383_horse_baseline.obj`,
    camera: { eye: { x: -1.0, y: -1.0, z: -1 } },
  },
  {
    id: 'horse1',
    title: 'Galloping racehorse',
    imageSrc: `${process.env.PUBLIC_URL}/static/3d_predictions/horse1/000000154710_horse_input.png`,
    lapSrc: `${process.env.PUBLIC_URL}/static/3d_predictions/horse1/000000154710_horse_before_tta.png`,
    meshSrc: `${process.env.PUBLIC_URL}/static/3d_predictions/horse1/000000154710_horse_before_tta.obj`,
    camera: { eye: { x: -1.0, y: -1.0, z: -1 } },
  },
  {
    id: 'cow1',
    title: 'Cow at night',
    imageSrc: `${process.env.PUBLIC_URL}/static/3d_predictions/cow1/000000005005_cow_input.png`,
    lapSrc: `${process.env.PUBLIC_URL}/static/3d_predictions/cow1/000000005005_cow_before_tta.png`,
    meshSrc: `${process.env.PUBLIC_URL}/static/3d_predictions/cow1/000000005005_cow_before_tta.obj`,
    camera: { eye: { x: -1.0, y: -1.0, z: -1 } },
  },
  {
    id: 'dogsnow',
    title: 'Husky running in snow',
    imageSrc: `${process.env.PUBLIC_URL}/static/3d_predictions/doginsnow/n02109961_11888_input.png`,
    lapSrc: `${process.env.PUBLIC_URL}/static/3d_predictions/doginsnow/n02109961_11888_before_tta.png`,
    meshSrc: `${process.env.PUBLIC_URL}/static/3d_predictions/doginsnow/n02109961_11888_before_tta.obj`,
    camera: { eye: { x: -1.0, y: -1.0, z: -1 } },
  },
  {
    id: 'hippo',
    title: 'Warthog in dry grass',
    imageSrc: `${process.env.PUBLIC_URL}/static/3d_predictions/hippo/n02397096_3109_input.png`,
    lapSrc: `${process.env.PUBLIC_URL}/static/3d_predictions/hippo/n02397096_3109_before_tta.png`,
    meshSrc: `${process.env.PUBLIC_URL}/static/3d_predictions/hippo/n02397096_3109_before_tta.obj`,
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
                PRIMA: Boosting Animal Mesh Recovery with Taxonomic Priors and Adaptation-Driven Data Bootstrapping
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
              <div className="is-size-5 publication-authors">
                <span className="author-block">Accepted at WACV 2027</span>
              </div>
              <div className="publication-links">
                <span className="link-block">
                  <a
                    href="https://arxiv.org/abs/2606.02366"
                    className="external-link button is-normal is-rounded is-dark"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <span className="icon">
                      <i className="fas fa-file-alt"></i>
                    </span>
                    <span>Paper</span>
                  </a>
                </span>
                <span className="link-block">
                  <a
                    href="https://github.com/AdaptiveMotorControlLab/PRIMA"
                    className="external-link button is-normal is-rounded is-dark"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <span className="icon">
                      <i className="fab fa-github"></i>
                    </span>
                    <span>Code</span>
                  </a>
                </span>
                <span className="link-block">
                  <a
                    href="https://huggingface.co/spaces/MLAdaptiveIntelligence/PRIMA-demo"
                    className="external-link button is-normal is-rounded is-dark"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <span className="icon">
                      <img
                        className="hf-icon"
                        src="https://huggingface.co/front/assets/huggingface_logo-noborder.svg"
                        alt=""
                        aria-hidden="true"
                      />
                    </span>
                    <span>Hugging Face Demo</span>
                  </a>
                </span>
              </div>
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
                Recovering articulated 3D animal meshes from monocular images is challenging due to the long-tailed distribution of species and limited large-scale 3D supervision. Existing methods rely on small annotated datasets and thus regress to average shapes and poses, leading to poor generalization to rare species and articulations.
          We present <strong>PRIMA</strong> (<strong>PRI</strong>ors for <strong>M</strong>esh <strong>A</strong>daptation), a framework that tackles these limitations with two components: taxonomic shape priors and adaptation-driven data bootstrapping.
          First, we derive <strong>taxonomic shape priors</strong> from BioCLIP image features, which are learned under taxonomic supervision, to inject species-level knowledge into mesh reconstruction, improving shape estimation across diverse quadrupeds.
          Second, we propose an <strong>adaptation-driven bootstrapping</strong> scheme that turns abundant 2D animal annotations into reliable pseudo-3D supervision via lightweight instance-level mesh refinement and quality-aware filtering.
          This yields <strong>Quadruped3D</strong>, a large-scale pseudo-3D dataset constructed from real-world animal images, containing approximately 9K pseudo-3D annotations.
          Together, these components alleviate the long-tail problem: extensive experiments on Animal3D, CtrlAni3D, Quadruped2D, and Animal Kingdom demonstrate state-of-the-art performance for mesh reconstruction, with particularly strong gains on challenging poses and underrepresented species.
          The code is available at{' '}
          <a href="https://github.com/AdaptiveMotorControlLab/PRIMA" target="_blank" rel="noopener noreferrer">
            https://github.com/AdaptiveMotorControlLab/PRIMA
          </a>.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function VideoResults() {
  return (
    <section className="section" id="video">
      <div className="container">
        <h2 className="title is-3">Mesh Recovery on Videos</h2>
        <p className="video-subtitle">
          PRIMA on DAVIS video sequences. Each pair shows the input frame and the PRIMA mesh overlay.
        </p>
        <figure className="video-card">
          <div className="video-column-labels" aria-hidden="true">
            <span>Input</span>
            <span>PRIMA</span>
            <span>Input</span>
            <span>PRIMA</span>
          </div>
          <video
            className="results-video"
            src={`${process.env.PUBLIC_URL}/static/videos/davis_grid_2x2_4x3_1920.mp4`}
            poster={`${process.env.PUBLIC_URL}/static/videos/davis_grid_2x2_4x3_1920_poster.jpg`}
            autoPlay
            muted
            loop
            playsInline
            controls
            preload="metadata"
          />
        </figure>
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
  const [lockedCamera, setLockedCamera] = useState(referenceCamera);
  const layout = useMemo(() => buildMeshLayout(lockedCamera), [lockedCamera]);

  useEffect(() => {
    setLockedCamera(referenceCamera);
  }, [referenceCamera]);

  const handleRelayout = (eventData) => {
    const nextCamera = extractCameraFromRelayout(eventData);
    if (!nextCamera) {
      return;
    }

    const nextLockedCamera = lockCameraToZAxis(nextCamera, referenceCamera);
    setLockedCamera(nextLockedCamera);
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
        <ImageCard title="Mesh Overlay" imageSrc={demo.lapSrc} />
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
      <VideoResults />

      <section className="section" id="demo">
        <div className="container is-max-desktop">
          <div className="columns is-centered">
            <div className="column is-full-width">
              <h2 className="title is-3">Mesh Recovery on Single Images</h2>
              <p className="demo-intro">
                Single-image mesh recovery on in-the-wild photos of six quadrupeds, covering riders
                occluding the body, fast galloping and running poses, low light, and animals blending
                into the background. Each example shows
                the <strong>input image</strong>, the predicted SMAL mesh rendered as a{' '}
                <strong>mesh overlay</strong> on the image, and the reconstructed{' '}
                <strong>3D mesh</strong>. Drag the 3D view to rotate it and scroll to zoom. All results
                are direct predictions from PRIMA, without instance-level refinement.
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
          <pre><code>{`@article{yu2026prima,
  title={PRIMA: Boosting Animal Mesh Recovery with Taxonomic Priors and Adaptation-Driven Data Bootstrapping},
  author={Yu, Xiaohang and Wang, Ti and Mathis, Mackenzie Weygandt},
  journal={arXiv preprint arXiv:2606.02366},
  year={2026}
}`}</code></pre>
        </div>
      </section>
    </div>
  );
}

export default App;
