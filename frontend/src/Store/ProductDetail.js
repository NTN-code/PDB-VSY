import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import {createTheme, ThemeProvider} from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import Container from "@mui/material/Container";
import Header from "./Header";
import Footer from "./Footer";
import {useParams} from "react-router-dom";
import {useQuery} from "react-query";
import {Alert, Backdrop, CircularProgress, Snackbar} from "@mui/material";
import Button from "@mui/material/Button";
import DeleteIcon from '@mui/icons-material/Delete';
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';
import PlusOneIcon from '@mui/icons-material/PlusOne';
import {useState} from "react";
import {caretKey} from "../RecoilStatesSelectors";
import {useRecoilState} from "recoil";


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

const ProductDetail = () => {
    let { id } = useParams();
    const { isLoading, error, data } = useQuery('repoData', () =>
        fetch(`http://localhost:8000/product?product_id=${id}`).then(res =>
        res.json()
        )
    )
    const [caret, setCaret] = useRecoilState(caretKey);


    const [amountToBuy, setAmountToBuy] = useState(0);

    let image_url = "http://localhost:8000/productimage?product_id=" + id;

    const [open, setOpen] = useState(false);



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
                <Grid>
                    <Typography alignContent="center" textAlign="center" variant="h2">
                        {data.name}
                    </Typography>

                    <Grid container spacing={2}>
                        <Grid item textAlign="Center" xs={12}>
                            <img
                            src={image_url}
                            alt="image product"
                            loading="lazy"
                            width="70%"
                            />
                        </Grid>

                        <Grid item xs={12}>
                            <Typography>
                                {data.description}
                            </Typography>
                        </Grid>

                        <Grid item  xs={6}>
                            <Typography>Weight {data.weight} kilogramms</Typography>
                            <Typography>Price {data.price}$</Typography>
                        </Grid>
                        <Grid item xs={6}>
                            <Container align="center">
                                <Typography variant="h6"> Add to order </Typography>

                                <Button variant="outlined" color="error" startIcon={<DeleteIcon />} onClick={() => {
                                    if(amountToBuy === 0){
                                        return
                                    }
                                    setAmountToBuy(amountToBuy - 1)
                                }}>
                                    Remove
                                </Button>
                                <Typography display="inline" m={2}>
                                    {amountToBuy}
                                </Typography>
                                <Button variant="outlined" color="success" startIcon={<PlusOneIcon />} onClick={() => {
                                    setAmountToBuy(amountToBuy + 1)
                                }}>
                                    Add
                                </Button>
                                <br/>
                                <Button variant="outlined" color="primary" startIcon={<AddShoppingCartIcon />} onClick={() => {
                                    if(amountToBuy === 0){
                                        return
                                    }
                                    let newCaret = JSON.parse(caret);
                                    console.log(newCaret);
                                    console.log(amountToBuy);

                                    if(!Object.prototype.hasOwnProperty.call(newCaret, data.name)){
                                        console.log(1);

                                        newCaret[data.name] = {amount: amountToBuy, price: data.price};
                                    }
                                    else{
                                        console.log(2);

                                        newCaret[data.name] = {amount: newCaret[data.name].amount + amountToBuy, price: data.price};
                                    }
                                    console.log(newCaret);

                                    localStorage.setItem('caretKey', JSON.stringify(newCaret));
                                    setCaret(JSON.stringify(newCaret));
                                    setAmountToBuy(0)
                                    setOpen(true)
                                }}>
                                    Make order
                                </Button>
                            </Container>
                        </Grid>

                        <Grid item xs={6}>

                        </Grid>
                    </Grid>
                </Grid>
                }
                <Snackbar open={open} autoHideDuration={6000} onClose={() => {
                    setOpen(false);
                }}>
                    <Alert  severity="success" sx={{ width: '100%' }}>
                        Add to caret!
                    </Alert>
                </Snackbar>
            </Container>

            <Footer
                title="Footer"
                description="Something here to give the footer a purpose!"
            />

        </ThemeProvider>
    )
}


export default ProductDetail;