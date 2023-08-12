import { useState, useEffect } from "react";
import "./app.css";
import Swal from "sweetalert2";
import { AiOutlineLoading, AiOutlineSetting } from "react-icons/ai";
import BlurBackgroundComponent from "./Midst";

import { Configuration, OpenAIApi } from "openai";
const configuration = new Configuration({
  apiKey: import.meta.env.VITE_OPENAI_KEY,
});
const openai = new OpenAIApi(configuration);

const App = () => {
  const [Promptin, setPromptin] = useState("");
  const [gptResponse, setGptResponse] = useState("");
  const [context, setContext] = useState("");
  const [Loading, setLoading] = useState(false);
  const [Models, setModels] = useState("gpt-3.5-turbo-16k");
  const [Menu, setMenu] = useState(false);
  const [Auth, setAuth] = useState(false);

  useEffect(() => {
    if (localStorage.getItem("password") === "passwordispassword") {
      setAuth(true);
    }
  }, []);

  const simulateGptResponse = async () => {
    if (
      context === "" ||
      context === undefined ||
      context === null ||
      context.length < 10
    ) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Please Enter the Context of atleast 10 characters.",
        timer: 2000,
      });
      return;
    }

    if (Promptin.length < 10) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Please Enter the Prompt of atleast 10 characters.",
        timer: 2000,
      });
      return;
    }

    if (!Auth) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Please Authenticate yourself First From the Setting Menu.",
        timer: 2000,
      });
      setMenu(true);
      return;
    }

    setLoading(true);
    let resp = "";
    try {
      const completion = await openai.createChatCompletion({
        model: Models,
        messages: [
          {
            role: "system",
            content:
              "You are a helpful assistant.You have to Follow the instructions given by the user and help him/her to efficiently complete the Prompt Task on the Context Give by the User.The Response Should be Properly Formated with \n or in Points etc. The Prompt is  : " +
              Promptin,
          },
          {
            role: "user",
            content: "Context : " + context,
          },
        ],
      });

      resp = completion.data.choices[0].message.content;
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: error.response.data.error.code,
        text: error.response.data.error.message,
        timer: 10000,
      });
    }

    setLoading(false);

    setGptResponse(resp);
  };

  return (
    <div className="bg-blue-400 flex flex-col items-center  h-screen w-screen justify-around">
      <button
        className="absolute top-2 right-4"
        onClick={() => {
          setMenu(!Menu);
          console.log(Models);
        }}
      >
        <AiOutlineSetting className="text-2xl text-black" />
      </button>
      {Menu ? (
        <>
          <div className="bg-gray-200 border rounded-2xl ">
            <BlurBackgroundComponent
              setMenu={setMenu}
              Models={Models}
              setModels={setModels}
              Auth={Auth}
              setAuth={setAuth}
            />
          </div>
        </>
      ) : (
        <>
          {" "}
          <div className="bg-gray-200 w-[80%] h-[50%]  border rounded-2xl ">
            <textarea
              style={{ resize: "none" }}
              className="w-full h-full border-gray-400 rounded-2xl p-4 overflow-y-auto"
              value={gptResponse}
              placeholder="GPT Response will be shown here..."
              onChange={(e) => setGptResponse(e.target.value)}
            ></textarea>
          </div>
          <div className=" bg-gray-200 w-[80%] h-[40%]  relative border rounded-2xl shadow-lg flex flex-col justify-between">
            <textarea
              className="w-full h-[60%] md:h-[80%] p-4 rounded-2xl border-gray-400 overflow-y-auto"
              onChange={(e) => setContext(e.target.value)}
              style={{ resize: "none" }}
              placeholder="Enter the Context here..."
              value={context}
            ></textarea>

            <div className="flex flex-col md:flex-row bottom-0 mb-2 w-full ">
              <input
                type="text"
                className="message-input md:w-full  rounded border border-gray-700 hover:border-[#7f18ef]/40 text-black bg-white mb-4 md:mb-0 px-4 py-2 ml-2 mr-2"
                placeholder="Type your prompt here..."
                onChange={(e) => setPromptin(e.target.value)}
                value={Promptin}
              />
              <button
                className="send-button bg-blue-500 hover:bg-blue-800 text-white rounded px-4 py-2 ml-2 mr-2 items-center flex justify-center"
                onClick={() => {
                  console.log("Clicked");
                  simulateGptResponse();
                }}
                disabled={Loading}
              >
                {Loading ? (
                  <AiOutlineLoading className="animate-spin" />
                ) : (
                  "Send"
                )}
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default App;
