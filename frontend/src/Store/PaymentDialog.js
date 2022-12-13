import {createTheme, ThemeProvider} from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import Container from "@mui/material/Container";
import Header from "./Header";
import Footer from "./Footer";
import PaymentForm from "./PaymentForm";
import Grid from "@mui/material/Grid";
import {useQuery} from "react-query";
import {useRecoilState} from "recoil";
import {idsForPayKey, paymentBucketKey, userIdKey} from "../RecoilStatesSelectors";
import {Backdrop, CircularProgress, Stack} from "@mui/material";
import {useState} from "react";
import {ConfirmBuyButton} from "./ConfirmBuyButton";
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

export const PaymentDialog = () => {
    const [userId, setUserId] = useRecoilState(userIdKey)
    const [paymentBucket, setPaymentBucket] = useRecoilState(paymentBucketKey);
    const [useLessState, setUseLessStatre] = useState(true);


    const { isLoading, error, data } = useQuery('getOrdersUserWaitPayment', () =>
    fetch(`http://localhost:8000/orderspay?user_id=${userId}`).then(res => {
                    res.json().then(r => {
                        setPaymentBucket(r)
                        localStorage.setItem("paymentBucketKey", JSON.stringify(r))
                    }
                )
            }
        )
    )

    return(
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <Container maxWidth="lg">
                <Header title="IDEA" sections={sections} />
                <Grid container>
                    <Grid item xs={6}>
                        {isLoading ?
                        <Backdrop
                            sx={{ color: '#fff' }}
                            open="True"
                            >
                            <CircularProgress color="inherit" />
                        </Backdrop>
                        :
                            <Stack>
                                {paymentBucket.map(obj => {
                                    return(
                                            <Grid container xs={12}>
                                                <Grid item xs={8}>
                                                    <Typography>Product: {obj.product['name']}</Typography>
                                                    <Typography>Amount Price: {obj.order['amount'] * obj.product['price']}$</Typography>

                                                </Grid>
                                                <ConfirmBuyButton order_id={obj.order['id']}/>
                                            </Grid>
                                    )
                                })}
                            </Stack>
                        }
                    </Grid>
                    <Grid item xs={6}>
                        <PaymentForm/>
                        
                    </Grid>
                </Grid>
            </Container>

            <Footer
                title="Footer"
                description="Something here to give the footer a purpose!"
            />

        </ThemeProvider>
    )
}