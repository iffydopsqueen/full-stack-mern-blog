// create a session
const storeSession = (key, value) => {
    return sessionStorage.setItem(key, value);
}

// retrieve data from session
const retrieveSession = (key) => {
    return sessionStorage.getItem(key);
}

// remove data from session
const removeSession = (key) => {
    return sessionStorage.removeItem(key);
}

// clear a user's session
const logOutUser = () => {
    sessionStorage.clear();
}

export { storeSession, retrieveSession, removeSession, logOutUser };