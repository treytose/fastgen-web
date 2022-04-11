import { useContext, useState, useRef } from 'react'
import type { NextPage } from 'next'

import { Container, Grid, Paper, Button, TextField, Box } from '@mui/material';

import SettingsContext from '../store/SettingsContext';
import ThemeSelection from '../components/ThemeSelect';

const Home: NextPage = () => {
  const settingsCtx = useContext(SettingsContext);

  return (
    <Container sx={{"width": "100%", "height": "100vh", "padding": "5rem 7rem", "textAlign": "center", "backgroundColor": "background.default", color: "white"}}>
        <Grid container spacing={2}>
          <Grid item xs={8}>
            <Paper sx={{padding: '3rem'}}>
              <Button variant="contained"> Button </Button>              
            </Paper>
          </Grid>
          <Grid item xs={4}>
           <ThemeSelection/>
          </Grid>
        </Grid>       
    </Container> 
  )
}

export default Home
