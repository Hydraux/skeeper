"use client"

import { Button, Grid, Group, Stack, Text, Title } from "@mantine/core";
import { Player } from "@prisma/client";
import { useMemo, useState } from "react";

interface Props {
    player: Player;
    onChange: (value: number) => void;
}

export default function ScoreCard({ player, onChange}: Props) {
    const [modifier, setModifier] = useState(0);

    const handleIncrement = (amount: number) => {
        setModifier(prev => prev + amount);
    }

    const handleDecrement = (amount: number) => {
        setModifier(prev => prev - amount);
    }

    const handleSave = () => {
        onChange(modifier);
        setModifier(0);
    }

    const deltaScore = useMemo(()=>{
        let str = modifier.toString();
        if(modifier >= 0)
           str = "+ " + str; 
        return str;
    },[modifier]);

    return (
        <Stack>
            <Group>
            <Title size={"lg"}>{"Score: " + player.score}</Title>
        {modifier !== 0 && <Text variant="gradient">{deltaScore}</Text>}
            </Group>
            <Grid gutter={10}>
                <Grid.Col span={4}>
                    <Stack>
                        <Button onClick={()=>handleIncrement(1)}>+1</Button>
                        <Button onClick={()=>handleDecrement(1)}>-1</Button>
                    </Stack>
                </Grid.Col>
                <Grid.Col span={4}>
                    <Stack>
                        <Button onClick={()=>handleIncrement(5)}>+5</Button>
                        <Button onClick={()=>handleDecrement(5)}>-5</Button>
                    </Stack>
                </Grid.Col>
                <Grid.Col span={4}>
                    <Stack>
                        <Button onClick={()=>handleIncrement(10)}>+10</Button>
                        <Button onClick={()=>handleDecrement(10)}>-10</Button>
                    </Stack>
                </Grid.Col>
            </Grid>
            <Button onClick={()=>handleSave()}>Save</Button>
        </Stack>
    );
}
