import {createTheme, ThemeProvider} from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import Footer from "./Footer";
import Header from "./Header";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import {Alert, Snackbar, Stack} from "@mui/material";
import {useRecoilState} from "recoil";
import {caretKey} from "../RecoilStatesSelectors";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import DeleteIcon from "@mui/icons-material/Delete";
import PlusOneIcon from "@mui/icons-material/PlusOne";
import {useState} from "react";
import {userIdKey} from "../RecoilStatesSelectors";
import axios from "axios";



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


export const Caret = () => {
    const [caret, setCaret] = useRecoilState(caretKey);
    const [userId, setUserId] = useRecoilState(userIdKey)

    const [open, setOpen] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

    let allPrice = 0
    console.log(caret);
    let objCaret = JSON.parse(caret);
    console.log(caret);

    return(
            <ThemeProvider theme={theme}>
                <Container maxWidth="lg">
                    <CssBaseline />
                    <Header title="IDEA" sections={sections} />
                    <Grid container>
                        <Grid item xs={6}>
                            <Stack spacing={2}>
                                {Object.keys(objCaret).map((name) => {
                                    let amount = objCaret[name]["amount"];
                                    let price = objCaret[name]["price"];
                                    console.log(name)
                                    allPrice += amount * price;
//                                    setAllPrice(amount*price)

                                    return(
                                        <Grid container id={name}>
                                            <Grid item xs={3}>
                                                <Typography variant="h5">{name}</Typography>
                                                <Typography variant="h6">amount: {amount}, price: {price}$, all price: {price*amount}$</Typography>
                                            </Grid>
                                            <Grid item xs={3}>
                                                <Container align="center">
                                                    <Button variant="outlined" color="error" startIcon={<DeleteIcon />} onClick={() => {

                                                        allPrice -= 1*price;
                                                        if(amount === 1){
                                                            window.location.href = 'http://localhost:3000/caret';
                                                            document.getElementById(name).remove()
                                                            delete objCaret[name]
                                                            localStorage.setItem('caretKey', JSON.stringify(objCaret));
                                                            return
                                                        }
                                                        else{
                                                            objCaret[name]['amount'] -= 1;
                                                        }
                                                        localStorage.setItem('caretKey', JSON.stringify(objCaret));
                                                        setCaret(JSON.stringify(objCaret));
                                                    }}>
                                                        Remove
                                                    </Button>
                                                    <Typography display="inline" m={2}>
                                                        {amount}
                                                    </Typography>
                                                    <Button variant="outlined" color="success" startIcon={<PlusOneIcon />} onClick={() => {
                                                        allPrice += 1*price;
                                                        objCaret[name]['amount'] += 1
                                                        setCaret(JSON.stringify(objCaret));
                                                    }}>
                                                        Add
                                                    </Button>
                                                    <br/>
                                                </Container>
                                            </Grid>
                                        </Grid>
                                    )
                                })}
                            </Stack>
                        </Grid>
                        <Grid item xs={6}>
                            <Stack mt={3}>
                                <Typography variant="h4">Amount price: {allPrice}$</Typography>
                                <Button variant="contained" color="success" onClick={() => {
                                    if(objCaret === {}){
                                        return
                                    }

                                    Object.keys(objCaret).map((name) => {
                                        axios.post("http://localhost:8000/makeorder", {
                                            user_id: Number(userId),
                                            amount_order: Number(objCaret[name]['amount']),
                                            product_name: name
                                        }).then((response) => {
                                            console.log(objCaret)
                                            setCaret(JSON.stringify({}));
                                            localStorage.setItem('caretKey', JSON.stringify({}));
                                            console.log(objCaret)
                                        }).catch((error) => {
                                            console.log(error.response.data);
                                            setErrorMessage(error.response.data)
                                            setOpen(true);
                                        })

                                    })

                                    localStorage.setItem('amountrPice', allPrice);
                                }}>Make order</Button>
                            </Stack>

                        </Grid>

                    </Grid>
                    <Snackbar open={open} autoHideDuration={6000} onClose={() => {
                        setOpen(false);
                    }}>
                        <Alert  severity="error" sx={{ width: '100%' }}>
                            {errorMessage}
                        </Alert>
                    </Snackbar>
                </Container>
                    <Footer
                        title="Footer"
                        description="Something here to give the footer a purpose!"
                    />
           </ThemeProvider>
    );
}
