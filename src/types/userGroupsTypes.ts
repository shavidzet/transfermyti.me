import { BaseCompoundEntityModel } from "./entityTypes";

export interface ClockifyUserGroupModel {
  id: string;
  name: string;
  userIds: Array<string>;
}

export interface TogglUserGroupModel {
  id: number;
  wid: number;
  name: string;
  at: string;
}

// prettier-ignore
export type CompoundUserGroupModel = ClockifyUserGroupModel & BaseCompoundEntityModel;
