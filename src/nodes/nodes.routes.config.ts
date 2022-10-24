import {Application, Request, Response, NextFunction} from 'express';
import {CommonRoutesConfig} from '../common/common.routes.config';
import {NODES, USERS} from '../common/common.routes.consts';
import {RedisController} from '../redis.controller';

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
        console.log('[INFO] Request /users/userId/nodes - POST');

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
      .patch(async (req: Request, res: Response) => {
        const updatedNode = await this.redisController.nodeKeepAlive(
          req.params.nodeId,
          req.body.setup
        );
        res
          .status(200)
          .send('Updated the following entity: "' + updatedNode + '"');
      });

    return this.app;
  }
}
