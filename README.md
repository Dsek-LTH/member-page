<a name="readme-top"></a>

<!-- PROJECT SHIELDS -->

[![Version][version-shield]][version-shield]
[![Forks][forks-shield]][forks-url]
[![Stargazers][stars-shield]][stars-url]
[![Contributors][contributors-shield]][contributors-url]
[![Issues][issues-shield]][issues-url]
[![License][license-shield]][license-url]

<!-- PROJECT LOGO -->
<br />
<div align="center">
  <a href="https://github.com/Dsek-LTH/member-page">
    <img src="https://www.dsek.se/favicon/D-favicon-196.png" alt="Logo" width="80" height="80">
  </a>

<h3 align="center">Member page</h3>

  <p align="center">
    The member page for the D-guild
    <br />
    <a href="https://www.dsek.se/"><strong>dsek.se</strong></a>
    <br />
    <br />
    <a href="https://github.com/Dsek-LTH/member-page/issues/new/choose">Report Bug</a>
    ·
    <a href="https://github.com/Dsek-LTH/member-page/issues/new/choose">Request Feature</a>
  </p>
</div>

<!-- ABOUT -->

## About

This repo contains code for both the frontend and the backend for the member page.

### Frontend

[![Typescript][typescript]][typescript-url]
[![Apollo Client][apolloclient]][apolloclient-url]
[![Next][next.js]][next-url]
[![MUI][mui]][mui-url]

### Backend

[![Typescript][typescript]][typescript-url]
[![Apollo Server][apolloserver]][apolloserver-url]
[![Knex.js][knex.js]][knex-url]
[![PostgresSQL][postgres]][postgres-url]

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- GETTING STARTED -->

## Getting Started

To get a local copy up and running follow these simple steps.

### Prerequisites

You need to have the following installed:

- Docker: install Docker by following the instructions on [https://docs.docker.com/get-docker/](https://docs.docker.com/get-docker/).
- Node: install Node by following the instructions on [https://nodejs.org/en/download/](https://nodejs.org/en/download/).

### Installation

1. Clone the repo
   ```sh
   git clone https://github.com/Dsek-LTH/member-page.git
   ```
2. Setup ([learn more](https://github.com/Dsek-LTH/member-page/blob/main/build-details.md)) both the frontend and the backend
   ```sh
   ./dev.sh
   ```
3. Once started the frontend should be available on [http://localhost:3000](http://localhost:3000) and the backend on [http://localhost:4000](http://localhost:4000).

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- USAGE EXAMPLES -->

## Development

### Frontend

Running the frontend in development mode also watches the backend for changes and generates types automatically. This means that the backend should be running when developing the frontend.

### Backend

- Database: pgAdmin is used as a database GUI. It is available on [http://localhost:5050](http://localhost:5050).

```
Name: whatever you want
Host: host.docker.internal
Port: 5432
Username: POSTGRES_USER (from .env)
Password: POSTGRES_PASSWORD (from .env)
```

- Testing: To run tests locally you have to run the `backend/setup_test_db.sh` bash script to setup the test db. Then you can run the tests with the command `npm run test` in the `backend` folder.

- Migration: To create a new migration run the command `npm run migrate:make <migration_name>` in the `backend` folder. This generates a new migration file at `backend/migrations/<datetime_migration_name>`. To run the migrations run the command `npm run dev:migrate` in the `backend` folder, and you cann rollback the migrations with the command `npm run migrate:rollback`.

- Seeding: To seed the database run the command `npm run seed` in the `backend` folder. This will seed the database with the data in `backend/seeds/data.ts`.

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- CONTRIBUTING -->

## Contributing

Any contributions you make are **greatly appreciated**. If you have a suggestion, please fork the repo and create a pull request. You can also simply open an issue using the links at the top.

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- LICENSE -->

## License

Distributed under the EUPL License. See `LICENSE` for more information.

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- CONTACT -->

## Contact

Head of DWWW - dwww@dsek.se

Project Link: [https://github.com/Dsek-LTH/member-page](https://github.com/Dsek-LTH/member-page)

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- MARKDOWN LINKS & IMAGES -->
<!-- https://www.markdownguide.org/basic-syntax/#reference-style-links -->

[contributors-shield]: https://img.shields.io/github/contributors/Dsek-LTH/member-page.svg?style=for-the-badge
[contributors-url]: https://github.com/Dsek-LTH/member-page/graphs/contributors
[forks-shield]: https://img.shields.io/github/forks/Dsek-LTH/member-page.svg?style=for-the-badge
[forks-url]: https://github.com/Dsek-LTH/member-page/network/members
[stars-shield]: https://img.shields.io/github/stars/Dsek-LTH/member-page.svg?style=for-the-badge
[stars-url]: https://github.com/Dsek-LTH/member-page/stargazers
[issues-shield]: https://img.shields.io/github/issues/Dsek-LTH/member-page.svg?style=for-the-badge
[issues-url]: https://github.com/Dsek-LTH/member-page/issues
[license-shield]: https://img.shields.io/github/license/Dsek-LTH/member-page.svg?style=for-the-badge
[license-url]: https://github.com/Dsek-LTH/member-page/blob/master/LICENSE
[version-shield]: https://img.shields.io/github/v/release/Dsek-LTH/member-page?style=for-the-badge
[product-screenshot]: images/screenshot.png
[typescript]: https://img.shields.io/badge/typescript-3178C6?style=for-the-badge&logo=typescript&logoColor=white
[typescript-url]: https://www.typescriptlang.org/
[next.js]: https://img.shields.io/badge/next.js-000000?style=for-the-badge&logo=nextdotjs&logoColor=white
[next-url]: https://nextjs.org/
[mui]: https://img.shields.io/badge/mui-007FFF?style=for-the-badge&logo=mui&logoColor=white
[mui-url]: https://mui.com/
[apolloclient]: https://img.shields.io/badge/apollo%20client-311C87?style=for-the-badge&logo=apollographql&logoColor=white
[apolloclient-url]: https://www.apollographql.com/apollo-client/
[apolloserver]: https://img.shields.io/badge/apollo%20server-311C87?style=for-the-badge&logo=apollographql&logoColor=white
[apolloserver-url]: https://www.apollographql.com/apollo-server/
[postgres]: https://img.shields.io/badge/postgres-4169E1?style=for-the-badge&logo=postgresql&logoColor=white
[postgres-url]: https://www.postgresql.org/
[knex.js]: https://img.shields.io/badge/knex.js-E1550F?style=for-the-badge&logo=data:image/png;base64,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&logoColor=white
[knex-url]: https://knexjs.org/
