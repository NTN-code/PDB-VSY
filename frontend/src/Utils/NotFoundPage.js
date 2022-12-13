import Typography from "@mui/material/Typography";
import {createTheme, ThemeProvider} from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import Container from "@mui/material/Container";
import Header from "../Store/Header";
import Footer from "../Store/Footer";

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

const NotFoundPage = () => {
    return(
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <Container maxWidth="lg">
                <Header title="IDEA" sections={sections} />
                <Container sx={{ pt: "100px", pb: "100px"}}>
                    <Typography variant="h2" align="center">
                        Not Found(need to be login)
                    </Typography>
                </Container>
            </Container>
            <Footer
                title="Footer"
                description="Something here to give the footer a purpose!"
            />
        </ThemeProvider>

    );
}


export default NotFoundPage;