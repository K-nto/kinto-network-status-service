import express from 'express';
import * as http from 'http';
import cors from 'cors';

const app: express.Application = express();
const server: http.Server = http.createServer(app);
const port = process.env.PORT || 3001;
/*
require('dotenv').config();

app.use(express.json());
app.use(cors());

const runningMessage = `Server running at http://localhost:${port}`;
app.get('/', (req: express.Request, res: express.Response) => {
  res.status(200).send('Healthcheck: OK!');
});

server.listen(port, (error?: any) => {
  if (error) {
    return console.error(error);
  }
  console.log(runningMessage);
});
*/

import {RedisController} from './redis.controller';

const abc = async () => {
  const redisController = new RedisController();

  const walletAdress = 'KRIPEIN_WALLET';

  //const node = await redisController.associateNode(walletAdress, 110);
  //console.log('Associate node', node);

  const listOfNodes = await redisController.getAssociatedNodes(walletAdress);
  console.log('getAsscoatedNodes', listOfNodes);

  const getNodeById = await redisController.getNodeById(
    '01GF4W7DT64F2JCRW20YZC146J'
  );
  console.log('getNodeById', getNodeById);

  const getNodesByWallet = await redisController.getNodesByWallet(walletAdress);
  console.log('getNodesByWallet', getNodesByWallet);
};
abc();

export default app;
