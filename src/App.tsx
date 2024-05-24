import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Login from "./screens/Login";
import Register from "./screens/Register";
import AddProducts from "./screens/AddProducts";
import ListProducts from "./screens/ListProducts";
import ListProductsUsers from "./screens/ListProductsUsers";

function App() {
  const accessToken = localStorage.getItem("accessToken");
  const userJSON = localStorage.getItem("user");
  const user = userJSON ? JSON.parse(userJSON) : null;

  const router = createBrowserRouter([
    {
      path: "/",
      element: accessToken ? <ListProductsUsers /> : <Login />,
    },
    {
      path: "/register",
      element: <Register />,
    },
    {
      path: "/addProducts",
      element: <AddProducts />,
    },
    {
      path: "/products",
      element: user && user.id==2 ? <ListProducts /> : <ListProductsUsers />,
    },
  ]);

  return <RouterProvider router={router} />;
}

export default App;