import React, { useEffect, useMemo, useState } from 'react';
import './App.css';
import Plot from 'react-plotly.js';
import JSZip from 'jszip';

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

function Navbar() {
  return (
    <nav className="navbar" role="navigation" aria-label="main navigation">
      <div className="navbar-brand">
        <a role="button" className="navbar-burger" aria-label="menu" aria-expanded="false">
          <span aria-hidden="true"></span>
          <span aria-hidden="true"></span>
          <span aria-hidden="true"></span>
        </a>
      </div>
      <div className="navbar-menu">
        <div className="navbar-start" style={{ flexGrow: 1, justifyContent: 'center' }}>
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
                FMPose3D placeholder media is kept for now so you can replace it later with PRIMA-specific
                figures, paper links, and demos.
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

const HUMAN_CONNECTIONS = [
  [0, 1], [0, 4], [1, 2], [4, 5],
  [2, 3], [5, 6], [0, 7], [7, 8],
  [8, 14], [8, 11], [14, 15], [15, 16],
  [11, 12], [12, 13], [8, 9], [9, 10],
];

const ANIMAL_CONNECTIONS = [
  [24, 0], [24, 1], [1, 21], [0, 20], [24, 2], [2, 22], [2, 23],
  [24, 18], [18, 12], [18, 13], [12, 8], [13, 9], [8, 14], [9, 15],
  [14, 3], [15, 4], [18, 7], [7, 10], [7, 11], [10, 16], [11, 17],
  [16, 5], [17, 6], [7, 25], [25, 19],
];

const POSE_PALETTE = [
  '#2563eb', '#f97316', '#10b981', '#e11d48',
  '#0ea5e9', '#9333ea', '#ef4444', '#14b8a6',
];

const plotConfig = {
  responsive: true,
  displaylogo: false,
  scrollZoom: true,
  modeBarButtonsToRemove: ['toImage', 'lasso3d', 'select3d'],
};

const axisTemplate = {
  title: '',
  showgrid: true,
  gridcolor: '#e5e7eb',
  zeroline: false,
  showticklabels: false,
  showbackground: true,
  backgroundcolor: '#f8fafc',
  showspikes: false,
};

const buildPoseTraces = (poses, connections = HUMAN_CONNECTIONS) => (
  poses.flatMap((pose, idx) => {
    const color = POSE_PALETTE[idx % POSE_PALETTE.length];
    const x = pose.map((point) => point[0]);
    const y = pose.map((point) => point[1]);
    const z = pose.map((point) => point[2]);

    const hovertext = pose.map(
      (point, jointIdx) =>
        `<b>Joint ${jointIdx}</b><br>x: ${point[0].toFixed(2)}<br>y: ${point[1].toFixed(2)}<br>z: ${point[2].toFixed(2)}`
    );

    const scatterTrace = {
      type: 'scatter3d',
      mode: 'markers',
      name: `Pose ${idx + 1}`,
      x,
      y,
      z,
      marker: {
        size: 4,
        color,
        opacity: 0.9,
        line: { width: 1, color: '#111827' },
      },
      hovertext,
      hoverinfo: 'text',
      showlegend: false,
    };

    const lineTraces = connections
      .filter(([a, b]) => a < pose.length && b < pose.length)
      .map(([a, b]) => ({
        type: 'scatter3d',
        mode: 'lines',
        x: [pose[a][0], pose[b][0]],
        y: [pose[a][1], pose[b][1]],
        z: [pose[a][2], pose[b][2]],
        line: { color, width: 3 },
        opacity: 0.45,
        hoverinfo: 'none',
        showlegend: false,
      }));

    return [scatterTrace, ...lineTraces];
  })
);

const buildPoseLayout = (camera) => ({
  margin: { l: 0, r: 0, t: 0, b: 0 },
  scene: {
    xaxis: axisTemplate,
    yaxis: axisTemplate,
    zaxis: axisTemplate,
    bgcolor: '#ffffff',
    aspectmode: 'data',
    camera: camera || { eye: { x: 1.6, y: 1.35, z: 1.25 } },
  },
  paper_bgcolor: 'white',
  plot_bgcolor: 'white',
  showlegend: false,
  hovermode: 'closest',
});

const meshAxisTemplate = {
  ...axisTemplate,
  showgrid: false,
  showbackground: false,
  visible: false,
};

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
    dragmode: 'orbit',
    camera: camera || { eye: { x: 1.5, y: 1.15, z: 0.85 } },
  },
  paper_bgcolor: 'white',
  plot_bgcolor: 'white',
  showlegend: false,
});

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
    vertices: normalizeMeshVertices(vertices),
    faces,
    color: meshColor || '#a6bddb',
  };
};

const parseHeaderStr = (str) => {
  const start = str.indexOf('{');
  const end = str.lastIndexOf('}');
  const core = start >= 0 && end >= 0 ? str.slice(start, end + 1) : str;
  const json = core
    .trim()
    .replace(/'/g, '"')
    .replace(/\(/g, '[')
    .replace(/\)/g, ']')
    .replace(/,]/g, ']')
    .replace(/,\s*}/g, '}')
    .replace(/\bTrue\b/g, 'true')
    .replace(/\bFalse\b/g, 'false');
  return JSON.parse(json);
};

