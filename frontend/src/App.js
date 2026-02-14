import React, { useEffect, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
} from "recharts";

function App() {
  const [data, setData] = useState(null);
  const [killSwitchActive, setKillSwitchActive] = useState(false);

  useEffect(() => {
    const fetchData = () => {
      fetch("http://localhost:3000/")
        .then((res) => res.json())
        .then((data) => setData(data))
        .catch((err) => console.error(err));
    };

    fetchData(); // initial load

    const interval = setInterval(fetchData, 30000); // refresh every 30 seconds

    return () => clearInterval(interval); // cleanup
  }, []);

  if (!data) return <h2 style={{ padding: "40px" }}>Loading...</h2>;

  // Forecast Logic
  const today = new Date();
  const dayOfMonth = today.getDate();
  const totalDaysInMonth = new Date(
    today.getFullYear(),
    today.getMonth() + 1,
    0,
  ).getDate();

  const averageDailySpend = dayOfMonth > 0 ? data.totalCost / dayOfMonth : 0;

  const projectedMonthlyCost = averageDailySpend * totalDaysInMonth;

  const forecastAlert = projectedMonthlyCost >= data.threshold;

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

      {forecastAlert && (
        <div
          style={{
            backgroundColor: "#ffcccc",
            padding: "15px",
            borderRadius: "8px",
            marginBottom: "20px",
            color: "darkred",
            fontWeight: "bold",
          }}
        >
          ⚠ Warning: Based on current spending rate, you are projected to exceed
          your monthly threshold!
        </div>
      )}

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

        <div style={{ ...cardStyle, flex: 1 }}>
          <h3>Projected Monthly Cost</h3>
          <h2>${projectedMonthlyCost.toFixed(2)}</h2>
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

      <div style={{ ...cardStyle, marginTop: "30px" }}>
        <h3>Cost by AWS Service</h3>
        <div style={{ width: "100%", height: 300 }}>
          <ResponsiveContainer>
            <BarChart data={data.serviceBreakdown || []}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="service" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="cost" fill="#82ca9d" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Kill Switch Simulation */}
      <div style={{ ...cardStyle, marginTop: "30px" }}>
        <h3>Kill Switch Simulation</h3>

        <p>
          {killSwitchActive
            ? "⚠ Resources are suspended to prevent further cost."
            : "System operating normally."}
        </p>

        <button
          onClick={() => setKillSwitchActive(!killSwitchActive)}
          style={{
            padding: "10px 20px",
            backgroundColor: killSwitchActive ? "green" : "red",
            color: "white",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
          }}
        >
          {killSwitchActive ? "Restore System" : "Activate Kill Switch"}
        </button>
      </div>
    </div>
  );
}

export default App;
