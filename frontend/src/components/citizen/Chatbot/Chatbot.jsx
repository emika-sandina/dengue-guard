import { useState } from 'react'
import './chatbot.css'
import axios from "axios";
import ReactMarkdown from "react-markdown";


function Chatbot() {

    // Controls whether chatbot UI is open or closed
    const [isOpen, setIsOpen] = useState(false);

    // Stores backend response data 
    let[data,setData]=useState("")

    // Stores conversation messages
    const [messages, setMessages] = useState([
    { sender: "bot", text: "Hi! I'm your Dengue Assistant. How can I help you today?" },
    ]);

    // Stores current input typed by the user
    const [input, setInput] = useState("");

    // Function triggered when user sends a message
    const handleSend = () => {

        //Handles emplty inputs
        if (!input.trim()) return;

        const userMessage={sender:"user",text:input}
        // Add user message to chat
        setMessages((prevMessages)=>[...prevMessages,userMessage]);

        //Clears the input field
        setInput("")

        //Send a post request to backend
        axios.post('http://localhost:5000/chatbot/ask',{input})
        .then((res)=>res.data)// Extract response body
        .then((finalRes)=>{
            console.log(finalRes);

            //If the message is succesfull set the bot response
            if (finalRes._status){
                setData=(finalRes.finalData)

                //Label the response and add it to the chat
                const botMessage={sender:"bot",text:finalRes.finalData};
                setMessages((prevMessages=>[...prevMessages,botMessage]))
            } else {
                //Handle errors
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
