import { useMemo } from "react";
import { ScaleBand } from "d3";

// tick length
const TICK_LENGTH = 6;

export default function AxisBottom ({ xScale, maps, txtOffset, wOffset }) {
  const [min, max] = xScale.range();

  const ticks = useMemo(() => {
    return xScale.domain().map((value) => ({
      value,
      xOffset: xScale(value) + wOffset,
    }));
  }, [xScale]);

  return (
    <>
      {/* Bottom horizontal line */}
      <path
        d={["M", min + 5, 0, "L", max - 25, 0].join(" ")}
        fill="none"
        stroke="currentColor"
      />

      {/* Axis Legand */}
      {ticks.map(({ value, xOffset }) => (
        <g key={value} transform={`translate(${xOffset}, 0)`}>
          <line y2={TICK_LENGTH} stroke="currentColor" />
          <text
            key={value}
            style={{
              fontSize: "10px",
              textAnchor: "middle",
              transform: "translateY(20px)",
            }}
          >
            {value}
          </text>
          <text
            key={value}
            style={{
              fontSize: "10px",
              textAnchor: "middle",
              transform: "translateY(35px)",
            }}
            word-spacing="5"
          >
            {"n=" + maps.get(value).nvalM}{" "}{"n=" + maps.get(value).nvalF}
          </text>
        </g>
      ))}

      {/* Axis Name */}
      <text
        style={{
          fontSize: "18px",
          textAnchor: "middle",
          transform: `translateX(${txtOffset}px) translateY(60px)`,
        }}
      >
        {"Age Group (years)"}
      </text>
    </>
  );
};
