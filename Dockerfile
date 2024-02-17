FROM node:20.9.0
RUN npm install -g nodemon
WORKDIR /home/naildev/api_backend
COPY . /home/naildev/api_backend
RUN npm ci
CMD npm run start
