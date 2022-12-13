import {useQuery} from "react-query";
import Header from "./Header";
import {Backdrop, CircularProgress, Stack} from "@mui/material";
import Container from "@mui/material/Container";
import Footer from "./Footer";
import {createTheme, ThemeProvider} from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";

const theme = createTheme();

const sections = [
    { title: 'Armchairs', url: '/armchairs' },
    { title: 'Beds', url: '/beds' },
    { title: 'Chairs', url: '/chairs' },
    { title: 'Desks', url: '/desks' },
    { title: 'Dressers', url: '/dressers' },
    { title: 'Mattress', url: '/mattress' },
    { title: 'Sofas', url: '/sofas' },
    { title: 'Wardrobes', url: '/wardrobes' },
    ];


export const Comments = () => {
    const { isLoading, error, data } = useQuery('getCommetns', () =>
        fetch(`http://localhost:8000/comments`).then(res =>res.json())
    )

    return(
            <ThemeProvider theme={theme}>
                <CssBaseline />
                <Container maxWidth="lg">
                    <Header title="IDEA" sections={sections} />
                    {isLoading ?
                    <Backdrop
                        sx={{ color: '#fff' }}
                        open="True"
                        >
                        <CircularProgress color="inherit" />
                    </Backdrop>
                    :
                        <Stack>
                            <Container>
                                <Typography alignContent="center" textAlign="center" variant="h3">Last comments</Typography>
                            </Container>
                            {data.map(obj => {
                                return(
                                <>
                                    <hr />
                                    <Grid container xs={12}>
                                        <Grid item xs={3} >
                                            <Typography alignContent="center" textAlign="center" variant="h6">
                                                {obj.username}
                                            </Typography>
                                            <Typography alignContent="center" textAlign="center" variant="h6">
                                                {obj.product}
                                            </Typography>
                                        </Grid>
                                        <Grid item xs={9}>
                                            {obj.text}
                                        </Grid>

                                    </Grid>
                                    <hr />
                                </>
                                )
                            })}
                        </Stack>
                    }
                </Container>

                <Footer
                    title="Footer"
                    description="Something here to give the footer a purpose!"
                />

            </ThemeProvider>
        )
}