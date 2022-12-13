import Footer from "./Footer";
import * as React from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import {Backdrop, CardActionArea, CircularProgress} from '@mui/material';
import {createTheme, ThemeProvider} from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import Container from "@mui/material/Container";
import Header from "./Header";
import Grid from "@mui/material/Grid";
import ProductListItem from "./ProductListItem";
import {useQuery} from "react-query";


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



const ProductList = (props) => {
    const { isLoading, error, data } = useQuery('repoData', () =>
            fetch(`http://localhost:8000/products?category_name=${props.category}`).then(res =>
                res.json())
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
                    <Grid container spacing={2} mt='10px'>
                        <Container>
                            <Typography align="center">{props.category}</Typography>
                        </Container>
                        {data.map(obj => {
                            let product_url = 'http://localhost:3000/' + props.category + "/"+ obj.id;
                            let image_url = 'http://localhost:8000/productimage?product_id=' + obj.id
                            return(
                                <Grid item xs={2}>
                                    <CardActionArea href={product_url}>
                                        <CardMedia
                                            component="img"
                                            width="180"
                                            height="180"
                                            image={image_url}
                                            alt={obj.name}
                                            loading="lazy"
                                        />
                                        <CardContent>
                                            <Typography gutterBottom variant="h5" component="div">
                                                {obj.name}
                                            </Typography>
                                        </CardContent>
                                    </CardActionArea>
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
    )
}

export default ProductList;
