import {createTheme, ThemeProvider} from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import Container from "@mui/material/Container";
import Header from "./Header";
import Footer from "./Footer";
import {useQuery} from "react-query";
import {Backdrop, CircularProgress} from "@mui/material";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";

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


const theme = createTheme();

const Store = () => {
    const { isLoading, error, data } = useQuery('getCategories', () =>
            fetch('http://localhost:8000/categories').then(res =>
                res.json()
        )
    )

    console.log(data);


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
                    <Grid container spacing={5} mt='10px'>
                        <Container>
                            <Typography align="center">Assortment</Typography>
                        </Container>
                        {data.map((obj) => {
                            let url = 'http://localhost:8000/categoryimage?category_id=' + obj.id
                            return (
                                <Grid item xs={2}>
                                    <img
                                        width='180px'
                                        height='180px'
                                        src={url}
                                        alt={obj.name}
                                        loading="lazy"
                                    />
                                    <Typography align="center">{obj.name}</Typography>
                                </Grid>
                            )
                        })}
                    </Grid>
                }

            </Container>
            <Footer
                title="Footer"
                description="Something here to give the footer a purpose!"
            />
        </ThemeProvider>
    );
}

export default Store;