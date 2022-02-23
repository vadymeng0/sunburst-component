import { useEffect, useState } from "react";

import { Sunburst } from "./components";
import { mockData } from "./utils/constants";
import { API_URL } from "./utils/config";

import "./App.scss";

const App = () => {
  const [data, setData] = useState<ProjectDataResponseItem[]>([]);
  const [loading, setLoading] = useState(false);

  const handleFetchProjectData = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${API_URL}/project-data`);
      const resJson = await res.json();
      // for showing loading 500ms
      setTimeout(() => {
        setLoading(false);
      }, 500);
      setData(resJson);
    } catch (err) {
      console.log("Error when calling API get project data: ", err);
      // use mock data in case run api fail
      setData(mockData);
      setLoading(false);
    }
  };

  useEffect(() => {
    handleFetchProjectData();
  }, []);

  return (
    <div className="App">
      {loading && (
        <div className="App__loading">
          <div className="App__loader"></div>
        </div>
      )}
      <Sunburst data={data} />
    </div>
  );
};

export default App;
