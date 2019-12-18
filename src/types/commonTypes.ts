/* eslint-disable @typescript-eslint/no-explicit-any */
import { Store } from "redux";
import { State } from "~/redux/rootReducer";
import { CompoundClientModel } from "./clientsTypes";
import { EntityGroup } from "./entityTypes";
import { CompoundProjectModel } from "./projectsTypes";
import { CompoundTagModel } from "./tagsTypes";
import { CompoundTaskModel } from "./tasksTypes";
import { CompoundTimeEntryModel } from "./timeEntriesTypes";
import { CompoundUserGroupModel } from "./userGroupsTypes";
import { CompoundUserModel } from "./usersTypes";
import { CompoundWorkspaceModel } from "./workspacesTypes";

export enum ToolName {
  Clockify = "clockify",
  Toggl = "toggl",
}

export interface TogglTotalCurrencyModel {
  currency: string | null;
  amount: number | null;
}

export type CompoundEntityModel =
  | CompoundClientModel
  | CompoundProjectModel
  | CompoundTagModel
  | CompoundTaskModel
  | CompoundTimeEntryModel
  | CompoundUserGroupModel
  | CompoundUserModel;

export interface ReduxStateEntryForTool<TModel> {
  readonly byId: Record<string, TModel>;
  readonly idValues: Array<string>;
}

export interface EntitiesByGroupModel {
  [EntityGroup.Clients]: ReduxStateEntryForTool<CompoundClientModel>;
  [EntityGroup.Projects]: ReduxStateEntryForTool<CompoundProjectModel>;
  [EntityGroup.Tags]: ReduxStateEntryForTool<CompoundTagModel>;
  [EntityGroup.Tasks]: ReduxStateEntryForTool<CompoundTaskModel>;
  [EntityGroup.UserGroups]: ReduxStateEntryForTool<CompoundUserGroupModel>;
  [EntityGroup.Users]: ReduxStateEntryForTool<CompoundUserModel>;
  [EntityGroup.Workspaces]: ReduxStateEntryForTool<CompoundWorkspaceModel>;
}

export enum HttpMethod {
  Post = "POST",
  Delete = "DELETE",
}

export interface EntityWithName {
  name: string;
}

export interface EntitiesFetchPayloadModel<TEntity> {
  entityRecords: Array<TEntity>;
  workspaceId: string;
}

/**
 * Redux Types
 */
export type ReduxStore = Store;
export type ReduxState = State;

export type ReduxGetState = () => ReduxState;

interface ReduxThunkDispatch {
  <TResult, TExtra>(asyncAction: ReduxThunkAction<TResult, TExtra>): TResult;
}

interface ReduxStandardDispatch {
  <TAction>(action: TAction & { type: any }): TAction & { type: any };
}
export type ReduxDispatch = ReduxStandardDispatch & ReduxThunkDispatch;

export type ReduxThunkAction<TResult, TExtra = undefined> = (
  dispatch: ReduxDispatch,
  getState: () => ReduxState,
  extraArgument?: TExtra,
) => TResult;

export interface ReduxAction<TPayload = {}> {
  type: string;
  payload?: TPayload;
  error?: boolean;
  meta?: any;
}
