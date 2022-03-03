interface Leaf {
  name: string;
  count: number;
  status?: string;
}

interface LeafProps {
  name: string;
  children: (Leaf | LeafProps)[];
  status?: string;
}

interface ProjectDataResponseItem {
  id: string;
  projectID: string;
  category: string;
  data: LeafProps;
  rev: number;
  timeDateStamp: string;
}
