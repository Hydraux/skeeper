"use client"

import { Button, Card, Group, Stack, Text, Title } from "@mantine/core";

export default function RoomCard() {
    return (
        <Card>
            <Card.Section inheritPadding pt={10} pb={10}>
                <Group justify="space-between">
                    <Stack gap={0}>
                    <Title size={"lg"}>Game 1</Title>
                    <Text>0/5</Text>
                    </Stack>
                    <Button>Join</Button>
                </Group>
            </Card.Section>
        </Card>
    );
}
