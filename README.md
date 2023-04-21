# Member page

This repository contains:

- Frontend for members.dsek.se
- Backend for graphql.api.dsek.se
- File server for minio.api.dsek.se

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

## Migrations

To make changes to the database, you will have to write a migration.

Run the command

```bash
npm run migrate:make migration_name
```

to generate a new migration file at

```
backend/migrations/DATETIME_migration_name
```

When you are done writing your migration, you can execute the migration locally by running the command

(in backend)

```
npm run dev:migrate
```

You can also seed data by editing the file

```
backend/seeds/data.ts
```

Additionally you can rollback your migration with the command

```
npm run migrate:rollback
```

## Gitmoji

We use [gitmoji](https://gitmoji.dev/) for our commit messages since it provides an easy way of identifying the purpose or intention of a commit with only looking at the emojis used.

### Installation

```bash
npm i -g gitmoji-cli
```

### Usage

Initialize gitmoji as a commit hook

```
gitmoji -i
```

The next time you commit gitmoji will ask you to pick a suitable emoji.
