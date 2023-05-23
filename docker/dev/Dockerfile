FROM node:19

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

RUN apt-get update

RUN apt-get install build-essential -y

RUN apt-get install libcairo2-dev -y

RUN apt-get install libpango1.0-dev -y

RUN apt-get install libjpeg-dev -y

RUN apt-get install libgif-dev -y

RUN apt-get install librsvg2-dev -y

# Install dependencies
RUN npm install

# Build js files
RUN npm run build

CMD [ "npm", "start" ]
