# Member page
This repository contains the frontend and backend for the webpage you will reach when going to xxx.dsek.se.

## Deployment
TODO

## Development
For development of the frontend run:
```bash
cd frontend
npm install #If you have not done this before
npm start
```

For development of the backend run:
```bash
cd backend
npm install #If you have not done this before
npm run services
```
and (i a seperate console):
```bash
cd backend
npm install #If you have not done this before
npm run gateway
```

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
