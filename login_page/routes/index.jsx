import Login from '../src/login';
import SignUp from "../src/signup";

const routes = [
    {
        path: "/",
        element: <Login />
    },
    {
        path: "SignUp",
        element: <SignUp />
    }
]