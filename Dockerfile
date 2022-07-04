FROM node:16

# Environmnet vairables runtime configuration
ARG DISCORD_TOKEN
ENV TOKEN="$DISCORD_TOKEN"

ARG AMQP_URL
ENV AMQP_URL="$AMQP_URL"

ARG DISCORD_BOTID
ENV BOTID="$DISCORD_BOTID"

ARG OPEN_AI_TOKEN
ENV OPEN_API_TOKEN="$OPEN_AI_TOKEN"

# Create app directory
WORKDIR /usr/src/app

# Bundle app source
COPY . .

# Install dependencies
RUN npm install

RUN ls -a

# Build js files
RUN npm run build


CMD [ "npm", "start" ]
