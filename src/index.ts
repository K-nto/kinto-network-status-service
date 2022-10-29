import express from 'express';
import * as http from 'http';
import cors from 'cors';
import debug from 'debug';
import * as cron from 'node-cron';
import {CommonRoutesConfig} from './common/common.routes.config';
import {NodesRoutes} from './nodes/nodes.routes.config';
import {NodeScoreService} from './services/NodeScore.service';

const app: express.Application = express();
const server: http.Server = http.createServer(app);
const port = process.env.PORT || 3001;

// eslint-disable-next-line @typescript-eslint/no-var-requires
require('dotenv').config();

//Starts service api
app.use(express.json());
app.use(cors());

//Create routes
const routes: Array<CommonRoutesConfig> = [];
routes.push(new NodesRoutes(app));

//Sets default endpoint
const runningMessage = `Server running at ${
  process.env.SERVICE_URL ?? 'http://localhost'
}:${port}`;
app.get('/', (req: express.Request, res: express.Response) => {
  res.status(200).send('Healthcheck: OK!');
});
const debugLog: debug.IDebugger = debug('app');

const nodeScoreService = new NodeScoreService();

server.listen(port, () => {
  routes.forEach((route: CommonRoutesConfig) => {
    debugLog(`Routes configured for ${route.getName()}`);
  });
  console.log(runningMessage);
});

//Every minute checks and calculates node confidence score
cron.schedule('* * * * *', async () =>
  nodeScoreService.calculateConfidenceScore()
);

export default app;
