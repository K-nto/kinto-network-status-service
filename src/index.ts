import express from 'express';
import * as http from 'http';
import cors from 'cors';
import debug from 'debug';
import {CommonRoutesConfig} from './common/common.routes.config';
import {NodesRoutes} from './nodes/nodes.routes.config';

const app: express.Application = express();
const server: http.Server = http.createServer(app);
const port = process.env.PORT || 3001;

// eslint-disable-next-line @typescript-eslint/no-var-requires
require('dotenv').config();

app.use(express.json());
app.use(cors());

const routes: Array<CommonRoutesConfig> = [];
routes.push(new NodesRoutes(app));

const runningMessage = `Server running at http://localhost:${port}`;
app.get('/', (req: express.Request, res: express.Response) => {
  res.status(200).send('Healthcheck: OK!');
});

const debugLog: debug.IDebugger = debug('app');
server.listen(port, () => {
  routes.forEach((route: CommonRoutesConfig) => {
    debugLog(`Routes configured for ${route.getName()}`);
  });
  console.log(runningMessage);
});

/*
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
*/
export default app;
