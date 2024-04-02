# Specify the base image and version
FROM node:18.12.0

# Set the working directory in the container
WORKDIR /usr/src/app

## Copy app source
COPY . ./
COPY ./pnpm-lock.yaml ./
COPY ./package.json ./

## Install pnpm
RUN npm install -g pnpm

RUN pnpm i

# Your app binds to port 3000 so you'll use the EXPOSE instruction to have it mapped by the docker daemon
EXPOSE 3000

# Define the command to run your app
CMD [ "node", "app.js" ]