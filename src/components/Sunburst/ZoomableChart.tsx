import * as d3 from "d3";
import {
  useCallback,
  useEffect,
  FC,
  SetStateAction,
  Dispatch,
  RefObject,
} from "react";
import { v4 as uuidv4 } from "uuid";
import {
  arc,
  partition,
  radius,
  unselectedOrUndefinedColor,
  width,
} from "../../utils/d3utils";

interface ZoomableChartProps {
  data?: LeafProps;
  setBreadcrumbIds: Dispatch<SetStateAction<{ name: string; id: string }[]>>;
  refSvg: RefObject<SVGSVGElement>;
  colorSchema: string[];
}

const ZoomableChart: FC<ZoomableChartProps> = ({
  data,
  setBreadcrumbIds,
  refSvg,
  colorSchema,
}) => {
  const color = d3.scaleOrdinal(colorSchema);

  const format = d3.format(",d");

  const buildGraph = useCallback(() => {
    const svg = d3.select(refSvg.current).html("");

    if (!data) return;

    const root = partition(data);

    root.each((d: any) => (d.current = d));

    svg.attr("viewBox", [0, 0, width, width]).style("font", "10px sans-serif");

    const g = svg
      .append("g")
      .attr("transform", `translate(${width / 2},${width / 2})`);

    const path = g
      .append("g")
      .selectAll("path")
      .data(root.descendants().slice(1))
      .join("path")
      .attr("fill", (d: any) => {
        return d.data.status
          ? color(d.data.status)
          : unselectedOrUndefinedColor;
      })
      .attr("data-status", (d: any) => {
        return d.data.status;
      })
      .attr("fill-opacity", (d: any) =>
        arcVisible(d.current) ? (d.children ? 0.6 : 0.4) : 0
      )
      .attr("pointer-events", (d: any) =>
        arcVisible(d.current) ? "auto" : "none"
      )
      .attr("d", (d: any) => arc(d.current));

    path
      .filter((d: any) => d.children)
      .style("cursor", "pointer")
      .on("click", clicked);

    path.append("title").text(
      (d) =>
        `${d
          .ancestors()
          .map((d: any) => d.data.name)
          .reverse()
          .join("/")}\n${format(d.value || 0)}`
    );

    const label = g
      .append("g")
      .attr("pointer-events", "none")
      .attr("text-anchor", "middle")
      .style("user-select", "none")
      .selectAll("text")
      .data(root.descendants().slice(1))
      .join("text")
      .attr("dy", "0.35em")
      .attr("fill-opacity", (d: any) => +labelVisible(d.current))
      .attr("transform", (d: any) => labelTransform(d.current))
      .text((d: any) => d.data.name)
      .attr("font-size", (d: any) => {
        return d.data.fontSize || "12px";
      });

    const parent = g
      .append("circle")
      .datum(root)
      .attr("r", radius)
      .attr("fill", "none")
      .attr("pointer-events", "all")
      .on("click", clicked);

    const handleBreadcrumb = (event: any, p: any) => {
      setBreadcrumbIds((prev) => {
        const isClickingBack = event.target.nodeName === "circle";
        if (isClickingBack) {
          const isOnRoot = prev.length === 1;
          return isOnRoot ? prev : prev.slice(0, prev.length - 1);
        }

        const targetId = event.target.getAttribute("id");
        if (targetId) {
          const selectedIndex = prev.findIndex((item) => item.id === targetId);
          const isNotInBreadcrumbList = selectedIndex === -1;

          return isNotInBreadcrumbList
            ? [...prev, { name: p.data.name, id: targetId }]
            : prev.slice(0, selectedIndex + 1);
        }

        const newUuid = uuidv4();
        event.target.setAttribute("id", newUuid);
        return [...prev, { name: p.data.name, id: newUuid }];
      });
    };

    function clicked(event: any, p: any) {
      parent.datum(p.parent || root);

      handleBreadcrumb(event, p);

      root.each(
        (d: any) =>
          (d.target = {
            x0:
              Math.max(0, Math.min(1, (d.x0 - p.x0) / (p.x1 - p.x0))) *
              2 *
              Math.PI,
            x1:
              Math.max(0, Math.min(1, (d.x1 - p.x0) / (p.x1 - p.x0))) *
              2 *
              Math.PI,
            y0: Math.max(0, d.y0 - p.depth),
            y1: Math.max(0, d.y1 - p.depth),
          })
      );

      const t = g.transition().duration(750);

      // Transition the data on all arcs, even the ones that aren’t visible,
      // so that if this transition is interrupted, entering arcs will start
      // the next transition from the desired position.
      path
        // @ts-ignore
        .transition(t)
        .tween("data", (d: any) => {
          const i = d3.interpolate(d.current, d.target);
          return (t: any) => (d.current = i(t));
        })
        // @ts-ignore
        .filter(function (d: any) {
          // @ts-ignore
          return +this.getAttribute("fill-opacity") || arcVisible(d.target);
        })
        .attr("fill-opacity", (d: any) =>
          arcVisible(d.target) ? (d.children ? 0.6 : 0.4) : 0
        )
        .attr("pointer-events", (d: any) =>
          arcVisible(d.target) ? "auto" : "none"
        )
        // @ts-ignore
        .attrTween("d", (d: any) => () => arc(d.current));

      label
        // @ts-ignore
        .filter(function (d: any) {
          // @ts-ignore
          return +this.getAttribute("fill-opacity") || labelVisible(d.target);
        })
        // @ts-ignore
        .transition(t)
        .attr("fill-opacity", (d: any) => +labelVisible(d.target))
        .attrTween("transform", (d: any) => () => labelTransform(d.current));
    }

    function arcVisible(d: any) {
      return d.y1 <= 3 && d.y0 >= 1 && d.x1 > d.x0;
    }

    function labelVisible(d: any) {
      return d.y1 <= 3 && d.y0 >= 1 && (d.y1 - d.y0) * (d.x1 - d.x0) > 0.03;
    }

    function labelTransform(d: any) {
      const x = (((d.x0 + d.x1) / 2) * 180) / Math.PI;
      const y = ((d.y0 + d.y1) / 2) * radius;
      return `rotate(${x - 90}) translate(${y},0) rotate(${x < 180 ? 0 : 180})`;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [refSvg, data, colorSchema]);

  useEffect(() => {
    buildGraph();
  }, [buildGraph]);

  return (
    <div className="ZoomableChart">
      <svg ref={refSvg}></svg>
    </div>
  );
};

export default ZoomableChart;
