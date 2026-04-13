import React, { useEffect, useRef, useState } from "react";

function App() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const socketRef = useRef(null);

  useEffect(() => {
    socketRef.current = new WebSocket("wss://chatapp8.onrender.com");

    socketRef.current.onopen = () => {
      console.log("Connected");
    };

    socketRef.current.onmessage = (event) => {
      console.log("Received:", event.data);
      setMessages((prev) => [...prev, event.data]);
    };

    socketRef.current.onerror = (e) => {
      console.log("Error:", e);
    };

    return () => socketRef.current.close();
  }, []);

  const sendMessage = () => {
    if (input.trim() !== "") {
      socketRef.current.send(input);
      setInput("");
    }
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>Real-Time Chat</h2>

      <div style={{ border: "1px solid gray", height: 300, overflowY: "auto" }}>
        {messages.map((msg, i) => (
          <div key={i}>{msg}</div>
        ))}
      </div>

      <input
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Type message..."
      />

      <button onClick={sendMessage}>Send</button>
    </div>
  );
}

export default App;
