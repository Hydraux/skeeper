"use server"

import prisma from "@/lib/prisma";
import { Room } from "@prisma/client";
import { revalidatePath } from "next/cache";

export async function CreateRoom(room: Room) {
  try {
    await prisma.room.create({ data: room });
  } catch (error: any) { // eslint-disable-line @typescript-eslint/no-explicit-any
    return { error: error.message || "Failed to create room" }
  } finally {
    revalidatePath("/");
  }
}

export async function RemoveRoom(room: Room) {
  try {
    const deletePlayers = prisma.player.deleteMany({ where: { roomId: room.id } });
    const deleteRoom = prisma.room.delete({ where: { id: room.id } });
    await prisma.$transaction([deletePlayers, deleteRoom]);
  } catch (error: any) { // eslint-disable-line @typescript-eslint/no-explicit-any
    console.log(error);
    return { error: error.message || "Failed to delete room" }
  } finally {
    revalidatePath("/");
  }
}

export async function OnMessage() {
  revalidatePath("/");
}
