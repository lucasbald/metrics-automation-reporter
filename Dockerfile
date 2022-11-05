FROM node:16-alpine3.15

RUN mkdir /opt/app
WORKDIR /opt/app
COPY package*.json ./
RUN chown -R node:node /opt/app
USER node
RUN npm install

COPY --chown=node:node . .

EXPOSE 3000
ENTRYPOINT [ "node", "main.js" ]