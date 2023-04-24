import { useState } from "react";

function Test() {
  //Array Example
  //let arr = ["Sun", "Mint", "Jaja", "Mildmint"]
  const [arr, setArr] = useState(["Sun", "Mint", "Jaja", "Mildmint"]);

  //Usestate
  const [stateTest, setStateTest] = useState("");

  //This is a button function
  const testButton = (args) => {
    console.log("Clicked by: " + args);
  };

  //This is a button function for usestate
  const updateArray = (text) => {
    setArr((current) => [...current, text]);
  };

  //See array content in HTML
  const seeArray = () => {
    console.log(arr);
  };

  return (
    <div>
      <h1>Hello World</h1>
      {/* Normal */}
      <input
        type="button"
        value="My Button"
        onClick={() => testButton("Sun")}
      />
      {/* Mapped */}
      {arr.map((item) => {
        let valueS = `My button if ${item}`;
        return (
          <div key={item}>
            <input
              type="button"
              value={valueS}
              onClick={() => testButton(item)}
            />
          </div>
        );
      })}
      {/* Input form test usestate*/}
      <input
        type="text"
        value={stateTest}
        onChange={(e) => setStateTest(e.target.value)}
      />
      {/* Usestate Array */}
      <button onClick={() => updateArray(stateTest)}>Update</button>
      <button onClick={() => seeArray()}>See</button>
      <h3>{stateTest}</h3>
    </div>
  );
}

export default Test;
