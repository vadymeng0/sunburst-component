import { FC, useEffect, useState } from "react";
import Select, { ActionMeta, MultiValue, StylesConfig } from "react-select";

interface LegendProps {
  listStatus: { [key: string]: string };
  onChange: (
    newValue: MultiValue<{ value: string; label: string }>,
    actionMeta: ActionMeta<{ value: string; label: string }>
  ) => void;
  value: { value: string; label: string }[];
}

const Legend: FC<LegendProps> = ({ listStatus, onChange, value }) => {
  const [colourOptions, setColourOptions] = useState<
    { value: string; label: string }[]
  >([]);

  useEffect(() => {
    const options: { value: string; label: string }[] = [];
    Object.keys(listStatus).forEach((item) => {
      options.push({ value: item, label: item });
    });
    setColourOptions(options);
  }, [listStatus]);

  const colourStyles: StylesConfig = {
    // control: (styles) => ({ ...styles, backgroundColor: 'white' }),
    option: (styles, { data, isDisabled, isFocused, isSelected }) => {
      // @ts-ignore
      const color = listStatus[data.value];

      return {
        ...styles,
        backgroundColor: color,
        opacity: 0.6,
        color: "#fff",
        cursor: "pointer",
      };
    },
    multiValue: (styles, { data }) => {
      // @ts-ignore
      const color = listStatus[data.value];
      return {
        ...styles,
        color: "#000",
        position: "relative",
        borderRadius: "2px",
        ":before": {
          content: '" "',
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          backgroundColor: color,
          opacity: 0.6,
          borderRadius: "2px",
        },
        ">div": {
          zIndex: 1,
        },
      };
    },
  };

  return (
    <div className="Legend">
      <Select
        closeMenuOnSelect={false}
        isMulti
        options={colourOptions}
        isClearable={false}
        onChange={onChange}
        value={value}
        styles={colourStyles as any}
      />
    </div>
  );
};

export default Legend;
