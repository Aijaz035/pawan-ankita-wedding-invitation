// Hand-drawn style ink illustrations. Every stroke with class "ink" is drawn on
// scroll by useDrawOnScroll; elements with class "wash" fade in afterwards.

const Svg = ({ vb, children, className = '', label }) => (
  <svg className={`sketch ${className}`} viewBox={vb} role="img" aria-label={label} fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round">
    {children}
  </svg>
);

const sprig = (x, y, s = 1, flip = 1) => (
  <g transform={`translate(${x} ${y}) scale(${s * flip} ${s})`}>
    <path className="ink" d="M0 0 C14 -6 28 -6 44 -16" strokeWidth="1" />
    <path className="ink" d="M12 -4 C14 -14 22 -16 26 -14 C24 -8 18 -4 12 -4Z" strokeWidth="0.9" />
    <path className="ink" d="M24 -8 C30 -2 38 -2 40 -4 C36 -10 30 -10 24 -8Z" strokeWidth="0.9" />
    <path className="ink" d="M34 -12 C36 -22 42 -24 46 -22 C44 -16 40 -12 34 -12Z" strokeWidth="0.9" />
  </g>
);

export function Rings() {
  return (
    <Svg vb="0 0 200 150" label="Engagement rings">
      <circle className="wash" cx="100" cy="92" r="52" fill="#f3d3cc" stroke="none" opacity="0.55" />
      <circle className="ink" cx="84" cy="94" r="33" strokeWidth="1.4" />
      <circle className="ink" cx="84" cy="94" r="27.5" strokeWidth="1" />
      <circle className="ink" cx="118" cy="100" r="31" strokeWidth="1.4" />
      <circle className="ink" cx="118" cy="100" r="26" strokeWidth="1" />
      <path className="ink" d="M74 60 L94 60 L84 72Z" strokeWidth="1" />
      <path className="ink" d="M70 52 L76 44 L92 44 L98 52 L84 70 Z" strokeWidth="1.3" />
      <path className="ink" d="M70 52 H98 M76 44 L80 52 L84 70 L88 52 L92 44 M80 52 L84 44 L88 52" strokeWidth="0.8" />
      <path className="ink" d="M58 38 l0 -8 M54 34 h8 M110 40 l0 -10 M105 35 h10 M104 52 l5 -5" strokeWidth="0.9" />
      {sprig(56, 136, 1, 1)}
      {sprig(146, 136, 1, -1)}
    </Svg>
  );
}

export function Diya() {
  return (
    <Svg vb="0 0 200 150" label="Tilak thali with diya">
      <circle className="wash" cx="100" cy="72" r="34" fill="#f8dfb9" stroke="none" opacity="0.6" />
      <ellipse className="wash" cx="100" cy="116" rx="74" ry="20" fill="#f3d3cc" stroke="none" opacity="0.55" />
      <ellipse className="ink" cx="100" cy="116" rx="74" ry="20" strokeWidth="1.4" />
      <ellipse className="ink" cx="100" cy="114" rx="60" ry="14" strokeWidth="0.9" />
      <path className="ink" d="M76 102 Q100 128 124 102 Q100 110 76 102Z" strokeWidth="1.3" />
      <path className="ink" d="M120 104 Q130 98 134 96" strokeWidth="1.1" />
      <path className="ink" d="M100 98 C91 86 96 70 100 60 C104 70 109 86 100 98Z" strokeWidth="1.2" />
      <path className="ink" d="M100 94 C96 88 98 80 100 74 C102 80 104 88 100 94Z" strokeWidth="0.8" />
      <path className="ink" d="M100 52 v-8 M86 58 l-5 -5 M114 58 l5 -5" strokeWidth="0.9" />
      <ellipse className="ink" cx="58" cy="110" rx="11" ry="4.5" strokeWidth="1" />
      <path className="ink" d="M47 110 Q58 124 69 110" strokeWidth="1" />
      {[[144, 106], [154, 112], [140, 116]].map(([x, y], i) => (
        <g key={i}>
          <circle className="ink" cx={x} cy={y} r="6" strokeWidth="0.9" strokeDasharray="2 1.4" />
          <circle className="ink" cx={x} cy={y} r="2.2" strokeWidth="0.8" />
        </g>
      ))}
      {[[80, 118], [90, 122], [112, 122], [122, 119], [70, 116], [130, 116]].map(([x, y], i) => (
        <path key={i} className="ink" d={`M${x} ${y} l2.4 -1`} strokeWidth="1.1" />
      ))}
    </Svg>
  );
}

