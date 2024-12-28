"use server"

import prisma from "@/lib/prisma";
import { Player } from "@prisma/client";
import { revalidatePath } from "next/cache";

export async function CreatePlayer(player: Player) {
    try {
        await prisma.player.create({ data: player });
    } catch (error: any) { // eslint-disable-line @typescript-eslint/no-explicit-any
        return { error: error.message || "Failed to create player"}
    } finally {
        revalidatePath("/");
    }
}

export async function RemovePlayer(player: Player) {
    try {
        await prisma.player.delete({ where: {id: player.id}});
    } catch (error: any) { // eslint-disable-line @typescript-eslint/no-explicit-any
        return { error: error.message || "Failed to delete player"}
    } finally {
        revalidatePath("/");
    }
}

export async function IncrementScore(player: Player, amount: number){
    try {
        await prisma.player.update({where: {id: player.id}, data: {score: {increment: amount}}})
    } catch (error: any) { // eslint-disable-line @typescript-eslint/no-explicit-any
        return { error: error.message || "Failed to increment player score"}
    } finally {
        revalidatePath("/");
    }
}

export async function DecrementScore(player: Player, amount: number){
    try {
        await prisma.player.update({where: {id: player.id}, data: {score: {decrement: amount}}})
    } catch (error: any) { // eslint-disable-line @typescript-eslint/no-explicit-any
        return { error: error.message || "Failed to decrement player score"}
    } finally {
        revalidatePath("/");
    }
}

export async function OnMessage(){
    revalidatePath("/");
}
