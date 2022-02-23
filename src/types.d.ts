interface Leaf {
  name: string;
  count: number;
}

interface LeafProps {
  name: string;
  children: (Leaf | LeafProps)[];
}

interface ProjectDataResponseItem {
  id: string;
  projectID: string;
  category: string;
  data: LeafProps;
  rev: number;
  timeDateStamp: string;
}
