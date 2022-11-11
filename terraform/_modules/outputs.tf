#Output address of the instance
output "address" {
  value = aws_instance.metricsServer.public_ip // TODO: remove after test
}
