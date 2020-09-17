import React, { useState } from 'react';
import { Button, Grid, TextField} from '@material-ui/core';

export default function FormBuscarNoticias({ pesquisarNoticias }) {

    const [busca, setBusca] = useState();
  
    return (
        <form onSubmit={(ev) => {ev.preventDefault(); pesquisarNoticias(busca); }}>
            <Grid container alignItems="center"  spacing={1}>
                <Grid item xs={9}>
                <TextField
                    id="query"
                    name="query"
                    placeholder="Busca"
                    label="Busca"
                    variant="outlined"
                    margin="normal"
                    type="text"
                    onChange={(ev) => setBusca(ev.target.value)}
                    fullWidth />
                </Grid>
                <Grid item xs={3}>
                    <Button type="submit"  color="primary" fullWidth variant="contained" margin="normal">
                        Buscar
                    </Button>
                </Grid>
            </Grid>  
        </form>
       )
}