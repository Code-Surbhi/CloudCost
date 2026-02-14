import React, { useEffect, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

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

      <h2 style={{ marginTop: "40px" }}>Daily Cost Trend</h2>

      <div style={{ width: "100%", height: 300 }}>
        <ResponsiveContainer>
          <LineChart data={data.dailyBreakdown}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Line type="monotone" dataKey="cost" stroke="#8884d8" />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export default App;
