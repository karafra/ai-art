FROM node:16

# Create app directory
WORKDIR /usr/src/app

# Bundle app source
COPY . .

# Install dependencies
RUN npm install

# Build js files
RUN npm run build

CMD [ "npm", "start" ]
