data "aws_instance" "wordpress" {
  instance_id = "i-09c032cfab82c4ff9"
}

output "wordpress_instance_id" {
  value = data.aws_instance.wordpress.id
}

output "wordpress_public_ip" {
  value = data.aws_instance.wordpress.public_ip
}

output "wordpress_private_ip" {
  value = data.aws_instance.wordpress.private_ip
}

resource "aws_security_group" "wordpress" {
  name        = "launch-wizard-1"
  description = "launch-wizard-1 created 2026-09-19T01:34:11.901Z"
  vpc_id      = "vpc-09f38f2a45a39c81e"

  ingress {
    description = null
    from_port   = 22
    to_port     = 22
    protocol    = "tcp"

    cidr_blocks = [
      "114.172.224.137/32"
    ]

    prefix_list_ids = [
      "pl-08d491d20eebc3b95"
    ]

    ipv6_cidr_blocks = []
    security_groups  = []
    self             = false
  }

  ingress {
    description = null
    from_port   = 80
    to_port     = 80
    protocol    = "tcp"

    cidr_blocks = []

    prefix_list_ids = [
      "pl-58a04531"
    ]

    ipv6_cidr_blocks = []
    security_groups  = []
    self             = false
  }

  egress {
    description = null
    from_port   = 0
    to_port     = 0
    protocol    = "-1"

    cidr_blocks = [
      "0.0.0.0/0"
    ]

    prefix_list_ids  = []
    ipv6_cidr_blocks = []
    security_groups  = []
    self             = false
  }

  tags = {}

  lifecycle {
    prevent_destroy = true
  }
}