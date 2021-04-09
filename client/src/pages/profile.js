import React, { useContext } from "react";
import { Link, useHistory } from "react-router-dom";
import { Card, Alert } from "react-bootstrap";
import { UserContext } from "../context/userProvider";
import moment from "moment";

import "../styles/main.scss";
import "../styles/profile.scss";
import "../styles/setQuitStats.scss";

function Profile() {
  const history = useHistory();
  const context = useContext(UserContext);

  const logout = () => {
    localStorage.clear();
    history.push("/");
  };

  let showAlert = false;

  const firstName = context.user.firstName;
  const lastName = context.user.lastName;
  const quitDate = context.user.quitDate;
  const cigCount = context.user.cigCount;
  const cigPerPack = context.user.cigPerPack;
  const moneyPerPack = context.user.moneyPerPack;

  let longQuitDate;
  let daysElapsed;
  let cigAvoided;
  let moneySaved;

  if (quitDate) {
    showAlert = false;

    longQuitDate = moment(quitDate).format("dddd, MMMM Do YYYY");
    daysElapsed = moment().diff(moment(quitDate), "days");
    cigAvoided = cigCount * moment().diff(moment(quitDate), "days");
    moneySaved =
      "$" +
      ((moneyPerPack / cigPerPack) * cigCount * daysElapsed)
        .toFixed(2)
        .toString();
  } else {
    showAlert = true;

    longQuitDate = "n/a";
    daysElapsed = "n/a";
    cigAvoided = "n/a";
    moneySaved = "n/a";
  }

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
            <h1 className="header-profile center">
              {firstName} {lastName}
            </h1>
            <h6 className="sub-header-profile center">
              Good for you for quitting! Here are your quit stats:
            </h6>
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
