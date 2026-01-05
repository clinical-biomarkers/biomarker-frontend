import { useMemo } from "react";
import * as d3 from "d3";
import AxisLeft from "./AxisLeft";
import AxisBottom from "./AxisBottom";
import VerticalBoxPlot from "./VerticalBoxPlot";
import { Grid } from "@mui/material";

const MARGIN = { top: 30, right: 30, bottom: 80, left: 80 };

export default function BoxPlot ({ title, input_data, width, height, color, colorMale, colorFemale, entityName }) {
  const boundsWidth = width - MARGIN.right - MARGIN.left;
  const boundsHeight = height - MARGIN.top - MARGIN.bottom;

  const { chartMin, chartMax, groups, maps, maleDataLen, femaleDataLen } = useMemo(() => {
    const chartMin = d3.min(input_data.map((d) => d.min_val)); 
    const chartMax = d3.max(input_data.map((d) => d.max_val));
    const groups = [...new Set(input_data.map((d) => d.age_group))];
    const maleDataLen = input_data.filter(d => d.sex.toLowerCase() === "male").length;
    const femaleDataLen = input_data.filter(d => d.sex.toLowerCase() === "female").length;

    const maps = new Map();
    groups.map((group) => {
      const maleData = input_data.filter(d => d.sex.toLowerCase() === "male").filter(d => d.age_group === group)[0];
      const { n_val: nvalM } = maleData ? maleData : {n_val: 0};
      const femaleData = input_data.filter(d => d.sex.toLowerCase() === "female").filter((d) => d.age_group === group)[0];
      const { n_val: nvalF } = femaleData ? femaleData: {n_val: 0};
      maps.set(group, {nvalM, nvalF})
    });

    return { chartMin, chartMax, groups, maps, maleDataLen, femaleDataLen };
  }, [input_data]);

  // Compute scales
  const yScale = d3
    .scaleLinear()
    .domain([chartMin, chartMax])
    .range([boundsHeight, 0]);
  const xScale = d3
    .scaleBand()
    .range([0, boundsWidth])
    .domain(groups)
    .padding(0.25);

   // Build the box shapes
  const boxShapes = groups.map((group, i) => {
    const groupDataMale = input_data.filter(d => d.sex.toLowerCase() === "male").filter(d => d.age_group === group)[0];

    const { min_val: minM, q1: qM1, median_val: median_valM, q3: qM3, max_val: maxM, mean_val: mean_valM, n_val: n_valM } = groupDataMale ? groupDataMale: 
    { min_val: 0, q1: 0, median_val: 0, q3: 0, max_val: 0, mean_val: 0, n_val: 0 };

    const groupDataFemale = input_data.filter(d => d.sex.toLowerCase() === "female").filter((d) => d.age_group === group)[0];

    const { min_val: minF, q1: qF1, median_val: median_valF, q3: qF3, max_val: maxF, mean_val: mean_valF, n_val: n_valF } = groupDataFemale ? groupDataFemale:
    { min_val: 0, q1: 0, median_val: 0, q3: 0, max_val: 0, mean_val: 0, n_val: 0 };

    return (
      <>
      <g key={i + "M"} transform={`translate(${xScale(group) - 20},0)`}>
        {groupDataMale && <VerticalBoxPlot
          width={120}
          q1={yScale(qM1)}
          median={yScale(median_valM)}
          q3={yScale(qM3)}
          min={yScale(minM)}
          max={yScale(maxM)}
          mean={yScale(mean_valM)}
          n_val={n_valM}
          stroke="black"
          fill={colorMale}
        />}
      </g>
      <g key={i + "F"} transform={`translate(${xScale(group) + 30}, 0)`}>
        {groupDataFemale && <VerticalBoxPlot
          width={120}
          q1={yScale(qF1)}
          median={yScale(median_valF)}
          q3={yScale(qF3)}
          min={yScale(minF)}
          max={yScale(maxF)}
          n_val={n_valF}
          mean={yScale(mean_valF)}
          stroke="black"
          fill={colorFemale}
        />}
      </g>
      </>
     );
  });

  return (
    <div>

      <Grid container spacing={2} justifyContent="center">
        <Grid textAlign="center" item xs={12} md={12} sm={12}>
          <strong><div style={{textAlign: "center"}}>{entityName + " Levels by Age Group and Sex (18+ years)"}</div></strong>
          <span className="male-box-plot">
            <span style={{fontSize: "26px"}}>&#9644;</span>
            {" " + "Male"}{" "}
          </span>
          <span className="female-box-plot">
            <span style={{fontSize: "26px"}}>&#9644;</span>
            {" " + "Female"}
          </span>
        </Grid>
      </Grid>
      <svg width={width} height={height}>
        <g
          width={boundsWidth}
          height={boundsHeight}
          transform={`translate(${[MARGIN.left, MARGIN.top].join(",")})`}
        >
          {boxShapes}
          <AxisLeft yScale={yScale} pixelsPerTick={30} txtHeight={yScale(chartMin)/2} entityName={entityName}/>
          <g transform={`translate(-5, ${boundsHeight})`}>
            <AxisBottom xScale={xScale} maps={maps} wOffset={ maleDataLen && femaleDataLen ? 30 : femaleDataLen ? 55 : maleDataLen ? 5 : 0} txtOffset={boundsWidth/2 - 20}/>
          </g>
        </g>
      </svg>
    </div>
  );
};
