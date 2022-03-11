interface Leaf {
  name: string;
  count: number;
  status?: string;
  fontSize?: string;
  label?: string;
}

interface LeafProps {
  name: string;
  children: (Leaf | LeafProps)[];
  status?: string;
  fontSize?: string;
  label?: string;
}

interface ProjectDataResponseItem {
  id: string;
  projectID: string;
  category: string;
  data: LeafProps;
  rev: number;
  timeDateStamp: string;
}
