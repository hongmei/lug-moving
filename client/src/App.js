import React from "react";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import { Provider } from "react-redux";
// import { createStore } from "redux";

import "./App.css";
import Home from "./pages/Home";
import TopBar from "./pages/booking/TopBar";
import LocationSelect from "./pages/booking/LocationSelect";
import CategorySelect from "./pages/booking/CategorySelect";
import VehicleSelect from "./pages/booking/VehicleSelect";
import TimeSelect from "./pages/booking/TimeSelect";
import PricePreview from "./pages/booking/PricePreview";
import ContactInfo from "./pages/booking/ContactInfo";
import HowItWorks from "./pages/HowItWorks";
import ItemSelect from "./pages/booking/ItemSelect";

import configureStore from "./redux/configureStore";
import Landing from "./pages/Landing";

const store = configureStore();

function App() {
    return (
        <Provider store={store}>
            <div>
                <BrowserRouter>
                    <Switch>
                        <Route exact path="/" component={Home} />
                        <Route exact path="/how" component={HowItWorks} />
                        <Route exact path="/store-delivery" component={Landing} />
                        <Route exact path="/service/:id" component={Landing} />
                        <Route>
                            <TopBar />
                            <Route exact path="/book" component={CategorySelect} />
                            <Route exact path="/book/location" component={LocationSelect} />
                            <Route exact path="/book/vehicle" component={VehicleSelect} />
                            <Route exact path="/book/time" component={TimeSelect} />
                            <Route exact path="/book/item" component={ItemSelect} />
                            <Route exact path="/book/contact" component={ContactInfo} />
                            <Route exact path="/book/preview" component={PricePreview} />
                        </Route>
                    </Switch>
                </BrowserRouter>
            </div>
        </Provider>
    );
}

export default App;
