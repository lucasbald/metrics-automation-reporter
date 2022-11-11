provider "aws" {
  region  = "us-east-1"
}

module "metricsServer" {
  source = "./_modules/"
  dns = var.dns
  hosted_zone_id = var.hosted_zone_id
  private_subnet = var.private_subnet
  public_subnet = var.public_subnet
  vpc_id = var.vpc_id
}
