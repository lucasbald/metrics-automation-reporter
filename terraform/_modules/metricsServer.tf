provider "aws" {
  region = var.region
}

data "template_file" "metricsServer-initialization" {
  template = file("${path.module}/templates/setup-metricsServer.tpl.sh")
}

resource "aws_instance" "metricsServer" {
  ami           = var.ami
  instance_type = var.instance_type
  subnet_id     = var.public_subnet
  security_groups = [
  aws_security_group.metricsServer-security-group.id]
  associate_public_ip_address = true
  iam_instance_profile        = aws_iam_instance_profile.metricsServer-instance-profile.name
  user_data                   = data.template_file.metricsServer-initialization.rendered
}

resource "aws_eip" "metricsServer-public-ip" {
  instance = aws_instance.metricsServer.id
  vpc      = true

  tags = {
    Name = "metricsServer-public-ip"
  }
}

resource "aws_route53_record" "metricsServer-dns" {
  zone_id = var.hosted_zone_id
  name    = var.dns
  type    = "A"
  ttl     = "300"
  records = [aws_eip.metricsServer-public-ip.public_ip]
}
