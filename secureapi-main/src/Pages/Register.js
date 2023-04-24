import React, { useState } from "react";

function RegisterPage() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  function handleUsernameChange(event) {
    setUsername(event.target.value);
  }

  function handleEmailChange(event) {
    setEmail(event.target.value);
  }

  function handlePasswordChange(event) {
    setPassword(event.target.value);
  }

  function handleSubmit(event) {
    event.preventDefault();
    console.log(
      `Username: ${username}, Email: ${email}, Password: ${password}`
    );
  }

  return (
    // HTML
    <form onSubmit={handleSubmit}>
      <h1> Great to see you back! <br/></h1>
      <h6> <br/>please login with your personal <br/>info </h6>
      <div>
      <button onClick={()=> window.location.href= "/login"}> SIGN IN </button>
      </div>

      <h1> <br/> Create Account</h1>
    
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
        <label htmlFor="email">Email:</label>
        <input
          type="email"
          id="email"
          value={email}
          onChange={handleEmailChange}
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
      <br/>
      <button type="submit">SIGN UP</button>
    </form>
  );
}

export default RegisterPage;
