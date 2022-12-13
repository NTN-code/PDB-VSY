import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Link from '@mui/material/Link';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import axios from "axios";
import {Alert, AlertTitle, Snackbar} from "@mui/material";
import {useState} from "react";
import {appKey, isAdminKey, isAuthKey, userIdKey, userKey} from "../RecoilStatesSelectors";
import {useRecoilState} from "recoil";
import Cookies from 'js-cookie'

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

export default function SignInSide() {
  const [error, setError] = useState(false);
  const [user, setUser] = useRecoilState(userKey);
  const [appkey, setAppKey] = useRecoilState(appKey)
  const [isAuth, setIsAuth] = useRecoilState(isAuthKey)
  const [isAdmin, setIsAdmin] = useRecoilState(isAdminKey)
  const [userId, setUserId] = useRecoilState(userIdKey)




  const handleSubmit = (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    axios.post("http://localhost:8000/login", {
        email: data.get("email"),
        password: data.get("password")
    })
    .then(function (response) {
        console.log(response);
        if(response.status === 200){

            Cookies.set("userKey", JSON.stringify(response.data))
            setUser(response.data)

            Cookies.set("userKey", JSON.stringify(response.data["api_token"]))
            setAppKey(response.data["api_token"])

            Cookies.set("isAuthKey", true)
            setIsAuth(true);

            Cookies.set("isAdminKey", response.data["role"])
            setIsAdmin(response.data["role"]);

            localStorage.setItem('userIdKey', response.data['id']);
            setUserId(response.data['id']);

            window.location.href = "http://localhost:3000/"
        }
        else{
            setError(true)
        }
    })
    .catch(function (error) {
        console.log(error);
        setError(true);

    });
    console.log({
      email: data.get('email'),
      password: data.get('password'),
    });
  };

  return (
    <ThemeProvider theme={theme}>
      <Grid container component="main" sx={{ height: '100vh' }}>
        <CssBaseline />
        <Grid
          item
          xs={false}
          sm={4}
          md={7}
          sx={{
              backgroundImage: 'url(signinIdea.jpeg)',
            backgroundRepeat: 'no-repeat',
            backgroundColor: (t) =>
              t.palette.mode === 'light' ? t.palette.grey[50] : t.palette.grey[900],
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        />
        <Grid item xs={12} sm={8} md={5} component={Paper} elevation={6} square>
          <Box
            sx={{
              my: 8,
              mx: 4,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}
          >
            <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
              <LockOutlinedIcon />
            </Avatar>
            <Typography component="h1" variant="h5">
              Sign in
            </Typography>
            <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 1 }}>
              <TextField
                margin="normal"
                required
                fullWidth
                id="email"
                label="Email Address"
                name="email"
                autoComplete="email"
                autoFocus
              />
              <TextField
                margin="normal"
                required
                fullWidth
                name="password"
                label="Password"
                type="password"
                id="password"
                autoComplete="current-password"
              />
              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
              >
                Sign In
              </Button>
              <Grid container>
                <Grid item>
                  <Link href="./register" variant="body2">
                    {"Don't have an account? Sign Up"}
                  </Link>
                </Grid>
              </Grid>
              <Copyright sx={{ mt: 5 }} />
            </Box>
          </Box>
        </Grid>
      </Grid>
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
    </ThemeProvider>
  );
}
