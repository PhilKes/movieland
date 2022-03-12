FROM node:12.13.0-alpine

# create destination directory
WORKDIR /app

# copy the app, note .dockerignore
COPY ./ ./
RUN ls -la ./*

RUN npm install

# start the app
CMD [ "npm", "run", "dev" ]
