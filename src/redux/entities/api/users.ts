import {
  AddUsersToWorkspaceRequest,
  ClockifyUser,
  TogglMeResponse,
  TogglUser,
} from '../../../types/usersTypes';
import { TogglProjectUser } from '../../../types/projectsTypes';
import { ClockifyWorkspace } from '../../../types/workspacesTypes';
import { HttpMethod } from '../../../types/commonTypes';

export const apiFetchClockifyUserDetails = (
  userId: string,
): Promise<ClockifyUser> => fetch(`/clockify/api/users/${userId}`);

export const apiFetchTogglUserDetails = (): Promise<TogglMeResponse> =>
  fetch('/toggl/api/me');

export const apiFetchClockifyUsersInProject = (
  projectId: string,
  workspaceId: string,
): Promise<ClockifyUser[]> =>
  fetch(`/clockify/api/workspaces/${workspaceId}/projects/${projectId}/users/`);

export const apiFetchTogglUsersInProject = (
  projectId: string,
): Promise<TogglProjectUser[]> =>
  fetch(`/toggl/api/projects/${projectId}/project_users`);

export const apiFetchClockifyUsersInWorkspace = (
  workspaceId: string,
): Promise<ClockifyUser[]> =>
  fetch(`/clockify/api/workspaces/${workspaceId}/users/`);

export const apiFetchTogglUsersInWorkspace = (
  workspaceId: string,
): Promise<TogglUser[]> => fetch(`/toggl/api/workspaces/${workspaceId}/users`);

export const apiAddClockifyUsersToWorkspace = (
  workspaceId: string,
  requestBody: AddUsersToWorkspaceRequest,
): Promise<ClockifyWorkspace> =>
  fetch(`/clockify/api/workspaces/${workspaceId}/users/`, {
    method: HttpMethod.Post,
    body: requestBody as any,
  });
