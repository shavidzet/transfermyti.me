import { createAsyncAction, createStandardAction } from "typesafe-actions";
import { batchClockifyTransferRequests } from "~/redux/utils";
import {
  apiCreateClockifyClient,
  apiFetchClockifyClients,
  apiFetchTogglClients,
} from "~/redux/entities/api/clients";
import { showFetchErrorNotification } from "~/redux/app/appActions";
import { selectClientsTransferPayloadForWorkspace } from "./clientsSelectors";
import {
  ClockifyClientModel,
  EntitiesFetchPayloadModel,
  EntityGroup,
  ReduxDispatch,
  ReduxGetState,
  TogglClientModel,
} from "~/types";

export const clockifyClientsFetch = createAsyncAction(
  "@clients/CLOCKIFY_FETCH_REQUEST",
  "@clients/CLOCKIFY_FETCH_SUCCESS",
  "@clients/CLOCKIFY_FETCH_FAILURE",
)<void, EntitiesFetchPayloadModel<ClockifyClientModel>, void>();

export const togglClientsFetch = createAsyncAction(
  "@clients/TOGGL_FETCH_REQUEST",
  "@clients/TOGGL_FETCH_SUCCESS",
  "@clients/TOGGL_FETCH_FAILURE",
)<void, EntitiesFetchPayloadModel<TogglClientModel>, void>();

export const clockifyClientsTransfer = createAsyncAction(
  "@clients/CLOCKIFY_TRANSFER_REQUEST",
  "@clients/CLOCKIFY_TRANSFER_SUCCESS",
  "@clients/CLOCKIFY_TRANSFER_FAILURE",
)<void, EntitiesFetchPayloadModel<ClockifyClientModel>, void>();

export const flipIsClientIncluded = createStandardAction(
  "@clients/FLIP_IS_INCLUDED",
)<string>();

export const fetchClockifyClients = (workspaceId: string) => async (
  dispatch: ReduxDispatch,
) => {
  dispatch(clockifyClientsFetch.request());

  try {
    const clients = await apiFetchClockifyClients(workspaceId);

    return dispatch(
      clockifyClientsFetch.success({ entityRecords: clients, workspaceId }),
    );
  } catch (error) {
    dispatch(showFetchErrorNotification(error));
    return dispatch(clockifyClientsFetch.failure());
  }
};

export const fetchTogglClients = (workspaceId: string) => async (
  dispatch: ReduxDispatch,
) => {
  dispatch(togglClientsFetch.request());

  try {
    const clients = await apiFetchTogglClients(workspaceId);

    return dispatch(
      togglClientsFetch.success({ entityRecords: clients, workspaceId }),
    );
  } catch (error) {
    dispatch(showFetchErrorNotification(error));
    return dispatch(togglClientsFetch.failure());
  }
};

export const transferClientsToClockify = (
  togglWorkspaceId: string,
  clockifyWorkspaceId: string,
) => async (dispatch: ReduxDispatch, getState: ReduxGetState) => {
  const state = getState();
  const clientsInWorkspace = selectClientsTransferPayloadForWorkspace(state)(
    togglWorkspaceId,
  );
  if (clientsInWorkspace.length === 0) return Promise.resolve();

  dispatch(clockifyClientsTransfer.request());

  try {
    const clients = await batchClockifyTransferRequests({
      requestsPerSecond: 4,
      dispatch,
      entityGroup: EntityGroup.Clients,
      entityRecordsInWorkspace: clientsInWorkspace,
      apiFunc: apiCreateClockifyClient,
      clockifyWorkspaceId,
      togglWorkspaceId,
    });

    return dispatch(
      clockifyClientsTransfer.success({
        entityRecords: clients,
        workspaceId: clockifyWorkspaceId,
      }),
    );
  } catch (error) {
    dispatch(showFetchErrorNotification(error));
    dispatch(clockifyClientsTransfer.failure());
  }
};
