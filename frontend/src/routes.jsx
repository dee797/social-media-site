import App from "./App";
import ErrorPage from "./components/ErrorPage";
import { Login } from "./components/Login";


const routes = [
    {
        path: "/",
        element: <App />,
        errorElement: <ErrorPage />,
        children: [
            { path: "/login", element: <Login /> },
            /*
            { path: "/signup", element: <Signup /> },
            { index: true, element: <Home /> },
            { path: "/settings/profile", element: <Settings /> },
            { path: "/post/:id", element: <Post /> },
            { path: "/search", element: <Search /> },
            { path: "/:handle", element: <Profile /> },
        */
        ]
    },
    
];

export default routes;