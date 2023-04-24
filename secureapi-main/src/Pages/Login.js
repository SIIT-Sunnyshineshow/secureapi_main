import React, { useState } from "react";
import axios from "axios";
import { v4 as uuidv4 } from "uuid";
import { useEffect } from "react";

const crypto = require("crypto");

function LoginPage() {
  const loginfn = () => {
    //validate check whether all the form is completed
    if (!username) {
      console.log("Please fill in the username");
      return;
    }

    if (!password) {
      console.log("Please fill in the password");
      return;
    }

    //hash password
    let raw_pass = password;
    // Generate a SHA-256 hash of the password
    const hashedPassword = crypto
      .createHash("sha256")
      .update(raw_pass)
      .digest("hex");
    //console.log('Hashed password:', hashedPassword);

    //axios post backend send to the backendman aka sunny
    // Make a POST request to the backend with the request body and headers using Axios
    axios
      .post("http://localhost:3001/api/login", {
        username: username,
        credentials: hashedPassword,
        unique: uniqueId,
      })
      .then((response) => {
        if (response.data.code == 200) {
          //Something to save tokens and redirect
          localStorage.setItem("accessToken", response.data.accessToken);
          localStorage.setItem("refreshToken", response.data.refreshToken);
          localStorage.setItem("sessionID ", response.data.sessionID);
          localStorage.setItem("userId ", response.data.userId);
          window.location.replace("/dashboard");
        }
      })
      .catch((error) => {
        console.log("Login failed, please try again");
      });
  };
  let uniqueId = localStorage.getItem("uniqueId");
  if (!uniqueId) {
    uniqueId = uuidv4();
    localStorage.setItem("uniqueId", uniqueId);
  }
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  function handleUsernameChange(event) {
    setUsername(event.target.value);
  }

  function handlePasswordChange(event) {
    setPassword(event.target.value);
  }

  function handleSubmit(event) {
    event.preventDefault();
    console.log(`Username: ${username} Password: ${password}`);
  }

  return (
    <form onSubmit={handleSubmit}>
      <h1> Sign in to the application </h1>
      <div>
        <label htmlFor="username">Username:</label>
        <input
          type="text"
          id="username"
          value={username}
          onChange={handleUsernameChange}
        />
      </div>
      <div>
        <label htmlFor="password">Password:</label>
        <input
          type="password"
          id="password"
          value={password}
          onChange={handlePasswordChange}
        />
      </div>
      <div>
        <a href="" target="_blank">
          Forget your password?
        </a>
      </div>
      <button type="Signin">SIGN IN</button>

      <h1>
        {" "}
        <br /> Nice to meet you!{" "}
      </h1>
      <h6>
        {" "}
        tell us a little bit about yourself <br />
      </h6>
      <h6> and start journey with us</h6>
      <div>
        <button onClick={() => (window.location.href = "/signup")}>
          {" "}
          Sign Up{" "}
        </button>
      </div>
    </form>
  );
}

export default LoginPage;
