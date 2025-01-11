import { Room } from "@prisma/client";

export type ReducerActionType =
  | "Add"
  | "Update"
  | "Remove"

export type RoomsReducerAction = {
  type: ReducerActionType;
  payload: Room;
};
