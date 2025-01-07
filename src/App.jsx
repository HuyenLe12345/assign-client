import "./App.css";
import "./css/custom.css";
import "./css/style.default.css";
import React, { lazy, Suspense, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { BrowserRouter, Route, Switch, Redirect } from "react-router-dom";

import Footer from "./Share/Footer/Footer";
import Header from "./Share/Header/Header";
import Chat from "./Share/Chat/Chat";

const Home = lazy(() => import("./Home/Home"));
const Detail = lazy(() => import("./Detail/Detail"));
const Cart = lazy(() => import("./Cart/Cart"));
const SignIn = lazy(() => import("./Authentication/SignIn"));
const SignUp = lazy(() => import("./Authentication/SignUp"));
const Checkout = lazy(() => import("./Checkout/Checkout"));
const History = lazy(() => import("./History/History"));
const Shop = lazy(() => import("./Shop/Shop"));

function App() {
  const idUser = useSelector((state) => state.Session.idUser);
  console.log(idUser);
  const [isAuthenticated, setIsAuthenticated] = useState(
    !!idUser || !!localStorage.getItem("token")
  );

  useEffect(() => {
    if (idUser || localStorage.getItem("token")) {
      setIsAuthenticated(true);
    } else {
      setIsAuthenticated(false);
    }
  }, [idUser]);
  return (
    <div className="App">
      <BrowserRouter>
        <Header />
        <Suspense fallback={<div>Loading...</div>}>
          <Switch>
            <Route exact path="/" component={Home} />{" "}
            <Route path="/shop" component={Shop} />
            <Route path="/signin" component={SignIn} />{" "}
            <Route path="/signup" component={SignUp} />{" "}
            <Route path="/cart" component={Cart} />{" "}
            <Route 
              path="/detail/:id"
              component={Detail}             
            />
            <PrivateRoute
              exact
              path="/checkout"
              component={Checkout}
              isAuthenticated={isAuthenticated}
            />
            <PrivateRoute
              exact
              path="/history"
              component={History}
              isAuthenticated={isAuthenticated}
            />
          </Switch>{" "}
        </Suspense>
      </BrowserRouter>

      <Chat />

      <Footer />
    </div>
  );
}

export default App;
function PrivateRoute({ component: Component, isAuthenticated, ...rest }) {
  return (
    <Route
      {...rest}
      render={(props) =>
        isAuthenticated ? (
          <Component {...props} />
        ) : (
          <Redirect
            to={{ pathname: "/signin", state: { from: props.location } }}
          />
        )
      }
    />
  );
}
