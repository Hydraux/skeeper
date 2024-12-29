import prisma from "@/lib/prisma";
import PlayersPage from "./_features/players/components/playersList";

export default async function HomePage(){
    const players = await prisma.player.findMany();

    console.log(players);

    return(
        <PlayersPage players={players}/>
    );
}
