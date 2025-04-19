import React, { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { getCurrentUser } from "../services/authService";
import { formatDistanceToNow } from "date-fns";
import { Icon } from "@iconify/react/dist/iconify.js";

const CodeGeneratorLayer = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [currentUser, setCurrentUser] = useState({ name: 'You', avatar: 'assets/images/chat/1.png' });
  const chatEndRef = useRef(null);

  useEffect(() => {
    // Auto-scroll to bottom when messages change
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  // Fetch current authenticated user
  useEffect(() => {
    (async () => {
      const user = await getCurrentUser();
      if (user) {
        setCurrentUser({
          name: user.name || user.username,
          avatar: user.avatar || 'assets/images/chat/1.png'
        });
      }
    })();
  }, []);

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;
    const userMessage = input;
    const timestamp = new Date();
    setMessages((msgs) => [
      ...msgs,
      { sender: "user", text: userMessage, timestamp }
    ]);
    setInput("");
    setLoading(true);
    try {
      const res = await fetch("http://localhost:5000/api/ai-agent", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ message: userMessage })
      });
      const data = await res.json();
      console.log('AI API response:', data);
      // Try to use answer, response, or message
      const aiText = data.answer || data.response || data.message || '[No response]';
      setMessages((msgs) => [
        ...msgs,
        { sender: "assistant", text: aiText, timestamp: new Date() }
      ]);
    } catch (err) {
      setMessages((msgs) => [
        ...msgs,
        { sender: "assistant", text: "Error: Could not get a response from the AI assistant.", timestamp: new Date() }
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='row gy-4 flex-wrap-reverse'>
      <div className='col-xxl-3 col-lg-4'>
        <div className='card h-100 p-0'>
          <div className='card-body p-0'>
            <div className='p-24'>
              <Link
                to='/code-generator-new'
                className='btn btn-primary text-sm btn-sm px-12 py-12 w-100 radius-8 d-flex align-items-center justify-content-center gap-2'
              >
                <i className='ri-messenger-line' />
                New Page
              </Link>
            </div>
            <ul className='ai-chat-list scroll-sm pe-24 ps-24 pb-24'>
              {/* ... */}
            </ul>
          </div>
        </div>
      </div>
      <div className='col-xxl-9 col-lg-8'>
        <div className='chat-main card overflow-hidden'>
          <div className='chat-sidebar-single gap-8 justify-content-between cursor-default flex-nowrap'>
            {/* ... */}
          </div>
          <div className="chat-message-list max-h-612-px min-h-612-px">
            <div className="chat-container d-flex flex-column h-100">
              <div className="chat-messages p-24 flex-grow-1 overflow-auto">
                {messages.map((msg, idx) => {
                  const isUser = msg.sender === 'user';
                  const senderName = isUser ? currentUser.name : 'MiLLIM AI';
                  const avatarSrc = isUser ? currentUser.avatar : 'assets/images/wow-dash-favicon.png';
                  return (
                    <div key={idx} className={`chat-message mb-16 ${isUser ? 'user-message' : 'bot-message'}`}>
                      <div className="message-content p-16 radius-8">
                        <div className="d-flex align-items-center mb-8">
                          <img src={avatarSrc} alt={senderName} className="w-44-px h-44-px rounded-circle object-fit-cover me-8" />
                          <strong className="text-lg">{senderName}</strong>
                        </div>
                        <div className="message-text mb-8">{msg.text}</div>
                        {msg.timestamp && (
                          <small className="message-time text-muted">
                            {formatDistanceToNow(new Date(msg.timestamp), { addSuffix: true })}
                          </small>
                        )}
                      </div>
                    </div>
                  );
                })}
                {loading && (
                  <div className="typing-indicator d-flex align-items-center mb-16">
                    <span className="me-8">MiLLIM AI is typing...</span>
                    <span className="spinner-border spinner-border-sm" />
                  </div>
                )}
                <div ref={chatEndRef} />
              </div>
              <div className="chat-input p-24 border-top">
                <form onSubmit={sendMessage} className="d-flex gap-16">
                  <input
                    type="text"
                    className="form-control flex-grow-1"
                    placeholder="Type your message..."
                    value={input}
                    onChange={e => setInput(e.target.value)}
                    disabled={loading}
                    autoFocus
                  />
                  <button type="submit" className="btn btn-primary px-24" disabled={loading || !input.trim()}>
                    <Icon icon={loading ? "ri:loader-4-line" : "ri:send-plane-fill"} />
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CodeGeneratorLayer;
