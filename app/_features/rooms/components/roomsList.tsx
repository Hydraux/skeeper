"use client"

import AppHeader from "@/app/_components/appHeader";
import { AppShell, Modal, Stack } from "@mantine/core";
import RoomCard from "./roomCard";
import { Room } from "@prisma/client";
import { useDisclosure } from "@mantine/hooks";
import { v4 as uuidv4 } from 'uuid';
import { socket } from "@/app/socket";
import { useCallback, useEffect, useOptimistic, useTransition } from "react";
import { CreateRoom, OnMessage, RemoveRoom } from "../actions";
import { RoomsReducerAction } from "../types";
import { toast } from "react-toastify";
import RoomForm from "./roomForm";
import { useRouter } from "next/navigation";

interface Props {
  rooms: Room[]
}

export default function RoomsList({ rooms }: Props) {
  const [opened, { open, close }] = useDisclosure(false);
  const router = useRouter();

  const [_, startTransition] = useTransition(); // eslint-disable-line @typescript-eslint/no-unused-vars

  const [optimisticRooms, modifyOptimisticRooms] = useOptimistic(rooms, (state, action: RoomsReducerAction) => {
    switch (action.type) {
      case "Add":
        return [...state, action.payload]
      case "Remove":
        return state.filter(room => room.id !== action.payload.id)
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

  const handleCreate = useCallback(async (formData: FormData) => {
    const name = formData.get("name");
    if (!name) throw new Error("Invalid form data");
    const room: Room = {
      id: uuidv4(),
      name: name.toString(),
    }
    modifyOptimisticRooms({ type: "Add", payload: room });
    const result = await CreateRoom(room);

    if (result?.error) {
      toast.error(result.error);
      return false;
    }
    socket.emit("message", "Room added");
    close();
    router.push(`${room.id}`);
    return true;
  }, [modifyOptimisticRooms, close, router]);

  const handleDelete = useCallback(async (room: Room) => {
    modifyOptimisticRooms({ type: "Remove", payload: room });
    const result = await RemoveRoom(room);

    if (result?.error) {
      toast.error(result.error);
      return;
    }
    socket.emit("message", "Room removed");
    return;
  }, [modifyOptimisticRooms]);

  return (
    <>
      <AppShell.Header>
        <AppHeader title="Skeeper" open={open}>
          <Modal opened={opened} withCloseButton onClose={close} title="Create Room">
            <RoomForm onSubmit={handleCreate} />
          </Modal>
        </AppHeader>
      </AppShell.Header>
      <AppShell.Main>
        <Stack gap={10}>
          {optimisticRooms.map(room =>
            <RoomCard key={room.id} room={room} onDelete={room => startTransition(() => handleDelete(room))} />
          )}
        </Stack>
      </AppShell.Main>
    </>
  );
}
