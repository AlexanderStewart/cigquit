import React, { useState, useEffect, useContext } from "react";
import Axios from "axios";
import { withRouter, useHistory } from "react-router-dom";
import { UserContext } from "../context/userProvider";
import { API_HOST } from "../constants";

function Auth(props) {
  const context = useContext(UserContext);
  const history = useHistory();
  const [validated, setValidated] = useState(false);
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem("token");

  useEffect(() => {
    let isMounted = true;
    if (token) {
      validateToken();
    } else {
      history.push("/login");
    }
    return () => { isMounted = false };
  }, []);

  const validateToken = async (e) => {
    const data = { token };

    await Axios.post(`${API_HOST}/api/protected`, data)
      .then((res) => {
        if (res.status === 200) {
          const validated = res.data.validated;
          const user = res.data.user;
          // const formattedUser = user.replace(/"([^"]+)":/g, "$1:");
          if (validated) {
            setValidated(true);
            setLoading(false);
            context.updateUser(user);
          } else {
            setValidated(false);
            setLoading(false);
          }
        }
      })
      .catch((err) => {
        console.log(err);
        setValidated(false);
        setLoading(false);
      });
  };

  if (!token) {
    history.push("/login");
    return null;
  } else {
    if (loading) {
      return null;
      // return (
      //   <div>
      //     <span>Loading</span>
      //   </div>
      // );
    } else {
      if (validated) {
        return <div>{props.children}</div>;
      } else {
        history.push("/login");
        localStorage.removeItem("token");
        return null;
      }
    }
  }
}

export default withRouter(Auth);
