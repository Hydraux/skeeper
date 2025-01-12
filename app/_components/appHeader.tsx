import { ActionIcon, Box, Group, Modal, Title } from "@mantine/core";
import { IconArrowLeft, IconPlus, IconQrcode, IconRefresh } from "@tabler/icons-react";
import Link from "next/link";
import { PropsWithChildren } from "react";
import { useQRCode } from 'next-qrcode';
import { useDisclosure } from "@mantine/hooks";

interface Props {
  title: string;
  withBackButton?: boolean;
  withResetButton?: boolean;
  onReset?: () => void;
  open: () => void;
  qrCodeURL?: string;
}

export default function AppHeader({ title, open, withBackButton = false, withResetButton = false, onReset, children, qrCodeURL }: PropsWithChildren<Props>) {
  const [opened, { open: openQrCode, close: closeQrCode }] = useDisclosure(false);
  const { Canvas } = useQRCode();

  if (withResetButton && !onReset) throw new Error("OnReset() is required if withResetButton is true");

  return (
    <>
      <Group px={10} align="center" gap={1}>
        {withBackButton && <Box display={"flex"} style={{ alignItems: "center" }}><ActionIcon variant="subtle" component={Link} href={"/"}>{<IconArrowLeft />}</ActionIcon></Box>}
        <Title >{title}</Title>
        <Group gap={10} justify="end" ml={"auto"}>
          {onReset && withResetButton && <ActionIcon onClick={onReset}><IconRefresh /></ActionIcon>}
          {qrCodeURL && <ActionIcon onClick={openQrCode}><IconQrcode /></ActionIcon>}
          <ActionIcon onClick={open}><IconPlus /></ActionIcon>
        </Group>
        {children}
      </Group >
      {qrCodeURL && <Modal opened={opened} withCloseButton={false} onClose={closeQrCode} centered size={"auto"} radius={20}>
        <Box display={"flex"} style={{ justifyContent: "center", overflow: "hidden", borderRadius: 10 }}>
          <Canvas text={qrCodeURL} />
        </Box>
      </Modal>
      }
    </>
  );
}
