let API = null;

if (process.env.NODE_ENV === "development") {
  API = "http://localhost:3001";
} else if (process.env.NODE_ENV === "production") {
  API = "https://cig-quit.herokuapp.com";
}

export { API as API_HOST };
