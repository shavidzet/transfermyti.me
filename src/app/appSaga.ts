import { SagaIterator } from "@redux-saga/types";
import { push } from "connected-react-router";
import * as R from "ramda";
import { put, select, takeEvery } from "redux-saga/effects";
import { getIfDev } from "~/utils";
import {
  flushAllEntities,
  updatePushAllChangesFetchStatus,
} from "~/allEntities/allEntitiesActions";
import {
  toolNameByMappingSelector,
  totalIncludedRecordsCountSelector,
} from "~/allEntities/allEntitiesSelectors";
import { currentPathSelector } from "~/app/appSelectors";
import { updateValidationFetchStatus } from "~/credentials/credentialsActions";
import { credentialsByMappingSelector } from "~/credentials/credentialsSelectors";
import { sourceWorkspacesSelector } from "~/workspaces/workspacesSelectors";
import { FetchStatus, RoutePath, ToolName } from "~/typeDefs";

export function* appSaga(): SagaIterator {
  yield takeEvery("@@router/LOCATION_CHANGE", respondToRouteChangesSaga);
}

/**
 * This saga listens for route changes and redirects the user to the
 * appropriate route path if certain conditions aren't met. Details for each
 * condition are documented within the saga.
 */
function* respondToRouteChangesSaga(): SagaIterator {
  const currentPath = yield select(currentPathSelector);
  if (
    [RoutePath.PickToolAction, RoutePath.ToolActionSuccess].includes(
      currentPath,
    )
  ) {
    yield put(flushAllEntities());
  }

  if (currentPath !== RoutePath.EnterApiKeys) {
    yield put(updateValidationFetchStatus(FetchStatus.Pending));
  }

  if (currentPath !== RoutePath.PerformToolAction) {
    yield put(updatePushAllChangesFetchStatus(FetchStatus.Pending));
  }

  // Disable the redirect for development. I originally had it turned on, but
  // I found myself disabling it more often than not:
  if (getIfDev()) {
    return;
  }

  /**
   * Returns true if the step associated with the _current_ path is after the
   * step associated with the stepPath.
   */
  const isPathPastStep = (stepPath: RoutePath): boolean => {
    const routePathValues = Object.values(RoutePath);
    const currentStepNumber = routePathValues.indexOf(currentPath);
    return currentStepNumber > routePathValues.indexOf(stepPath);
  };

  switch (true) {
    // If the user is currently on a step after the transfer mapping selection
    // step and both transfer mappings in state are "none", go back to the
    // transfer mapping selection to ensure the user picks a valid option:
    case isPathPastStep(RoutePath.PickToolAction):
      const mapping = yield select(toolNameByMappingSelector);
      if (Object.values(mapping).every(mapping => mapping === ToolName.None)) {
        yield put(push(RoutePath.PickToolAction));
      }
      break;

    // If the user is currently on a step after the API key entry step and
    // the credentials in state are missing, go back to the API key entry step:
    case isPathPastStep(RoutePath.EnterApiKeys):
      const credentials = yield select(credentialsByMappingSelector);
      if (
        [
          credentials.source.apiKey,
          credentials.source.email,
          credentials.source.userId,
          credentials.target.apiKey,
          credentials.target.email,
          credentials.target.userId,
        ].some(value => R.isNil(value))
      ) {
        yield put(push(RoutePath.EnterApiKeys));
      }
      break;

    // If the user is currently on a step after the step to select Workspace
    // inclusions, but no workspaces are present in state, go back to the
    // Workspace selection step:
    case isPathPastStep(RoutePath.SelectWorkspaces):
      const sourceWorkspaces = yield select(sourceWorkspacesSelector);
      if (sourceWorkspaces.length === 0) {
        yield put(push(RoutePath.SelectWorkspaces));
      }
      break;

    case isPathPastStep(RoutePath.SelectInclusions):
      const totalIncludedCount = yield select(
        totalIncludedRecordsCountSelector,
      );
      if (totalIncludedCount === 0) {
        yield put(push(RoutePath.SelectInclusions));
      }
      break;

    default:
      break;
  }
}
