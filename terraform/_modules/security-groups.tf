resource "aws_security_group" "metricsServer-security-group" {
  name   = "metricsServer-security-group"
  vpc_id = var.vpc_id

  ingress {
    from_port   = 80
    to_port     = 80
    protocol    = "tcp"
    cidr_blocks = split("\n", file("<PATH_TO_ALLOWED_IPS>")) // TODO, include allowed IPs
  }

  ingress {
    from_port   = 443
    to_port     = 443
    protocol    = "tcp"
    cidr_blocks = split("\n", file("<PATH_TO_ALLOWED_IPS>")) // TODO, include allowed IPs
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }
}
