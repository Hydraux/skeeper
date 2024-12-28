import SubmitButton from "@/app/_components/submitButton";
import { Stack, TextInput } from "@mantine/core";
import { useFocusTrap } from "@mantine/hooks";

interface Props {
    onSubmit: (formData: FormData) => void
}

export default function PlayerForm({onSubmit: handleSubmit} : Props){
    const focusTrapRef = useFocusTrap();
    return(
        <form action={handleSubmit} ref={focusTrapRef}>
            <Stack>
            <TextInput data-autofocus label="Name" name="name" required/>
            <SubmitButton/> 
            </Stack>
        </form>
    );
}
