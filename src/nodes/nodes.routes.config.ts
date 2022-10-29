import {Application, Request, Response, NextFunction} from 'express';
import {CommonRoutesConfig} from '../common/common.routes.config';
import {NODES, USERS} from '../common/common.routes.consts';
import {KintoNodePostRequest} from '../kintoNode.entity';
import {RedisController} from '../redis.controller';
import logger from 'node-color-log';

export class NodesRoutes extends CommonRoutesConfig {
  private redisController: RedisController;

  constructor(app: Application) {
    super(app, 'NodesRoutes');
    this.redisController = new RedisController();
  }
  configureRoutes() {
    this.app
      .route(`/${USERS}/:userId/${NODES}/`)
      .all((req: Request, res: Response, next: NextFunction) => {
        // Middleware executed on every route. @TODO: Validation @TODO: Authentication @TODO: Hyperledger (some)
        next();
      })
      .get(async (req: Request, res: Response) => {
        const nodeList = await this.redisController.getNodesByWallet(
          req.params.userId
        );
        res.status(200).send(nodeList);
      })
      .post(async (req: Request, res: Response) => {
        logger.info('Request /users/userId/nodes - POST');

        if (!req.body.storage)
          res.status(500).send('Missing storage amount on body').end();
        const createdNode = await this.redisController.associateNode(
          req.params.userId,
          req.body.storage,
          req.body.alias
        );

        res.status(201).send(createdNode).end();
      });

    this.app
      .route(`/${USERS}/:userId/${NODES}/:nodeId`)
      .all((req: Request, res: Response, next: NextFunction) => {
        // Middleware executed on every route. @TODO: Validation @TODO: Authentication @TODO: Hyperledger (some)
        next();
      })
      .get(async (req: Request, res: Response) => {
        const node = await this.redisController.getNodeById(req.params.nodeId);
        res.status(200).send(node);
      })
      .delete(async (req: Request, res: Response) => {
        const node = await this.redisController.removeNode(req.params.nodeId);
        res.status(200).send(node);
      })
      .post(async (req: Request, res: Response) => {
        const updatedNode = await this.redisController.updateNode(
          req.params.nodeId,
          <KintoNodePostRequest>req.body
        );
        res.status(200).send(`Updated node ID: ${updatedNode}`);
      })
      .patch(async (req: Request, res: Response) => {
        const updatedNode = await this.redisController.nodeKeepAlive(
          req.params.nodeId,
          req.body.setup
        );
        res.status(200).send('Keep alive received for"' + updatedNode + '"');
      });

    this.app
      .route(`/${USERS}/:userId/networkConfiguration`)
      .all((req: Request, res: Response, next: NextFunction) => {
        // Middleware executed on every route. @TODO: Validation @TODO: Authentication @TODO: Hyperledger (some)
        next();
      })
      .get(async (req: Request, res: Response) => {
        const networkConfiguration = {
          repo: process.env.IPFS_REPO ?? 'ipfs',
          config: {
            Addresses: {
              Swarm: process.env.IPFS_SWARM,
              API: process.env.IPFS_API,
              Gateway: process.env.IPFS_GATEWAY,
              RPC: process.env.IPFS_RPC,
            },
            Bootstrap: [],
          },
        };
        res.status(200).send(networkConfiguration);
      });
    return this.app;
  }
}
