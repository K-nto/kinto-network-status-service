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
  const client = new RedisController();
  let test = await client.getAssociatedNodes('test_node');
  console.log(test);
  //await client.associateNode('test_node');
  test = await client.getAssociatedNodes('test_node');
  console.log(test);
};
abc();

export default app;
