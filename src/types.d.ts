interface Leaf {
  name: string;
  count: number;
}

interface LeafProps {
  name: string;
  children: (Leaf | LeafProps)[];
}

interface DataResponseItem {
  Pk_id: string;
  Fk_project_id: string;
  category: string;
  data: LeafProps;
  rev: number;
  time_date_stamp: string;
}
