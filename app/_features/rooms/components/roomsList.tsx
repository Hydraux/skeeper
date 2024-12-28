"use client"

import AppHeader from "@/app/_components/appHeader";
import { AppShell, Stack } from "@mantine/core";
import RoomCard from "./roomCard";

export default function RoomsList() {
    const handleCreate = () => { }
    return (
        <>
            <AppShell.Header>
                <AppHeader title="Skeeper" onCreate={handleCreate} />
            </AppShell.Header>
            <AppShell.Main>
                <Stack gap={10}>
                    <RoomCard />
                </Stack>
            </AppShell.Main>
        </>
    );
}
