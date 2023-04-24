import React, { useState } from "react";
import axios from 'axios';

const crypto = require('crypto');

const [username, setUsername] = useState("");
const [password, setPassword] = useState("");



const loginfn = ()=>{
  //validate check whether all the form is completed
  function handleSubmit(event) {
    event.preventDefault();

    // Check if all the required fields have been filled in
    if (formData.username && formData.password) {
      // All required fields have been filled in - submit the form
      console.log('Submitting form:', formData);
    } else {
      // Required fields are missing - show an error message
      console.log('All fields are required');
    }
  }

  //hash password
const crypto = require('crypto');
  // Define the plaintext password
  //const password = 'my password';
    // Generate a SHA-256 hash of the password
  const hashedPassword = crypto.createHash('sha256').update(password).digest('hex');
  console.log('Hashed password:', hashedPassword);
    // Hash the message using SHA256
  const hash = crypto.createHash('sha256').update(message).digest('hex');

//axios post backend send to the backendman aka sunny
  const endpointUrl = 'http://localhost:3001/api/auth/login';
  // Define the request body as a JSON object with the hashed message
  const requestBody = { hash: hash };

  // Define additional headers to include in the request
  const headers = { 'Authorization': 'Bearer <token>' };
  // Make a POST request to the backend with the request body and headers using Axios
  axios.post(endpointUrl, requestBody, { headers: headers })
  .then(response => {
    console.log('Received response:', response.data);
  })
  .catch(error => {
    console.error('Error sending request:', error);
  });

//console.log('Hashed message:', hash);
}


function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  function handleUsernameChange(event){
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
        <input type="text" 
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
      <a href="" target="_blank">Forget your password?</a>
      </div>
      <button type="Signin">SIGN IN</button>

      <h1> <br/> Nice to meet you! </h1>
      <h6> tell us a little bit about yourself <br/></h6>
      <h6> and start journey with us</h6>
      <div>
        <button onClick={()=> window.location.href= "/signup"}> Sign Up </button>
      </div>


    </form>
  );
}



export default LoginPage;
