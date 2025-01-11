"use client"

import { ActionIcon, Button, Card, Group, Menu, Modal, Text, Title } from "@mantine/core";
import { IconPlus, IconMinus, IconDots, IconTrash } from "@tabler/icons-react";
import { useDebouncedCallback, useDisclosure } from "@mantine/hooks";
import { Player } from "@prisma/client";
import { useCallback, useState } from "react";
import { toast } from "react-toastify";
import { socket } from "@/app/socket";
import ScoreCard from "./scoreCard";
import { SetScore } from "../actions";

interface Props {
  player: Player;
  onDelete: (player: Player) => void;
}

function PlayerCard({ player, onDelete: handleDelete }: Props) {
  const [opened, { open, close }] = useDisclosure(false);
  const [modifier, setModifier] = useState(0);

  const setScore = useCallback(async (score: number) => {
    console.log("setScore()");
    const result = await SetScore(player.id, score);

    if (result?.error) {
      toast.error(result.error);
      return;
    }

    socket.emit("message", "Player modified");
  }, [player.id]);

  const debouncedSetScore = useDebouncedCallback(setScore, 500);

  const handleChange = useCallback((amount: number) => {
    console.log("handleChange()");
    setModifier(amount);
    debouncedSetScore(player.score + amount);
  }, [player.score, setModifier, debouncedSetScore]);


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
            <ActionIcon onClick={() => handleChange(modifier - 1)}><IconMinus /></ActionIcon>
            <Button variant="transparent" onClick={open}>
              <Group gap={5}>
                <Title size={"xl"}>{player.score}</Title>
                {modifier !== 0 && <Text variant="gradient">{(modifier > 0 ? "+" : "") + modifier.toString()}</Text>}
              </Group>
            </Button>
            <ActionIcon onClick={() => handleChange(modifier + 1)}><IconPlus /></ActionIcon>
          </Group>
        </Card.Section>
      </Card>
      <Modal opened={opened} withCloseButton onClose={close} title={"Edit " + player.name + "'s Score"}>
        <ScoreCard player={player} onChange={(amount) => {
          setScore(player.score + amount);
          close();
        }
        } />
      </Modal>
    </>
  );
};

export default PlayerCard;
