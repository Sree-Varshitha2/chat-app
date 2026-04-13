import React, { useEffect, useRef, useState } from "react";

function App() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const socketRef = useRef(null);

  useEffect(() => {
    // 🔌 Connect to backend
    socketRef.current = new WebSocket("wss://chatapp16.onrender.com");

    socketRef.current.onopen = () => {
      console.log("✅ Connected to server");
    };

    socketRef.current.onmessage = (event) => {
      console.log("📩 Received:", event.data);

      // 🔥 Add message to UI
      setMessages((prev) => [...prev, event.data]);
    };

    socketRef.current.onerror = (error) => {
      console.error("❌ WebSocket error:", error);
    };

    socketRef.current.onclose = () => {
      console.log("🔌 Disconnected");
    };

    return () => {
      socketRef.current.close();
    };
  }, []);

  // 📤 Send message
  const sendMessage = () => {
    if (input.trim() !== "") {
      socketRef.current.send(input);
      setInput("");
    }
  };

  return (
    <div style={{ padding: "20px", fontFamily: "Arial" }}>
      <h2>Real-Time Chat</h2>

      {/* 💬 Chat box */}
      <div
        style={{
          border: "1px solid #ccc",
          height: "300px",
          overflowY: "auto",
          marginBottom: "10px",
          padding: "10px",
        }}
      >
        {messages.length === 0 ? (
          <p>No messages yet</p>
        ) : (
          messages.map((msg, index) => (
            <div key={index} style={{ marginBottom: "5px" }}>
              {msg}
            </div>
          ))
        )}
      </div>

      {/* ✍️ Input */}
      <input
        type="text"
        placeholder="Type message..."
        value={input}
        onChange={(e) => setInput(e.target.value)}
        style={{ width: "80%", padding: "8px" }}
      />

      {/* 📤 Send button */}
      <button
        onClick={sendMessage}
        style={{ padding: "8px 12px", marginLeft: "10px" }}
      >
        Send
      </button>
    </div>
  );
}

export default App;
