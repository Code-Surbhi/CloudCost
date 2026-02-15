output "sns_topic_arn" {
  value = aws_sns_topic.cost_alert_topic.arn
}
