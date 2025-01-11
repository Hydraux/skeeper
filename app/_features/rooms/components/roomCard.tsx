"use client"

import { ActionIcon, Card, Group, Menu, Text, Title } from "@mantine/core";
import { Room } from "@prisma/client";
import { IconDots, IconTrash } from "@tabler/icons-react";
import Link from "next/link";

interface Props {
  room: Room
  onDelete: (room: Room) => void;
}

export default function RoomCard({ room, onDelete: handleDelete }: Props) {
  return (
    <Card component={Link} href={`/${room.id}`}>
      <Card.Section inheritPadding py={"sm"}>
        <Group justify="space-between">
          <Title size={"lg"}>{room.name}</Title>
          <Menu withinPortal>
            <Menu.Target>
              <ActionIcon variant="transparent" color="grey" onClick={e => e.preventDefault()}>
                <IconDots />
              </ActionIcon>
            </Menu.Target>
            <Menu.Dropdown>
              <Menu.Item leftSection={<IconTrash />} onClick={e => { e.preventDefault(); handleDelete(room); }}>
                Delete
              </Menu.Item>
            </Menu.Dropdown>
          </Menu>
        </Group>
      </Card.Section>
      <Card.Section inheritPadding pb={"sm"}>
        <Group justify="space-between">
          <Text>0/5</Text>
        </Group>
      </Card.Section>
    </Card>
  );
}
