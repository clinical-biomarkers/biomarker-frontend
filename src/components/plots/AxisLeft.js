import { useMemo } from "react";
import { ScaleLinear } from "d3";

// tick length
const TICK_LENGTH = 6;

export default function AxisLeft ({ yScale, pixelsPerTick, txtHeight, entityName }) {
  const range = yScale.range();

  const ticks = useMemo(() => {
    const height = range[0] - range[1];
    const numberOfTicksTarget = Math.floor(height / pixelsPerTick);

    return yScale.ticks(numberOfTicksTarget).map((value) => ({
      value,
      yOffset: yScale(value),
    }));
  }, [yScale]);

  return (
    <>
      {/* Main vertical line */}
      <path
        d={["M", 0, range[0], "L", 0, range[1]].join(" ")}
        fill="none"
        stroke="currentColor"
      />
        <text
          style={{
            fontSize: "18px",
            textAnchor: "middle",
            transform: `rotate(270deg) translateX(${-1 * txtHeight}px) translateY(-45px)`,
          }}
        >
          {entityName} {" (ng/mL)"}
        </text>

      {/* Ticks and labels */}
      {ticks.map(({ value, yOffset }) => (
        <g key={value} transform={`translate(0, ${yOffset})`}>
          <line x2={-TICK_LENGTH} stroke="currentColor" />
          <text
            key={value}
            style={{
              fontSize: "10px",
              textAnchor: "middle",
              transform: "translateX(-20px)",
            }}
          >
            {value}
          </text>
        </g>
      ))}
    </>
  );
};
