import { createSelector } from "reselect";
import * as R from "ramda";
import { activeWorkspaceIdSelector } from "~/workspaces/workspacesSelectors";
import { ReduxState, UserGroupModel } from "~/typeDefs";

export const sourceUserGroupsSelector = createSelector(
  (state: ReduxState) => state.userGroups.source,
  (userGroupsById): UserGroupModel[] =>
    Object.values(userGroupsById).filter(({ name }) => !/Admin/gi.test(name)),
);

export const includedSourceUserGroupsSelector = createSelector(
  sourceUserGroupsSelector,
  (sourceUserGroups): UserGroupModel[] =>
    sourceUserGroups.filter(sourceUserGroup => sourceUserGroup.isIncluded),
);

export const sourceUserGroupsForTransferSelector = createSelector(
  sourceUserGroupsSelector,
  (sourceUserGroups): UserGroupModel[] =>
    sourceUserGroups.filter(sourceUserGroup =>
      R.isNil(sourceUserGroup.linkedId),
    ),
);

export const sourceUserGroupsInActiveWorkspaceSelector = createSelector(
  sourceUserGroupsSelector,
  activeWorkspaceIdSelector,
  (sourceUserGroups, workspaceId): UserGroupModel[] =>
    sourceUserGroups.filter(userGroup => userGroup.workspaceId === workspaceId),
);
