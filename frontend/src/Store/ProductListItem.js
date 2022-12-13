import Card from "@mui/material/Card";
import {CardActionArea} from "@mui/material";
import CardMedia from "@mui/material/CardMedia";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";


const ProductListItem = (props) => {
    let url_product = "/" + props.category_name + "/" + props.id;
    return(
        <Card sx={{ maxWidth: 345 }}>
            <CardActionArea href={url_product}>
                <CardMedia
                    component="img"
                    height="140"
                    image="http://localhost:8000/"
                    alt="green iguana"
                />
                <CardContent>
                    <Typography gutterBottom variant="h5" component="div">
                        Lizard
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        Lizards are a widespread group of squamate reptiles, with over 6,000
                        species, ranging across all continents except Antarctica
                    </Typography>
                </CardContent>
            </CardActionArea>
        </Card>
    )
}

export default ProductListItem;