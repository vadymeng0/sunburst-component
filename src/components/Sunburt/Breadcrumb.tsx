import { FC } from "react";

interface BreadcrumbProps {
  breadcrumbIds: { name: string; id: string }[];
  onClick: (id: string) => void;
}

const Breadcrumb: FC<BreadcrumbProps> = ({ breadcrumbIds, onClick }) => {
  return (
    <div className="Breadcrumb">
      {breadcrumbIds.map((item, index) => (
        <button
          key={item.id || "Root-Breadcrumb"}
          onClick={() => {
            const isLastItem =
              index !== 0 && index === breadcrumbIds.length - 1;
            if (isLastItem) return;
            onClick(item.id);
          }}
        >
          {item.name}
        </button>
      ))}
    </div>
  );
};

export default Breadcrumb;
