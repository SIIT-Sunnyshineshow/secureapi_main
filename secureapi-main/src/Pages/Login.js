import React, { useState } from "react";

function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [Email, setEmail] = useState("");

  function handleEmailChange(event){
    setEmail(event.target.value);
  }


  function handlePasswordChange(event) {
    setPassword(event.target.value);
  }

  function handleSubmit(event) {
    event.preventDefault();
    console.log(`Email: ${Email} Password: ${password}`);
  }

  return (
    <form onSubmit={handleSubmit}>
      <h1> Sign in to the application </h1>
      <div>
        <label htmlFor="Email">Email:</label>
        <input type="text" 
        id="Email" 
        value={Email} 
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
      <div>
      <a href="" target="_blank">Forget your password?</a>
      </div>
      <button type="Signin">SIGN IN</button>

      <h1> <br/> Nice to meet you! </h1>
      <h6> tell us a little bit about yourself <br/></h6>
      <h6> and start journey with us</h6>
      <div>
      <button type="Signup">SIGN UP</button>
      </div>


    </form>
  );
}

export default LoginPage;
