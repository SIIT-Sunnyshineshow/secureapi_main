import React, { useState } from "react";
import axios from "axios";

import sha256 from "crypto-js/sha256";

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
      alert("Password and ConfirmPass does not match");
      return;
    }

    //hash password
    // Generate a SHA-256 hash of the password
    let hashedPassword = sha256(password).toString();
    //console.log('Hashed password:', hashedPassword);

    //axios post backend send to the backendman aka sunny
    // Make a POST request to the backend with the request body and headers using Axios
    axios
      .post("http://localhost:8080/api/auth/login", {
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
        alert("Login failed, please try again");
        console.log(error);
      });
  };

  function handleUsernameChange(event) {
    setUsername(event.target.value);
  }

  function handlePasswordChange(event) {
    setPassword(event.target.value);
  }

  function handleConfirmPasswordChange(event) {
    setConfirmPassword(event.target.value);
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
        <label htmlFor="comfirmpassword">Comfirm Password:</label>
        <input
          type="password"
          id="confirmpassword"
          value={confirmPassword}
          onChange={handleConfirmPasswordChange}
        />
      </div>

      <br />
      <button onClick={() => loginfn()}>SIGN UP</button>
    </form>
  );
}

export default RegisterPage;