const typedArrayCtor = (descr) => {
  switch (descr) {
    case '<f8':
      return Float64Array;
    case '<f4':
      return Float32Array;
    case '<i4':
      return Int32Array;
    case '<i2':
      return Int16Array;
    case '|u1':
      return Uint8Array;
    default:
      throw new Error(`Unsupported dtype: ${descr}`);
  }
};

const reorderFortranToC = (data, shape) => {
  const total = data.length;
  const dest = new data.constructor(total);
  const dims = shape.length;
  const strideF = new Array(dims).fill(0);
  strideF[0] = 1;

  for (let i = 1; i < dims; i += 1) {
    strideF[i] = strideF[i - 1] * shape[i - 1];
  }

  for (let idx = 0; idx < total; idx += 1) {
    let cIdx = idx;
    const multi = new Array(dims);

    for (let dim = dims - 1; dim >= 0; dim -= 1) {
      multi[dim] = cIdx % shape[dim];
      cIdx = Math.floor(cIdx / shape[dim]);
    }

    let fIdx = 0;
    for (let dim = 0; dim < dims; dim += 1) {
      fIdx += multi[dim] * strideF[dim];
    }

    dest[idx] = data[fIdx];
  }

  return dest;
};

const parseNpy = (buffer) => {
  const dv = new DataView(buffer);
  const magic = String.fromCharCode(
    dv.getUint8(0),
    dv.getUint8(1),
    dv.getUint8(2),
    dv.getUint8(3),
    dv.getUint8(4),
    dv.getUint8(5)
  );

  if (magic !== '\x93NUMPY') {
    throw new Error('Not a NPY file');
  }

  const major = dv.getUint8(6);
  const littleEndian = true;
  const headerLen = major <= 1 ? dv.getUint16(8, littleEndian) : dv.getUint32(8, littleEndian);
  const headerStart = major <= 1 ? 10 : 12;
  const headerTxt = new TextDecoder('ascii').decode(new Uint8Array(buffer, headerStart, headerLen));
  const header = parseHeaderStr(headerTxt);

  if (!header.descr.startsWith('<') && !header.descr.startsWith('|')) {
    throw new Error(`Only little-endian/byte-aligned dtypes supported, got ${header.descr}`);
  }

  const ctor = typedArrayCtor(header.descr);
  const dataOffset = headerStart + headerLen;
  const data = new ctor(buffer, dataOffset);
  const flat = header.fortran_order ? reorderFortranToC(data, header.shape) : data;

  return { data: flat, shape: header.shape };
};

const reshapePose = (data, shape) => {
  if (!shape || shape.length < 2 || shape[1] !== 3) {
    throw new Error(`Unsupported pose shape: ${shape}`);
  }

  const pose = [];
  for (let i = 0; i < shape[0]; i += 1) {
    pose.push([
      data[i * 3 + 0],
      data[i * 3 + 1],
      data[i * 3 + 2],
    ]);
  }

  return pose;
};

const loadPoseFromNpz = async (url) => {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Failed to fetch pose file: ${response.status}`);
  }

  const buffer = await response.arrayBuffer();
  const zip = await JSZip.loadAsync(buffer);
  const npyFileName = Object.keys(zip.files).find((name) => name.endsWith('.npy'));

  if (!npyFileName) {
    throw new Error('NPZ file does not contain an .npy array');
  }

  const npyBuffer = await zip.files[npyFileName].async('arraybuffer');
  const parsed = parseNpy(npyBuffer);
  return reshapePose(parsed.data, parsed.shape);
};

const loadMeshFromObj = async (url) => {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Failed to fetch mesh file: ${response.status}`);
  }

  const text = await response.text();
  return parseObjMesh(text);
};

const SAMPLES = [
  {
    id: 'animal-horse-tta',
    title: 'Horse',
    viewerTitle: '3D Mesh',
    imageSrc: `${process.env.PUBLIC_URL}/static/3d_predictions/animals/000000119761_horse/pose2D_on_image/0000_2d.png`,
    assetPath: `${process.env.PUBLIC_URL}/static/3d_predictions/000000199236_horse_after_tta.obj`,
    viewerType: 'mesh',
    camera: { eye: { x: 1.65, y: 1.1, z: 0.8 } },
  },
  {
    id: 'animal-cow',
    title: 'Cow',
    viewerTitle: '3D Pose',
    imageSrc: `${process.env.PUBLIC_URL}/static/3d_predictions/animals/000000129100_cow/pose2D_on_image/0000_2d.png`,
    assetPath: `${process.env.PUBLIC_URL}/static/3d_predictions/animals/000000129100_cow/pose3D/0000_3D.npz`,
    viewerType: 'pose',
    connections: ANIMAL_CONNECTIONS,
  },
];

