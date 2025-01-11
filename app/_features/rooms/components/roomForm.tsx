import SubmitButton from "@/app/_components/submitButton";
import { Stack, TextInput } from "@mantine/core";
import { useFocusTrap } from "@mantine/hooks";

interface Props {
  onSubmit: (formData: FormData) => void;
}

export default function RoomForm({ onSubmit: handleSubmit }: Props) {
  const focusTrapRef = useFocusTrap();
  return (
    <form action={handleSubmit} ref={focusTrapRef}>
      <Stack>
        <TextInput data-autofocus required label="Name" name="name" />
        <TextInput required label="Number of Players" name="numPlayers" type="number" />
        <SubmitButton />
      </Stack>
    </form>
  );
}
