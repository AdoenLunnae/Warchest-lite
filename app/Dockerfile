FROM node:19.6.1-slim
# Update the current working directory to the /app folder
WORKDIR /app

COPY package.json .
RUN npm install
ADD . /app


# Start
CMD [ "npm", "start" ]