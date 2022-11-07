provider "aws" {
  region  = "us-east-1"
  profile = "<TODO / README: YOUR_ACCOUNT_PROFILE_NAME>"
}

module "metricsServer" {
  source = "./_modules/"
}
