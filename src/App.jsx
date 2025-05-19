import "@/App.css";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { setCredentials } from "@/features/auth/authSlice";
import { useRoutes } from "react-router-dom";
import routes from "@/routes/route";

function App() {
  const dispatch = useDispatch();
  const element = useRoutes(routes);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const refreshToken = localStorage.getItem("refreshToken");
    const user = JSON.parse(localStorage.getItem("user"));

    if (token && refreshToken && user) {
      dispatch(setCredentials({ user, token, refreshToken }));
    }
  }, [dispatch]);

  return element;
}

export default App;
