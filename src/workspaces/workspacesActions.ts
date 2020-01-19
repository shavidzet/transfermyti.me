import { createAction, createAsyncAction } from "typesafe-actions";
import { Mapping, WorkspaceModel, WorkspacesByIdModel } from "~/typeDefs";

export const createWorkspaces = createAsyncAction(
  "@workspaces/CREATE_WORKSPACES_REQUEST",
  "@workspaces/CREATE_WORKSPACES_SUCCESS",
  "@workspaces/CREATE_WORKSPACES_FAILURE",
)<void, Record<Mapping, WorkspacesByIdModel>, void>();

export const fetchWorkspaces = createAsyncAction(
  "@workspaces/FETCH_WORKSPACES_REQUEST",
  "@workspaces/FETCH_WORKSPACES_SUCCESS",
  "@workspaces/FETCH_WORKSPACES_FAILURE",
)<void, Record<Mapping, WorkspacesByIdModel>, void>();

export const updateActiveWorkspaceId = createAction(
  "@workspaces/UPDATE_ACTIVE_WORKSPACE_ID",
)<string>();

export const appendUserIdsToWorkspace = createAction(
  "@workspaces/APPEND_USER_IDS_TO_WORKSPACE",
)<{ mapping: Mapping; workspaceId: string; userIds: string[] }>();

export const flipIsWorkspaceIncluded = createAction(
  "@workspaces/FLIP_IS_INCLUDED",
)<WorkspaceModel>();

export const resetContentsForMapping = createAction(
  "@workspaces/RESET_CONTENTS_FOR_MAPPING",
)<Mapping>();
