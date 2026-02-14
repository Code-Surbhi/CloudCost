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

  const cardStyle = {
    background: "white",
    padding: "20px",
    borderRadius: "10px",
    boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
    marginBottom: "20px",
  };

  return (
    <div
      style={{
        padding: "40px",
        fontFamily: "Arial",
        backgroundColor: "#f4f6f9",
        minHeight: "100vh",
      }}
    >
      <h1 style={{ marginBottom: "30px" }}>🚀 CloudCost Sentinel Dashboard</h1>

      {/* Summary Cards */}
      <div style={{ display: "flex", gap: "20px" }}>
        <div style={{ ...cardStyle, flex: 1 }}>
          <h3>Total Cost</h3>
          <h2>${data.totalCost}</h2>
        </div>

        <div style={{ ...cardStyle, flex: 1 }}>
          <h3>Threshold</h3>
          <h2>${data.threshold}</h2>
        </div>

        <div style={{ ...cardStyle, flex: 1 }}>
          <h3>Status</h3>
          <h2
            style={{
              color: data.alert ? "red" : "green",
            }}
          >
            {data.alert ? "⚠ ALERT" : "✓ SAFE"}
          </h2>
        </div>
      </div>

      {/* Chart Section */}
      <div style={{ ...cardStyle, marginTop: "30px" }}>
        <h3>Daily Cost Trend</h3>
        <div style={{ width: "100%", height: 300 }}>
          <ResponsiveContainer>
            <LineChart data={data.dailyBreakdown}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="cost"
                stroke="#3f51b5"
                strokeWidth={2}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}

export default App;