function PoseViewerCard({ title, poses, camera, connections }) {
  const traces = useMemo(() => buildPoseTraces(poses, connections), [poses, connections]);
  const layout = useMemo(() => buildPoseLayout(camera), [camera]);

  return (
    <div className="pose-card">
      <h3 className="title is-5 pose-card-title">{title}</h3>
      <div className="pose-plot-wrapper">
        <Plot
          data={traces}
          layout={layout}
          config={plotConfig}
          className="pose-plot"
          style={{ width: '100%', height: '100%' }}
          useResizeHandler
        />
      </div>
    </div>
  );
}

function MeshViewerCard({ title, mesh, camera }) {
  const trace = useMemo(() => buildMeshTrace(mesh), [mesh]);
  const layout = useMemo(() => buildMeshLayout(camera), [camera]);

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

function App() {
  const [viewerDataMap, setViewerDataMap] = useState({});
  const [viewerLoading, setViewerLoading] = useState(true);
  const [viewerError, setViewerError] = useState('');

  useEffect(() => {
    let isMounted = true;

    const loadAll = async () => {
      setViewerLoading(true);
      setViewerError('');

      try {
        const results = await Promise.allSettled(
          SAMPLES.map(async (sample) => {
            const viewerData = sample.viewerType === 'mesh'
              ? await loadMeshFromObj(sample.assetPath)
              : await loadPoseFromNpz(sample.assetPath);
            return { id: sample.id, viewerData };
          })
        );

        const nextMap = {};
        const errors = [];

        results.forEach((result, idx) => {
          if (result.status === 'fulfilled') {
            nextMap[result.value.id] = result.value.viewerData;
            return;
          }

          errors.push(`${SAMPLES[idx].id}: ${result.reason?.message || 'load failed'}`);
        });

        if (!isMounted) {
          return;
        }

        setViewerDataMap(nextMap);
        if (errors.length) {
          setViewerError(errors.join('; '));
        }
      } catch (err) {
        if (isMounted) {
          setViewerError(err?.message || 'Failed to load interactive assets');
        }
      } finally {
        if (isMounted) {
          setViewerLoading(false);
        }
      }
    };

    loadAll();

    return () => {
      isMounted = false;
    };
  }, []);

  const demoModules = useMemo(() => {
    const modules = [];

    SAMPLES.forEach((sample) => {
      modules.push({
        type: 'image',
        id: `${sample.id}-img`,
        title: sample.title,
        imageSrc: sample.imageSrc,
      });
      modules.push({
        type: 'pose',
        id: `${sample.id}-pose`,
        title: sample.viewerTitle,
        sampleId: sample.id,
        camera: sample.camera,
        connections: sample.connections,
        viewerType: sample.viewerType,
      });
    });

    return modules;
  }, []);

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
                The first animal example now renders your provided horse OBJ directly in the browser. The
                remaining example is still a placeholder skeleton demo that you can replace later with more
                PRIMA-specific assets.
              </p>
              {viewerLoading && (
                <p className="pose-status pose-loading">Loading interactive previews...</p>
              )}
              {viewerError && (
                <p className="pose-status pose-error">Some preview files could not be loaded: {viewerError}</p>
              )}
              <div className="pose-viewers-grid four-wide">
                {demoModules.map((module) => {
                  if (module.type === 'image') {
                    return (
                      <ImageCard
                        key={module.id}
                        title={module.title}
                        imageSrc={module.imageSrc}
                      />
                    );
                  }

                  const viewerData = viewerDataMap[module.sampleId];
                  if (!viewerData) {
                    return (
                      <div key={module.id} className="pose-card">
                        <h3 className="title is-5 pose-card-title">{module.title}</h3>
                        <p className="pose-status pose-loading">Loading viewer...</p>
                      </div>
                    );
                  }

                  if (module.viewerType === 'mesh') {
                    return (
                      <MeshViewerCard
                        key={module.id}
                        title={module.title}
                        mesh={viewerData}
                        camera={module.camera}
                      />
                    );
                  }

                  return (
                    <PoseViewerCard
                      key={module.id}
                      title={module.title}
                      poses={[viewerData]}
                      camera={module.camera}
                      connections={module.connections}
                    />
                  );
                })}
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
                    src={`${process.env.PUBLIC_URL}/static/images/training_pipeline.png`}
                    alt="Placeholder training pipeline"
                    className="result-image"
                  />
                  <p className="figure-caption">
                    <strong>Placeholder method figure.</strong> This panel is still the FMPose3D training
                    pipeline. Replace it with a PRIMA overview figure showing biological priors, mesh recovery,
                    and the role of test-time adaptation.
                  </p>
                </div>
                <div className="result-image-wrapper">
                  <img
                    src={`${process.env.PUBLIC_URL}/static/images/inference_pipeline.png`}
                    alt="Placeholder inference pipeline"
                    className="result-image"
                  />
                  <p className="figure-caption">
                    <strong>Placeholder inference figure.</strong> This panel is also retained from FMPose3D.
                    Replace it with a PRIMA inference or adaptation diagram, for example SMAL refinement under
                    reprojection constraints and pseudo-3D generation.
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
  note={EPFL project page placeholder. Update publication year, venue, and links when available.}
}`}</code></pre>
        </div>
      </section>
    </div>
  );
}

export default App;
