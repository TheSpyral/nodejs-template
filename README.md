# VINIVIA BACKEND API

[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=flat-square)](http://makeapullrequest.com) [![npm version](https://badge.fury.io/js/express-rest-es2017-boilerplate.svg)](https://badge.fury.io/js/express-rest-es2017-boilerplate)

Boilerplate/Generator/Starter Project for building RESTful APIs and microservices using Node.js, Express and MongoDB

## Features

- No transpilers, just vanilla javascript
- ES2017 latest features like Async/Await
- CORS enabled
- Uses [yarn](https://yarnpkg.com)
- Express + Sequelize ([Sequelize](https://sequelize.org/))
- Consistent coding styles with [editorconfig](http://editorconfig.org)
- [Docker](https://www.docker.com/) support
- Uses [helmet](https://github.com/helmetjs/helmet) to set some HTTP headers for security
- Load environment variables from .env files with [dotenv](https://github.com/rolodato/dotenv-safe)
- Request validation with [joi](https://github.com/hapijs/joi)
- Gzip compression with [compression](https://github.com/expressjs/compression)
- Linting with [eslint](http://eslint.org)
- Tests with [mocha](https://mochajs.org), [chai](http://chaijs.com) and [sinon](http://sinonjs.org)
- Code coverage with [istanbul](https://istanbul.js.org) and [coveralls](https://coveralls.io)
- Git hooks with [husky](https://github.com/typicode/husky)
- Logging with [morgan](https://github.com/expressjs/morgan)
- Authentication and Authorization with [passport](http://passportjs.org)
- API documentation geratorion with [apidoc](http://apidocjs.com)
- Continuous integration support with [travisCI](https://travis-ci.org)
- Monitoring with [pm2](https://github.com/Unitech/pm2)

## Requirements

- [Node v7.6+](https://nodejs.org/en/download/current/) or [Docker](https://www.docker.com/)
- [Yarn](https://yarnpkg.com/en/docs/install)

## Getting Started

Clone the repo and make it yours:

```bash
git clone --depth 1 git@bitbucket.org:vinivia/vinivia-backend-api.git
cd vinivia-backend-api
rm -rf .git
```

Install dependencies:

```bash
yarn
```

Set environment variables:

```bash
cp .env.example .env
```

## Run migration

### The CLI

In order to use the CLI you need to install the respective package:

```bash
npm install --save sequelize-cli
```

As with any npm package, you can use the global flag (-g) to install the CLI globally. If you have installed the CLI without the global flag, use `node_modules/.bin/sequelize [command]` instead of `sequelize [command]`.

```bash
sequelize db:migrate        # Run pending migrations.
sequelize db:migrate:undo   # Revert the last migration run.
sequelize help              # Display this help text.
sequelize init              # Initializes the project.
sequelize migration:create  # Generates a new migration file.
sequelize version           # Prints the version number.
```

## Running Locally

```bash
yarn dev
```

## Running in Production

```bash
yarn start
```

## Lint

```bash
# lint code with ESLint
yarn lint

# try to fix ESLint errors
yarn lint:fix

# lint and watch for changes
yarn lint:watch
```

## Test

```bash
# run all tests with Mocha
yarn test

# run unit tests
yarn test:unit

# run integration tests
yarn test:integration

# run all tests and watch for changes
yarn test:watch

# open nyc test coverage reports
yarn coverage
```

## Validate

```bash
# run lint and tests
yarn validate
```

## Logs

```bash
# show logs in production
pm2 logs
```

## Documentation

```bash
# generate and open api documentation
yarn docs
```

## Docker

```bash
# run container locally
yarn docker:dev
or
docker-compose -f docker-compose.yml -f docker-compose.dev.yml up

# run container in production
yarn docker:prod
or
docker-compose -f docker-compose.yml -f docker-compose.prod.yml up

# run tests
yarn docker:test
or
docker-compose -f docker-compose.yml -f docker-compose.test.yml up
```

## Deploy

Set your server ip:

```bash
DEPLOY_SERVER=127.0.0.1
```

Replace my Docker username with yours:

```bash
nano deploy.sh
```

Run deploy script:

```bash
yarn deploy
or
sh ./deploy.sh
```

## Tutorials

- [Create API Documentation Using Squarespace](https://selfaware.blog/home/2018/6/23/api-documentation)

## Inspirations

- [KunalKapadia/express-mongoose-es6-rest-api](https://github.com/KunalKapadia/express-mongoose-es6-rest-api)
- [diegohaz/rest](https://github.com/diegohaz/rest)

## License

[MIT License](README.md) - [Daniel Sousa](https://github.com/danielfsousa)
