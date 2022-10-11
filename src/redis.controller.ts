import {KintoNode, KintoNodeSchema} from './kintoNode.entity';
import {Client, Repository} from 'redis-om';

const DEFAULT_REDIS_CLIENT_URL = 'redis://default:redispw@localhost:49154';

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
  public async getAssociatedNodes(walletAddress: string): Promise<KintoNode[]> {
    console.log(
      '[DEBUG] redis controller - getAssociatedNodes:',
      walletAddress
    );

    try {
      return await this.kintoNodesRepository.search().return.all();
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
    contributedSpace: number
  ): Promise<string> {
    console.log('[DEBUG] redis controller - associateNode:', walletAddress);
    return await this.kintoNodesRepository.createAndSave({
      wallet: walletAddress,
      createdDate: new Date(),
      latestUpdateDate: new Date(),
      contributedSpace: contributedSpace,
    });
  }

  /**
   * getNodeById
   */
  public async getNodeById(nodeId: string): Promise<KintoNode> {
    console.log('[DEBUG] redis controller - getNodeById:', nodeId);
    return await this.kintoNodesRepository.fetch(nodeId);
  }

  /**
   * getNodeByWallet
   */
  public async getNodesByWallet(walletId: string): Promise<KintoNode[]> {
    console.log('[DEBUG] redis controller - getNodeById:', walletId);
    return await this.kintoNodesRepository
      .search()
      .where('wallet')
      .eq(walletId)
      .return.all();
  }

  /**
   * removeNode
   */
  public async removeNode(nodeId: string): Promise<void> {
    console.log('[DEBUG] redis controller - removeNode:', nodeId);
    await this.kintoNodesRepository.remove(nodeId);
  }
}
