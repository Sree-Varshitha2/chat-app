import React, { useEffect, useRef, useState } from "react";

function App() {
  const [username, setUsername] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");

  const socketRef = useRef(null);

  // 🔌 Connect after login
  useEffect(() => {
    if (isLoggedIn) {
      socketRef.current = new WebSocket("wss://chatapp25.onrender.com");

      socketRef.current.onopen = () => {
        console.log("Connected");
      };

      socketRef.current.onmessage = (event) => {
        setMessages((prev) => [...prev, event.data]);
      };

      socketRef.current.onerror = (err) => {
        console.log("Error:", err);
      };

      return () => socketRef.current.close();
    }
  }, [isLoggedIn]);

  // 📤 Send message
  const sendMessage = () => {
    if (input.trim() !== "") {
      const msg = username + ": " + input;
      socketRef.current.send(msg);
      setInput("");
    }
  };

  // 🔐 LOGIN PAGE
  if (!isLoggedIn) {
    return (
      <div style={{ textAlign: "center", marginTop: "100px" }}>
        <h2>Login</h2>
        <input
          type="text"
          placeholder="Enter your name"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          style={{ padding: "10px", width: "200px" }}
        />
        <br /><br />
        <button
          onClick={() => {
            if (username.trim() !== "") {
              setIsLoggedIn(true);
            }
          }}
          style={{ padding: "10px 20px" }}
        >
          Enter Chat
        </button>
      </div>
    );
  }

  // 💬 CHAT PAGE
  return (
    <div style={{ padding: "20px" }}>
      <h2>Real-Time Chat</h2>
      <p>Welcome, <b>{username}</b></p>

      <div
        style={{
          border: "1px solid #ccc",
          height: "300px",
          overflowY: "auto",
          padding: "10px",
          marginBottom: "10px",
        }}
      >
        {messages.length === 0 ? (
          <p>No messages yet</p>
        ) : (
          messages.map((msg, index) => (
            <div key={index}>{msg}</div>
          ))
        )}
      </div>

      <input
        type="text"
        placeholder="Type message..."
        value={input}
        onChange={(e) => setInput(e.target.value)}
        style={{ width: "70%", padding: "8px" }}
      />

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
