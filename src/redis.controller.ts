import {
  KintoNode,
  KintoNodeInterface,
  KintoNodePostRequest,
  KintoNodeSchema,
  NodeStates,
} from './kintoNode.entity';
import {Client, Repository} from 'redis-om';
import logger from 'node-color-log';

const REDIS_CLIENT_URL =
  process.env.REDIS_CLIENT_URL ?? 'redis://default:redispw@localhost:6379';

export class RedisController {
  private client: Client;
  private kintoNodesRepository: Repository<any>;

  constructor() {
    this.client = new Client();
    this.client.open(REDIS_CLIENT_URL);
    this.kintoNodesRepository = this.client.fetchRepository(KintoNodeSchema);
    this.kintoNodesRepository.createIndex();
  }

  /**
   * @name allNodes
   * @description get list of all nodes associated by kinto
   */
  public async allNodes(): Promise<KintoNodeInterface[]> {
    logger.debug(' redis controller - allNodes:');

    try {
      const kintoNodeModelList: KintoNode[] = await this.kintoNodesRepository
        .search()
        .return.all();
      return kintoNodeModelList.map(
        (kintoNode: KintoNode) => <KintoNodeInterface>kintoNode.toJSON()
      );
    } catch (error) {
      logger.warn('redis controller - allNodes:', error);
      return [];
    }
  }

  /**
   * @name associateNode
   * @description associates a new node into kinto
   * @param (walletAddress) wallet to register node under
   * @param (contributedSpace) by such node
   * @param (alias) node alias
   */
  public async associateNode(
    walletAddress: string,
    contributedSpace: number,
    alias?: string
  ): Promise<KintoNodeInterface> {
    logger.debug('redis controller - associateNode:', walletAddress);
    const kintoNodeModel: KintoNode =
      await this.kintoNodesRepository.createAndSave({
        wallet: walletAddress,
        alias: alias ?? '', // I don't think this is OK
        createdDate: new Date(),
        latestUpdateDate: new Date(),
        contributedSpace: contributedSpace,
        userAvailableSpace: contributedSpace / 4,
        status: NodeStates.CONNECTING,
        confidence: 0,
      });
    return <KintoNodeInterface>kintoNodeModel.toJSON();
  }

  /**
   * @name getNodeById
   * @description gets associated node by id
   * @param (nodeId) id of the associated node
   */
  public async getNodeById(nodeId: string): Promise<KintoNodeInterface> {
    logger.debug(' redis controller - getNodeById:', nodeId);
    const kintoNodeModel: KintoNode = await this.kintoNodesRepository.fetch(
      nodeId
    );
    return <KintoNodeInterface>kintoNodeModel.toJSON();
  }

  /**
   * @name getNodesByWallet
   * @description gets associated node by wallet
   * @param (wallet) wallet of the associated node
   */
  public async getNodesByWallet(
    walletId: string
  ): Promise<KintoNodeInterface[]> {
    logger.debug(' redis controller - getNodeById:', walletId);
    const kintoNodeModelList: KintoNode[] = await this.kintoNodesRepository
      .search()
      .where('wallet')
      .eq(walletId)
      .return.all();
    return kintoNodeModelList.map(
      (kintoNode: KintoNode) => <KintoNodeInterface>kintoNode.toJSON()
    );
  }

  /**
   * @name removeNode
   * @description removes associated node by id
   * @param (nodeId) id of the associated node
   */
  public async removeNode(nodeId: string): Promise<void> {
    logger.debug(' redis controller - removeNode:', nodeId);
    await this.kintoNodesRepository.remove(nodeId);
  }

  /**
   * @name nodeKeepAlive
   * @description removes associated node by id
   * @param (nodeId) id of the associated node
   * @param (firstConnection) boolean if it is the first connection of the node
   */
  public async nodeKeepAlive(
    nodeId: string,
    firstConnection = false
  ): Promise<string> {
    logger.debug(' redis controller - nodeKeepAlive:', nodeId);
    const entity: KintoNode = await this.kintoNodesRepository.fetch(nodeId);
    const node = <KintoNodeInterface>entity.toJSON();
    node.status = NodeStates.CONNECTED;
    node.latestUpdateDate = new Date();
    if (firstConnection) node.confidence = 100;
    return await this.saveNode(node);
  }

  /**
   * @name updateNode
   * @description updates node by node id
   * @param (nodeId) id of the associated node
   * @param (updatedProperties)
   */
  public async updateNode(
    nodeId: string,
    updatedProperties: KintoNodePostRequest
  ): Promise<string> {
    logger.debug('redis controller - updateNode:', nodeId);
    const entity: KintoNode = await this.kintoNodesRepository.fetch(nodeId);
    const node = <KintoNodeInterface>entity.toJSON();
    return await this.saveNode({...node, ...updatedProperties});
  }

  /**
   * @name storeNode
   * @description saves node updated info
   * @param (node) kinto node
   */
  public async saveNode(node: KintoNodeInterface) {
    logger.debug('redis controller - saveNode:', node.entityId);
    return await this.kintoNodesRepository.save(
      new KintoNode(KintoNodeSchema, node.entityId, {...node})
    );
  }
}
