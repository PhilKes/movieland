FROM node:12.13.0-alpine
# update and install dependency
RUN apk update && apk upgrade
RUN apk add git

# copy the app, note .dockerignore
COPY . /usr/src/nuxt-app/

WORKDIR /usr/src/nuxt-app/

RUN npm install

# build necessary, even if no static files are needed,
# since it builds the server as well
RUN npm run build

# start the app
CMD [ "npm", "start" ]
