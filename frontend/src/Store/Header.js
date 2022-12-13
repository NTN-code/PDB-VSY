import * as React from 'react';
import PropTypes from 'prop-types';
import Toolbar from '@mui/material/Toolbar';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Link from '@mui/material/Link';
import {useRecoilState} from "recoil";
import Cookies from 'js-cookie'
import {caretKey, isAdminKey, isAuthKey} from "../RecoilStatesSelectors";
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import PaymentIcon from '@mui/icons-material/Payment';
import ShoppingBagIcon from '@mui/icons-material/ShoppingBag';

function Header(props) {
    const { sections, title } = props;
    const [isAuth, setIsAuth] = useRecoilState(isAuthKey);
    const [isAdmin, setIsAdmin] = useRecoilState(isAdminKey);
    const [myCaretKet, setCaretKey] = useRecoilState(caretKey);

    return (
        <React.Fragment>
            <Toolbar sx={{ borderBottom: 1, borderColor: 'divider' }}>
                <Typography
                    component="h2"
                    variant="h5"
                    color="inherit"
                    align="center"
                    noWrap
                    sx={{ flex: 1 }}
                    >
                    <Link href="/">{title}</Link>
                </Typography>
                { isAuth ?
                <>
                    <Button variant="outlined" size="small" startIcon={<ShoppingBagIcon/>} href="http://localhost:3000/myorders">Orders</Button>
                    <Button variant="outlined" size="small" startIcon={<PaymentIcon/>} href="http://localhost:3000/payment">Payment</Button>
                    <Button variant="outlined" size="small" startIcon={<ShoppingCartIcon/>} href="http://localhost:3000/caret">Caret</Button>
                    <Button variant="outlined" size="small" onClick={()=>{
                        Cookies.remove("appKey");
                        Cookies.remove("isAdminKey");
                        Cookies.remove("isAuthKey");

                        localStorage.setItem("caretKey", JSON.stringify({}));
                        

                        setCaretKey({});
                        setIsAuth(false);
                        setIsAdmin(false);
                    }}>Log out</Button>
                </>
                    :
                <>
                    <Button variant="outlined" size="small" href="http://localhost:3000/register">
                        Sign up
                    </Button>
                    <Button variant="outlined" size="small" href="http://localhost:3000/login">
                        Sign in
                    </Button>
                </>

                }

            </Toolbar>
            <Toolbar
                component="nav"
                variant="dense"
                sx={{ justifyContent: 'space-between', overflowX: 'auto' }}
                >
                {sections.map((section) => (
                        <Link
                            color="inherit"
                            noWrap
                            key={section.title}
                            variant="body2"
                            href={section.url}
                            sx={{ p: 1, flexShrink: 0 }}
                            >
                            {section.title}
                        </Link>
                        ))}
                <Link
                    color="inherit"
                    noWrap
                    key='Comments'
                    variant="body2"
                    href='http://localhost:3000/comments'
                    sx={{ p: 1, flexShrink: 0 }}
                    >
                    Comments
                </Link>
            </Toolbar>
        </React.Fragment>
    );
}

Header.propTypes = {
    sections: PropTypes.arrayOf(
            PropTypes.shape({
                title: PropTypes.string.isRequired,
                url: PropTypes.string.isRequired,
            }),
            ).isRequired,
    title: PropTypes.string.isRequired,
};

export default Header;