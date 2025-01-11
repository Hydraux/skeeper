import prisma from "@/lib/prisma";
import RoomsList from "./_features/rooms/components/roomsList";

export default async function RoomsPage() {
  const rooms = await prisma.room.findMany();

  return (
    <RoomsList rooms={rooms} />
  );
}
