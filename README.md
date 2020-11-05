# Member page
This repository contains the frontend and backend for the webpage you will reach when going to xxx.dsek.se.

## Prerequisites
- Docker
- `.env` file in backend
- nodejs and npm (development only)
- (recommended) Visual studio code for typescript (development only)

### Example .env
```
MYSQL_ROOT_PASSWORD=password
MYSQL_USER=user
MYSQL_PASSWORD=password
MYSQL_DATABASE=dsek
MYSQL_HOST=database
MYSQL_VERSION=8.0
```

## Deployment
Run the following command for the backend:
```bash
> cd backend
> docker-compose --env-file .env -f docker-compose.yml -f docker-compose.prod.yml up -d --build
```

TODO: frontend and full-stack

## Development
For development of the frontend run:
```bash
cd frontend
npm install #If you have not done this before
npm start
```

For development of the backend run:
```bash
cd backend/shared
npm install #If you have not done this before
npm run dev
```
and (i a seperate console):
```bash
> cd backend
> docker-compose --env-file .env -f docker-compose.yml -f docker-compose.dev.yml up -d --build
```

Note: Hot reload is enabled for the backend but you need to rebuild a container if a new package is added with npm.

For end to end development run all of the above.

## Commit messages

The commit messages in this project should follow this standard:

tag(issue number): Short description

Long description

    tag: What type of change it is, e.g. feature, refactor, bugfix.
        feature: new functionallity
        bugfix: fixes erroneous functionallity
        refactor: no functionallity change but nicer looking code
        config: changes to config files
        build: changes to build files, process etc.
        misc: other changes, e.g. README
    issue number: Which issue it relates to. Must begin with a hashtag.
    Short description: Should not be longer than 70 characters. Should be written in imperative mood.
    Long description: OPTIONAL, if a longer description is needed write in whatever format you want.

Example

feature(#4): Add a contribution description
