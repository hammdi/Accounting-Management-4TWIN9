import React, { useState, useRef, useEffect } from "react";
//import { Link } from "react-router-dom";
import { getCurrentUser } from "../services/authService";
import { formatDistanceToNow } from "date-fns";
import { Icon } from "@iconify/react/dist/iconify.js";
import { Link } from 'react-router-dom'; // Importer le composant Link de React Router



// Ajoutez cette fonction à vos utilitaires
const processMessageText = (text, currentUserName) => {
  const parts = text.split(/\[(view_invoice|download_pdf):([^\]]+)\]/g);
  
  return parts.map((part, i) => {
    if (i % 3 === 1) { // Type de lien (view_invoice ou download_pdf)
      const linkType = part;
      const linkValue = parts[i+1];
      i++; // On saute la valeur du lien
      
      if (linkType === 'view_invoice') {
        return (
          <Link
            key={i}
            to={`/invoice-preview/${linkValue}`}
            style={{ color: 'blue', textDecoration: 'underline' }}
          >
            Click here to view
          </Link>
        );
      } else if (linkType === 'download_pdf') {
        return (
          <a
            key={i}
            href={`${process.env.REACT_APP_API_URL}${linkValue}`}
            style={{ color: 'blue', textDecoration: 'underline' }}
            download
          >
            Download PDF Report
          </a>
        );
      }
    }
    return part;
  });
};






const getUserAvatar = (avatar) => {
  if (avatar) {
    // Vérifie si l'avatar est déjà une chaîne Base64
    if (typeof avatar === 'string' && avatar.startsWith('data:image/png;base64,')) {
      return avatar; // L'avatar est déjà au format Base64
    }
    // Si l'avatar est un objet Buffer avec un tableau de données
    if (avatar && avatar.data && Array.isArray(avatar.data)) {
      // Convertir les données du tableau en chaîne Base64
      const base64Avatar = arrayBufferToBase64(new Uint8Array(avatar.data));
      //console.log("Avatar converti en Base64:", base64Avatar); // Affiche l'avatar converti
      return `data:image/png;base64,${base64Avatar}`;
    }

    console.log("L'avatar n'est pas un format valide.");
  }

  return "default-avatar.png"; // Image par défaut si l'avatar est vide ou invalide
};

