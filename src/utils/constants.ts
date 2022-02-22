import Discipline from "./discipline.json";
import Users from "./users.json";

export const mockData: DataResponseItem[] = [
  {
    Pk_id: "e5e2cc3e-c813-4870-8b62-9c3595697905",
    Fk_project_id: "039a5779-9dfa-4ba3-b838-2678fe386e92",
    category: "Discipline - Tags",
    data: Discipline,
    rev: 1,
    time_date_stamp: "2021-07-12 10:00:08.089",
  },
  {
    Pk_id: "90584c90-5fc4-425a-9e15-b20a6fcea346",
    Fk_project_id: "039a5779-9dfa-4ba3-b838-2678fe386e92",
    category: "Users",
    data: Users,
    rev: 2,
    time_date_stamp: "2021-07-12 10:00:08.089",
  },
];
