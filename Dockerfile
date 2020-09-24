FROM node:14-alpine

WORKDIR /usr/app

COPY . .

RUN yarn install && yarn run setup-build


EXPOSE 3001

CMD ["yarn", "run", "prod"]