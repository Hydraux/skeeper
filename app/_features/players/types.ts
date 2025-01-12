import { Player } from "@prisma/client";

export type PlayerReducerType =
  | "IncrementScore"
  | "DecrementScore"
  | "EditName"

export type PlayerReducerPayload =
  | string
  | number

export type PlayerReducerAction = { type: PlayerReducerType, payload: PlayerReducerPayload };

export type ReducerActionType =
  | "Add"
  | "Update"
  | "Reset"
  | "Remove"

export type PlayersReducerAction = {
  type: ReducerActionType;
  payload?: Player;
};
