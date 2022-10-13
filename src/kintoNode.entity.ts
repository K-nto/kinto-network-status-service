import {Entity, Schema} from 'redis-om';
export class KintoNode extends Entity {}

export const KintoNodeSchema = new Schema(KintoNode, {
  wallet: {type: 'string'},
  alias: {type: 'string'}, // DK how to make it optional
  createdDate: {type: 'date'},
  latestUpdateDate: {type: 'date'},
  contributedSpace: {type: 'number'}, // I assume it's in GB
  availableSpaceForUser: {type: 'number'}, // GB - not the free space in the node. The space that the node gives the user
  confidence: {type: 'number'},
});

export interface KintoNodeInterface {
  wallet: string;
  alias?: string;
  createdDate: Date;
  latestUpdateDate: Date;
  contributedSpace: number; // GB
  availableSpaceForUser: number; // GB - not the free space in the node. The space that the node gives the user
  confidence: number;
  // connection info ? IP ? DNS ? any domain name?
}
