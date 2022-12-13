import {createTheme, ThemeProvider} from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import Container from "@mui/material/Container";
import Header from "./Header";
import Grid from "@mui/material/Grid";
import {Backdrop, CircularProgress, Stack} from "@mui/material";
import Typography from "@mui/material/Typography";
import Footer from "./Footer";
import {useQuery} from "react-query";
import {useRecoilState} from "recoil";
import {userIdKey} from "../RecoilStatesSelectors";
import {DataGrid} from "@mui/x-data-grid";


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


const getCalculatedPrice = (params) => {
    return `${params.row.amount * params.row.price}`;
}

const formatterToMoney = (params) => {
    return `${params.value}$`;
}


export const MyOrders = () => {
    const [userID, setUserID] = useRecoilState(userIdKey);

    const { isLoading, error, data } = useQuery('getMyOrders', () =>
        fetch(`http://localhost:8000/myorders?id=${userID}`,).then(res =>
            res.json()
        )
    )

    const columns = [
        { field: 'id', headerName: 'Order ID', width: 150 },
        { field: 'product_name', headerName: 'Product Name', width: 150 },
        { field: 'amount', headerName: 'Amount', width: 150 },
        { field: 'price', headerName: 'Price per item', width: 150, valueFormatter: formatterToMoney},
        { field: 'allPrice', headerName: 'All price', width: 150, valueGetter: getCalculatedPrice, valueFormatter: formatterToMoney },
        { field: 'status', headerName: 'Status', width: 150 },
        { field: 'created_at', headerName: 'Created at', width: 180 },
    ];

    console.log(data);
    console.log(columns);

    return(
        <ThemeProvider theme={theme}>
                <CssBaseline />
                <Container maxWidth="lg">
                    <Header title="IDEA" sections={sections} />
                    <Grid container>
                        <Grid item xs={12}>
                            {isLoading ?
                            <Backdrop
                                sx={{ color: '#fff' }}
                                open="True"
                                >
                                <CircularProgress color="inherit" />
                            </Backdrop>
                            :
                                <div style={{ height: 500, width: '100%' }}>
                                    <DataGrid
                                        
                                        rows={data}
                                        columns={columns}
                                        headerHeight={50}
                                    />
                                </div>

                            }
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
