import { useEffect, useState } from "react";
import { Sunburt } from "./components";
import { mockData } from "./utils/constants";

import "./App.scss";

function App() {
  const [data, setData] = useState<DataResponseItem[]>([]);

  // mock data here
  // replace with fetching real api later
  useEffect(() => {
    setTimeout(() => {
      setData(mockData);
    }, 100);
  }, []);

  return (
    <div className="App">
      <Sunburt data={data} />
    </div>
  );
}

export default App;
