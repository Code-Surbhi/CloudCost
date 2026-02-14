require("dotenv").config();
const express = require("express");
const {
  CostExplorerClient,
  GetCostAndUsageCommand,
} = require("@aws-sdk/client-cost-explorer");

const { SNSClient, PublishCommand } = require("@aws-sdk/client-sns");

const app = express();
const PORT = 3000;
const COST_THRESHOLD = 0; // Keep 0 for testing only

// ===============================
// AWS CLIENTS
// ===============================

const client = new CostExplorerClient({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

const snsClient = new SNSClient({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

// ===============================
// MAIN COST ROUTE
// ===============================

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

    const dailyBreakdown = results.map((day) => ({
      date: day.TimePeriod.Start,
      cost: parseFloat(day.Total.UnblendedCost.Amount),
    }));

    const totalCost = dailyBreakdown.reduce((sum, day) => sum + day.cost, 0);

    const alert = totalCost >= COST_THRESHOLD;

    if (alert && process.env.SNS_TOPIC_ARN) {
      const publishCommand = new PublishCommand({
        TopicArn: process.env.SNS_TOPIC_ARN,
        Subject: "🚨 AWS Cost Alert - Threshold Exceeded",
        Message: `Your AWS monthly spending is $${totalCost}, which exceeds your threshold of $${COST_THRESHOLD}.`,
      });

      await snsClient.send(publishCommand);
      console.log("SNS alert sent successfully.");
    }

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

// ===============================
// SNS TEST ROUTE (INDEPENDENT)
// ===============================

app.get("/test-sns", async (req, res) => {
  try {
    if (!process.env.SNS_TOPIC_ARN) {
      return res.status(400).json({
        error: "SNS_TOPIC_ARN not set in .env",
      });
    }

    const publishCommand = new PublishCommand({
      TopicArn: process.env.SNS_TOPIC_ARN,
      Subject: "🚨 CloudCost Sentinel Test Alert",
      Message: "This is a test alert from CloudCost Sentinel.",
    });

    await snsClient.send(publishCommand);

    console.log("Test SNS alert sent successfully.");

    res.json({ message: "Test SNS alert sent successfully!" });
  } catch (error) {
    console.error("SNS Test Error:", error);
    res.status(500).json({ error: "SNS test failed" });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
