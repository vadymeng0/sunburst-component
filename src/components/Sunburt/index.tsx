import { FC, useCallback, useEffect, useRef, useState } from "react";
import { cloneDeep } from "lodash";
import Breadcrumb from "./Breadcrumb";
import Legend from "./Legend";
import ListTitle from "./ListTitle";
import Title from "./Title";
import ZoomableChart from "./ZoomableChart";

import "./style.scss";

interface SunburtProps {
  data: DataResponseItem[];
}

const Sunburt: FC<SunburtProps> = ({ data }) => {
  const refSvg = useRef<SVGSVGElement>(null);
  const [breadcrumbIds, setBreadcrumbIds] = useState<
    { name: string; id: string }[]
  >([]);
  const [dataSelected, setDataSelected] = useState<DataResponseItem>();
  const [listTitle, setListTitle] = useState<
    { value: string; label: string }[]
  >([]);

  const resetBreadcrumb = (name: string) => {
    setBreadcrumbIds([{ name, id: "" }]);
  };

  useEffect(() => {
    setListTitle(
      data.map((item) => ({ value: item.Pk_id, label: item.category }))
    );
    setDataSelected(data?.[0]);
    if (data?.[0]) {
      resetBreadcrumb(data[0].data.name);
    }
  }, [data]);

  const handleChangeCategory = useCallback(
    (id: string) => {
      const newDataSelected = data.filter((item) => item.Pk_id === id)?.[0];
      if (dataSelected?.Pk_id !== newDataSelected.Pk_id) {
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

  return (
    <div className="Sunburt">
      <div className="Sunburt__left">
        <Title title={dataSelected?.category || ""} />
        <div className="Sunburt__control">
          <Breadcrumb
            breadcrumbIds={breadcrumbIds}
            onClick={handleChangeBreadcrumb}
          />
          <Legend />
        </div>
        <ZoomableChart
          data={dataSelected?.data}
          setBreadcrumbIds={setBreadcrumbIds}
          refSvg={refSvg}
        />
      </div>
      <div className="Sunburt__right">
        <ListTitle
          data={listTitle}
          selectedDataId={dataSelected?.Pk_id}
          onClick={handleChangeCategory}
        />
      </div>
    </div>
  );
};

export default Sunburt;
