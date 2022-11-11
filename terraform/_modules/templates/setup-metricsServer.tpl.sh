#!/bin/bash
AGENT_USER="ec2-user"

echo "Installing docker"
sudo yum install docker -y
sudo curl -L "https://github.com/docker/compose/releases/download/1.25.1/docker-compose-Linux-x86_64" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose
sudo ln -s /usr/local/bin/docker-compose /usr/bin/docker-compose

systemctl status docker
systemctl enable docker
systemctl start docker

# let the ec2-user execute docker without sudo
sudo usermod -a -G docker $AGENT_USER
echo "Done!"

echo "Installing git"
sudo yum install -y git
echo "Done!"

echo "cloning metrics-server repo"
cd /opt || exit
git clone https://github.com/lucasbald/metrics-automation-reporter.git
echo "Done!"

echo "starting metricsServer docker"
cd /opt/metrics-automation-reporter || exit
docker-compose up -d
echo "Done!"

# create a script to renew the cert
sudo tee -a /opt/metrics-automation-reporter/renew <<EOF
#!/bin/bash
cd /opt/metrics-automation-reporter
docker-compose stop nginx
docker rm metrics-automation-reporter_nginx_1
docker rmi \$(sudo docker images | grep metrics-automation-reporter_nginx | awk '{print \$3}')
docker-compose up -d
EOF
sudo chmod +x /opt/metrics-automation-reporter/renew

# append the crontab for the renew
echo "$(echo '0 0 1 */2 * /opt/metrics-automation-reporter/renew'; crontab -l)" | crontab -
