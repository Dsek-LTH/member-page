import { FormControl, InputLabel, TextField } from "@mui/material"


export default function TicketForm(){

                
                
  return(
        <FormControl>
            <TextField required id="Name" label="Name" variant="outlined"/>
            <TextField required id="Mail" label="Mail" variant="outlined"/>
        </FormControl>
        )
}