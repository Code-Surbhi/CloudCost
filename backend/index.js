require("dotenv").config();
const express = require("express");
const {
  CostExplorerClient,
  GetCostAndUsageCommand,
} = require("@aws-sdk/client-cost-explorer");

const app = express();
const PORT = 3000;
const COST_THRESHOLD = 3; // USD monthly safety limit

// Create AWS client
const client = new CostExplorerClient({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

app.get("/", async (req, res) => {
  try {
    const today = new Date();
    const start = new Date(today.getFullYear(), today.getMonth(), 1);

    const command = new GetCostAndUsageCommand({
      TimePeriod: {
        Start: start.toISOString().split("T")[0],
        End: today.toISOString().split("T")[0],
      },
      Granularity: "DAILY",
      Metrics: ["UnblendedCost"],
    });

    const response = await client.send(command);

    const results = response.ResultsByTime || [];

    const dailyBreakdown = results.map((day) => {
      return {
        date: day.TimePeriod.Start,
        cost: parseFloat(day.Total.UnblendedCost.Amount),
      };
    });

    const totalCost = dailyBreakdown.reduce((sum, day) => sum + day.cost, 0);

    const alert = totalCost >= COST_THRESHOLD;

    res.json({
      totalCost,
      threshold: COST_THRESHOLD,
      alert,
      currency: results[0]?.Total?.UnblendedCost?.Unit || "USD",
      dailyBreakdown,
    });
  } catch (error) {
    if (error.name === "DataUnavailableException") {
      return res.json({
        message:
          "Cost data not available yet. Cost Explorer is still initializing.",
        totalCost: 0,
        threshold: COST_THRESHOLD,
        alert: false,
        dailyBreakdown: [],
      });
    }

    console.error("Error fetching cost data:", error);
    res.status(500).json({ error: "Failed to fetch cost data" });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
