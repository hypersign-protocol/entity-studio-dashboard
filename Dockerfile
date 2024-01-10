FROM node:14 as build-stage


WORKDIR /app
COPY ./package.json .

RUN npm install

# Build the Vue.js app for production
ENV VUE_APP_TITLE='__VUE_APP_TITLE__'

ENV VUE_APP_DESC='__VUE_APP_DESC__'

ENV VUE_APP_VERSION='__VUE_APP_VERSION__'

ENV VUE_APP_STUDIO_SERVER_BASE_URL='__VUE_APP_STUDIO_SERVER_BASE_URL__'

ENV VUE_APP_STUDIO_SERVER_BASE_WS='__VUE_APP_STUDIO_SERVER_BASE_WS__'

ENV VUE_APP_NODE_SERVER_BASE_URL='__VUE_APP_NODE_SERVER_BASE_URL__'

ENV VUE_APP_NODE_SERVER_BASE_URL_REST='__VUE_APP_NODE_SERVER_BASE_URL_REST__'

ENV VUE_APP_EXPLORER_BASE_URL='__VUE_APP_EXPLORER_BASE_URL__'

ENV VUE_APP_WEB_WALLET_ADDRESS='__VUE_APP_WEB_WALLET_ADDRESS__'

RUN npm run build


FROM nginx:latest as production-stage
COPY nginx/nginx.conf /etc/nginx/nginx.conf

COPY --from=build-stage /app/dist /usr/share/nginx/html

EXPOSE 80

