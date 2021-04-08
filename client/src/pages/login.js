import { useState, useEffect } from "react";
import { Form, Button, Alert } from "react-bootstrap";
import Axios from "axios";
import { Link, withRouter, useHistory } from "react-router-dom";
import { API_HOST } from "../constants";

import "../styles/main.scss";
import "../styles/signup.scss";
import "../styles/login.scss";

function Login() {
  const history = useHistory();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      history.push("/profile");
    }
  }, []);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [showAlert, setShowAlert] = useState(false);
  const [myVariant, setMyVariant] = useState("");
  const [alertContent, setAlertContent] = useState("");

  const submitReview = () => {
    Axios.post(`${API_HOST}/api/login`, {
      email: email,
      password: password,
    })
      .then((response) => {
        localStorage.setItem("token", response.data.token);
        const myMessage = response.data.message.toString();
        if (myMessage === "SUCCESS") {
          history.push("/profile");
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
    } else if (myMessage === "EMAIL_NOT_ON_FILE") {
      setMyVariant("warning");
      setAlertContent("Sorry, we don't have that email on file.");
      setShowAlert(true);
    } else if (myMessage === "PASSWORD_EMPTY") {
      setMyVariant("warning");
      setAlertContent("Please enter a password.");
      setShowAlert(true);
    } else if (myMessage === "WRONG_PASSWORD") {
      setMyVariant("warning");
      setAlertContent("That password is incorrect.");
      setShowAlert(true);
    } else if (myMessage === "SUCCESS") {
      setMyVariant("success");
      setAlertContent("Success! You are now logged in!");
      setShowAlert(true);
    }
  };

  return (
    <div className="Home">
      <div className="center">
        <div className="main-width">
          <div className="login-sign-up-container">
            <h6>
              <Link to="/signup" className="text-muted">
                Signup
              </Link>
            </h6>
          </div>
          <div className="wide-line"></div>
          <div className="center">
            <h1 className="header-signup lato-black">Login</h1>
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
            </Form.Group>

            <Form.Group controlId="password">
              <Form.Label>Password</Form.Label>
              <Form.Control
                type="password"
                onChange={(e) => setPassword(e.target.value)}
              />
            </Form.Group>

            <Button variant="success" onClick={submitReview}>
              Submit
            </Button>
          </Form>
        </div>
      </div>
    </div>
  );
}

export default withRouter(Login);
