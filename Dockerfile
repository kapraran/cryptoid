FROM node:20
WORKDIR /app
COPY ["package.json", "package-lock.json*", "./"]
RUN npm ci
COPY . .
RUN npm run build
RUN npm run parcel:build
CMD [ "npm", "run", "start" ]
