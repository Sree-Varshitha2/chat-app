import { useEffect, useRef, useState } from "react";
import "./App.css";

function App() {
  const [username, setUsername] = useState("");
  const [nameSubmitted, setNameSubmitted] = useState(false);

  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const ws = useRef(null);

  useEffect(() => {
    ws.current = new WebSocket("ws://localhost:8080");

    ws.current.onmessage = (event) => {
      const data = JSON.parse(event.data);
      setMessages((prev) => [...prev, data]);
    };

    return () => ws.current.close();
  }, []);

  const sendMessage = () => {
    if (input.trim()) {
      const msg = {
        user: username,
        text: input,
      };

      ws.current.send(JSON.stringify(msg));
      setInput("");
    }
  };

  // LOGIN SCREEN
  if (!nameSubmitted) {
    return (
      <div className="login">
        <h2>Enter Username</h2>
        <input
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Your name"
        />
        <button onClick={() => username && setNameSubmitted(true)}>
          Join Chat
        </button>
      </div>
    );
  }

  // CHAT SCREEN
  return (
    <div className="container">
      <h2>Real-Time Chat</h2>

      <div className="chat-box">
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`msg ${msg.user === username ? "right" : "left"}`}
          >
            <b>{msg.user}</b>: {msg.text}
          </div>
        ))}
      </div>

      <div className="input-box">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type message..."
        />
        <button onClick={sendMessage}>Send</button>
      </div>
    </div>
  );
}

export default App;
