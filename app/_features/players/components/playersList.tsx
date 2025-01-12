"use client"

import { Player } from "@prisma/client";
import PlayerCard from "./playerCard";
import { useCallback, useEffect, useOptimistic, useTransition } from "react";
import { AppShell, Modal, Stack } from "@mantine/core";
import AppHeader from "@/app/_components/appHeader";
import { v4 as uuidv4 } from 'uuid';
import { CreatePlayer, OnMessage, RemovePlayer, ResetScore } from "../actions";
import { toast } from "react-toastify";
import { socket } from "@/app/socket";
import { PlayersReducerAction } from "../types";
import { useDisclosure } from "@mantine/hooks";
import PlayerForm from "./playerForm";

interface Props {
  players: Player[];
  roomId: string;
  roomName: string;
}

export default function PlayersPage({ players, roomId, roomName }: Props) {
  const [opened, { open, close }] = useDisclosure(false);

  const [_, startTransition] = useTransition(); // eslint-disable-line @typescript-eslint/no-unused-vars

  const [optimisticPlayers, modifyOptimisticPlayers] = useOptimistic(players, (state, action: PlayersReducerAction) => {
    switch (action.type) {
      case "Add":
        return action.payload ? [...state, action.payload] : state;
      case "Reset":
        return state.map(player => {
          player.score = 0;
          return player;
        });
      case "Remove":
        return action.payload ? state.filter(player => player.id !== action.payload?.id) : state;
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

    async function onMessage() {
      await OnMessage();

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
      roomId: roomId,
    }
    modifyOptimisticPlayers({ type: "Add", payload: player });
    const result = await CreatePlayer(player);

    if (result?.error) {
      toast.error(result.error);
      return false;
    }
    socket.emit("message", "Player added");
    close();
    return true;
  }

  const handleDelete = async (player: Player) => {
    modifyOptimisticPlayers({ type: "Remove", payload: player });
    const result = await RemovePlayer(player);

    if (result?.error) {
      toast.error(result.error);
      return;
    }
    socket.emit("message", "Player removed");
    return;
  }

  const handleReset = useCallback(async () => {
    modifyOptimisticPlayers({ type: "Reset" });
    const result = await ResetScore();

    if (result?.error) {
      toast.error(result.error);
      return;
    }
    socket.emit("message", "Player modified");
    return;

  }, [modifyOptimisticPlayers]);

  return (
    <>
      <AppShell.Header>
        <AppHeader title={roomName} open={open} withBackButton withResetButton onReset={() => startTransition(() => handleReset())} qrCodeURL={`http://hydraux-homelab.com:3000/${roomId}`} />
        <Modal opened={opened} withCloseButton onClose={close} title="Create Player">
          <PlayerForm onSubmit={handleCreate} />
        </Modal>
      </AppShell.Header>
      <AppShell.Main>
        <Stack gap={10}>
          {optimisticPlayers.sort((a, b) => a.dateCreated.getTime() - b.dateCreated.getTime()).map(player =>
            <PlayerCard key={player.id + player.score} player={player} onDelete={player => startTransition(() => handleDelete(player))} />
          )}
        </Stack>
      </AppShell.Main>
    </>
  );
}
