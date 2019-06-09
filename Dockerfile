FROM node:10
WORKDIR /usr/src/image-viewer

COPY api/package*.json ./
RUN npm ci --only=production
COPY api/*.js ./
ADD api/store ./store
ADD ui/build ./public
EXPOSE 3000
CMD [ "npm", "start" ]
