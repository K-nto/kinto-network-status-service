import {
  KintoNode,
  KintoNodeInterface,
  KintoNodePostRequest,
  KintoNodeSchema,
  NodeStates,
} from './kintoNode.entity';
import {Client, Repository} from 'redis-om';

const DEFAULT_REDIS_CLIENT_URL = 'redis://default:redispw@localhost:6379';

export class RedisController {
  private CLIENT_URL: string;
  private client: Client;
  private kintoNodesRepository: Repository<any>;

  constructor() {
    this.CLIENT_URL = process.env.REDIS_CLIENT_URL ?? DEFAULT_REDIS_CLIENT_URL;
    this.client = new Client();
    this.client.open(this.CLIENT_URL);
    this.kintoNodesRepository = this.client.fetchRepository(KintoNodeSchema);
    this.kintoNodesRepository.createIndex();
  }

  /**
   * getAssociatedNodes
   */
  public async allNodes(): Promise<KintoNodeInterface[]> {
    console.log('[DEBUG] redis controller - allNodes:');

    try {
      const kintoNodeModelList: KintoNode[] = await this.kintoNodesRepository
        .search()
        .return.all();
      return kintoNodeModelList.map(
        (kintoNode: KintoNode) => <KintoNodeInterface>kintoNode.toJSON()
      );
    } catch (error) {
      console.log('[Error] redis controller - allNodes:', error);
      return [];
    }
  }

  /**
   * associateNode
   */
  public async associateNode(
    walletAddress: string,
    contributedSpace: number,
    alias?: string
  ): Promise<KintoNodeInterface> {
    console.log('[DEBUG] redis controller - associateNode:', walletAddress);
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
   * getNodeById
   */
  public async getNodeById(nodeId: string): Promise<KintoNodeInterface> {
    console.log('[DEBUG] redis controller - getNodeById:', nodeId);
    const kintoNodeModel: KintoNode = await this.kintoNodesRepository.fetch(
      nodeId
    );
    return <KintoNodeInterface>kintoNodeModel.toJSON();
  }

  /**
   * getNodeByWallet
   */
  public async getNodesByWallet(
    walletId: string
  ): Promise<KintoNodeInterface[]> {
    console.log('[DEBUG] redis controller - getNodeById:', walletId);
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
   * removeNode
   */
  public async removeNode(nodeId: string): Promise<void> {
    console.log('[DEBUG] redis controller - removeNode:', nodeId);
    await this.kintoNodesRepository.remove(nodeId);
  }

  /**
   * updateNode
   */
  public async nodeKeepAlive(
    nodeId: string,
    firstConnection = false
  ): Promise<string> {
    console.log('[DEBUG] redis controller - nodeKeepAlive:', nodeId);
    const entity: KintoNode = await this.kintoNodesRepository.fetch(nodeId);
    const node = <KintoNodeInterface>entity.toJSON();
    node.status = NodeStates.CONNECTED;
    node.latestUpdateDate = new Date();
    if (firstConnection) node.confidence = 100;
    return await this.saveNode(node);
  }

  public async updateNode(
    nodeId: string,
    updatedProperties: KintoNodePostRequest
  ): Promise<string> {
    console.log('[DEBUG] redis controller - updateNode:', nodeId);
    const entity: KintoNode = await this.kintoNodesRepository.fetch(nodeId);
    const node = <KintoNodeInterface>entity.toJSON();
    return await this.saveNode({...node, ...updatedProperties});
  }

  public async saveNode(node: KintoNodeInterface) {
    return await this.kintoNodesRepository.save(
      new KintoNode(KintoNodeSchema, node.entityId, {...node})
    );
  }
}
