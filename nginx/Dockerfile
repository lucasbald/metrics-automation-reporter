FROM nginx:alpine

ARG CERTBOT_URLS
ARG CERTBOT_EMAIL
ARG NGINX_USER
ARG NGINX_PASSWORD

COPY conf/metrics.conf /etc/nginx/conf.d/metrics.conf
RUN sed "s/#URL#/${CERTBOT_URLS}/g" -i /etc/nginx/conf.d/metrics.conf

RUN apk add --update python3 py3-pip alpine-sdk python3-dev libffi-dev apache2-utils

RUN python3 -m venv /opt/certbot/ && \
/opt/certbot/bin/pip install --upgrade pip && \
/opt/certbot/bin/pip install certbot && \
ln -s /opt/certbot/bin/certbot /usr/bin/certbot && \
/opt/certbot/bin/pip install certbot-dns-route53

WORKDIR /opt/certbot

RUN htpasswd -b -c /etc/nginx/.htpasswd ${NGINX_USER} ${NGINX_PASSWORD}

RUN certbot certonly \
-n --agree-tos --email "${CERTBOT_EMAIL}" \
--dns-route53 -d "${CERTBOT_URLS}" \
--work-dir=auto-generation --logs-dir=auto-generation --config-dir=auto-generation

RUN cp /opt/certbot/auto-generation/live/${CERTBOT_URLS}/fullchain.pem /etc/ssl/certs/fullchain1.pem
RUN cp /opt/certbot/auto-generation/live/${CERTBOT_URLS}/privkey.pem /etc/ssl/private/privkey1.pem
