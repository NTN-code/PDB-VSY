import {useState} from "react";
import Button from "@mui/material/Button";
import DoneIcon from "@mui/icons-material/Done";
import Grid from "@mui/material/Grid";
import {useRecoilState} from "recoil";
import {idsForPayKey} from "../RecoilStatesSelectors";


export const ConfirmBuyButton = (props) => {
    const [isBuy, setIsBuy] = useState(false);
    const [idsForPay, setIdsForPay] = useRecoilState(idsForPayKey);

    return(
                <Grid item xs={4}>
                    {isBuy || idsForPay.includes(props.order_id)  ?
                    <Button color="success" startIcon={<DoneIcon/>} onClick={() => {
                        setIsBuy(false);
                        let orders_ids = JSON.parse(JSON.stringify(idsForPay));
                        orders_ids = orders_ids.filter(orders_ids => orders_ids != props.order_id);
                        setIdsForPay(orders_ids)
                        localStorage.setItem("idsForPayKey", JSON.stringify(orders_ids))
                    }}/>
                    :
                    <Button color="success" onClick={() => {
                        setIsBuy(true);
                        let orders_ids = JSON.parse(JSON.stringify(idsForPay));
                        orders_ids.push(props.order_id)
                        setIdsForPay(orders_ids)
                        localStorage.setItem("idsForPayKey", JSON.stringify(orders_ids))
                    }}>Buy</Button>
                    }
                </Grid>

    )
}
