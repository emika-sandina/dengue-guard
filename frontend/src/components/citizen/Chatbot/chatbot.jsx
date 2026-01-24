
import { useState } from 'react'
import './chatbot.css'
import axios from "axios";
import ReactMarkdown from "react-markdown";

function chatbot() {
  

    return (
        <>
        {/* Floating button */}
        {!isOpen && (
            <button
            onClick={() => setIsOpen(true)}
            className="button-class">
            🤖
            </button>
        )}

        {/* Chatbot window */}      
        {isOpen && (
            <div className="Main-Background">
            <div className="chatHeader">
                <h3>DengueGuard Chatbot</h3> 
                <button onClick={() => setIsOpen(false)}>✖</button>
            </div>

            {/* Messages */}
            <div className="messagesBox">
                {messages.map((msg, index) => (
                <div
                    key={index}
                    className={`message ${msg.sender}`}
                >
                    <ReactMarkdown>{msg.text}</ReactMarkdown>
                </div>
                ))}
            </div>

            {/* Input */}
            <div className="chatbotInputSection">
                <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                className="chatbotInput"
                placeholder="Ask about dengue..."
                onKeyDown={(e) => e.key === "Enter" && handleSend()}
                />
                <button onClick={handleSend}>Send</button>
            </div>  
            </div>
        )}
        </>
    )
}

export default chatbot;
