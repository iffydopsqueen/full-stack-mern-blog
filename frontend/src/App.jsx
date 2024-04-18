import Navbar from "./components/navbar";
import { Routes, Route } from "react-router-dom";
import UserAuthForm from "./pages/userAuthForm";
import { createContext, useEffect, useState } from "react";
import { retrieveSession } from "./common/session";

export const UserContext = createContext({});

const App = () => {

    const [userAuth, setUserAuth] = useState({});

    // check if we have anything in session and store them
    useEffect(() => {

        let userSession = retrieveSession("user");
        
        userSession ? setUserAuth(JSON.parse(userSession)) : setUserAuth({ access_token: null })
    }, []);

    return (
        <UserContext.Provider value={{userAuth, setUserAuth}}>
            <Routes>
                <Route path="/" element={<Navbar />}>
                    <Route path="signin" element={<UserAuthForm type="sign-in" />} />
                    <Route path="signup" element={<UserAuthForm type="sign-up" />} />
                </Route>
            </Routes>
        </UserContext.Provider>
    )
}

export default App;