import { CompoundClientModel } from "~/clients/clientsTypes";
import {
  BaseCompoundEntityModel,
  TogglTotalCurrencyModel,
} from "~/commonTypes";
import {
  ClockifyProjectModel,
  CompoundProjectModel,
} from "~/projects/projectsTypes";
import { CompoundTagModel } from "~/tags/tagsTypes";
import { CompoundTaskModel } from "~/tasks/tasksTypes";
import { ClockifyUserModel, CompoundUserModel } from "~/users/usersTypes";
import { CompoundWorkspaceModel } from "~/workspaces/workspacesTypes";

export interface ClockifyTimeIntervalModel {
  duration: string;
  end: string;
  start: string;
}

export interface ClockifyTimeEntryModel {
  id: string;
  description: string;
  tags: Array<string> | null;
  user: ClockifyUserModel;
  billable: boolean;
  task: unknown;
  project: ClockifyProjectModel;
  timeInterval: ClockifyTimeIntervalModel;
  workspaceId: string;
  totalBillable: string | null;
  hourlyRate: string | null;
  isLocked: boolean;
  projectId: string;
}

export interface TogglTimeEntryModel {
  id: number;
  pid: number;
  tid: number | null;
  uid: number;
  description: string;
  start: string;
  end: string;
  updated: string;
  dur: number;
  user: string;
  use_stop: boolean;
  client: string;
  project: string;
  project_color: string;
  project_hex_color: string;
  task: string | null; // Name of task
  billable: number | null;
  is_billable: boolean;
  cur: string | null;
  tags: Array<string>;
}

export interface TogglTimeEntriesFetchResponseModel {
  total_grand: number;
  total_billable: number | null;
  total_currencies: Array<TogglTotalCurrencyModel>;
  total_count: number;
  per_page: number;
  data: Array<TogglTimeEntryModel>;
}

export interface CompoundTimeEntryModel extends BaseCompoundEntityModel {
  id: string;
  description: string;
  projectId: string;
  taskId: string | null;
  userId: string | null;
  userGroupIds: Array<string> | null;
  clientName: string | null;
  clientId?: string | null;
  isBillable: boolean;
  start: Date | null;
  end: Date | null;
  year: number;
  tagNames: Array<string>;
  isActive: boolean;
  name: null; // Not used, included because other entities have a "name".
}

export interface DetailedTimeEntryModel extends CompoundTimeEntryModel {
  client: CompoundClientModel | null;
  project: CompoundProjectModel | null;
  task: CompoundTaskModel | null;
  tags: Array<CompoundTagModel>;
  user: CompoundUserModel | null;
  workspace: CompoundWorkspaceModel;
}

export type TimeEntryForTool = ClockifyTimeEntryModel | TogglTimeEntryModel;