import { useState } from 'react'
import './chatbot.css'
import axios from "axios";
import ReactMarkdown from "react-markdown";


function Chatbot() {
    const [isOpen, setIsOpen] = useState(false);
    let[data,setData]=useState("")
    const [messages, setMessages] = useState([
    { sender: "bot", text: "Hi! I'm your Dengue Assistant. How can I help you today?" },
    ]);
    const [input, setInput] = useState("");

    const handleSend = () => {
        if (!input.trim()) return;

        const userMessage={sender:"user",text:input}
        setMessages((prevMessages)=>[...prevMessages,userMessage]);
        setInput("")
        axios.post(`${import.meta.env.VITE_API_URL }/chatbot/ask`,{input})
        .then((res)=>res.data)
        .then((finalRes)=>{
            console.log(finalRes);

            if (finalRes._status){
                setData=(finalRes.finalData)

                const botMessage={sender:"bot",text:finalRes.finalData};
                setMessages((prevMessages=>[...prevMessages,botMessage]))
            } else {
                const botMessage= {sender:"bot",text:"Sorry I encounterd an error.Please try again."}
                setMessages((prevMessages=>[...prevMessages,botMessage]))
            }
        })
        
    };
  

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

export default Chatbot;
