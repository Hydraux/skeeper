"use client"

import { Player } from "@prisma/client";
import PlayerCard from "./playerCard";
import { useEffect, useOptimistic, useTransition } from "react";
import { AppShell, Stack } from "@mantine/core";
import AppHeader from "@/app/_components/appHeader";
import { v4 as uuidv4 } from 'uuid';
import { CreatePlayer, OnMessage, RemovePlayer } from "../actions";
import { toast } from "react-toastify";
import { socket } from "@/app/socket";
import { PlayersReducerAction} from "../types";

interface Props {
    players: Player[]
}

export default function PlayersPage({ players }: Props) {
    const [_, startTransition] = useTransition(); // eslint-disable-line @typescript-eslint/no-unused-vars
    const [optimisticPlayers, modifyOptimisticPlayers] = useOptimistic(players, (state, action: PlayersReducerAction) => {
        switch(action.type){
            case "Add":
                return [...state, action.payload]
            case "Remove":
                return state.filter(player => player.id !== action.payload.id)
            default:
                return state;
        }
    });

    useEffect(() => {
        if (socket.connected) {
            onConnect();
        }

        function onConnect() {
        }

        function onDisconnect() {
        }

        function onMessage() {
            OnMessage();

        }

        socket.on("connect", onConnect);
        socket.on("disconnect", onDisconnect);
        socket.on("message", onMessage);

        return () => {
            socket.off("connect", onConnect);
            socket.off("disconnect", onDisconnect);
        };
    }, []);

    const handleCreate = async (formData: FormData) => {
        const name = formData.get("name");
        if (!name) throw new Error("Invalid form data");
        const player: Player = {
            id: uuidv4(),
            dateCreated: new Date(Date.now()),
            name: name.toString(),
            score: 0,
        }
        modifyOptimisticPlayers({type: "Add", payload: player});
        const result = await CreatePlayer(player);

        if (result?.error) {
            toast.error(result.error);
            return false;
        }
        socket.emit("message", "Player added");
        return true;
    }

    const handleDelete = async (player: Player) => {
        modifyOptimisticPlayers({type: "Remove", payload: player});
        const result = await RemovePlayer(player);

        if (result?.error) {
            toast.error(result.error);
            return;
        }
        socket.emit("message", "Player removed");
        return;
    } 

    return (
        <>
            <AppShell.Header>
                <AppHeader onCreate={handleCreate} />
            </AppShell.Header>
            <AppShell.Main>
                <Stack gap={10}>
                    {optimisticPlayers.sort((a, b) => a.dateCreated.getTime() - b.dateCreated.getTime()).map(player =>
                        <PlayerCard key={player.id} player={player} onDelete={player => startTransition(()=>handleDelete(player))}/>
                    )}
                </Stack>
            </AppShell.Main>
        </>
    );
}
