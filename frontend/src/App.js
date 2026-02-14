import React, { useEffect, useState } from "react";

function App() {
  const [data, setData] = useState(null);

  useEffect(() => {
    fetch("http://localhost:3000/")
      .then((res) => res.json())
      .then((data) => setData(data))
      .catch((err) => console.error(err));
  }, []);

  if (!data) return <h2 style={{ padding: "40px" }}>Loading...</h2>;

  return (
    <div style={{ padding: "40px", fontFamily: "Arial" }}>
      <h1>CloudCost Sentinel Dashboard</h1>

      <h2>Total Cost: ${data.totalCost}</h2>
      <h3>Threshold: ${data.threshold}</h3>

      <h3>
        Alert Status:{" "}
        <span style={{ color: data.alert ? "red" : "green" }}>
          {data.alert ? "⚠ ALERT" : "✓ Safe"}
        </span>
      </h3>
    </div>
  );
}

export default App;
