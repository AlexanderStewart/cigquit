import { useState, useEffect } from "react";
import { Form, Button, Alert } from "react-bootstrap";
import Axios from "axios";
import { Link, withRouter, useHistory } from "react-router-dom";
import { API_HOST } from "../constants";

import "../styles/main.scss";
import "../styles/signup.scss";

function Signup() {
  const history = useHistory();

  useEffect(() => {
    let isMounted = true;
    const token = localStorage.getItem("token");
    if (token) {
      history.push("/profile");
    }
    return () => { isMounted = false };
  }, []);

  const [email, setEmail] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [password, setPassword] = useState("");

  const [showAlert, setShowAlert] = useState(false);
  const [myVariant, setMyVariant] = useState("");
  const [alertContent, setAlertContent] = useState("");

  const submitRegister = (e) => {
    e.preventDefault();
    // setShowAlert(false);
    Axios.post(`${API_HOST}/api/signup`, {
      email: email,
      firstName: firstName,
      lastName: lastName,
      password: password,
    })
      .then((response) => {
        localStorage.setItem("token", response.data.token);
        const myMessage = response.data.message.toString();
        if (myMessage === "SUCCESS") {
          history.push("/update-quit-stats");
        }
        showAlerts(myMessage);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const showAlerts = (myMessage) => {
    if (myMessage === "EMAIL_EMPTY") {
      setMyVariant("warning");
      setAlertContent("Please enter an email.");
      setShowAlert(true);
    } else if (myMessage === "EMAIL_NOT_VALID") {
      setMyVariant("warning");
      setAlertContent("Your email is formatted incorrectly.");
      setShowAlert(true);
    } else if (myMessage === "FIRST_NAME_EMPTY") {
      setMyVariant("warning");
      setAlertContent("Please enter a first name.");
      setShowAlert(true);
    } else if (myMessage === "LAST_NAME_EMPTY") {
      setMyVariant("warning");
      setAlertContent("Please enter a last name.");
      setShowAlert(true);
    } else if (myMessage === "PASSWORD_EMPTY") {
      setMyVariant("warning");
      setAlertContent("Please enter a password.");
      setShowAlert(true);
    } else if (myMessage === "PASSWORD_SHORT") {
      setMyVariant("warning");
      setAlertContent("Your password must be six characters or longer.");
      setShowAlert(true);
    } else if (myMessage === "ER_DUP_ENTRY") {
      setMyVariant("warning");
      setAlertContent("That email is already in use.");
      setShowAlert(true);
    } else if (myMessage === "SUCCESS") {
      setMyVariant("success");
      setAlertContent("Success! Your account has been created!");
      setShowAlert(true);
    }
  };

  return (
    <div className="Home">
      <div className="center">
        <div className="main-width">
          <div className="login-sign-up-container">
            <h6>
              <Link to="/login" className="text-muted">
                Login
              </Link>
            </h6>
          </div>
          <div className="wide-line"></div>
          <div className="center">
            <h1 className="header-signup lato-black">Signup</h1>
          </div>
          <div className="wide-line"></div>
          {showAlert && (
            <Alert className="signup-alert" variant={myVariant}>
              {alertContent}
            </Alert>
          )}
          <Form>
            <Form.Group controlId="Email">
              <Form.Label>Email address</Form.Label>
              <Form.Control
                type="email"
                placeholder="e.g. me@example.com"
                onChange={(e) => setEmail(e.target.value)}
              />
              <Form.Text className="text-muted">
                We'll never share your email with anyone else.
              </Form.Text>
            </Form.Group>

            <Form.Group controlId="firstName">
              <Form.Label>First name</Form.Label>
              <Form.Control
                type="text"
                onChange={(e) => setFirstName(e.target.value)}
              />
            </Form.Group>

            <Form.Group controlId="lastName">
              <Form.Label>Last name</Form.Label>
              <Form.Control
                type="text"
                onChange={(e) => setLastName(e.target.value)}
              />
            </Form.Group>

            <Form.Group controlId="password">
              <Form.Label>Password</Form.Label>
              <Form.Control
                type="password"
                onChange={(e) => setPassword(e.target.value)}
              />
              <Form.Text className="text-muted">
                minimum six characters.
              </Form.Text>
            </Form.Group>

            <Button variant="success" onClick={submitRegister}>
              Submit
            </Button>
          </Form>
        </div>
      </div>
    </div>
  );
}

export default withRouter(Signup);
