import React, { useState } from "react";
import axios from "axios";

const crypto = require("crypto");

function RegisterPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
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
    if (password != confirmPassword) {
      console.log("Password and ConfirmPass does not match");
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
      .post("http://localhost:3001/api/register", {
        username: username,
        credentials: hashedPassword,
      })
      .then((response) => {
        if (response.data.code == 200) {
          //Something to save tokens and redirect

          window.location.replace("/login");
        }
      })
      .catch((error) => {
        console.log("Login failed, please try again");
      });
  };

  function handleUsernameChange(event) {
    setUsername(event.target.value);
  }

  function handlePasswordChange(event) {
    setPassword(event.target.value);
  }

  function handleSubmit(event) {
    event.preventDefault();
    console.log(`Username: ${username}, Password: ${password}`);
  }

  return (
    // HTML
    <form onSubmit={handleSubmit}>
      <h1>
        {" "}
        Great to see you back! <br />
      </h1>
      <h6>
        {" "}
        <br />
        please login with your personal <br />
        info{" "}
      </h6>
      <div>
        <button onClick={() => (window.location.href = "/login")}>
          {" "}
          SIGN IN{" "}
        </button>
      </div>

      <h1>
        {" "}
        <br /> Create Account
      </h1>

      <div>
        <label htmlFor="username">Username:</label>
        <input
          type="text"
          id="username"
          value={username}
          onChange={handleUsernameChange}
        />
      </div>
      {/* <div>
        <label htmlFor="email">Email:</label>
        <input
          type="email"
          id="email"
          value={email}
          onChange={handleEmailChange}
        />
      </div> */}
      <div>
        <label htmlFor="password">Password:</label>
        <input
          type="password"
          id="password"
          value={password}
          onChange={handlePasswordChange}
        />
      </div>
      <br />
      <button type="submit">SIGN UP</button>
    </form>
  );
}

export default RegisterPage;
