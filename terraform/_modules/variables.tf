variable "region" {
  default = "us-east-1"
}
variable "availability_zone" {
  description = "availability zone for volume and instance"
  default     = "us-east-1"
}
variable "ami" {
  type    = string
  default = "ami-00dc79254d0461090"
}
variable "instance_type" {
  description = "type for AWS instance - NOT FOR FREE TIER"
  default     = "t2.small"
}

variable "vpc_id" {
  description = "vpc_id"
}

variable "public_subnet" {
  type    = string
}

variable "private_subnet" {
  type    = string
}

variable "hosted_zone_id" {
  type    = string
}

variable "dns" {
  type        = string
  description = "description"
}
