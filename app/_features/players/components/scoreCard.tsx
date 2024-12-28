"use client"

import { Button, Grid, Stack, Title } from "@mantine/core";
import { Player } from "@prisma/client";

interface Props {
    player: Player;
    onIncrement: (value: number) => void;
    onDecrement: (value: number) => void;
}

export default function ScoreCard({ player, onIncrement, onDecrement }: Props) {
    return (
        <Stack>
            <Title size={"lg"}>{"Score: " + player.score}</Title>
            <Grid gutter={10}>
                <Grid.Col span={4}>
                    <Stack>
                        <Button onClick={()=>onIncrement(1)}>+1</Button>
                        <Button onClick={()=>onDecrement(1)}>-1</Button>
                    </Stack>
                </Grid.Col>
                <Grid.Col span={4}>
                    <Stack>
                        <Button onClick={()=>onIncrement(5)}>+5</Button>
                        <Button onClick={()=>onDecrement(5)}>-5</Button>
                    </Stack>
                </Grid.Col>
                <Grid.Col span={4}>
                    <Stack>
                        <Button onClick={()=>onIncrement(10)}>+10</Button>
                        <Button onClick={()=>onDecrement(10)}>-10</Button>
                    </Stack>
                </Grid.Col>
            </Grid>
        </Stack>
    );
}
