FROM node:20

WORKDIR /usr/src/app

COPY . .

RUN rm -rf node_modules && yarn install --frozen-lockfile

EXPOSE 3000

CMD npm run dev

