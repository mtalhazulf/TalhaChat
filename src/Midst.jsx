import React, { useState, useEffect } from "react";
import { FaTimes } from "react-icons/fa"; // Import the close icon from React Icons

const BlurBackgroundComponent = (props) => {
  const [password, setPassword] = useState(
    localStorage.getItem("password") || ""
  );
  const [Models, setModels] = useState(props.Models);

  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
  };

  useEffect(() => {
    if (localStorage.getItem("password") === "passwordispassword") {
      props.setAuth(true);
    }
  }, []);

  const handleAuthentication = () => {
    if (password === "passwordispassword") {
      props.setAuth(true);
      localStorage.setItem("password", password);
    } else {
      alert("Incorrect password. Try again.");
    }
  };

  const handleCloseClick = () => {
    // Implement the close logic here
    console.log("Close button clicked");
    props.setMenu(false);
  };

  return (
    <>
      <div className="flex flex-col justify-center items-center rounded-2xl p-4 bg-white relative">
        <div className="absolute inset-0 bg-blur-image blur"></div>
        <div className="z-10 text-center ">
          <button onClick={handleCloseClick}>
            <FaTimes className="text-2xl text-black" />
          </button>
          {props.Auth ? (
            <div className="p-4 m-4">
              <h1 className="text-3xl font-semibold">Authenticated</h1>
              <button
                className="text-xl font-semibold bg-red-200 rounded-2xl p-4 mt-4"
                onClick={() => {
                  props.setAuth(false);
                  localStorage.removeItem("password");
                }}
              >
                Remove Authentication
              </button>
            </div>
          ) : (
            <div className="flex flex-col md:flex-row">
              <input
                type="password"
                value={password}
                onChange={handlePasswordChange}
                placeholder="Password"
                className="p-4 rounded-md shadow-md focus:outline-none m-4"
              />
              <button
                onClick={handleAuthentication}
                className="p-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none m-4"
              >
                Authenticate
              </button>
            </div>
          )}
        </div>

        <div className="flex flex-col md:flex-row justify-between relative">
          <h1 className="bg-gray-300 p-4 m-2 font-bold rounded-2xl z-10">
            Model
          </h1>
          <select
            className="bg-gray-300 rounded-2xl m-2 p-4 cursor-pointer z-20"
            value={props.Models}
            onChange={(e) => props.setModels(e.target.value)}
          >
            <option
              value="gpt-3.5-turbo-16k"
              {...(props.Models === "gpt-3.5-turbo-16k"
                ? { selected: true }
                : {})}
            >
              GPT-3.5 Turbo
            </option>
            <option
              value="gpt-4"
              {...(props.Models === "gpt-4" ? { selected: true } : {})}
            >
              GPT-4
            </option>
            <option
              value="gpt-4-32k"
              {...(props.Models === "gpt-4-32k" ? { selected: true } : {})}
            >
              GPT 4 32K
            </option>
          </select>
        </div>
      </div>
    </>
  );
};

export default BlurBackgroundComponent;
