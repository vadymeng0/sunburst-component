import * as d3 from "d3";

export const partition = (dataPartition: any) => {
  const root = d3
    .hierarchy(dataPartition)
    .sum((d) => d.count)
    .sort((a, b) => (b?.value || 0) - (a?.value || 0));
  return d3.partition().size([2 * Math.PI, root.height + 1])(root);
};

export const getColorSchema = (dataLength?: number) => {
  return d3.quantize(d3.interpolateRainbow, (dataLength || 0) + 1);
};

export const width = 932;

export const radius = width / 6;

export const arc = d3
  .arc()
  .startAngle((d: any) => d.x0)
  .endAngle((d: any) => d.x1)
  .padAngle((d: any) => Math.min((d.x1 - d.x0) / 2, 0.005))
  .padRadius(radius * 1.5)
  .innerRadius((d: any) => d.y0 * radius)
  .outerRadius((d: any) => Math.max(d.y0 * radius, d.y1 * radius - 1));

export const unselectedOrUndefinedColor = "grey";
