import App from "./App";
import ErrorPage from "./pages/404ErrorPage";
import { Home } from "./pages/Home";
import { Login } from "./pages/Login";
import { Signup } from "./pages/Signup";
import { Settings } from "./pages/Settings";
import { NewPost } from "./pages/NewPost";
import { ViewPost } from "./pages/ViewPost";


const routes = [
    {
        path: "/",
        element: <App />,
        errorElement: <ErrorPage />,
        children: [
            { index: true, element: <Home /> },
            { path: "/login", element: <Login /> },
            { path: "/signup", element: <Signup /> },
            { path: "/settings/profile", element: <Settings /> },
            { path: "/post", element: <NewPost />},
            { path: "/post/:id", element: <ViewPost /> },
            /*
            { path: "/search", element: <Search /> },
            { path: "/:handle", element: <Profile /> },
        */
        ]
    }   
];

export default routes;