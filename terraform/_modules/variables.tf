variable "region" {
  default = "us-east-1"
}
variable "availability_zone" {
  description = "availability zone for volume and instance"
  default     = "us-east-1"
}
variable "ami" {
  type    = string
  default = "ami-TODO"  // TODO, take the new one
}
variable "instance_type" {
  description = "type for AWS instance - NOT FOR FREE TIER"
  default     = "t2.small" // https://aws.amazon.com/ec2/instance-types/?nc1=h_ls TODO, check performance
}

variable "vpc_id" {
  description = "vpc_id"
  default     = "<TODO / README: YOUR_VPC_VALUE>"
}

variable "public_subnet" {
  type    = string
  default = "<TODO / README: YOUR_SUBNET_VALUE>"
}

variable "private_subnet" {
  type    = string
  default = "<TODO / README: YOUR_PRIVATE_SUBNET_VALUE>"
}

variable "hosted_zone_id" {
  type    = string
  default = "<TODO/ README: YOUR_HOSTED_ZONE_ID>"
}
