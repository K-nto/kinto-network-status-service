<div align="center">

  <img src="resources/Kintoisologo.png" alt="logo" width="200" height="auto" />
  <h1>Kinto network status service</h1>
  
  <h5>
    UADE Informatics Engineering thesis project - 2022   
  </h5>

  <p>
    Kinto network service, handles nodes and node related operations. 
  </p>
   
<h4>
    <a href="https://github.com/K-nto/Kinto-node/">Documentation</a>
  <span> · </span>
    <a href="https://github.com/K-nto/Kinto-node/issues/">Report Bug</a>
  <span> · </span>
    <a href="https://github.com/K-nto/Kinto-node/issues/">Request Feature</a>
  </h4>
</div>

<br />

# :notebook_with_decorative_cover: Table of Contents

- [About the Project](#star2-about-the-project)
  - [Tech Stack](#space_invader-tech-stack)
  - [Features](#dart-features)
- [Setup](#Setup)
  - [Prerequisites](#bangbang-prerequisites)
- [Usage](#eyes-usage)
- [License](#warning-license)
- [Contact](#handshake-contact)
- [Acknowledgements](#gem-acknowledgements)

## :star2: About the Project

This service manages nodes conections, registers nodes, calculates healthchecks and updates on the peers network.

### :space_invader: Tech Stack

  <ul>
    <li><a href="https://nodejs.org/">Node</a></li>
    <li><a href="https://redis.io/">Redis</a></li>
    <li><a href="https://www.typescriptlang.org/">Typescript</a></li>
  </ul>

### :dart: Features

- Registers and conect nodes
- Maintains registry of node confidence values
- Alows users to manage their nodes through Kinto Front End UI

## :toolbox: Setup

### :bangbang: Prerequisites

- **Node** This project uses node and npm as package manager, make sure it is installed.

```bash
 node -v
 npm -v
```

- **Redis** This project uses redis to store nodes information
  Create a redis search local image, you can set up a local redis docker container by executing the following command

```bash
docker run -it --rm --name redis-stack -p 6379:6379 redis/redis-stack:latest
```

### :key: Environment Variables

To run this project, you will need to add the following environment variables to your .env file

`REDIS_CLIENT_URL` redis databese to store nodes information.

`PORT` where the service will listen to.

`SERVICE_URL` endpoint of your service.

Ipfs network configuration, new nodes will use to provide resources to the network.
`IPFS_REPO`
`IPFS_API`
`IPFS_GATEWAY`
`IPFS_RPC`

## :gear: Usage

Clone the project

```bash
  git clone https://github.com/K-nto/Kinto-network-status-service.git
```

Go to the project directory

```bash
  cd Kinto-network-status-service
```

Install dependencies.

```bash
  npm install
```

Start the service.

```bash
  npm run start
```

## :warning: License

Distributed under the no License. See LICENSE.txt for more information.

<!-- Contact -->

## :handshake: Contact

Federico Javier Parodi - Fedejp - [Linkedin](https://www.linkedin.com/in/fedejp) - [Github](https://github.com/Fedejp)

Carlos Santiago Yanzon - Bizk - [Linkedin](https://www.linkedin.com/in/carlos-santiago-yanzon/) - [Github](https://github.com/bizk)

Project Link: [https://github.com/K-nto](https://github.com/K-nto)

## :gem: Acknowledgements

We thank and aknowledge the authors of these resources for their work.

- [Awesome README](https://github.com/matiassingers/awesome-readme)
- [Emoji Cheat Sheet](https://github.com/ikatyang/emoji-cheat-sheet/blob/master/README.md#travel--places)
- [Readme Template](https://github.com/othneildrew/Best-README-Template)
