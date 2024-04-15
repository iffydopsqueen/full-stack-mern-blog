import Navbar from "./components/navbar";
import { Routes, Route } from "react-router-dom";
import UserAuthForm from "./pages/userAuthForm";

const App = () => {
    return (
        <Routes>
            <Route path="/" element={<Navbar />}>
                <Route path="signin" element={<UserAuthForm type="sign-in" />} />
                <Route path="signup" element={<UserAuthForm type="sign-up" />} />
            </Route>
        </Routes>
    )
}

export default App;