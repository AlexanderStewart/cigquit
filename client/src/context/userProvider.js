import React, { useState } from "react";

export const UserContext = React.createContext();

const initialUserValue = {
  id: null,
  email: "",
  firstName: "",
  lastName: "",
  quitDate: null,
  cigCount: null,
  cigPerPack: null,
  moneyPerPack: null,
};

function UserProvider(props) {
  const [user, setUser] = useState(initialUserValue);

  const updateUser = (e) => {
    setUser(e);
  };

  const updateStats = (e) => {
    setUser({
      ...user,
      quitDate: e.quitDate,
      cigCount: e.cigCount,
      cigPerPack: e.cigPerPack,
      moneyPerPack: e.moneyPerPack,
    });
  };

  const value = {
    user,
    updateUser,
    updateStats,
  };

  return (
    <UserContext.Provider value={value}>{props.children}</UserContext.Provider>
  );
}

export default UserProvider;
