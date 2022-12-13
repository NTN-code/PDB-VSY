import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import axios from "axios";
import {Alert, AlertTitle, Snackbar} from "@mui/material";
import {useState} from "react";

function Copyright(props) {
  return (
    <Typography variant="body2" color="text.secondary" align="center" {...props}>
      {'Copyright © '}
      <Link color="inherit" href="http://localhost:3000/">
        Your Website
      </Link>{' '}
      {new Date().getFullYear()}
      {'.'}
    </Typography>
  );
}

const theme = createTheme();

export default function SignUp() {
    const [error, setError] = useState(false);

  const handleSubmit = (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    axios.post('http://localhost:8000/register', {
        name: data.get("name"),
        surname: data.get("surname"),
        email: data.get("email"),
        country: data.get("country"),
        city: data.get("city"),
        address: data.get("address"),
        phone: data.get("phone"),
        password: data.get("password")
    })
    .then(function (response) {
        console.log(response);
        if(response.status === 201){
            window.location.href = "http://localhost:3000/login"
        }
        else{
            setError(true)
        }
    })
    .catch(function (error) {
        console.log(error);
        setError(true);
    });
  };

  return (
    <ThemeProvider theme={theme}>
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Box
          sx={{
            marginTop: 8,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Sign up
          </Typography>
          <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 3 }}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  autoComplete="given-name"
                  name="name"
                  required
                  fullWidth
                  id="name"
                  label="Name"
                  autoFocus
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  fullWidth
                  id="surname"
                  label="Surname"
                  name="surname"
                  autoComplete="family-name"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  id="email"
                  label="Email Address"
                  name="email"
                  autoComplete="email"
                />
              </Grid>
                <Grid item xs={6}>
                    <TextField
                        required
                        fullWidth
                        id="country"
                        label="Country"
                        name="country"
                    />
                </Grid>
                <Grid item xs={6}>
                    <TextField
                        required
                        fullWidth
                        id="city"
                        label="City"
                        name="city"
                    />
                </Grid>
                <Grid item xs={12}>
                    <TextField
                        required
                        fullWidth
                        id="address"
                        label="Address"
                        name="address"
                    />
                </Grid>
                <Grid item xs={12}>
                <TextField
                    required
                    fullWidth
                    id="phone"
                    label="Phone"
                    name="phone"
                />
                </Grid>


              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  name="password"
                  label="Password"
                  type="password"
                  id="password"
                  autoComplete="new-password"
                />
              </Grid>
            </Grid>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Sign Up
            </Button>
            <Grid container justifyContent="flex-end">
              <Grid item>
                <Link href="/login" variant="body2">
                  Already have an account? Sign in
                </Link>
              </Grid>
            </Grid>
          </Box>
        </Box>
        <Copyright sx={{ mt: 5 }} />
          {error ?
          <Snackbar open={error} autoHideDuration={6000}>
              <Alert severity="error" sx={{ width: '100%' }}>
                  <AlertTitle>Error</AlertTitle>
                  Data in not valid !
              </Alert>
          </Snackbar>
          :
            <></>
          }
      </Container>
    </ThemeProvider>
  );
}
