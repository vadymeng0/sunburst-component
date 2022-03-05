import { FC, useCallback, useEffect, useRef, useState } from "react";
import * as d3 from "d3";
import { cloneDeep } from "lodash";
import Breadcrumb from "./Breadcrumb";
import Legend from "./Legend";
import ListTitle from "./ListTitle";
import Title from "./Title";
import ZoomableChart from "./ZoomableChart";

import "./style.scss";
import {
  getColorSchema,
  partition,
  unselectedOrUndefinedColor,
} from "../../utils/d3utils";
import { MultiValue } from "react-select";

interface SunburstProps {
  data: ProjectDataResponseItem[];
}

const Sunburst: FC<SunburstProps> = ({ data }) => {
  const refSvg = useRef<SVGSVGElement>(null);
  const [breadcrumbIds, setBreadcrumbIds] = useState<
    { name: string; id: string }[]
  >([]);
  const [dataSelected, setDataSelected] = useState<ProjectDataResponseItem>();
  const [listTitle, setListTitle] = useState<
    { value: string; label: string }[]
  >([]);
  const [listStatus, setListStatus] = useState<{ [key: string]: string }>({});
  const [colorSchema, setColorSchema] = useState<string[]>([]);
  const [selectedStatus, setSelectedStatus] = useState<
    { value: string; label: string }[]
  >([]);

  useEffect(() => {
    if (!dataSelected?.data.children.length) return;

    const newListStatus: { [key: string]: string } = {};

    const root = partition(dataSelected?.data);
    const rooDescendants = root.descendants().slice(1);

    rooDescendants.forEach((item: any, index) => {
      if (item.data.status && !newListStatus[item.data.status]) {
        newListStatus[item.data.status] = "red"; // give it a temp red color
      }
    });

    const rainbowColors = getColorSchema(Object.keys(newListStatus).length);
    setColorSchema([...rainbowColors]);

    Object.keys(newListStatus).forEach((item: string, index) => {
      newListStatus[item] = rainbowColors[index];
    });

    setListStatus(newListStatus);
    setSelectedStatus(
      Object.keys(newListStatus).map((item) => ({ value: item, label: item }))
    );
  }, [dataSelected]);

  const resetBreadcrumb = (name: string) => {
    setBreadcrumbIds([{ name, id: "" }]);
  };

  useEffect(() => {
    setListTitle(
      data.map((item) => ({ value: item.id, label: item.category }))
    );
    setDataSelected(data?.[0]);
    if (data?.[0]) {
      resetBreadcrumb(data[0].data.name);
    }
  }, [data]);

  const handleChangeCategory = useCallback(
    (id: string) => {
      const newDataSelected = data.filter((item) => item.id === id)?.[0];
      if (dataSelected?.id !== newDataSelected.id) {
        setDataSelected(newDataSelected);
        resetBreadcrumb(newDataSelected.data.name);
      }
    },
    [data, dataSelected]
  );

  const handleChangeBreadcrumb = (id: string) => {
    const isRoot = !Boolean(id);
    if (!isRoot) {
      return document.getElementById(id)?.dispatchEvent(new Event("click"));
    }

    if (dataSelected) {
      setDataSelected(cloneDeep(dataSelected));
      resetBreadcrumb(dataSelected.data.name);
    }
  };

  const handleChangeStatus = useCallback(
    (newValue: MultiValue<{ value: string; label: string }>) => {
      setSelectedStatus(newValue as { value: string; label: string }[]);
      const newSelectedStatus = newValue.map((item) => item.value);

      d3.selectAll(".ZoomableChart path").each(function () {
        const thisPath = d3.select(this);
        const currentStatus = thisPath.attr("data-status");
        const isSelected = newSelectedStatus.includes(currentStatus);
        thisPath.attr(
          "fill",
          isSelected ? listStatus[currentStatus] : unselectedOrUndefinedColor
        );
      });
    },
    [listStatus]
  );

  return (
    <div className="Sunburst">
      <div className="Sunburst__left">
        <Title title={dataSelected?.category || ""} />
        <div className="Sunburst__control">
          <Breadcrumb
            breadcrumbIds={breadcrumbIds}
            onClick={handleChangeBreadcrumb}
          />
          <Legend
            listStatus={listStatus}
            onChange={handleChangeStatus}
            value={selectedStatus}
          />
        </div>
        <ZoomableChart
          data={dataSelected?.data}
          setBreadcrumbIds={setBreadcrumbIds}
          refSvg={refSvg}
          colorSchema={colorSchema}
        />
      </div>
      <div className="Sunburst__right">
        <ListTitle
          data={listTitle}
          selectedDataId={dataSelected?.id}
          onClick={handleChangeCategory}
        />
      </div>
    </div>
  );
};

export default Sunburst;
