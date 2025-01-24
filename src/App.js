import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import AdminLogin from "./admin/LoginPage";
import Root from "./admin/Root";
import MainHeader from "./client/MainHeader";

import "@fontsource/montserrat"; // Defaults to weight 400
import "@fontsource/montserrat/400.css"; // Specify weight
import "@fontsource/montserrat/400-italic.css"; // Specify weight and style

export function user_is_authenticated() {
    if (localStorage.getItem("user_access_token") == undefined) {
        return false;
    } else {
        return true;
    }
}

function App() {
    return (
        <div className="App">
            <BrowserRouter>
                <Routes>
                    <Route
                        path="/superuser/login"
                        element={<AdminLogin></AdminLogin>}
                    />
                    <Route path="/superuser/*" element={<Root></Root>} />
                    <Route path="/*" element={<MainHeader></MainHeader>} />
                </Routes>
            </BrowserRouter>
        </div>
    );
}

export default App;
