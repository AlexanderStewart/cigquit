import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Card, Button } from "react-bootstrap";

import "../styles/main.scss";
import "../styles/home.scss";

function Home() {
  const [signedIn, setSignedIn] = useState(false);

  useEffect(() => {
    let isMounted = true;
    const token = localStorage.getItem("token");

    if (token) {
      setSignedIn(true);
    }
    return () => { isMounted = false };
  }, []);

  return (
    <div className="Home">
      <div className="center">
        <div className="main-width">
          {!signedIn && (
            <div className="login-sign-up-container">
              <h6>
                <Link to="/login" className="text-muted">
                  Login
                </Link>
              </h6>
              <div className="horizontal-space"></div>
              <h6>
                <Link to="/signup" className="text-muted">
                  Signup
                </Link>
              </h6>
            </div>
          )}
          {signedIn && (
            <div className="login-sign-up-container">
              <h6>
                <Link to="/update-quit-stats" className="text-muted">
                  Update Quit Stats
                </Link>
              </h6>
              <div className="horizontal-space"></div>
              <h6>
                <Link to="/profile" className="text-muted">
                  Profile
                </Link>
              </h6>
            </div>
          )}
          <div className="wide-line"></div>
          <div className="center column">
            <h1 className="header">CigQuit</h1>
            <div className="wide-line"></div>
            <div>
              <Card className="home-card shadow border-0">
                <Card.Body>
                  <Card.Text>
                    Set a quit date. Track the number of days cigarettes haven't
                    been a part of your life. Count the number of cigarettes you
                    would have smoked had you not quit. Track how much money you
                    have saved. Become a healthier person.
                  </Card.Text>
                </Card.Body>
              </Card>

              <Card className="home-card shadow border-0">
                <Card.Body>
                  <Card.Text>
                    CigQuit is totally free to use. It is also open source!
                  </Card.Text>
                  <Button
                    variant="outline-info"
                    href="https://github.com/AlexanderStewart/cigquit"
                  >
                    GitHub repo
                  </Button>
                </Card.Body>
              </Card>

              <Card className="home-card shadow border-0">
                <Card.Body>
                  <Card.Text>
                    CigQuit is totally free to use. It is also open source!
                  </Card.Text>
                  <Button
                    variant="outline-info"
                    href="https://github.com/AlexanderStewart/cigquit"
                  >
                    GitHub repo
                  </Button>
                </Card.Body>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;
