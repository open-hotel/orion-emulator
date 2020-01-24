FROM node:10.18.0-alpine as base
WORKDIR /orion
COPY . .
RUN apk --no-cache add --virtual builds-deps build-base python && \
  yarn && \
  apk --no-cache del builds-deps build-base python

FROM base as prod
RUN yarn build
CMD [ "node", "dist/main.js" ]