export function Lotus() {
  return (
    <Svg vb="0 0 220 150" label="Lotus">
      <ellipse className="wash" cx="110" cy="82" rx="58" ry="40" fill="#f3d3cc" stroke="none" opacity="0.55" />
      <path className="ink" d="M110 30 C96 52 96 80 110 96 C124 80 124 52 110 30Z" strokeWidth="1.4" />
      <path className="ink" d="M110 96 C88 88 74 68 72 46 C90 54 104 72 110 96" strokeWidth="1.3" />
      <path className="ink" d="M110 96 C132 88 146 68 148 46 C130 54 116 72 110 96" strokeWidth="1.3" />
      <path className="ink" d="M108 98 C80 100 58 88 46 70 C68 70 92 82 108 98" strokeWidth="1.2" />
      <path className="ink" d="M112 98 C140 100 162 88 174 70 C152 70 128 82 112 98" strokeWidth="1.2" />
      <path className="ink" d="M110 40 V88 M86 60 C94 70 102 82 108 92 M134 60 C126 70 118 82 112 92" strokeWidth="0.6" />
      <path className="ink" d="M40 112 C70 104 150 104 180 112" strokeWidth="1" />
      <path className="ink" d="M28 124 C60 116 92 124 110 120 C128 116 160 124 192 118" strokeWidth="0.9" />
      <path className="ink" d="M50 134 C80 128 140 130 170 134" strokeWidth="0.8" />
      <ellipse className="ink" cx="52" cy="106" rx="20" ry="5" strokeWidth="1" />
      <ellipse className="ink" cx="168" cy="106" rx="18" ry="4.5" strokeWidth="1" />
    </Svg>
  );
}

export function BanquetHall() {
  const cols = [86, 110, 134, 166, 190, 214];
  return (
    <Svg vb="0 0 300 210" label="Swarnim Lawn and Banquet Hall">
      <rect className="wash" x="62" y="96" width="176" height="86" fill="#f3d3cc" stroke="none" opacity="0.5" />
      <ellipse className="wash" cx="150" cy="198" rx="140" ry="10" fill="#e8dccd" stroke="none" opacity="0.6" />
      {/* steps */}
      <path className="ink" d="M58 196 H242 M64 190 H236 M70 184 H230" strokeWidth="1.1" />
      {/* main block */}
      <path className="ink" d="M70 184 V100 H230 V184" strokeWidth="1.3" />
      {/* pediment */}
      <path className="ink" d="M60 100 L150 58 L240 100 Z" strokeWidth="1.3" />
      <path className="ink" d="M82 96 L150 66 L218 96 Z" strokeWidth="0.8" />
      <circle className="ink" cx="150" cy="84" r="6" strokeWidth="0.9" />
      {/* dome */}
      <path className="ink" d="M128 60 C128 36 172 36 172 60" strokeWidth="1.2" />
      <path className="ink" d="M150 36 V24 M146 28 H154" strokeWidth="1" />
      {cols.map((x) => (
        <g key={x}>
          <path className="ink" d={`M${x - 5} 108 H${x + 5} M${x - 4} 108 V180 M${x + 4} 108 V180 M${x - 6} 180 H${x + 6}`} strokeWidth="1" />
        </g>
      ))}
      {/* door */}
      <path className="ink" d="M140 184 V150 C140 138 160 138 160 150 V184" strokeWidth="1.2" />
      <path className="ink" d="M150 140 V184" strokeWidth="0.7" />
      {/* wings */}
      <path className="ink" d="M70 130 H28 V184 M230 130 H272 V184 M24 130 H74 M226 130 H276" strokeWidth="1.1" />
      {[38, 56, 244, 262].map((x) => (
        <path key={x} className="ink" d={`M${x - 5} 172 V150 C${x - 5} 142 ${x + 5} 142 ${x + 5} 150 V172 Z`} strokeWidth="0.9" />
      ))}
      {/* trees */}
      <path className="ink" d="M10 184 C2 150 10 112 16 96 C22 112 30 150 22 184 Z" strokeWidth="1" />
      <path className="ink" d="M290 184 C298 150 290 112 284 96 C278 112 270 150 278 184 Z" strokeWidth="1" />
      {/* string lights */}
      <path className="ink" d="M16 104 Q42 126 64 104 M236 104 Q258 126 284 104" strokeWidth="0.7" />
      {[24, 32, 40, 48, 56, 244, 252, 260, 268, 276].map((x, i) => (
        <circle key={i} className="ink" cx={x} cy={104 + Math.sin(((x % 236 > 100 ? x - 236 : x - 16) / 48) * Math.PI) * 11} r="1.6" strokeWidth="0.8" />
      ))}
    </Svg>
  );
}

