CloudCost Sentinel — Personal AWS Cost Guard

1. Overview

CloudCost Sentinel is a full-stack cloud monitoring system designed to prevent accidental AWS credit exhaustion by students and startups.

The system integrates directly with AWS Cost Explorer APIs, performs financial aggregation, computes forecasted monthly spend, triggers threshold-based alerts via SNS, and presents real-time cost intelligence through a React dashboard.

This project demonstrates:

AWS FinOps awareness

Event-driven architecture

Secure credential handling

Predictive cost modeling

Full-stack system integration

Cloud-native scalability path

## Architecture Diagram

![Architecture](docs/architecture.png)

2. Problem Statement

Students and early-stage startups frequently exceed AWS budgets due to:

Unmonitored EC2 instances

Forgotten development environments

Misconfigured auto-scaling groups

Lack of proactive cost forecasting

CloudCost Sentinel acts as a guardrail system to:

Monitor usage

Predict overspending

Trigger alerts

Simulate emergency shutdown protocols

3. Architecture
   High-Level Architecture
   React Dashboard (Frontend)
   ↓
   Express Backend API
   ↓
   AWS Cost Explorer API
   ↓
   Threshold & Forecast Logic
   ↓
   SNS Topic
   ↓
   Email Notification

Core Components
Frontend

React

Recharts for visualization

Auto-refresh monitoring (30-second interval)

Forecast-based alerting

Kill-switch simulation UI

Backend

Node.js + Express

AWS SDK v3

Cost aggregation logic

Threshold comparison engine

Forecast calculation

SNS publish logic

CORS-enabled API

AWS Services Used

AWS Cost Explorer

Amazon SNS

IAM (least privilege model)

AWS Budget (optional guardrail)

4. Key Features
   Real-Time Cost Monitoring

Pulls daily billing metrics from Cost Explorer.

Structured Cost Aggregation

Transforms raw AWS API responses into frontend-ready JSON.

Threshold Alert System

Triggers SNS email notifications when cost exceeds defined budget.

Forecast-Based Warning

Projects end-of-month spend using average burn-rate extrapolation.

Auto Refresh Engine

Dashboard re-fetches cost data every 30 seconds.

Kill Switch Simulation

Simulated emergency cost control mechanism for production-ready architecture extension.

5. Forecasting Logic

Projected Monthly Cost is calculated using:

Average Daily Spend × Total Days in Current Month

Where:

Average Daily Spend = Current Spend / Days Elapsed

This provides proactive budget risk detection.

6. Security Considerations

Environment variables used for credential isolation

IAM user limited to billing + SNS permissions

.env excluded via .gitignore

No hardcoded AWS credentials

Explicit region configuration

No destructive AWS actions in kill switch simulation

7. Cost Safety

This project is designed to remain within AWS Free Tier constraints.

Cost Explorer API calls are minimal

SNS usage stays within free email tier

No EC2, ECS, RDS, or compute resources provisioned

Budget alerts recommended for account-level protection

8. Production Evolution Roadmap

Future enhancements include:

Service-level cost breakdown

Anomaly detection

Real kill-switch Lambda integration

Terraform infrastructure definition

Deployment via API Gateway + Lambda

Frontend hosting via S3 + CloudFront

CI/CD via GitHub Actions

Parameter Store for secret management

9. Setup Instructions
   Backend
   cd backend
   npm install
   npm start

Requires:

AWS_ACCESS_KEY_ID
AWS_SECRET_ACCESS_KEY
AWS_REGION
SNS_TOPIC_ARN

Frontend
cd frontend
npm install
npm start

Runs on port 3001.

10. Engineering Highlights

This project demonstrates:

Full-stack system design

Cloud cost awareness

Event-driven notifications

Predictive modeling

Secure configuration management

Professional Git history discipline

Clean separation of concerns

Production scalability thinking

11. Interview Talking Points

Why cost monitoring matters in cloud-native environments

Trade-offs of polling vs event-driven billing

IAM least privilege strategy

Forecast model limitations

Scaling SNS for multi-account monitoring

Migration path to serverless deployment

FinOps mindset in early-stage teams
