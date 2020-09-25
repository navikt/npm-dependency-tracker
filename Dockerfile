FROM node:14-alpine
RUN apk --no-cache add git

WORKDIR /usr/app

COPY . .

RUN yarn install && yarn run setup-build

EXPOSE 8080:3001

CMD ["yarn", "run", "prod", "--dev"]