# Member page
This repository contains:
 - Frontend for members.dsek.se
 - Backend for api.dsek.se
 - File server for files.dsek.se

## Prerequisites
- Install Docker
- Install nodejs (version 16) and npm (development only)
- (recommended) Visual studio code for typescript and the eslint extension (development only)

## Installation
Run the following command to setup everything (UNIX-based systems):
```bash
./dev.sh
```
If you want to learn more about what this does under the hood, you can check out our [build details](build-details.md)

### Testing
To run tests locally you have to run the `/backend/setup_test_db.sh` bash script to setup the test db.

### Database setup
First time using pg Admin you need to connect it to the database. To do this add a new server with the following options:
Name: (Can be whatever)
Username (POSTGRES_USER from .env)
Password (POSTGRES_PASSWORD from .env)
Host: host.docker.internal
Port: 5432

### Generating a new service
To generate a new service run the following command:
```bash
cd tools/cli
npm install #If you have not done this before
npm run generate -- <serviceName> #Where <serviceName> is replaced with desired name
```

Note: \<serviceName> cannot be the same name as an existing service.

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
