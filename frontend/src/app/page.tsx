// "use client";

// import { useState } from "react";

// export default function Home() {
//   const [image, setImage] = useState<string | null>(null);

//   const handleImage = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const file = e.target.files?.[0];

//     if (file) {
//       setImage(URL.createObjectURL(file));
//     }
//   };

//   return (
//     <main className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-10">
//       <h1 className="text-5xl font-bold mb-3">
//         SpineSight AI
//       </h1>

//       <p className="text-gray-400 mb-10">
//         Upload a spinal X-ray
//       </p>

//       <input
//         type="file"
//         accept="image/*"
//         onChange={handleImage}
//         className="mb-6"
//       />

//       {image && (
//         <img
//           src={image}
//           alt="Preview"
//           className="w-[400px] rounded-xl border border-gray-700"
//         />
//       )}
//     </main>
//   );
// }


// "use client";

// import { useState } from "react";

// export default function Home() {
//   const [image, setImage] = useState<string | null>(null);
//   const [result, setResult] = useState<any>(null);
//   const [loading, setLoading] = useState(false);
//   const [annotatedImage, setAnnotatedImage] = useState<string | null>(null);
//   const handleImage = async (
//     e: React.ChangeEvent<HTMLInputElement>
//   ) => {
//     const file = e.target.files?.[0];

//     if (!file) return;

//     setImage(URL.createObjectURL(file));

//     const formData = new FormData();
//     formData.append("file", file);

//     try {
//       setLoading(true);

//       const response = await fetch(
//         "http://127.0.0.1:8000/predict",
//         {
//           method: "POST",
//           body: formData,
//         }
//       );

//       const data = await response.json();

//       console.log(data);

//       setResult(data);
//       setAnnotatedImage(
//         `http://localhost:8000/${data.results.output_image}`
//       );

//     } catch (error) {
//       console.error(error);
//     }

//     setLoading(false);
//   };

//   return (
//     <main className="min-h-screen bg-black text-white flex flex-col items-center p-10">

//       <h1 className="text-5xl font-bold mb-3">
//         SpineSight AI
//       </h1>

//       <p className="text-gray-400 mb-8">
//         Upload a spinal X-ray
//       </p>

//       <input
//         type="file"
//         accept="image/*"
//         onChange={handleImage}
//         className="mb-6"
//       />

//       {image && (
//         <img
//           src={image}
//           alt="preview"
//           className="w-[400px] rounded-xl border border-gray-700 mb-6"
//         />
//       )}

//       {loading && (
//         <p>Analyzing X-ray...</p>
//       )}
//       {annotatedImage && (
//         <div className="mt-6 bg-zinc-900 p-4 rounded-lg">

//           <h2 className="text-xl font-bold mb-4">
//             AI Detection Result
//           </h2>

//           <img
//             src={annotatedImage}
//             alt="Annotated Result"
//             className="rounded-lg w-full"
//           />

//         </div>
//       )}
//       {result?.results?.detections && (
//         <div className="bg-zinc-900 p-6 rounded-xl w-[400px]">

//           <h2 className="font-bold text-xl mb-4">
//             Detection Results
//           </h2>

//           {result.results.detections.map(
//             (item: any, index: number) => (
//               <div
//                 key={index}
//                 className="mb-2 border-b border-gray-700 pb-2"
//               >
//                 <p>
//                   Class: {item.class_id}
//                 </p>

//                 <p>
//                   Confidence:
//                   {(item.confidence * 100).toFixed(1)}%
//                 </p>

//               </div>
//             )
//           )}
//         </div>
//       )}

//     </main>
//   );
// }

"use client";

import { useState, useRef } from "react";

