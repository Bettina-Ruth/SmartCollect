import { useState } from 'react';
import { Send, Paperclip, MoreVertical, Phone, Image as ImageIcon } from 'lucide-react';
import './ChatbotView.css';

interface Message {
    id: number;
    text: string;
    sender: 'ai' | 'user';
    time: string;
    type?: 'text' | 'action';
    actions?: string[];
}

export default function ChatbotView() {
    const [messages, setMessages] = useState<Message[]>([
        {
            id: 1,
            text: "Hello Raj, this is SmartCollect Bank's virtual assistant. We noticed your Auto Loan EMI of ₹14,500 was due on 15th Oct. Are you facing any difficulties in making this payment?",
            sender: 'ai',
            time: '10:30 AM'
        },
        {
            id: 2,
            text: "Yes, I had some unexpected medical expenses this month. I won't be able to pay the full amount.",
            sender: 'user',
            time: '10:35 AM'
        },
        {
            id: 3,
            text: "I understand, Raj. To help you manage this, we can offer a temporary restructuring plan. Would you like to pay 50% now (₹7,250) and defer the rest to next month without penalty?",
            sender: 'ai',
            time: '10:36 AM',
            type: 'action',
            actions: ['Accept Restructuring', 'Talk to Human Agent']
        }
    ]);

    const [inputValue, setInputValue] = useState('');
    const [isTyping, setIsTyping] = useState(false);

    const handleSend = () => {
        if (!inputValue.trim()) return;

        const newMessage: Message = {
            id: messages.length + 1,
            text: inputValue,
            sender: 'user',
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };

        setMessages([...messages, newMessage]);
        setInputValue('');
        setIsTyping(true);

        // Simulate AI response
        setTimeout(() => {
            setIsTyping(false);
            setMessages(prev => [...prev, {
                id: prev.length + 1,
                text: "Thank you for the update. Let me process that request for you.",
                sender: 'ai',
                time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            }]);
        }, 1500);
    };

    const handleAction = (action: string) => {
        const newMessage: Message = {
            id: messages.length + 1,
            text: action,
            sender: 'user',
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };

        setMessages([...messages, newMessage]);
        setIsTyping(true);

        // Simulate AI response based on action
        setTimeout(() => {
            setIsTyping(false);
            const aiResponse = action === 'Accept Restructuring'
                ? "Excellent. I've sent a secure payment link for ₹7,250 to your registered email and SMS. The remaining balance will be adjusted in your next billing cycle."
                : "Transferring you to our recovery specialist, Priya. Please hold for a moment.";

            setMessages(prev => [...prev, {
                id: prev.length + 1,
                text: aiResponse,
                sender: 'ai',
                time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                type: action === 'Accept Restructuring' ? 'action' : 'text',
                actions: action === 'Accept Restructuring' ? ['Pay ₹7,250 Now'] : []
            }]);
        }, 1500);
    };

    return (
        <div className="page-container fade-in chatbot-layout">
            <div className="chatbot-sidebar">
                <h2 className="mb-4">Chatbot Configuration</h2>
                <div className="config-card">
                    <h4>Target Borrower</h4>
                    <select className="config-select">
                        <option>Raj Kumar (High Risk)</option>
                        <option>Priya Sharma (High Risk)</option>
                        <option>Amit Singh (Medium Risk)</option>
                    </select>

                    <h4 className="mt-4">AI Strategy Tone</h4>
                    <select className="config-select">
                        <option>Empathetic & Accommodating</option>
                        <option>Firm & Direct</option>
                        <option>Negotiation Focused</option>
                    </select>

                    <h4 className="mt-4">Language</h4>
                    <select className="config-select">
                        <option>English</option>
                        <option>Hindi</option>
                        <option>Tamil</option>
                    </select>

                    <button className="btn btn-outline w-full mt-6">Reset Conversation</button>
                </div>
            </div>

            <div className="chatbot-main">
                <div className="phone-mockup">
                    <div className="phone-screen">
                        <div className="chat-header">
                            <div className="flex items-center gap-3">
                                <div className="bank-avatar">
                                    SC
                                </div>
                                <div>
                                    <h3 className="chat-name">SmartCollect Virtual Assistant</h3>
                                    <p className="chat-status">Verified Business</p>
                                </div>
                            </div>
                            <div className="flex gap-4 text-white opacity-80">
                                <Phone size={20} />
                                <MoreVertical size={20} />
                            </div>
                        </div>

                        <div className="chat-body">
                            <div className="chat-date">Today</div>

                            {messages.map((msg) => (
                                <div key={msg.id} className={`chat-message-wrapper ${msg.sender === 'user' ? 'user-wrapper' : 'ai-wrapper'}`}>
                                    <div className={`chat-bubble ${msg.sender === 'user' ? 'user-bubble' : 'ai-bubble'}`}>
                                        <p>{msg.text}</p>
                                        <span className="message-time">{msg.time}</span>
                                    </div>

                                    {msg.type === 'action' && msg.actions && (
                                        <div className="action-buttons-container">
                                            {msg.actions.map(action => (
                                                <button
                                                    key={action}
                                                    className="chat-action-btn"
                                                    onClick={() => handleAction(action)}
                                                >
                                                    {action}
                                                </button>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            ))}

                            {isTyping && (
                                <div className="chat-message-wrapper ai-wrapper">
                                    <div className="chat-bubble ai-bubble typing-indicator">
                                        <span className="dot"></span>
                                        <span className="dot"></span>
                                        <span className="dot"></span>
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className="chat-input-area">
                            <button className="chat-icon-btn"><ImageIcon size={22} /></button>
                            <button className="chat-icon-btn"><Paperclip size={22} /></button>
                            <div className="input-container">
                                <input
                                    type="text"
                                    placeholder="Type a message..."
                                    value={inputValue}
                                    onChange={(e) => setInputValue(e.target.value)}
                                    onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                                />
                            </div>
                            <button className="chat-icon-btn send-btn" onClick={handleSend}><Send size={20} /></button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
