import {NodeStates} from '../kintoNode.entity';
import {RedisController} from '../redis.controller';

const CONFIDENCE_SCORE_SERVICE = '[CONFIDENCE SCORE SERVICE]';
const MIN_IN_MS = 1000 * 60;
const HOUR_IN_MS = 1000 * 60 * 60;
const DAY_IN_MS = 1000 * 60 * 60 * 24;

export class NodeScoreService {
  private redisController: RedisController;
  constructor() {
    this.redisController = new RedisController();
  }

  public async calculateConfidenceScore() {
    console.debug(
      `${CONFIDENCE_SCORE_SERVICE} Start calculating confidence score`
    );
    const allNodes = await this.redisController.allNodes();
    if (allNodes.length === 0) {
      console.debug(
        `${CONFIDENCE_SCORE_SERVICE} No nodes registered. Ending job.`
      );
      return;
    }
    const now = new Date();
    let updatedNodesCount = 0,
      deletedNodesCount = 0,
      skippedNodes = 0;
    allNodes.forEach(async node => {
      const differenceInMs = node.latestUpdateDate
        ? now.getTime() - node.latestUpdateDate?.getTime()
        : now.getTime() - node.createdDate.getTime();
      if (node.status === NodeStates.DISCONNECTED) {
        if (differenceInMs > DAY_IN_MS * 3) {
          // latest update more than 72hs ago, delete the node.
          this.redisController.removeNode(node.entityId);
          deletedNodesCount++;
          return;
        } else if (differenceInMs > DAY_IN_MS) {
          // More dan a day disconnected, reset confidence score
          node.confidence = 0;
        }

        // don't even update disconnected nodes
        else {
          skippedNodes++;
          return;
        }
      } else if (node.status === NodeStates.CONNECTED) {
        if (differenceInMs <= MIN_IN_MS) {
          // If last update happened less than a minute ago, add 1 confidence
          node.confidence = node.confidence
            ? Math.min(100, node.confidence + 1)
            : 100;
        } else if (differenceInMs > MIN_IN_MS && differenceInMs < HOUR_IN_MS) {
          // if last update happened more than a minute ago but within the last hour, reduce 1 confidence
          node.confidence = node.confidence
            ? Math.max(node.confidence - 1, 0)
            : 100;
        } else {
          // automatically disconnect any node that has send no updates for > 1hr
          node.status = NodeStates.DISCONNECTED;
        }
      }
      updatedNodesCount++;
      await this.redisController.saveNode(node);
      return;
    });
    console.debug(
      `${CONFIDENCE_SCORE_SERVICE} Confidence Scores updated on ${allNodes.length}: Updated: ${updatedNodesCount}; Skipped: ${skippedNodes}; Deleted: ${deletedNodesCount}`
    );
  }
}
