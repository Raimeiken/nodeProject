import { createBrowserRouter } from "react-router-dom";
import MainLayout from "../layout/MainLayout";
import Home from "../pages/Home/Home";

import Coffee from "../pages/Coffee/Coffee";
import Bartenders from "../pages/Bartenders/Bartenders";
import Classes from "../pages/Classes/Classes";


export const router = createBrowserRouter([
    {
        path:"/",
        element: <MainLayout/>,
        children:[
            {
                path:"/",
                element:<Home/>
            },
            {
                path:"instructors",
                element:<Bartenders/>
            },
            {
                path:"classes",
                element:<Classes/>
            }
        ]
    }
])