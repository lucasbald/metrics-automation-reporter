resource "aws_iam_instance_profile" "metricsServer-instance-profile" {
  name = "metricsServer-instance-profile"
  role = aws_iam_role.metricsServer-instance-role.name
}

resource "aws_iam_role" "metricsServer-instance-role" {
  name = "metricsServer-instance-role"

  assume_role_policy  = <<EOF
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Action": "sts:AssumeRole",
      "Principal": {
        "Service": "ec2.amazonaws.com"
      },
      "Effect": "Allow",
      "Sid": ""
    }
  ]
}
EOF
  managed_policy_arns = ["arn:aws:iam::aws:policy/AmazonSSMManagedInstanceCore"]
  path                = "/"
  tags = {
    tag-key = "instance-role-metricsServer"
  }
}

resource "aws_iam_role_policy" "metricsServer-instance-policy" {
  name = "metricsServer-instance-policy"
  role = aws_iam_role.metricsServer-instance-role.name

  policy = <<EOF
{
  "Version": "2012-10-17",
  "Statement": [
    {
        "Effect": "Allow",
        "Action": [
            "route53:ListHostedZones",
            "route53:GetChange"
        ],
        "Resource": [
            "*"
        ]
    },
    {
        "Effect" : "Allow",
        "Action" : [
            "route53:ChangeResourceRecordSets"
        ],
        "Resource" : [
            "arn:aws:route53:::hostedzone/${var.hosted_zone_id}"
        ]
    }
  ]
}
EOF
}