resource "aws_sns_topic" "cost_alert_topic" {
  name = "${var.project_name}-alerts"
}
