import * as React from 'react';
import {
  BrowserRouter as Router, Routes, Route
} from "react-router-dom";
import SignInSide from "./Auth/SignIn";
import SignUp from "./Auth/SignUp";
import Store from "./Store/Store";
import NotFoundPage from "./Utils/NotFoundPage";
import ProductsList from "./Store/ProductsList";
import ProductDetail from "./Store/ProductDetail";
import {isAuthKey} from "./RecoilStatesSelectors";
import {useRecoilState} from "recoil";
import {Caret} from "./Store/Caret";
import {PaymentDialog} from "./Store/PaymentDialog";
import {MyOrders} from "./Store/MyOrders";
import {Comments} from "./Store/Comments";


function App() {
    const [isAuth, setIsAuth] = useRecoilState(isAuthKey);

  return (
    <Router>
        <Routes >
            <Route path="/login" element={<SignInSide />} />
            <Route path="/register" element={<SignUp />} />
            <Route path="/comments" element={<Comments />} />
            <Route path="/" element={<Store />} />

            {isAuth ?
                <>
                <Route path="/armchairs" element={<ProductsList category="armchairs" />} />
                <Route path="/armchairs/:id" element={<ProductDetail category="armchairs" />} />

                <Route path="/beds" element={<ProductsList category="beds" />} />
                <Route path="/beds/:id" element={<ProductDetail category="beds" />} />

                <Route path="/chairs" element={<ProductsList category="chairs" />} />
                <Route path="/chairs/:id" element={<ProductDetail category="chairs" />} />

                <Route path="/desks" element={<ProductsList category="desks" />} />
                <Route path="/desks/:id" element={<ProductDetail category="desks" />} />

                <Route path="/dressers" element={<ProductsList category="dressers" />} />
                <Route path="/dressers/:id" element={<ProductDetail category="dressers" />} />

                <Route path="/mattress" element={<ProductsList category="mattress" />} />
                <Route path="/mattress/:id" element={<ProductDetail category="mattress" />} />

                <Route path="/sofas" element={<ProductsList category="sofas" />} />
                <Route path="/sofas/:id" element={<ProductDetail category="sofas" />} />

                <Route path="/wardrobes" element={<ProductsList category="wardrobes" />} />
                <Route path="/wardrobes/:id" element={<ProductDetail category="wardrobes" />} />

                <Route path="/caret" element={<Caret />} />
                <Route path="/payment" element={<PaymentDialog />} />
                <Route path="/myorders" element={<MyOrders />} />

                </>
            :
                <></>
            }
            <Route path="*" element={<NotFoundPage/>} />



        </Routes >
    </Router>
  );
}

export default App;
