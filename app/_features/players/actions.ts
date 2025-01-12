"use server"

import prisma from "@/lib/prisma";
import { Player } from "@prisma/client";
import { revalidatePath } from "next/cache";

export async function CreatePlayer(player: Player) {
  try {
    await prisma.player.create({ data: player });
  } catch (error: any) { // eslint-disable-line @typescript-eslint/no-explicit-any
    return { error: error.message || "Failed to create player" }
  } finally {
    revalidatePath("/");
  }
}

export async function RemovePlayer(player: Player) {
  try {
    await prisma.player.delete({ where: { id: player.id } });
  } catch (error: any) { // eslint-disable-line @typescript-eslint/no-explicit-any
    return { error: error.message || "Failed to delete player" }
  } finally {
    revalidatePath("/");
  }
}

export async function ResetScore() {
  try {
    await prisma.player.updateMany({ data: { score: 0 } })
  } catch (error: any) { // eslint-disable-line @typescript-eslint/no-explicit-any
    return { error: error.message || "Failed to reset player scores" }
  } finally {
    revalidatePath("/");
  }
}

export async function SetScore(playerId: string, score: number) {
  try {
    await prisma.player.update({ where: { id: playerId }, data: { score: score } })
  } catch (error: any) { // eslint-disable-line @typescript-eslint/no-explicit-any
    return { error: error.message || "Failed to set player score" }
  } finally {
    revalidatePath("/");
  }
}

export async function OnMessage() {
  revalidatePath("/");
}
