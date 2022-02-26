FROM node:lts-alpine as builder

WORKDIR /build

COPY package.json yarn.lock ./

RUN yarn

COPY tsconfig.json ./

COPY public ./public
COPY src ./src

RUN yarn build

RUN yarn build-monitor



FROM node:lts-alpine

RUN apk add --no-cache bash caddy

ENV XDG_CONFIG_HOME /caddy/config
ENV XDG_DATA_HOME /caddy/data

WORKDIR /backend

VOLUME /caddy
VOLUME /backend/.cache

EXPOSE 80

COPY docker/Caddyfile /etc/caddy/Caddyfile
COPY --chmod=755 docker/entrypoint.sh /usr/bin/entrypoint.sh
COPY --from=builder /build/build /var/www/html
COPY --from=builder /build/dist /backend

ENTRYPOINT [ "entrypoint.sh" ]

CMD ["node", "--enable-source-maps", "monitor.js"]
