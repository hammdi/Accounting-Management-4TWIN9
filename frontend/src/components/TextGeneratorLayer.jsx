import { Icon } from '@iconify/react/dist/iconify.js';
import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { formatDistanceToNow } from 'date-fns';

const TextGeneratorLayer = () => {
    const [messages, setMessages] = useState([]);
    const [inputMessage, setInputMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [chatHistory, setChatHistory] = useState([]);
    const messagesEndRef = useRef(null);
    const [error, setError] = useState(null);

    // Fetch chat history on component mount
    useEffect(() => {
        fetchChatHistory();
    }, []);

    // Auto scroll to bottom of messages
    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    // Fetch previous chat history
    const fetchChatHistory = async () => {
        try {
            const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/chat/history`);
            if (response.data.success) {
                setChatHistory(response.data.history);
            }
        } catch (error) {
            console.error('Error fetching chat history:', error);
            setError('Failed to load chat history');
        }
    };

    // Handle sending new message
    const handleSendMessage = async (e) => {
        e.preventDefault();
        if (!inputMessage.trim()) return;

        const newMessage = {
            content: inputMessage,
            timestamp: new Date(),
            type: 'user'
        };

        setMessages(prev => [...prev, newMessage]);
        setInputMessage('');
        setIsLoading(true);

        try {
            const response = await axios.post(`${process.env.REACT_APP_API_URL}/api/chat/message`, {
                message: inputMessage
            });

            if (response.data.success) {
                setMessages(prev => [...prev, {
                    content: response.data.reply,
                    timestamp: new Date(),
                    type: 'bot'
                }]);
            }
        } catch (error) {
            console.error('Error sending message:', error);
            setError('Failed to send message');
        } finally {
            setIsLoading(false);
        }
    };

    // Create new chat
    const handleNewChat = () => {
        setMessages([]);
        setError(null);
    };

    return (
        <div className="row gy-4 flex-wrap-reverse">
            {/* Sidebar with chat history */}
            <div className="col-xxl-3 col-lg-4">
                <div className="card h-100 p-0">
                    <div className="card-body p-0">
                        <div className="p-24">
                            <button
                                onClick={handleNewChat}
                                className="btn btn-primary text-sm btn-sm px-12 py-12 w-100 radius-8 d-flex align-items-center justify-content-center gap-2"
                            >
                                <Icon icon="ri:messenger-line" />
                                New Chat
                            </button>
                        </div>
                        <ul className="ai-chat-list scroll-sm pe-24 ps-24 pb-24">
                            <li className="mb-16 mt-0">
                                <span className="text-primary-600 text-sm fw-semibold">Recent Chats</span>
                            </li>
                            {chatHistory.map((chat, index) => (
                                <li key={index} className="mb-16">
                                    <button
                                        onClick={() => setMessages(chat.messages)}
                                        className="text-line-1 text-secondary-light text-hover-primary-600 border-0 bg-transparent w-100 text-start"
                                    >
                                        {chat.title || 'Chat ' + (index + 1)}
                                        <small className="d-block text-muted">
                                            {formatDistanceToNow(new Date(chat.timestamp), { addSuffix: true })}
                                        </small>
                                    </button>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </div>

            {/* Main chat area */}
            <div className="col-xxl-9 col-lg-8">
                <div className="chat-main card overflow-hidden">
                    <div className="chat-sidebar-single gap-8 justify-content-between cursor-default flex-nowrap">
                        <div className="d-flex align-items-center gap-16">
                            <button
                                onClick={handleNewChat}
                                className="text-primary-light text-2xl line-height-1"
                            >
                                <Icon icon="ri:arrow-left-line" />
                            </button>
                            <h6 className="text-lg mb-0 text-line-1">
                                UI/UX Design Roadmap
                            </h6>
                        </div>
                        <div className="d-flex align-items-center gap-16 flex-shrink-0">
                            <button
                                type="button"
                                className="text-secondary-light text-xl line-height-1 text-hover-primary-600"
                            >
                                <Icon icon="ri:edit-2-line" />
                            </button>
                            <button
                                type="button"
                                className="text-secondary-light text-xl line-height-1 text-hover-primary-600"
                            >
                                <Icon icon="ri:delete-bin-6-line" />
                            </button>
                        </div>
                    </div>
                    {/* chat-sidebar-single end */}
                    <div className="chat-message-list max-h-612-px min-h-612-px">
                        <div className="chat-container d-flex flex-column h-100">
                            {/* Messages area */}
                            <div className="chat-messages p-24 flex-grow-1 overflow-auto">
                                {messages.map((message, index) => (
                                    <div
                                        key={index}
                                        className={`chat-message mb-16 ${
                                            message.type === 'user' ? 'user-message' : 'bot-message'
                                        }`}
                                    >
                                        <div className="message-content p-16 radius-8">
                                            <div className="message-text">{message.content}</div>
                                            <small className="message-time text-muted">
                                                {formatDistanceToNow(new Date(message.timestamp), { addSuffix: true })}
                                            </small>
                                        </div>
                                    </div>
                                ))}
                                {isLoading && (
                                    <div className="typing-indicator">
                                        <span></span>
                                        <span></span>
                                        <span></span>
                                    </div>
                                )}
                                {error && (
                                    <div className="alert alert-danger" role="alert">
                                        {error}
                                    </div>
                                )}
                                <div ref={messagesEndRef} />
                            </div>

                            {/* Input area */}
                            <div className="chat-input p-24 border-top">
                                <form onSubmit={handleSendMessage} className="d-flex gap-16">
                                    <input
                                        type="text"
                                        value={inputMessage}
                                        onChange={(e) => setInputMessage(e.target.value)}
                                        placeholder="Message wowdash..."
                                        className="form-control flex-grow-1"
                                        disabled={isLoading}
                                    />
                                    <button
                                        type="submit"
                                        className="btn btn-primary px-24"
                                        disabled={isLoading || !inputMessage.trim()}
                                    >
                                        <Icon icon={isLoading ? "ri:loader-4-line" : "ri:send-plane-fill"} />
                                    </button>
                                </form>
                            </div>
                        </div>
                    </div>
                    <form className="chat-message-box">
                        <input
                            type="text"
                            name="chatMessage"
                            placeholder="Message wowdash..."
                        />
                        <button
                            type="submit"
                            className="w-44-px h-44-px d-flex justify-content-center align-items-center radius-8 bg-primary-600 text-white bg-hover-primary-700 text-xl"
                        >
                            <Icon icon="f7:paperplane" />
                        </button>
                    </form>
                </div>
            </div>
        </div>

    )
}

export default TextGeneratorLayer