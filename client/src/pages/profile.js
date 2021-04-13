import React, { useEffect, useContext, useState } from "react";
import { Link, useHistory } from "react-router-dom";
import { Card, Alert } from "react-bootstrap";
import { UserContext } from "../context/userProvider";
import moment from "moment";

import "../styles/main.scss";
import "../styles/home.scss";
import "../styles/profile.scss";
import "../styles/setQuitStats.scss";

function Profile() {
  const history = useHistory();
  const context = useContext(UserContext);

  const logout = () => {
    localStorage.clear();
    history.push("/");
  };

  const [firstName, setFirstName] = useState(null);
  const [lastName, setLastName] = useState(null);
  const [quitDate, setQuitDate] = useState(null);
  const [cigCount, setCigCount] = useState(null);
  const [cigPerPack, setCigPerPack] = useState(null);
  const [moneyPerPack, setMoneyPerPack] = useState(null);

  const [longQuitDate, setLongQuitDate] = useState(null);
  const [daysElapsed, setDaysElapsed] = useState(null);
  const [cigAvoided, setCigAvoided] = useState(null);
  const [moneySaved, setMoneySaved] = useState(null);

  const [showAlert, setShowAlert] = useState(null);

  useEffect(() => {

    setFirstName(context.user.firstName);
    setLastName(context.user.lastName);
    setQuitDate(context.user.quitDate);
    setCigCount(context.user.cigCount);
    setCigPerPack(context.user.cigPerPack);
    setMoneyPerPack(context.user.moneyPerPack);

    if (quitDate) {
      setShowAlert(false);

      setLongQuitDate(moment(quitDate).format("dddd, MMMM Do YYYY"));

      setDaysElapsed(moment().diff(moment(quitDate), "days"));

      setCigAvoided(cigCount * moment().diff(moment(quitDate), "days"));

      setMoneySaved(
        "$" +
        ((moneyPerPack / cigPerPack) * cigCount * daysElapsed)
          .toFixed(2)
          .toString());

    } else {
      setShowAlert(true);

      setLongQuitDate("n/a");
      setDaysElapsed("n/a");
      setCigAvoided("n/a");
      setMoneySaved("n/a");
    }

    console.log(".");

  });

  return (
    <div className="Profile">
      <div className="center">
        <div className="main-width">
          <div className="login-sign-up-container">
            <div className="custom-link">
              <h6 className="text-muted" onClick={logout}>
                Logout
              </h6>
            </div>
            <div className="horizontal-space"></div>
            <h6>
              <Link to="/update-quit-stats" className="text-muted">
                Update Quit Stats
              </Link>
            </h6>
          </div>
          <div className="wide-line"></div>
          {showAlert && (
            <Alert className="signup-alert" variant="warning">
              Looks like you haven't set your quit stats. Click 'update quit
              stats' above to do so.
            </Alert>
          )}
          <div className="column">
            {!showAlert && (
              <div className="center header-container">
                <h1 className="header-profile header-a">{firstName}&nbsp;</h1>
                <h1 className="header-profile header-b">{lastName}</h1>
              </div>
            )}
            {!showAlert && (
              <h6 className="sub-header-profile center">
                Good for you for quitting! Here are your quit stats:
              </h6>
            )}
            <div className="wide-line"></div>
            <div className="center">
              <div className="flex-wrap">
                <Card className="profile-card shadow border-0">
                  <Card.Body>
                    <Card.Text>Date of last smoke:</Card.Text>
                    <Card.Title>{longQuitDate}</Card.Title>
                  </Card.Body>
                </Card>

                <Card className="profile-card shadow border-0">
                  <Card.Body>
                    <Card.Text>
                      Days passed since you last smoked a cigarette:
                    </Card.Text>
                    <Card.Title>{daysElapsed}</Card.Title>
                  </Card.Body>
                </Card>

                <Card className="profile-card shadow border-0">
                  <Card.Body>
                    <Card.Text>
                      Numbers of cigarettes you have avoided smoking:
                    </Card.Text>
                    <Card.Title>{cigAvoided}</Card.Title>
                  </Card.Body>
                </Card>

                <Card className="profile-card shadow border-0">
                  <Card.Body>
                    <Card.Text>Amount of money saved:</Card.Text>
                    <Card.Title>{moneySaved}</Card.Title>
                  </Card.Body>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile;
