import cuid from "cuid";
import { createAction } from "typesafe-actions";
import { getIfDev } from "~/utils";
import { NotificationModel } from "~/typeDefs";

export const showNotification = createAction(
  "@app/SHOW_NOTIFICATION",
  (notification: Partial<NotificationModel>) => {
    return { id: cuid(), ...notification } as NotificationModel;
  },
)<NotificationModel>();

const getApiErrorMessage = (response: Response): string => {
  const { status, statusText, url } = response;
  let toolName = "";
  if (/clockify/gi.test(url)) {
    toolName = "Clockify";
  } else if (/toggl/gi.test(url)) {
    toolName = "Toggl";
  } else {
    toolName = "Unknown";
  }

  let message = `Error code ${status} when fetching from ${toolName} API.`;
  if (statusText) {
    message += `Error message: ${statusText}`;
  }

  return message;
};

export const showErrorNotification = createAction(
  "@app/SHOW_FETCH_ERROR_NOTIFICATION",
  (err: Error | Response) => {
    if (getIfDev()) {
      console.error(err);
    }

    let message = "";
    if ("ok" in err) {
      message = getApiErrorMessage(err);
    } else {
      message = err.message;
    }

    // This is a redux-saga error that should only occur during development, but
    // we're cleaning it up here (just in case):
    if (/call: argument fn is undefined or null/gi.test(message)) {
      message = "Parsing error";
    }

    return {
      id: cuid(),
      message: `The following error occurred: ${message}`,
      type: "error",
    };
  },
)<NotificationModel>();

export const dismissNotification = createAction("@app/DISMISS_NOTIFICATION")<
  string
>();

export const dismissAllNotifications = createAction(
  "@app/DISMISS_ALL_NOTIFICATIONS",
)<undefined>();
