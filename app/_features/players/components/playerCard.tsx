"use client"

import { ActionIcon, Button, Card, Group, Menu, Modal, Text, Title } from "@mantine/core";
import { IconPlus, IconMinus, IconDots, IconTrash } from "@tabler/icons-react";
import { useDebouncedValue, useDisclosure } from "@mantine/hooks";
import { Player } from "@prisma/client";
import { useMemo, useState } from "react";
import { IncrementScore } from "../actions";
import { toast } from "react-toastify";
import { socket } from "@/app/socket";
import ScoreCard from "./scoreCard";

interface Props {
    player: Player;
    onDelete: (player: Player) => void;
}

function PlayerCard({ player, onDelete: handleDelete }: Props) {
    const [opened, { open, close }] = useDisclosure(false);
    const [modifier, setModifier] = useState(0);
    const [debouncedModifier] = useDebouncedValue(modifier, 500);

    const handleChange = async (amount: number) => {
        const result = await IncrementScore(player, amount);

        if (result?.error) {
            toast.error(result.error);
            return;
        }

        socket.emit("message", "Player modified");
    }

   useMemo(async ()=>{
        if(debouncedModifier === 0)
           return;
       await handleChange(debouncedModifier);
        setModifier(0);
   },[debouncedModifier]); 


    const deltaScore = useMemo(() => {
        let str = modifier.toString();
        if (modifier >= 0)
            str = "+ " + str;
        return str;
    }, [modifier]);

    return (
        <>
            <Card>
                <Card.Section inheritPadding py={"sm"}>
                    <Group justify="space-between">
                        <Title size={"lg"}>
                            {player.name}
                        </Title>
                        <Menu withinPortal>
                            <Menu.Target>
                                <ActionIcon variant="transparent" color="grey">
                                    <IconDots />
                                </ActionIcon>
                            </Menu.Target>
                            <Menu.Dropdown>
                                <Menu.Item leftSection={<IconTrash />} onClick={() => handleDelete(player)}>
                                    Delete
                                </Menu.Item>
                            </Menu.Dropdown>
                        </Menu>
                    </Group>
                </Card.Section>
                <Card.Section inheritPadding pb={"sm"}>
                    <Group justify="space-between">
                        <ActionIcon onClick={() => setModifier(prev => prev - 1)}><IconMinus /></ActionIcon>
                        <Button variant="transparent" onClick={open}>
                            <Group gap={5}>
                                <Title size={"xl"}>{player.score}</Title>
                                {modifier !== 0 && <Text variant="gradient">{deltaScore}</Text>}
                            </Group>
                        </Button>
                        <ActionIcon onClick={() => setModifier(prev => prev + 1)}><IconPlus /></ActionIcon>
                    </Group>
                </Card.Section>
            </Card>
            <Modal opened={opened} withCloseButton onClose={close} title={"Edit " + player.name + "'s Score"}>
        <ScoreCard player={player} onChange={(amount)=> {
            handleChange(amount);
            close();
        }
        }/>
            </Modal>
        </>
    );
};

export default PlayerCard;
