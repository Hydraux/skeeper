"use client"

import { ActionIcon, Group, Modal, Title } from "@mantine/core";
import { IconPlus } from "@tabler/icons-react";
import { useDisclosure } from "@mantine/hooks";
import PlayerForm from "../_features/players/components/playerForm";

interface Props {
    title: string;
    onCreate: (formData: FormData) => void
}

export default function AppHeader({title, onCreate}: Props) {
    const [opened, { open, close }] = useDisclosure(false);

    const handleSubmit = (formData: FormData) => {
        onCreate(formData);
        close();
    }

    return (
        <>
        <Group justify="space-between" px={10}>
            <Title>{title}</Title>
            <ActionIcon onClick={open}><IconPlus /></ActionIcon>
        </Group>
        <Modal opened={opened} withCloseButton onClose={close} title="Create Player">
            <PlayerForm onSubmit={handleSubmit}/>
        </Modal>
        </>
    );
}
