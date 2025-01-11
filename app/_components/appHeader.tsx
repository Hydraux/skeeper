import { ActionIcon, Group, Title } from "@mantine/core";
import { IconArrowLeft, IconPlus } from "@tabler/icons-react";
import Link from "next/link";
import { PropsWithChildren } from "react";

interface Props {
  title: string;
  withBackButton?: boolean;
  open: () => void;
}

export default function AppHeader({ title, open, withBackButton = false, children }: PropsWithChildren<Props>) {

  return (
    <>
      <Group justify="space-between" px={10}>
        {withBackButton && <ActionIcon variant="subtle" component={Link} href={"/"}>{<IconArrowLeft />}</ActionIcon>}
        <Title>{title}</Title>
        <ActionIcon onClick={open}><IconPlus /></ActionIcon>
        {children}
      </Group>
    </>
  );
}
