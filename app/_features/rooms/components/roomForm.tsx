import SubmitButton from "@/app/_components/submitButton";
import { TextInput } from "@mantine/core";

export default function RoomForm(){
    return(
        <form>
            <TextInput required label="Name" name="name"/>
            <TextInput required label="Number of Players" name="numPlayers" type="number"/>
            <SubmitButton/>
        </form>
    );
}
