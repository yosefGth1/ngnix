FROM node as build-deps

WORKDIR /usr/src/app

# Copy the files required for installing node_modules
COPY package.json yarn.lock ./
RUN yarn
# COPY package*.json
# RUN npm i

# Copy the rest of the code
COPY . ./

# Exporting NODE_OPTIONS because of webpack 4 exception
ENV NODE_OPTIONS=--openssl-legacy-provider
RUN yarn build
# RUN npm run build

# To enable non-root website hosting
# add "homepage" key into package.json

# Moving all built data into the new container
FROM nginx:alpine
COPY --from=build-deps /usr/src/app/build /usr/share/nginx/html

# To enable proper routing in nginx
COPY ./nginx/production.routing.conf /etc/nginx/conf.d/default.conf

# Nginx exposing port 80 by default
EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]