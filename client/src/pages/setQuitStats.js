import React, { useContext, useState } from "react";
import Axios from "axios";
import { Form, Button, Alert } from "react-bootstrap";
import DatePicker from "react-datepicker";
import { Link, useHistory } from "react-router-dom";
import moment from "moment";
import { UserContext } from "../context/userProvider";
import { API_HOST } from "../constants";

import "react-datepicker/dist/react-datepicker.css";
import "../styles/main.scss";
import "../styles/profile.scss";
import "../styles/setQuitStats.scss";

function SetQuitStats() {
  const history = useHistory();
  const context = useContext(UserContext);

  const [longDate, setLongDate] = useState(new Date());
  const [cigCount, setCigCount] = useState(null);
  const [cigPerPack, setCigPerPack] = useState("");
  const [moneyPerPack, setMoneyPerPack] = useState("");

  const [showAlert, setShowAlert] = useState(false);
  const [myVariant, setMyVariant] = useState("");
  const [alertContent, setAlertContent] = useState("");

  const logout = () => {
    localStorage.clear();
    history.push("/");
  };

  const submitStats = () => {
    const quitDate = moment(longDate).format("YYYY-MM-DD").toString();

    Axios.post(`${API_HOST}/api/stats`, {
      quitDate: quitDate,
      cigCount: cigCount,
      cigPerPack: cigPerPack,
      moneyPerPack: moneyPerPack,
      userId: context.user._id,
    })
      .then((response) => {
        const myMessage = response.data.message;

        if (myMessage === "SUCCESS") {
          context.updateStats({
            quitDate: quitDate,
            cigCount: cigCount,
            cigPerPack: cigPerPack,
            moneyPerPack: moneyPerPack,
          });
        }
        showAlerts(myMessage);
      })
      .catch((error) => {
        console.log(error.response);
      });
  };

  const showAlerts = (myMessage) => {
    if (myMessage === "QUIT_DATE_EMPTY") {
      setMyVariant("warning");
      setAlertContent("Please enter a quit date.");
      setShowAlert(true);
    } else if (myMessage === "CIG_COUNT_EMPTY") {
      setMyVariant("warning");
      setAlertContent(
        "Please enter the amount of cigarettes you smoked (on average) per day."
      );
      setShowAlert(true);
    } else if (myMessage === "CIG_COUNT_NOT_INT") {
      setMyVariant("warning");
      setAlertContent(
        "The amount of cigarettes you smoked (on average) per day must be an whole number."
      );
      setShowAlert(true);
    } else if (myMessage === "CIG_PER_PACK_EMPTY") {
      setMyVariant("warning");
      setAlertContent(
        "Please enter the amount of cigarettes in the pack you typically purchase."
      );
      setShowAlert(true);
    } else if (myMessage === "MONEY_PER_PACK_EMPTY") {
      setMyVariant("warning");
      setAlertContent("Please enter the amount of money per pack.");
      setShowAlert(true);
    } else if (myMessage === "ERROR") {
      setMyVariant("danger");
      setAlertContent("Error, something went wrong.");
      setShowAlert(true);
    } else if (myMessage === "SUCCESS") {
      setMyVariant("success");
      setAlertContent("Success!");
      setShowAlert(true);
      history.push("/profile");
    }
  };

  return (
    <div className="Home">
      <div className="center">
        <div className="main-width">
          <div className="login-sign-up-container">
            <div className="custom-link text-muted">
              <h6 onClick={logout}>Logout</h6>
            </div>
            <div className="horizontal-space"></div>
            <h6>
              <Link to="/profile" className="text-muted">
                Profile
              </Link>
            </h6>
          </div>
          <div className="wide-line"></div>

          <div className="center">
            <h1 className="header-signup lato-black">Update Quit Stats</h1>
          </div>

          <div className="wide-line"></div>

          {showAlert && (
            <Alert className="signup-alert" variant={myVariant}>
              {alertContent}
            </Alert>
          )}
          <Form>
            <Form.Group>
              <Form.Label>Select the day you quit.</Form.Label>
              <div>
                <DatePicker
                  selected={longDate}
                  onChange={(date) => setLongDate(date)}
                  className="form-control"
                />
              </div>
            </Form.Group>

            <Form.Group>
              <Form.Label>
                Enter the amount of cigarettes you smoked (on average) per day
                before you quit.
              </Form.Label>
              <Form.Control
                type="number"
                onChange={(e) => setCigCount(e.target.value)}
              />
            </Form.Group>

            <Form.Group>
              <Form.Label>
                Enter the amount of cigarettes in the pack you typically
                purchase.
              </Form.Label>
              <Form.Control
                type="number"
                onChange={(e) => setCigPerPack(e.target.value)}
              />
            </Form.Group>

            <Form.Group>
              <Form.Label>
                Enter the amount of money the pack you buy costs.
              </Form.Label>
              <Form.Control
                type="number"
                onChange={(e) => setMoneyPerPack(e.target.value)}
              />
            </Form.Group>

            <Button variant="success" onClick={submitStats}>
              submit
            </Button>
          </Form>
        </div>
      </div>
    </div>
  );
}

export default SetQuitStats;
