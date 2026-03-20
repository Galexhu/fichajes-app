export default function SkyBackground() {
  return (
    <div
      className="fixed inset-0 -z-10 overflow-hidden"
      style={{
        background:
          "linear-gradient(180deg, #3b2d6e 0%, #7a4a72 45%, #d47055 75%, #e8976a 100%)",
      }}
    >
      {/* ── Clouds ── */}
      <div className="cloud-slow absolute top-[8%] left-[6%] opacity-90">
        <Cloud width={220} />
      </div>
      <div className="cloud-mid absolute top-[5%] right-[8%] opacity-95">
        <Cloud width={260} />
      </div>
      <div className="cloud-fast absolute top-[22%] left-[38%] opacity-80">
        <Cloud width={180} />
      </div>
      <div className="cloud-slow absolute top-[30%] right-[20%] opacity-85">
        <Cloud width={200} />
      </div>
      <div className="cloud-mid absolute top-[18%] left-[62%] opacity-75">
        <Cloud width={150} />
      </div>
      <div className="cloud-fast absolute top-[38%] left-[12%] opacity-70">
        <Cloud width={170} />
      </div>

      {/* ── City silhouette ── */}
      <CitySilhouette />
    </div>
  );
}

function Cloud({ width = 200 }) {
  const h = width * 0.42;
  return (
    <svg width={width} height={h} viewBox="0 0 200 84" fill="none">
      <ellipse cx="100" cy="60" rx="100" ry="32" fill="rgba(220,180,160,0.55)" />
      <ellipse cx="70"  cy="48" rx="52"  ry="36" fill="rgba(225,190,170,0.6)" />
      <ellipse cx="130" cy="50" rx="46"  ry="32" fill="rgba(215,175,155,0.55)" />
      <ellipse cx="100" cy="40" rx="42"  ry="30" fill="rgba(230,200,180,0.65)" />
    </svg>
  );
}

function CitySilhouette() {
  // Building shapes + lit windows
  const buildings = [
    { x: 0,    w: 55, h: 110 },
    { x: 58,   w: 40, h: 80  },
    { x: 100,  w: 70, h: 140 },
    { x: 173,  w: 45, h: 100 },
    { x: 220,  w: 60, h: 90  },
    { x: 283,  w: 50, h: 130 },
    { x: 336,  w: 80, h: 160 },
    { x: 420,  w: 45, h: 95  },
    { x: 468,  w: 65, h: 120 },
    { x: 536,  w: 55, h: 85  },
    { x: 594,  w: 70, h: 145 },
    { x: 668,  w: 50, h: 105 },
    { x: 720,  w: 80, h: 75  },
    { x: 804,  w: 45, h: 130 },
    { x: 852,  w: 60, h: 100 },
    { x: 916,  w: 70, h: 150 },
    { x: 990,  w: 50, h: 90  },
    { x: 1044, w: 65, h: 115 },
    { x: 1112, w: 55, h: 80  },
    { x: 1170, w: 80, h: 140 },
    { x: 1253, w: 45, h: 100 },
    { x: 1302, w: 60, h: 125 },
  ];

  const vw = 1400;
  const ground = 200;

  return (
    <svg
      className="absolute bottom-0 left-0 w-full"
      viewBox={`0 0 ${vw} ${ground}`}
      preserveAspectRatio="xMidYMax slice"
    >
      {buildings.map((b, i) => {
        const top = ground - b.h;
        const windows = [];
        const cols = Math.max(1, Math.floor(b.w / 18));
        const rows = Math.max(1, Math.floor(b.h / 20));
        for (let r = 0; r < rows; r++) {
          for (let c = 0; c < cols; c++) {
            const lit = Math.random() > 0.35;
            windows.push(
              <rect
                key={`w-${i}-${r}-${c}`}
                x={b.x + 5 + c * 18}
                y={top + 8 + r * 20}
                width={8}
                height={10}
                rx={1}
                fill={lit ? "rgba(255,230,150,0.85)" : "rgba(30,20,60,0.4)"}
              />
            );
          }
        }
        return (
          <g key={i}>
            <rect
              x={b.x}
              y={top}
              width={b.w}
              height={b.h}
              fill="#1a1230"
            />
            {windows}
          </g>
        );
      })}
      {/* Ground fill */}
      <rect x={0} y={ground - 2} width={vw} height={4} fill="#1a1230" />
    </svg>
  );
}
