import * as React from 'react';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Button from "@mui/material/Button";
import axios from "axios";
import {idsForPayKey} from "../RecoilStatesSelectors";
import {useRecoilState} from "recoil";

export default function PaymentForm() {
    const [idsForPay, setIdsForPay] = useRecoilState(idsForPayKey);

    return (
            <React.Fragment>
                <Typography variant="h6" gutterBottom>
                    Payment method
                </Typography>
                <Grid container spacing={3}>
                    <Grid item xs={12} md={6}>
                        <TextField
                            required
                            id="cardName"
                            label="Name on card"
                            fullWidth
                            autoComplete="cc-name"
                            variant="standard"
                        />
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <TextField
                            required
                            id="cardNumber"
                            label="Card number"
                            fullWidth
                            autoComplete="cc-number"
                            variant="standard"
                        />
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <TextField
                            required
                            id="expDate"
                            label="Expiry date"
                            fullWidth
                            autoComplete="cc-exp"
                            variant="standard"
                        />
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <TextField
                            required
                            id="cvv"
                            label="CVV"
                            helperText="Last three digits on signature strip"
                            fullWidth
                            autoComplete="cc-csc"
                            variant="standard"
                        />
                    </Grid>
                    <Grid item xs={12} md={12}>
                        <Button variant="contained" fullWidth color="primary" onClick={() => {
                            axios.post('http://localhost:8000/makepayment', {
                                idsForPay
                            }).then(r => {
                                localStorage.setItem("idsForPayKey", JSON.stringify([]))
                                setIdsForPay([])
                                window.location.href ='http://localhost:3000/payment';
                            })
                        }}>Confirm</Button>
                     </Grid>
                </Grid>
            </React.Fragment>
            );
}