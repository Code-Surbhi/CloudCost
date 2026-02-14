require("dotenv").config();
const express = require("express");
const {
  CostExplorerClient,
  GetCostAndUsageCommand,
} = require("@aws-sdk/client-cost-explorer");

const app = express();
const PORT = 3000;

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

    console.log("Cost Data:", response);

    res.json(response);
  } catch (error) {
    if (error.name === "DataUnavailableException") {
      return res.json({
        message:
          "Cost data not available yet. Cost Explorer is still initializing.",
        cost: 0,
      });
    }

    console.error("Error fetching cost data:", error);
    res.status(500).json({ error: "Failed to fetch cost data" });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
