"use client"

import { Button, Grid, Group, Space, Stack, Text, Title } from "@mantine/core";
import { Player } from "@prisma/client";
import { IconBackspace } from "@tabler/icons-react";
import { useMemo, useState } from "react";

interface Props {
    player: Player;
    onChange: (value: number) => void;
}

export default function ScoreCard({ player, onChange }: Props) {
    const [modifier, setModifier] = useState("");

    const handleIncrement = (amount: number) => {
        setModifier(prev => !isNaN(parseInt(prev)) ? (parseInt(prev) + amount).toString() : amount.toString());
    }

    const handleDecrement = (amount: number) => {
        setModifier(prev => !isNaN(parseInt(prev)) ? (parseInt(prev) - amount).toString() : (amount * -1).toString());
    }

    const handleSave = () => {
        onChange(parseInt(modifier));
        setModifier("0");
    }

    const deltaScore = useMemo(() => {
        let str = modifier.toString();
        if (parseInt(modifier) >= 0)
            str = "+ " + str;
        return str;
    }, [modifier]);

    return (
        <Stack>
            <Group>
                <Title size={"lg"}>{"Score: " + player.score}</Title>
                {parseInt(modifier) !== 0 && <Text variant="gradient">{deltaScore}</Text>}
            </Group>
            <Grid gutter={10}>
                <Grid.Col span={4}>
                    <Stack>
                        <Button onClick={() => handleIncrement(1)}>+1</Button>
                        <Button onClick={() => handleDecrement(1)}>-1</Button>
                    </Stack>
                </Grid.Col>
                <Grid.Col span={4}>
                    <Stack>
                        <Button onClick={() => handleIncrement(5)}>+5</Button>
                        <Button onClick={() => handleDecrement(5)}>-5</Button>
                    </Stack>
                </Grid.Col>
                <Grid.Col span={4}>
                    <Stack>
                        <Button onClick={() => handleIncrement(10)}>+10</Button>
                        <Button onClick={() => handleDecrement(10)}>-10</Button>
                    </Stack>
                </Grid.Col>
            </Grid>
            <Space/>
            <Grid>
                <Grid.Col span={4}>
                    <Stack>
                        <Button onClick={() => setModifier(prev=>prev+"7")}>7</Button>
                        <Button onClick={() => setModifier(prev=>prev+"4")}>4</Button>
                        <Button onClick={() => setModifier(prev=>prev+"1")}>1</Button>
                    </Stack>
                </Grid.Col>
                <Grid.Col span={4}>
                    <Stack>
                        <Button onClick={() => setModifier(prev=>prev+"8")}>8</Button>
                        <Button onClick={() => setModifier(prev=>prev+"5")}>5</Button>
                        <Button onClick={() => setModifier(prev=>prev+"2")}>2</Button>
                    </Stack>
                </Grid.Col>
                <Grid.Col span={4}>
                    <Stack>
                        <Button onClick={() => setModifier(prev=>prev+"9")}>9</Button>
                        <Button onClick={() => setModifier(prev=>prev+"6")}>6</Button>
                        <Button onClick={() => setModifier(prev=>prev+"3")}>3</Button>
                    </Stack>
                </Grid.Col>
            </Grid>
            <Grid>
                <Grid.Col span={4}>
                    <Stack>
                        <Button disabled={modifier.length === 0} onClick={() => setModifier(prev=>(parseInt(prev) * -1).toString())}>{parseInt(modifier) >=0 ? "-" : "+"}</Button>
                    </Stack>
                </Grid.Col>
                <Grid.Col span={4}>
                    <Stack>
                        <Button disabled={modifier.length === 0} onClick={() => setModifier(prev=>prev.length > 0 ? prev+"0": prev)}>0</Button>
                    </Stack>
                </Grid.Col>
                <Grid.Col span={4}>
                    <Stack>
                        <Button disabled={modifier.length === 0} onClick={() => setModifier(prev=>(prev.length-1 === 0 || (prev.length-1 === 1 && prev[0] === "-")) ? "" :  prev.substring(0,prev.length-1))}><IconBackspace /></Button>
                    </Stack>
                </Grid.Col>
            </Grid>
                        <Button onClick={() => handleSave()}>Save</Button>
        </Stack>
    );
}
