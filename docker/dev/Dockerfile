FROM node:16

ARG DISCORD_TOKEN
ENV TOKEN="$DISCORD_TOKEN"

ARG AMQP_URL
ENV AMQP_URL="$AMQP_URL"

ARG OPEN_AI_TOKEN
ENV OPEN_API_TOKEN="$OPEN_AI_TOKEN"

ARG MONGO_URI
ENV MONGO_URI="$MONGO_URI"

# Create app directory
WORKDIR /usr/src/app

# Bundle app source
COPY . .

# Install dependencies
RUN npm install

# Build js files
RUN npm run build

CMD [ "npm", "start" ]