export default function Home() {
  const [image, setImage] = useState<string | null>(null);
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [annotatedImage, setAnnotatedImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImage = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setImage(URL.createObjectURL(file));
    setResult(null);
    setAnnotatedImage(null);

    const formData = new FormData();
    formData.append("file", file);

    try {
      setLoading(true);
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/predict`, {
        method: "POST",
        body: formData,
      });
      const data = await response.json();
      console.log(data);
      setResult(data);
      setAnnotatedImage(`${process.env.NEXT_PUBLIC_API_URL}/${data.results.output_image}`);
    } catch (error) {
      console.error(error);
    }

    setLoading(false);
  };

  const getSeverityColor = (c: number) => c >= 0.85 ? "#f87171" : c >= 0.65 ? "#fbbf24" : "#34d399";
  const getSeverityBg = (c: number) => c >= 0.85 ? "rgba(248,113,113,0.1)" : c >= 0.65 ? "rgba(251,191,36,0.1)" : "rgba(52,211,153,0.1)";
  const getSeverityLabel = (c: number) => c >= 0.85 ? "HIGH" : c >= 0.65 ? "MED" : "LOW";

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@300;400;500;600&family=Outfit:wght@400;500;600;700&display=swap');

        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        :root {
          --bg:       #080c10;
          --surface:  #0d1218;
          --surface2: #111820;
          --border:   rgba(255,255,255,0.06);
          --border2:  rgba(255,255,255,0.04);
          --text:     #dde3ec;
          --muted:    #4a5568;
          --accent:   #22d3ee;
          --accent2:  #818cf8;
          --danger:   #f87171;
          --warn:     #fbbf24;
          --ok:       #34d399;
          --hdr:      52px;
        }

        html, body { height: 100%; overflow: hidden; }

        body {
          background: var(--bg);
          color: var(--text);
          font-family: 'Outfit', sans-serif;
          font-size: 13px;
        }

        /* ══ LAYOUT SHELL ══ */
        .shell {
          display: grid;
          grid-template-rows: var(--hdr) 1fr;
          height: 100vh;
          overflow: hidden;
        }

        /* ══ HEADER ══ */
        .hdr {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0 24px;
          background: rgba(8,12,16,0.95);
          border-bottom: 1px solid var(--border);
          backdrop-filter: blur(20px);
          z-index: 50;
        }
        .hdr-l { display: flex; align-items: center; gap: 10px; }
        .hdr-icon {
          width: 30px; height: 30px; border-radius: 8px;
          background: linear-gradient(135deg, var(--accent), var(--accent2));
          display: flex; align-items: center; justify-content: center;
          flex-shrink: 0;
        }
        .hdr-icon svg { width: 15px; height: 15px; }
        .hdr-title {
          font-family: 'Outfit', sans-serif;
          font-weight: 700; font-size: 15px;
          letter-spacing: -0.3px; color: #f1f5f9;
        }
        .hdr-title span { color: var(--accent); }
        .sep { width: 1px; height: 16px; background: var(--border); margin: 0 2px; }
        .hdr-sub { font-size: 11px; color: var(--muted); letter-spacing: 0.2px; }
        .hdr-r { display: flex; align-items: center; gap: 8px; }
        .pill {
          display: inline-flex; align-items: center; gap: 5px;
          font-family: 'JetBrains Mono', monospace; font-size: 9.5px;
          letter-spacing: 0.8px; text-transform: uppercase;
          color: var(--muted); border: 1px solid var(--border);
          border-radius: 5px; padding: 3px 9px;
          background: rgba(255,255,255,0.015);
        }
        .live-dot {
          width: 5px; height: 5px; border-radius: 50%;
          background: var(--ok); box-shadow: 0 0 5px var(--ok);
          animation: blink 2.4s ease infinite;
        }

        /* ══ MAIN GRID ══ */
        .main {
          display: grid;
          grid-template-columns: 300px 1fr 320px;
          height: 100%;
          overflow: hidden;
        }

        /* ══ PANELS ══ */
        .panel {
          display: flex; flex-direction: column;
          overflow: hidden;
          border-right: 1px solid var(--border);
        }
        .panel:last-child { border-right: none; }

        .panel-hdr {
          display: flex; align-items: center; justify-content: space-between;
          padding: 0 16px;
          height: 38px;
          border-bottom: 1px solid var(--border);
          background: var(--surface);
          flex-shrink: 0;
        }
        .panel-hdr-label {
          font-family: 'JetBrains Mono', monospace;
          font-size: 9px; letter-spacing: 1.8px;
          text-transform: uppercase; color: var(--accent);
          display: flex; align-items: center; gap: 6px;
        }
        .panel-hdr-label::before {
          content: '';
          width: 3px; height: 14px;
          background: var(--accent); border-radius: 2px;
          opacity: 0.6;
        }
        .panel-body {
          flex: 1; overflow: hidden;
          display: flex; flex-direction: column;
          padding: 14px;
          gap: 12px;
        }

        /* ══ LEFT — UPLOAD ══ */
        .upload-zone {
          border: 1.5px dashed rgba(255,255,255,0.08);
          border-radius: 12px;
          padding: 22px 16px;
          display: flex; flex-direction: column;
          align-items: center; gap: 10px;
          cursor: pointer;
          transition: all 0.2s ease;
          background: rgba(255,255,255,0.015);
          text-align: center;
          flex-shrink: 0;
        }
        .upload-zone:hover {
          border-color: rgba(34,211,238,0.4);
          background: rgba(34,211,238,0.04);
        }
        .upload-zone:hover .up-icon { background: rgba(34,211,238,0.12); transform: translateY(-1px); }
        .up-icon {
          width: 44px; height: 44px; border-radius: 11px;
          background: rgba(255,255,255,0.05);
          display: flex; align-items: center; justify-content: center;
          transition: all 0.2s ease;
        }
        .upload-zone h3 { font-weight: 600; font-size: 13px; color: #e2e8f0; }
        .upload-zone p {
          font-family: 'JetBrains Mono', monospace;
          font-size: 9.5px; color: var(--muted); line-height: 1.8;
        }
        .upload-btn {
          padding: 7px 20px;
          background: linear-gradient(135deg, #0ea5e9, #6366f1);
          border: none; border-radius: 8px; color: #fff;
          font-family: 'Outfit', sans-serif; font-weight: 600;
          font-size: 12px; cursor: pointer;
          transition: all 0.2s ease;
          box-shadow: 0 3px 14px rgba(14,165,233,0.25);
        }
        .upload-btn:hover { transform: translateY(-1px); box-shadow: 0 5px 18px rgba(14,165,233,0.35); }
        input[type="file"] { display: none; }

        /* Preview */
        .preview-wrap {
          flex: 1; overflow: hidden;
          border-radius: 10px; border: 1px solid var(--border);
          background: #04070a;
          display: flex; flex-direction: column;
          min-height: 0;
        }
        .preview-titlebar {
          display: flex; align-items: center; gap: 6px;
          padding: 7px 10px;
          border-bottom: 1px solid var(--border2);
          background: rgba(255,255,255,0.02);
          flex-shrink: 0;
        }
        .mc { width: 7px; height: 7px; border-radius: 50%; flex-shrink: 0; }
        .titlebar-name {
          font-family: 'JetBrains Mono', monospace;
          font-size: 9px; color: var(--muted); margin-left: 4px;
          letter-spacing: 0.2px;
        }
        .preview-wrap img {
          flex: 1; width: 100%; object-fit: contain; display: block;
          background: #04070a; min-height: 0;
        }
        .preview-empty {
          flex: 1; display: flex; flex-direction: column;
          align-items: center; justify-content: center;
          gap: 8px; color: #1a2233;
          border-radius: 10px; border: 1px dashed rgba(255,255,255,0.04);
          background: rgba(255,255,255,0.008);
        }
        .preview-empty p {
          font-family: 'JetBrains Mono', monospace;
          font-size: 10px; line-height: 1.7; text-align: center;
        }

        /* ══ CENTER — RESULT IMAGE ══ */
        .center-panel {
          display: flex; flex-direction: column;
          overflow: hidden; border-right: 1px solid var(--border);
        }
        .center-body {
          flex: 1; padding: 14px;
          display: flex; flex-direction: column;
          gap: 10px; overflow: hidden; min-height: 0;
        }
        .annotated-card {
          flex: 1; border-radius: 12px; overflow: hidden;
          border: 1px solid var(--border); background: #04070a;
          display: flex; flex-direction: column; min-height: 0;
          box-shadow: 0 16px 48px rgba(0,0,0,0.5);
          animation: riseIn 0.35s ease;
        }
        .ann-topbar {
          display: flex; align-items: center; justify-content: space-between;
          padding: 8px 14px;
          border-bottom: 1px solid var(--border2);
          background: rgba(255,255,255,0.02);
          flex-shrink: 0;
        }
        .ann-topbar-l {
          display: flex; align-items: center; gap: 7px;
          font-family: 'JetBrains Mono', monospace;
          font-size: 9.5px; color: var(--muted);
        }
        .ann-status {
          display: flex; align-items: center; gap: 5px;
          font-family: 'JetBrains Mono', monospace;
          font-size: 9px; color: var(--ok);
        }
        .ann-dot {
          width: 5px; height: 5px; border-radius: 50%;
          background: var(--ok); box-shadow: 0 0 5px var(--ok);
          animation: blink 2s infinite;
        }
        .annotated-card img {
          flex: 1; width: 100%; object-fit: contain; display: block;
          background: #04070a; min-height: 0;
        }
        .ann-footer {
          display: flex; align-items: center; justify-content: space-between;
          padding: 8px 14px;
          border-top: 1px solid var(--border2);
          background: rgba(255,255,255,0.015);
          font-family: 'JetBrains Mono', monospace;
          font-size: 9px; color: var(--muted);
          flex-shrink: 0;
        }

        /* Empty center state */
        .center-empty {
          flex: 1; display: flex; flex-direction: column;
          align-items: center; justify-content: center;
          gap: 12px; color: #111820;
        }
        .center-empty-grid {
          display: grid; grid-template-columns: repeat(5,1fr); gap: 5px;
          margin-bottom: 8px;
        }
        .ceg { width: 22px; height: 22px; border-radius: 5px; background: rgba(255,255,255,0.03); }
        .ceg.lit { background: rgba(34,211,238,0.12); }
        .center-empty h3 { font-family: 'Outfit', sans-serif; font-weight: 600; font-size: 14px; color: #1a2233; }
        .center-empty p { font-family: 'JetBrains Mono', monospace; font-size: 10px; color: #111820; }

        /* Loading overlay */
        .loading-bar {
          border-radius: 10px; border: 1px solid rgba(34,211,238,0.15);
          background: rgba(34,211,238,0.025);
          padding: 18px 20px;
          display: flex; align-items: center; gap: 16px;
          flex-shrink: 0;
          animation: riseIn 0.25s ease;
        }
        .spinner {
          width: 34px; height: 34px; border-radius: 50%;
          border: 2px solid rgba(34,211,238,0.12);
          border-top-color: var(--accent);
          animation: spin 0.75s linear infinite; flex-shrink: 0;
        }
        .loading-text strong { display: block; font-weight: 600; font-size: 13px; color: var(--accent); margin-bottom: 3px; }
        .loading-text p { font-family: 'JetBrains Mono', monospace; font-size: 10px; color: var(--muted); }

        /* ══ RIGHT — DETECTIONS ══ */
        .det-summary {
          display: grid; grid-template-columns: 1fr 1fr 1fr;
          border-bottom: 1px solid var(--border2);
          flex-shrink: 0;
        }
        .det-sum-cell {
          padding: 12px 8px; text-align: center;
          border-right: 1px solid var(--border2);
        }
        .det-sum-cell:last-child { border-right: none; }
        .det-sum-val {
          font-family: 'JetBrains Mono', monospace;
          font-size: 18px; font-weight: 500;
          line-height: 1; margin-bottom: 4px;
        }
        .det-sum-key {
          font-size: 8.5px; letter-spacing: 1px;
          text-transform: uppercase; color: var(--muted);
        }
        .det-list { flex: 1; overflow-y: auto; }
        .det-item {
          padding: 11px 14px;
          border-bottom: 1px solid var(--border2);
          display: flex; flex-direction: column; gap: 8px;
          transition: background 0.12s;
        }
        .det-item:last-child { border-bottom: none; }
        .det-item:hover { background: rgba(255,255,255,0.018); }
        .det-top { display: flex; align-items: center; justify-content: space-between; }
        .det-l { display: flex; align-items: center; gap: 8px; }
        .det-idx {
          width: 22px; height: 22px; border-radius: 5px;
          background: rgba(255,255,255,0.04);
          display: flex; align-items: center; justify-content: center;
          font-family: 'JetBrains Mono', monospace; font-size: 10px; color: var(--muted);
        }
        .det-label { font-size: 13px; font-weight: 500; color: #e2e8f0; }
        .det-id { font-family: 'JetBrains Mono', monospace; font-size: 9.5px; color: var(--muted); margin-left: 2px; }
        .det-r { display: flex; align-items: center; gap: 6px; }
        .det-pct { font-family: 'JetBrains Mono', monospace; font-size: 13px; font-weight: 500; color: #e2e8f0; }
        .sev {
          font-size: 8px; font-weight: 700; letter-spacing: 0.8px;
          text-transform: uppercase; border-radius: 4px; padding: 2px 6px;
        }
        .bar-track { height: 3px; background: rgba(255,255,255,0.05); border-radius: 99px; overflow: hidden; }
        .bar-fill { height: 100%; border-radius: 99px; transition: width 0.6s cubic-bezier(0.25,1,0.5,1); }

        /* No-result state */
        .det-empty {
          flex: 1; display: flex; flex-direction: column;
          align-items: center; justify-content: center;
          gap: 8px; color: var(--muted); text-align: center; padding: 20px;
        }
        .det-empty p { font-family: 'JetBrains Mono', monospace; font-size: 10px; line-height: 1.7; color: #1e2d3d; }

        /* ══ ANIMATIONS ══ */
        @keyframes spin  { to { transform: rotate(360deg); } }
        @keyframes blink { 0%,100% { opacity: 1; } 50% { opacity: 0.25; } }
        @keyframes riseIn {
          from { opacity: 0; transform: translateY(8px); }
          to   { opacity: 1; transform: translateY(0); }
        }

        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.07); border-radius: 99px; }
      `}</style>

      <div className="shell">

        {/* ── HEADER ── */}
        <header className="hdr">
          <div className="hdr-l">
            <div className="hdr-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 3H5a2 2 0 0 0-2 2v4m6-6h10a2 2 0 0 1 2 2v4M9 3v18m0 0h10a2 2 0 0 0 2-2v-4M9 21H5a2 2 0 0 1-2-2v-4m0 0h18" />
              </svg>
            </div>
            <span className="hdr-title">Spine<span>Sight</span> AI</span>
            <div className="sep" />
            <span className="hdr-sub">Spinal X-ray Analysis</span>
          </div>
          <div className="hdr-r">
            <span className="pill"><span className="live-dot" />YOLO · Live</span>
            <span className="pill">v1.0</span>
          </div>
        </header>

        {/* ── THREE-COLUMN MAIN ── */}
        <div className="main">

          {/* ── COL 1: UPLOAD + PREVIEW ── */}
          <div className="panel">
            <div className="panel-hdr">
              <span className="panel-hdr-label">Input</span>
            </div>
            <div className="panel-body">

              {/* Upload Zone */}
              <div className="upload-zone" onClick={() => fileInputRef.current?.click()}>
                <div className="up-icon">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                    <polyline points="17 8 12 3 7 8" />
                    <line x1="12" y1="3" x2="12" y2="15" />
                  </svg>
                </div>
                <h3>Upload X-ray</h3>
                <p>PNG · JPG · DICOM<br />High-res recommended</p>
                <button className="upload-btn">Select File</button>
              </div>
              <input ref={fileInputRef} type="file" accept="image/*" onChange={handleImage} />

              {/* Preview */}
              {image ? (
                <div className="preview-wrap">
                  <div className="preview-titlebar">
                    <span className="mc" style={{ background: "#ef4444" }} />
                    <span className="mc" style={{ background: "#f59e0b" }} />
                    <span className="mc" style={{ background: "#22c55e" }} />
                    <span className="titlebar-name">original_scan.jpg</span>
                  </div>
                  <img src={image} alt="Uploaded X-ray" />
                </div>
              ) : (
                <div className="preview-empty">
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="0.7" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="3" width="18" height="18" rx="2" />
                    <circle cx="8.5" cy="8.5" r="1.5" />
                    <polyline points="21 15 16 10 5 21" />
                  </svg>
                  <p>Preview appears<br />after upload</p>
                </div>
              )}
            </div>
          </div>

          {/* ── COL 2: ANNOTATED OUTPUT ── */}
          <div className="center-panel">
            <div className="panel-hdr">
              <span className="panel-hdr-label">AI Output</span>
              {result && !loading && (
                <span className="ann-status">
                  <span className="ann-dot" />
                  Analysis complete
                </span>
              )}
            </div>
            <div className="center-body">
              {loading && (
                <div className="loading-bar">
                  <div className="spinner" />
                  <div className="loading-text">
                    <strong>Running YOLO Model</strong>
                    <p>Inference in progress — please wait…</p>
                  </div>
                </div>
              )}

              {annotatedImage && !loading ? (
                <div className="annotated-card">
                  <div className="ann-topbar">
                    <div className="ann-topbar-l">
                      <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
                      </svg>
                      annotated_result.jpg
                    </div>
                    <span className="ann-status"><span className="ann-dot" />Complete</span>
                  </div>
                  <img src={annotatedImage} alt="Annotated Detection Result" />
                  <div className="ann-footer">
                    <span>SpineSight · YOLO Inference</span>
                    <span>{result?.results?.detections?.length ?? 0} region(s) flagged</span>
                  </div>
                </div>
              ) : !loading ? (
                <div className="center-empty">
                  <div className="center-empty-grid">
                    {Array.from({ length: 15 }).map((_, i) => (
                      <div key={i} className={`ceg${[2, 7, 11].includes(i) ? " lit" : ""}`} />
                    ))}
                  </div>
                  <h3>No scan loaded</h3>
                  <p>Upload a spinal X-ray to begin</p>
                </div>
              ) : null}
            </div>
          </div>

          {/* ── COL 3: DETECTIONS ── */}
          <div className="panel">
            <div className="panel-hdr">
              <span className="panel-hdr-label">Detections</span>
              {result?.results?.detections && (
                <span className="pill">{result.results.detections.length} found</span>
              )}
            </div>

            {result?.results?.detections && !loading ? (() => {
              const dets = result.results.detections;
              const avg = dets.reduce((s: number, d: any) => s + d.confidence, 0) / dets.length;
              const high = dets.filter((d: any) => d.confidence >= 0.85).length;

              return (
                <>
                  {/* Summary strip */}
                  <div className="det-summary">
                    <div className="det-sum-cell">
                      <div className="det-sum-val" style={{ color: "var(--accent)" }}>{dets.length}</div>
                      <div className="det-sum-key">Total</div>
                    </div>
                    <div className="det-sum-cell">
                      <div className="det-sum-val" style={{ color: "var(--danger)" }}>{high}</div>
                      <div className="det-sum-key">Very Confident</div>
                    </div>
                    <div className="det-sum-cell">
                      <div className="det-sum-val" style={{ color: "#c9d1dc" }}>{(avg * 100).toFixed(0)}%</div>
                      <div className="det-sum-key">Avg Conf.</div>
                    </div>
                  </div>

                  {/* Detection list */}
                  <div className="det-list">
                    {dets.map((item: any, i: number) => {
                      const color = getSeverityColor(item.confidence);
                      const bg = getSeverityBg(item.confidence);
                      const lbl = getSeverityLabel(item.confidence);
                      const pct = (item.confidence * 100).toFixed(1);
                      return (
                        <div className="det-item" key={i}>
                          <div className="det-top">
                            <div className="det-l">
                              <div className="det-idx">{i + 1}</div>
                              <span>
                                <span className="det-label">{item.label ?? "Class"}</span>
                                <span className="det-id">#{item.class_id}</span>
                              </span>
                            </div>
                            <div className="det-r">
                              <span className="det-pct">{pct}%</span>
                              <span className="sev" style={{ color, background: bg }}>{lbl}</span>
                            </div>
                          </div>
                          <div className="bar-track">
                            <div className="bar-fill" style={{ width: `${pct}%`, background: color }} />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </>
              );
            })() : (
              <div className="det-empty">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="0.8" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
                  <line x1="12" y1="9" x2="12" y2="13" /><line x1="12" y1="17" x2="12.01" y2="17" />
                </svg>
                <p>No detections yet.<br />Results appear here<br />after analysis.</p>
              </div>
            )}
          </div>

        </div>
      </div>
    </>
  );
}