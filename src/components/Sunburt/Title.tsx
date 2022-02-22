import { FC } from "react";

interface TitleProps {
  title: string;
}

const Title: FC<TitleProps> = ({ title }) => {
  return (
    <div className="Title">
      <h2>{title}</h2>
    </div>
  );
};

export default Title;
