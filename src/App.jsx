import { useState } from "react";

const App = () => {
  const [userInput, setUserInput] = useState("");
  const [gptResponse, setGptResponse] = useState("");
  const [userInputHistory, setUserInputHistory] = useState([]);

  const simulateGptResponse = async () => {
    try {
      const prompt = userInput;

      const apiUrl = "https://api.openai.com/v1/chat/completions";
      const apiKey = "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"; 

      const requestData = {
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content: "You are a helpful assistant.",
          },
          {
            role: "user",
            content: prompt,
          },
        ],
        stream: true,
      };

      const response = await fetch(apiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify(requestData),
      });

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const data = await response.json();
      if (data.choices && data.choices.length > 0) {
        const generatedResponse = data.choices[0].message.content;
        setGptResponse(generatedResponse);
        setUserInputHistory([...userInputHistory, userInput]);
      } else {
        console.error("Invalid API response format:", data);
      }
    } catch (error) {
      console.error("Error fetching GPT response:", error);
    }
  };

  
return (
    <div className='bg-blue-400 flex flex-col items-center justify-center h-screen w-screen'>

      <div className='bg-gray-200 w-[80%] h-[50%] overflow-y-scroll border rounded-lg shadow-lg'>
        <div className="ml-2 mr-2 mt-2 mb-2 h-full border shadow-lg">
          <textarea className='w-full h-[80%] p-4 mt-2 border-gray-400'  value={gptResponse}readOnly >
          </textarea>
        </div>
      </div>

      <div className='mt-8 bg-gray-200 w-[80%] h-[30%] overflow-y-scroll relative border rounded-lg shadow-lg'>
        <div className='ml-2 mr-2 mt-2 mb-2 h-full border shadow-lg'>
          <textarea className='w-full h-[70%] p-4 mt-2 border-gray-400' id="lowerTextarea" readOnly>
          {userInputHistory.map((input, index) => (
              <div key={index}>{input}</div>
            ))}
          </textarea>
        </div>

        <div className="flex absolute bottom-0 mb-2 w-full">
          <input
            type="text"
            className="ml-2 message-input w-full rounded border border-gray-700 px-4 py-2 hover:border-[#7f18ef]/40 text-black bg-white"
            placeholder="Type your prompt here..."
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
          />
          <button className="send-button bg-blue-500 hover:bg-blue-800 text-white rounded px-4 py-2 ml-2 mr-2"
            onClick={() => {
              const textarea = document.getElementById("lowerTextarea");
              textarea.value = userInput;
              simulateGptResponse();
            }}
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
}

export default App;

//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