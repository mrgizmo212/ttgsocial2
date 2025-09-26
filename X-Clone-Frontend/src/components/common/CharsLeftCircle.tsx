type CharsLeftCircleProps = {
  charsLeft: number;
  radius?: number;
  stroke?: number;
};

export function CharsLeftCircle({
  charsLeft,
  radius = 9,
  stroke = 1.5,
}: CharsLeftCircleProps) {
  const scale = 1.5;

  const r = radius * scale;
  const s = stroke * scale;

  const clamped = Math.max(0, Math.min(180, charsLeft));
  const progress = 1 - clamped / 180;
  const c = 2 * Math.PI * r;
  const offset = charsLeft < 0 ? 0 : c * (1 - progress);
  const color = charsLeft < 0 ? "stroke-red-500" : "stroke-(--color-main)";

  const size = 2 * (r + s);
  const center = r + s;

  return (
    <svg width={size} height={size}>
      <circle
        cx={center}
        cy={center}
        r={r}
        fill="none"
        stroke="var(--color-twitterBorder)"
        strokeWidth={s}
        className="transition-all duration-200"
      />
      <circle
        cx={center}
        cy={center}
        r={r}
        fill="none"
        strokeWidth={s}
        strokeDasharray={c}
        strokeDashoffset={offset}
        className={`transition-all duration-200 ${color}`}
        strokeLinecap="round"
        transform={`rotate(-90 ${center} ${center})`}
      />
      {charsLeft <= 20 && (
        <text
          x={center}
          y={center + 4}
          textAnchor="middle"
          className={`text-xs ${
            charsLeft < 0 ? "fill-red-500" : "fill-(--color-main)"
          }`}
        >
          {charsLeft}
        </text>
      )}
    </svg>
  );
}
