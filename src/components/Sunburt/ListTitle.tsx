import { FC } from "react";
import classNames from "classnames";

interface ListTitleProps {
  data: { value: string; label: string }[];
  onClick: (id: string) => void;
  selectedDataId?: string;
}

const List: FC<ListTitleProps> = ({ data, onClick, selectedDataId }) => {
  return (
    <div className="ListTitle">
      <h2>Sunburt Display</h2>
      <ul>
        {data.map((item) => (
          <li key={item.value}>
            <button
              className={classNames({ active: selectedDataId === item.value })}
              onClick={() => onClick(item.value)}
            >
              {item.label}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default List;
