FROM node:current-alpine

RUN apk -U --no-cache update \
    && apk -U --no-cache upgrade \
    && apk -U --no-cache --allow-untrusted add git

WORKDIR /app

RUN git clone --depth=1 --branch main https://github.com/SirlyDreamer/Idiom.git \
    && cd ./Idiom \
    && yarn install

WORKDIR /app/Idiom

COPY docker-entrypoint.sh entrypoint.sh

RUN chmod +x ./entrypoint.sh \
    && rm -rf /var/cache/* \
    && rm -rf /tmp/*

ENTRYPOINT ["./entrypoint.sh"]