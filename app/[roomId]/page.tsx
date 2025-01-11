import prisma from "@/lib/prisma";
import PlayersPage from "../_features/players/components/playersList";
import { redirect } from "next/navigation";

interface Props {
  params: Promise<{ roomId: string }>;
}

export default async function RoomPage({ params }: Props) {
  const roomId = (await params).roomId;
  const room = await prisma.room.findUnique({ where: { id: roomId } });

  if (!room) {
    redirect("/");
  }

  const players = await prisma.player.findMany({ where: { roomId: roomId } });

  return (
    <PlayersPage players={players} roomId={room.id} roomName={room.name} />
  );
}
