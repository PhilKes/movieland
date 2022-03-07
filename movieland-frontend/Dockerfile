FROM node:12.13.0-alpine

# create destination directory
WORKDIR /app

EXPOSE 3000

# copy the app, note .dockerignore
COPY ./ ./
RUN ls -la ./*

RUN npm install



# set app serving to permissive / assigned
ENV NUXT_HOST=127.0.0.1
# set app port
ENV NUXT_PORT=3000

# start the app
CMD [ "npm", "run", "dev" ]
