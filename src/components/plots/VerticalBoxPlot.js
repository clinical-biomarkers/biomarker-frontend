import * as d3 from "d3"; // we will need d3.js

const STROKE_WIDTH = 2;

// A reusable component that builds a vertical box shape using svg
// Note: numbers here are px, not the real values in the dataset.

export default function VerticalBoxPlot ({
  min,
  q1,
  median,
  q3,
  max,
  width,
  stroke,
  fill,
  mean
}) {
  return (
    <g transform={`translate(0 ,0)`}>
      <line
        x1={width / 6}
        x2={width / 6}
        y1={min}
        y2={max}
        stroke={stroke}
        strokeWidth={STROKE_WIDTH}
      />
      <rect
        x={0}
        y={q3}
        width={width / 3}
        height={q1 - q3}
        stroke={stroke}
        fill={fill}
        strokeWidth={STROKE_WIDTH/3}
      />
      <line
        x1={0}
        x2={width / 3}
        y1={median}
        y2={median}
        stroke={stroke}
        strokeWidth={STROKE_WIDTH}
      />
      <line x1={width / 6 - 10} y1={max} x2={width / 6 + 10} y2={max} stroke={stroke} strokeWidth={STROKE_WIDTH}/>
      <line x1={width / 6 - 10} y1={min} x2={width / 6 + 10} y2={min} stroke={stroke} strokeWidth={STROKE_WIDTH}/>

      <line x1={width / 6 - 4} y1={mean - 4} x2={width / 6 + 4} y2={mean + 4} stroke={stroke} strokeWidth={STROKE_WIDTH}/>
      <line x1={width / 6 + 4} y1={mean - 4} x2={width / 6 - 4} y2={mean + 4} stroke={stroke} strokeWidth={STROKE_WIDTH}/>
    </g>
  );
};
