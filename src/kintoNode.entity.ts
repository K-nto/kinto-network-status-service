import {Entity, Schema} from 'redis-om';
export class KintoNode extends Entity {}

export const KintoNodeSchema = new Schema(KintoNode, {
  wallet: {type: 'string'},
  createdDate: {type: 'date'},
  latestUpdateDate: {type: 'date'},
  contributedSpace: {type: 'number'},
});

export interface KintoNodeInterface {
  wallet: string;
  createdDate: Date;
  latestUpdateDate: Date;
  contributedSpace: number;
}
