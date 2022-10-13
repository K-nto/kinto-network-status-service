import {
  KintoNode,
  KintoNodeInterface,
  KintoNodeSchema,
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
  public async listAssociatedNodes(
    walletAddress: string
  ): Promise<KintoNodeInterface[]> {
    console.log(
      '[DEBUG] redis controller - getAssociatedNodes:',
      walletAddress
    );

    try {
      const kintoNodeModelList: KintoNode[] = await this.kintoNodesRepository
        .search()
        .return.all();
      return kintoNodeModelList.map(
        (kintoNode: KintoNode) => <KintoNodeInterface>kintoNode.toJSON()
      );
    } catch (error) {
      console.log('[Error] redis controller - getAssociatedNodes:', error);
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
        userAvailableSpace: this.calculateUserAvailableSpace(contributedSpace),
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
  public async updateNode(nodeId: string): Promise<string> {
    console.log('[DEBUG] redis controller - updateNode:', nodeId);
    const node: any = await this.kintoNodesRepository.fetch(nodeId);
    node.latestUpdateDate = new Date();
    return await this.kintoNodesRepository.save(node);
  }

  private calculateUserAvailableSpace(storageSpace: number) {
    // TODO: define other strategies
    return storageSpace / 4;
  }
}
