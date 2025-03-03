import App from "./App";
import ErrorPage from "./components/ErrorPage";
import { Login } from "./components/Login";


const routes = [
    /*
    {
        path: "/",
        element: <App />,
        errorElement: <ErrorPage />,
        children: [
            { index: true, element: <Home /> },
            // if authenticated and user tries to go to /signup, just redirect to home
            { path: "/:handle", element: <Profile /> },
            { path: "/settings/profile", element: <Settings /> },
            { path: "/post/:id", element: <Post /> },
            { path: "/search", element: <Search /> },
        ]
    },
    {
        path: "/signup",
        element: <Signup />,
        errorElement: <ErrorPage />
    },*/
    {
        path: "/login", 
        element: <Login />,
        errorElement: <ErrorPage />
    }
];

export default routes;