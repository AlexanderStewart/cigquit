import "./App.css";
import { Switch, Route } from "react-router-dom";
import Home from "./pages/home";
import Signup from "./pages/signup";
import Login from "./pages/login";
import SetQuitStats from "./pages/setQuitStats";
import Profile from "./pages/profile";
import Auth from "./context/Auth";
import UserProvider from "./context/userProvider";

function App() {
  return (
    <main>
      <Switch>
        <Route path="/" component={Home} exact />
        <Route path="/signup" component={Signup} />
        <Route path="/login" component={Login} />

        <UserProvider>
          <Auth>
            <Route path="/update-quit-stats" component={SetQuitStats} />
            <Route path="/profile" component={Profile} />
          </Auth>
        </UserProvider>
      </Switch>
    </main>
  );
}

export default App;