export function Drapery() {
  const ties = [10, 90, 160, 230, 310];
  return (
    <Svg vb="0 0 320 130" className="drapery" label="Drapery">
      <path className="ink" d="M4 8 H316" strokeWidth="1.4" />
      {ties.slice(0, -1).map((x, i) => {
        const x2 = ties[i + 1];
        const m = (x + x2) / 2;
        return (
          <g key={i}>
            <path className="wash" d={`M${x} 10 Q${m} 62 ${x2} 10 Q${m} 30 ${x} 10Z`} fill="#f3d3cc" stroke="none" opacity="0.6" />
            <path className="ink" d={`M${x} 10 Q${m} 62 ${x2} 10`} strokeWidth="1.2" />
            <path className="ink" d={`M${x + 6} 11 Q${m} 48 ${x2 - 6} 11`} strokeWidth="0.8" />
            <path className="ink" d={`M${x + 12} 11 Q${m} 34 ${x2 - 12} 11`} strokeWidth="0.6" />
            {[-14, 0, 14].map((d, k) => (
              <g key={k}>
                <path className="ink" d={`M${m + d} ${36 - Math.abs(d) * 0.4} V${70 + k * 10 - Math.abs(d)}`} strokeWidth="0.5" />
                <circle className="ink" cx={m + d} cy={72 + k * 10 - Math.abs(d)} r="1.8" strokeWidth="0.7" />
              </g>
            ))}
          </g>
        );
      })}
      {[10, 310].map((x, i) => (
        <g key={x}>
          <path className="ink" d={`M${x} 8 C${x + (i ? -8 : 8)} 50 ${x + (i ? 6 : -6)} 90 ${x} 122`} strokeWidth="1.1" />
          <path className="ink" d={`M${x + (i ? -4 : 4)} 10 C${x + (i ? -14 : 14)} 56 ${x} 92 ${x + (i ? -6 : 6)} 118`} strokeWidth="0.7" />
          <circle className="ink" cx={x} cy="10" r="4" strokeWidth="1" />
        </g>
      ))}
      {ties.slice(1, -1).map((x) => (
        <g key={x}>
          <circle className="ink" cx={x} cy="12" r="3.4" strokeWidth="1" />
          <path className="ink" d={`M${x} 15 V30 M${x - 3} 30 L${x} 40 L${x + 3} 30Z`} strokeWidth="0.8" />
        </g>
      ))}
    </Svg>
  );
}

export const SKETCHES = { rings: Rings, diya: Diya, lotus: Lotus, hall: BanquetHall, drapery: Drapery };
