"use client"

import { ActionIcon, Button, Card, Group, Menu, Modal, Title } from "@mantine/core";
import { IconPlus, IconMinus, IconDots , IconTrash } from "@tabler/icons-react";
import { useDisclosure } from "@mantine/hooks";
import ScoreCard from "./scoreCard";
import { Player } from "@prisma/client";
import { useOptimistic, useTransition } from "react";
import { DecrementScore, IncrementScore } from "../actions";
import { toast } from "react-toastify";
import { socket } from "@/app/socket";

interface Props {
    player: Player;
    onDelete: (player: Player) => void;
}

function PlayerCard({player, onDelete: handleDelete}: Props) {
    const [_, startTransition] = useTransition(); // eslint-disable-line @typescript-eslint/no-unused-vars
    const [opened, { open, close }] = useDisclosure(false);
    const [optimisticPlayer, updateOptimisticPlayer] = useOptimistic(player, (state, newPlayer: Player)=>{
        return newPlayer;
    });

    const handleIncrement = async (amount: number) => {
       updateOptimisticPlayer({...optimisticPlayer, score: optimisticPlayer.score + amount});
        const result = await IncrementScore(player, amount);

        if(result?.error){
            toast.error(result.error);
            return;
        }

        socket.emit("message", "Player modified");
    }

    const handleDecrement = async (amount: number) => {
       updateOptimisticPlayer({...optimisticPlayer, score: optimisticPlayer.score - amount});
        const result = await DecrementScore(player, amount);

        if(result?.error){
            toast.error(result.error);
            return;
        }
        socket.emit("message", "Player modified");
    }



    return (
        <>
            <Card>
                <Card.Section inheritPadding py={"sm"}>
                    <Group justify="space-between">
                    <Title size={"lg"}>
                        {optimisticPlayer.name}
                    </Title>
                    <Menu withinPortal>
                        <Menu.Target>
                            <ActionIcon variant="transparent" color="grey">
                                <IconDots/>
                            </ActionIcon>
                        </Menu.Target>
                        <Menu.Dropdown>
                            <Menu.Item leftSection={<IconTrash/>} onClick={()=>handleDelete(player)}>
                                Delete
                            </Menu.Item>
                        </Menu.Dropdown>
                    </Menu>
                    </Group>
                </Card.Section>
                <Card.Section inheritPadding pb={"sm"}>
                    <Group justify="space-between">
                        <ActionIcon onClick={() => startTransition(()=>handleDecrement(1))}><IconMinus /></ActionIcon>
                        <Button variant="transparent" onClick={open}>
                            <Title size={"xl"}>{optimisticPlayer.score}</Title>
                        </Button>
                        <ActionIcon onClick={() => startTransition(()=>handleIncrement(1))}><IconPlus /></ActionIcon>
                    </Group>
                </Card.Section>
            </Card>
            <Modal opened={opened} withCloseButton onClose={close} title={"Edit " + optimisticPlayer.name + "'s Score"}>
                <ScoreCard player={optimisticPlayer} onIncrement={amount => startTransition(()=>handleIncrement(amount))} onDecrement={amount => startTransition(()=> handleDecrement(amount))} />
            </Modal>
        </>
    );
};

export default PlayerCard;
