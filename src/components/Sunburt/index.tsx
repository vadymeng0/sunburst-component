import { FC, useEffect, useState } from "react";
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
  const [dataSelected, setDataSelected] = useState<DataResponseItem>();
  const [listTitle, setListTitle] = useState<
    { value: string; label: string }[]
  >([]);

  useEffect(() => {
    setListTitle(
      data.map((item) => ({ value: item.Pk_id, label: item.category }))
    );
    setDataSelected(data?.[0]);
  }, [data]);

  const handleSelect = (id: string) => {
    setDataSelected(data.filter((item) => item.Pk_id === id)?.[0]);
  };

  return (
    <div className="Sunburt">
      <div className="Sunburt__left">
        <Title title={dataSelected?.category || ""} />
        <div className="Sunburt__control">
          <Breadcrumb />
          <Legend />
        </div>
        <ZoomableChart data={dataSelected?.data} />
      </div>
      <div className="Sunburt__right">
        <ListTitle
          data={listTitle}
          selectedDataId={dataSelected?.Pk_id}
          onClick={handleSelect}
        />
      </div>
    </div>
  );
};

export default Sunburt;
