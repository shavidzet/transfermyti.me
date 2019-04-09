import { getType } from 'typesafe-actions';
import { combineActions, handleActions } from 'redux-actions';
import {
  appendEntryCountToState,
  findIdFieldValue,
  normalizeState,
  flipEntityInclusion,
} from '~/redux/utils';
import { togglTimeEntriesFetch } from '~/redux/entities/timeEntries/timeEntriesActions';
import * as clientsActions from './clientsActions';
import { ClientModel, ClockifyClient, TogglClient } from '~/types/clientsTypes';
import {
  ReduxAction,
  ReduxStateEntryForTool,
  ToolName,
} from '~/types/commonTypes';
import { EntityGroup, EntityType } from '~/types/entityTypes';
import { TogglTimeEntry } from '~/types/timeEntriesTypes';

export interface ClientsState {
  readonly clockify: ReduxStateEntryForTool<ClientModel>;
  readonly toggl: ReduxStateEntryForTool<ClientModel>;
  readonly isFetching: boolean;
}

export const initialState: ClientsState = {
  clockify: {
    byId: {},
    idValues: [],
  },
  toggl: {
    byId: {},
    idValues: [],
  },
  isFetching: false,
};

const schemaProcessStrategy = (
  value: ClockifyClient | TogglClient,
): ClientModel => ({
  id: value.id.toString(),
  name: value.name,
  workspaceId: findIdFieldValue(value, EntityType.Workspace),
  linkedId: null,
  isIncluded: true,
  entryCount: 0,
});

export default handleActions(
  {
    [combineActions(
      getType(clientsActions.clockifyClientsFetch.success),
      getType(clientsActions.clockifyClientsTransfer.success),
    )]: (
      state: ClientsState,
      { payload: clients }: ReduxAction<Array<ClockifyClient>>,
    ): ClientsState =>
      normalizeState(
        ToolName.Clockify,
        EntityGroup.Clients,
        state,
        clients,
        schemaProcessStrategy,
      ),

    [getType(clientsActions.togglClientsFetch.success)]: (
      state: ClientsState,
      { payload: clients }: ReduxAction<Array<TogglClient>>,
    ): ClientsState =>
      normalizeState(
        ToolName.Toggl,
        EntityGroup.Clients,
        state,
        clients,
        schemaProcessStrategy,
      ),

    [combineActions(
      getType(clientsActions.clockifyClientsFetch.request),
      getType(clientsActions.clockifyClientsTransfer.request),
      getType(clientsActions.togglClientsFetch.request),
    )]: (state: ClientsState): ClientsState => ({
      ...state,
      isFetching: true,
    }),

    [combineActions(
      getType(clientsActions.clockifyClientsFetch.success),
      getType(clientsActions.clockifyClientsFetch.failure),
      getType(clientsActions.clockifyClientsTransfer.success),
      getType(clientsActions.clockifyClientsTransfer.failure),
      getType(clientsActions.togglClientsFetch.success),
      getType(clientsActions.togglClientsFetch.failure),
    )]: (state: ClientsState): ClientsState => ({
      ...state,
      isFetching: false,
    }),

    [getType(clientsActions.flipIsClientIncluded)]: (
      state: ClientsState,
      { payload: clientId }: ReduxAction<string>,
    ): ClientsState => flipEntityInclusion(state, EntityType.Client, clientId),

    [getType(togglTimeEntriesFetch.success)]: (
      state: ClientsState,
      { payload: timeEntries }: ReduxAction<Array<TogglTimeEntry>>,
    ) =>
      appendEntryCountToState(
        EntityType.Client,
        ToolName.Toggl,
        state,
        timeEntries,
      ),
  },
  initialState,
);