// Fonction utilitaire pour convertir un tableau Uint8Array en chaîne Base64
const arrayBufferToBase64 = (uint8Array) => {
  let binary = '';
  const len = uint8Array.length;
  for (let i = 0; i < len; i++) {
    binary += String.fromCharCode(uint8Array[i]);
  }
  return window.btoa(binary); // Convertir en Base64
};//////////////////////
const CodeGeneratorLayer = () => {
  // ...
  // Delete chat from history
  const handleDeleteChat = (index) => {
    const updated = chatHistory.filter((_, i) => i !== index);
    setChatHistory(updated);
    localStorage.setItem("codeChatHistory", JSON.stringify(updated));
    // If current messages are from deleted chat, clear them
    if (messages === (chatHistory[index]?.messages || [])) {
      setMessages([]);
      localStorage.removeItem("codeChatMessages");
    }
  };

  // Load persisted messages and track mount status for background responses
  const [messages, setMessages] = useState(() => {
    const stored = localStorage.getItem("codeChatMessages");
    return stored ? JSON.parse(stored) : [];
  });
  const isMounted = useRef(true);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [currentUser, setCurrentUser] = useState({ name: 'You', avatar: 'assets/images/user.png' });
  const chatEndRef = useRef(null);
  const [user, setUser] = useState(null);
useEffect(() => {
    const fetchUser = async () => {
      const userData = await getCurrentUser();
      console.log(userData)
      if (userData) {
        setUser(userData);

      }
    };
    fetchUser().then(r => console.log(""));
  }, []);
  // Chat history state
  const [chatHistory, setChatHistory] = useState(() => {
    const stored = localStorage.getItem("codeChatHistory");
    return stored ? JSON.parse(stored) : [];
  });

  // Handlers for history and new chat
  const handleSelectChat = (index) => {
    const msgs = (chatHistory[index]?.messages) || [];
    localStorage.setItem("codeChatMessages", JSON.stringify(msgs));
    setMessages(msgs);
  };
  const handleNewChat = () => {
    if (messages.length) {
      const title = messages[0]?.text?.slice(0, 20) || `Chat ${chatHistory.length + 1}`;
      const newEntry = { id: Date.now(), title, messages };
      const updated = [newEntry, ...chatHistory];
      setChatHistory(updated);
      localStorage.setItem("codeChatHistory", JSON.stringify(updated));
    }
    localStorage.removeItem("codeChatMessages");
    setMessages([]);
  };

  // Cleanup mount flag on unmount
  useEffect(() => () => { isMounted.current = false; }, []);

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
          avatar: getUserAvatar(user? user.avatar:"")
        });
      }
    })();
  }, []);

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;
    const userMessage = input;
    const timestamp = new Date();
    // Persist user message
    const stored = JSON.parse(localStorage.getItem("codeChatMessages")) || [];
    const userMsg = { sender: "user", text: userMessage, timestamp };
    const updated = [...stored, userMsg];
    localStorage.setItem("codeChatMessages", JSON.stringify(updated));
    if (isMounted.current) setMessages(updated);

    setInput("");
    setLoading(true);

    try {
      const res = await fetch(`${process.env.REACT_APP_API_URL}/api/ai-agent`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ message: userMessage })
      });
      const data = await res.json();
      console.log('AI API response:', data);
      const aiText = data.answer || data.response || data.message || '[No response]';
      // Persist AI response
      const stored2 = JSON.parse(localStorage.getItem("codeChatMessages")) || [];
      const botMsg = { sender: "assistant", text: aiText, timestamp: new Date() };
      const updated2 = [...stored2, botMsg];
      localStorage.setItem("codeChatMessages", JSON.stringify(updated2));
      if (isMounted.current) setMessages(updated2);
    } catch (err) {
      // Persist error message
      const stored3 = JSON.parse(localStorage.getItem("codeChatMessages")) || [];
      const errorMsg = { sender: "assistant", text: "Error: Could not get a response from the AI assistant.", timestamp: new Date() };
      const updated3 = [...stored3, errorMsg];
      localStorage.setItem("codeChatMessages", JSON.stringify(updated3));
      if (isMounted.current) setMessages(updated3);
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
              <button
                onClick={handleNewChat}
                className='btn btn-primary text-sm btn-sm px-12 py-12 w-100 radius-8 d-flex align-items-center justify-content-center gap-2'
              >
                <Icon icon='ri:messenger-line' />
                New Chat
              </button>
            </div>
            <ul className='ai-chat-list scroll-sm pe-24 ps-24 pb-24'>
              <li className='mb-16 mt-0'>
                <span className='text-primary-600 text-sm fw-semibold'>Recent Chats</span>
              </li>
              {chatHistory.map((chat, idx) => (
                <li key={chat.id} className='mb-16 d-flex align-items-center justify-content-between'>
                  <button
                    onClick={() => handleSelectChat(idx)}
                    className='text-line-1 text-secondary-light text-hover-primary-600 border-0 bg-transparent w-100 text-start'
                  >
                    {chat.title}
                  </button>
                  <button
                    onClick={() => handleDeleteChat(idx)}
                    className='btn btn-link btn-sm text-danger p-0 ms-2'
                    title='Delete chat'
                  >
                    <Icon icon='ri:delete-bin-6-line' />
                  </button>
                </li>
              ))}
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
                  const avatarSrc = isUser ? currentUser.avatar : 'assets/images/user.png';
                  return (
                    <div key={idx} className={`chat-message mb-16 ${isUser ? 'user-message' : 'bot-message'}`}>
                      <div className="message-content p-16 radius-8">
                        <div className="d-flex align-items-center mb-8">
                          <img src={avatarSrc} alt={senderName} className="w-44-px h-44-px rounded-circle object-fit-cover me-8" />
                          <strong className="text-lg">{senderName}</strong>
                        </div>
                        {/* <div className="message-text mb-8">
                          {isUser ? msg.text : `Mr/Mrs ${currentUser.name}, ${msg.text}`}
                        </div> */}
<div className="message-text mb-8">
  {isUser ? (
    msg.text
  ) : (
    <>
      Mr/Mrs {currentUser.name}, {processMessageText(msg.text, currentUser.name)}
    </>
  )}
</div>
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