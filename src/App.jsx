import { useState } from "react";
import "./app.css";
import Swal from "sweetalert2";
import {AiOutlineLoading} from "react-icons/ai";

import { Configuration, OpenAIApi } from "openai";
const configuration = new Configuration({
  apiKey: "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",
});
const openai = new OpenAIApi(configuration);

const App = () => {
  const [Promptin, setPromptin] = useState("");
  const [gptResponse, setGptResponse] = useState("");
  const [context, setContext] = useState("");
  const [Loading, setLoading] = useState(false);

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
      });
      return;
    }

    if (Promptin.length < 10) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Please Enter the Prompt of atleast 10 characters.",
      });
      return;
    }

    setLoading(true);
    let resp = "";
    try {
      const completion = await openai.createChatCompletion({
        model: "gpt-3.5-turbo-16k",
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
      console.error("Error fetching GPT response:", error);
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Something went wrong. Please try again later.",
        timer: 2000,
      });
    }

    setLoading(false);

    setGptResponse(resp);
  };

  return (
    <div className="bg-blue-400 flex flex-col items-center  h-screen w-screen justify-around">
      <div className="bg-gray-200 w-[80%] h-[50%]  border rounded-2xl ">
        <textarea
          style={{ resize: "none" }}
          className="w-full h-full border-gray-400 rounded-2xl p-4 overflow-y-auto"
          value={gptResponse}
          placeholder="GPT Response will be shown here...n"
          onChange={(e) => setGptResponse(e.target.value)}
        ></textarea>
      </div>

      <div className=" bg-gray-200 w-[80%] h-[40%]  relative border rounded-2xl shadow-lg">
        <textarea
          className="w-full h-[80%] p-4 rounded-2xl border-gray-400 overflow-y-auto"
          onChange={(e) => setPromptin(e.target.value)}
          style={{ resize: "none" }}
          
          placeholder="Enter the Context here..."
        ></textarea>

        <div className="flex absolute bottom-0 mb-2 w-full ">
          <input
            type="text"
            className="ml-2 message-input w-full  rounded border border-gray-700 px-4 py-2 hover:border-[#7f18ef]/40 text-black bg-white"
            placeholder="Type your prompt here..."
            onChange={(e) => setContext(e.target.value)}
            value={context}
          />
          <button
            className="send-button bg-blue-500 hover:bg-blue-800 text-white rounded px-4 py-2 ml-2 mr-2"
            onClick={() => {
              console.log("Clicked");
              simulateGptResponse();
            }}
            disabled={Loading}
          >
            {
              Loading ? <AiOutlineLoading className="animate-spin"/> : "Send"
            }
            
          </button>
        </div>
      </div>
    </div>
  );
};

export default App;
