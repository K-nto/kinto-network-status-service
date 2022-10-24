import {Entity, Schema} from 'redis-om';
export class KintoNode extends Entity {}

export const KintoNodeSchema = new Schema(KintoNode, {
  entityId: {type: 'string'},
  wallet: {type: 'string'},
  alias: {type: 'string'}, // DK how to make it optional
  createdDate: {type: 'date'},
  latestUpdateDate: {type: 'date'},
  contributedSpace: {type: 'number'}, // I assume it's in GB
  userAvailableSpace: {type: 'number'}, // GB - not the free space in the node. The space that the node gives the user
  confidence: {type: 'number'},
  status: {type: 'string'}, // connected / disconnected / deleted
});

export interface KintoNodeInterface {
  entityId: string;
  wallet: string;
  alias?: string;
  createdDate: Date;
  latestUpdateDate?: Date;
  contributedSpace: number; // GB
  userAvailableSpace: number; // GB - not the free space in the node. The space that the node gives the user
  confidence?: number;
  status?: string;
  // connection info ? IP ? DNS ? any domain name?
}
