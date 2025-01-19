FROM alpine:3.21

ENV USER=node

# Home folder for node user
RUN mkdir -p /home/node/app
WORKDIR /home/node/app

# Copy package files and install dependencies first
COPY package*.json ./

RUN npm install

# Copy the rest of the application code
COPY . ./

RUN chown -R node:node /home/node/app

# Global npm configuration for node user
RUN mkdir /home/node/.npm-global
RUN chown -R node:node /home/node/.npm-global

ENV PATH=/home/node/.npm-global/bin:$PATH
ENV NPM_CONFIG_PREFIX=/home/node/.npm-global
RUN npm --global config set user "${USER}"

USER node
RUN npm install --location=global pm2

ENV NODE_ENV=production
RUN npm run build

CMD [ "pm2-runtime", "--no-auto-exit", "npm", "--", "run", "docker:start:prod" ]
