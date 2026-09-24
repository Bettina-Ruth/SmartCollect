import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
    ArrowLeft,
    MessageSquare,
    Phone,
    Calendar,
    IndianRupee,
    Activity,
    Clock,
    FileText,
    Bot,
    Send,
    CheckCircle2,
    Mail,
    Smartphone,
    RefreshCw
} from 'lucide-react';
import Card from '../components/Card';
import Badge from '../components/Badge';
import { apiService } from '../services/api';
import type { Borrower } from '../services/api';
import './BorrowerDetail.css';

interface ChatMessage {
    id: string;
    sender: 'assistant' | 'borrower';
    text: string;
}

type MessageChannel = 'WhatsApp' | 'Email' | 'SMS';

const QUICK_ACTIONS = [
    'View EMI Amount',
    'Payment Options',
    'Request Extension',
    'Request Assistance',
    'Talk to Recovery Agent',
];

function buildGreeting(borrower: Borrower): string {
    const firstName = borrower.name.split(' ')[0];
    const overdueNote = borrower.daysPastDue > 0
        ? ` Your account is currently ${borrower.daysPastDue} day(s) past due.`
        : '';

    return `Hi ${firstName}, I'm your Repayment Assistant for your ${borrower.loanType} loan. Your current EMI is ₹${borrower.emiAmount.toLocaleString('en-IN')}.${overdueNote} How can I help you today?`;
}

function getAssistantReply(userText: string, borrower: Borrower): string {
    const lower = userText.toLowerCase();
    const emi = `₹${borrower.emiAmount.toLocaleString('en-IN')}`;

    if (lower.includes('emi')) {
        return `Your current EMI for your ${borrower.loanType} is ${emi}, due on the 15th of every month.`;
    }

    if (lower.includes('payment option')) {
        return `You can repay via UPI, NetBanking, Debit Card, or at your nearest branch. Would you like a payment link sent to your registered mobile number?`;
    }

    if (lower.includes('extension')) {
        return `I've noted your request for a payment extension. A recovery agent will review your account and get back to you within 24 hours with available options.`;
    }

    if (
        lower.includes("can't pay") ||
        lower.includes('cannot pay') ||
        lower.includes('can not pay') ||
        lower.includes('full amount') ||
        lower.includes('assistance')
    ) {
        return `I understand. You can request repayment assistance or discuss available payment arrangements with a recovery agent.`;
    }

    if (
        lower.includes('recovery agent') ||
        lower.includes('agent') ||
        lower.includes('talk to')
    ) {
        return `Connecting you to a recovery agent. Someone from our team will call you on your registered number shortly to discuss your account.`;
    }

    if (
        lower.includes('overdue') ||
        lower.includes('past due') ||
        lower.includes('status')
    ) {
        return borrower.daysPastDue > 0
            ? `Your account currently shows ${borrower.daysPastDue} day(s) past due. Clearing this at the earliest will help avoid additional charges and protect your credit score.`
            : `Good news — your account has no overdue payments at the moment. You're all caught up!`;
    }

    return `I can help with your EMI amount, payment options, overdue status, extension requests, repayment assistance, or connecting you to a recovery agent. What would you like to know?`;
}

export default function BorrowerDetail() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();

    const [borrower, setBorrower] = useState<Borrower | null>(null);
    const [loading, setLoading] = useState(true);

    const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
    const [chatInput, setChatInput] = useState('');
    const [isAssistantTyping, setIsAssistantTyping] = useState(false);
    const [shareStatus, setShareStatus] = useState<string | null>(null);

    const [messageChannel, setMessageChannel] = useState<MessageChannel>('WhatsApp');
    const [messageVersion, setMessageVersion] = useState(0);
    const [messageStatus, setMessageStatus] = useState<string | null>(null);

    const chatEndRef = useRef<HTMLDivElement>(null);
    const messageIdRef = useRef(0);

    useEffect(() => {
        if (!id) return;

        const fetchBorrower = async () => {
            try {
                const data = await apiService.getBorrowerById(id);
                setBorrower(data || null);
            } catch (error) {
                console.error('Failed to fetch borrower:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchBorrower();
    }, [id]);

    useEffect(() => {
        if (borrower && chatMessages.length === 0) {
            messageIdRef.current += 1;

            setChatMessages([
                {
                    id: `msg-${messageIdRef.current}`,
                    sender: 'assistant',
                    text: buildGreeting(borrower),
                },
            ]);
        }
    }, [borrower]);

    useEffect(() => {
        chatEndRef.current?.scrollIntoView({
            behavior: 'smooth',
        });
    }, [chatMessages, isAssistantTyping]);

    const handleSendMessage = (rawText?: string) => {
        const text = (rawText ?? chatInput).trim();

        if (!text || !borrower || isAssistantTyping) return;

        messageIdRef.current += 1;

        const borrowerMsg: ChatMessage = {
            id: `msg-${messageIdRef.current}`,
            sender: 'borrower',
            text,
        };

        setChatMessages((prev) => [...prev, borrowerMsg]);
        setChatInput('');
        setIsAssistantTyping(true);

        setTimeout(() => {
            messageIdRef.current += 1;

            const reply = getAssistantReply(text, borrower);

            setChatMessages((prev) => [
                ...prev,
                {
                    id: `msg-${messageIdRef.current}`,
                    sender: 'assistant',
                    text: reply,
                },
            ]);

            setIsAssistantTyping(false);
        }, 550);
    };

    const handleShareAssistant = () => {
        setShareStatus('Repayment Assistant prepared for borrower');
    };

    const getCommunicationMessage = () => {
        if (!borrower) return '';

        const firstName = borrower.name.split(' ')[0];
        const emi = borrower.emiAmount.toLocaleString('en-IN');

        if (messageChannel === 'Email') {
            const emailMessages = [
                `Dear ${firstName},

This is a reminder regarding your ${borrower.loanType} EMI of ₹${emi}.

Our records indicate that your payment requires attention. If you are facing temporary financial difficulties, please contact our recovery team to discuss available assistance options.

You can make your payment or request assistance through the available repayment options.

Regards,
Recovery Team`,
                `Dear ${firstName},

We are reaching out regarding your ${borrower.loanType} loan EMI of ₹${emi}.

Please arrange the payment at your earliest convenience. If you are experiencing financial difficulties, our recovery team can help you explore suitable repayment options.

Regards,
Recovery Team`,
                `Dear ${firstName},

Your ${borrower.loanType} EMI of ₹${emi} requires your attention.

Please complete the payment or contact our recovery team if you need assistance with repayment arrangements.

Regards,
Recovery Team`,
            ];

            return emailMessages[messageVersion % emailMessages.length];
        }

        if (messageChannel === 'SMS') {
            const smsMessages = [
                `Dear ${firstName}, your ${borrower.loanType} EMI of ₹${emi} requires attention. Please make your payment or contact our recovery team for assistance.`,
                `Hi ${firstName}, this is a reminder regarding your ${borrower.loanType} EMI of ₹${emi}. Please complete your payment or contact us for repayment assistance.`,
                `${firstName}, your ${borrower.loanType} EMI of ₹${emi} is pending. Please make the payment at your earliest convenience or contact our recovery team for assistance.`,
            ];

            return smsMessages[messageVersion % smsMessages.length];
        }

        const whatsappMessages = [
            `This is a gentle reminder regarding your ${borrower.loanType} EMI of ₹${emi}, which requires attention. If you are facing temporary difficulties, we can help you explore available assistance options.`,
            `Your ${borrower.loanType} EMI of ₹${emi} requires your attention. Please use the repayment option below or request assistance if you are unable to pay at this time.`,
            `We are reaching out regarding your ${borrower.loanType} EMI of ₹${emi}. If you need help with repayment, our recovery team can assist you with available options.`,
        ];

        return whatsappMessages[messageVersion % whatsappMessages.length];
    };

    const handleRegenerateMessage = () => {
        setMessageVersion((current) => current + 1);
        setMessageStatus(null);
    };

    const handleApproveAndSend = () => {
        setMessageStatus(
            `${messageChannel} message approved and queued for sending.`
        );
    };

    if (loading) {
        return (
            <div className="page-container p-8 text-center">
                Loading borrower details...
            </div>
        );
    }

    if (!borrower) {
        return (
            <div className="page-container p-8 text-center">
                <h2>Borrower Not Found</h2>

                <button
                    className="btn btn-outline mt-4"
                    onClick={() => navigate('/borrowers')}
                >
                    Back to Directory
                </button>
            </div>
        );
    }

    const getRiskVariant = (category: string) => {
        if (category === 'High') return 'danger';
        if (category === 'Medium') return 'warning';
        return 'success';
    };

    const riskVariant = getRiskVariant(borrower.riskCategory);
    const firstName = borrower.name.split(' ')[0];
    const emi = borrower.emiAmount.toLocaleString('en-IN');

    return (
        <div className="page-container fade-in detail-layout">
            <div className="detail-header">
                <button
                    className="back-btn"
                    onClick={() => navigate('/borrowers')}
                >
                    <ArrowLeft size={20} />
                    Back to Directory
                </button>

                <div className="detail-actions">
                    <button
                        className="btn btn-outline"
                        onClick={() =>
                            setMessageStatus(
                                'Call request created for the recovery agent.'
                            )
                        }
                    >
                        <Phone size={18} />
                        Call Agent
                    </button>

                    <button
                        className="btn btn-primary"
                        onClick={() =>
                            setMessageStatus(
                                'Notice prepared for this borrower.'
                            )
                        }
                    >
                        <MessageSquare size={18} />
                        Send Notice
                    </button>
                </div>
            </div>

            <div className="detail-grid">
                <div className="detail-sidebar">
                    <Card className="profile-card text-center relative overflow-hidden">
                        <div
                            className={`profile-accent bg-${riskVariant}`}
                        ></div>

                        <div className="avatar-large mx-auto mt-6 mb-4">
                            {borrower.name.charAt(0)}
                        </div>

                        <h2 className="profile-name text-xl font-bold">
                            {borrower.name}
                        </h2>

                        <p className="profile-id text-muted mb-4">
                            {borrower.id}
                        </p>

                        <Badge
                            variant={riskVariant}
                            className="mb-6"
                        >
                            {borrower.riskCategory} Risk
                        </Badge>

                        <div className="contact-info border-t pt-4 text-left">
                            <div className="info-row">
                                <Phone
                                    size={16}
                                    className="text-muted"
                                />
                                <span>+91 98765 43210</span>
                            </div>

                            <div className="info-row">
                                <MessageSquare
                                    size={16}
                                    className="text-muted"
                                />
                                <span>
                                    {firstName.toLowerCase()}@email.com
                                </span>
                            </div>
                        </div>
                    </Card>

                    <Card
                        title="Loan Summary"
                        className="mt-6"
                    >
                        <div className="summary-grid">
                            <div className="summary-item">
                                <span className="summary-label">
                                    Loan Type
                                </span>

                                <div className="summary-value flex items-center gap-2">
                                    <FileText
                                        size={16}
                                        className="text-blue"
                                    />
                                    {borrower.loanType}
                                </div>
                            </div>

                            <div className="summary-item">
                                <span className="summary-label">
                                    EMI Amount
                                </span>

                                <div className="summary-value flex items-center gap-2">
                                    <IndianRupee
                                        size={16}
                                        className="text-orange"
                                    />
                                    ₹{emi}
                                </div>
                            </div>

                            <div className="summary-item">
                                <span className="summary-label">
                                    Next Due Date
                                </span>

                                <div className="summary-value flex items-center gap-2">
                                    <Calendar
                                        size={16}
                                        className="text-green"
                                    />
                                    15th Oct 2024
                                </div>
                            </div>

                            <div className="summary-item">
                                <span className="summary-label">
                                    Days Past Due
                                </span>

                                <div
                                    className={`summary-value flex items-center gap-2 ${
                                        borrower.daysPastDue > 0
                                            ? 'text-danger font-medium'
                                            : ''
                                    }`}
                                >
                                    <Clock size={16} />

                                    {borrower.daysPastDue > 0
                                        ? `${borrower.daysPastDue} Days`
                                        : 'On Time'}
                                </div>
                            </div>
                        </div>
                    </Card>
                </div>

                <div className="detail-main">
                    <Card
                        title="AI Risk Analysis"
                        className="mb-6"
                    >
                        <div className="flex items-center gap-6 mb-8">
                            <div className="risk-score-display">
                                <div
                                    className={`score-ring text-${riskVariant}`}
                                >
                                    <Activity size={32} />

                                    <span className="score-value">
                                        {borrower.riskScore}
                                    </span>
                                </div>

                                <span className="score-desc">
                                    AI Risk Score (out of 100)
                                </span>
                            </div>

                            <div className="flex-1 max-w-md">
                                <h4 className="mb-3 font-medium text-sm text-secondary uppercase tracking-wider">
                                    Top Risk Drivers
                                </h4>

                                <ul className="risk-drivers-list">
                                    <li>
                                        <span className="driver-bullet bg-danger"></span>
                                        <span>
                                            Missed 2 consecutive payments in
                                            last 3 months
                                        </span>
                                    </li>

                                    <li>
                                        <span className="driver-bullet bg-warning"></span>
                                        <span>
                                            Recent decline in monthly average
                                            balance
                                        </span>
                                    </li>

                                    <li>
                                        <span className="driver-bullet bg-warning"></span>
                                        <span>
                                            High credit utilization across
                                            other facilities
                                        </span>
                                    </li>
                                </ul>
                            </div>
                        </div>

                        <div className="recommendation-box">
                            <h4>AI Recommended Strategy</h4>

                            <p className="font-medium text-blue mb-2">
                                {borrower.recommendedAction}
                            </p>

                            <p className="text-sm text-muted mb-4">
                                Based on the borrower's digital footprint and
                                historical recovery patterns, this strategy
                                provides a targeted recovery approach.
                            </p>
                        </div>
                    </Card>

                    <Card title="Generated Communication Preview">
                        <div className="message-preview-container">
                            <div className="message-tabs">
                                <button
                                    className={`tab ${
                                        messageChannel === 'WhatsApp'
                                            ? 'active'
                                            : ''
                                    }`}
                                    onClick={() => {
                                        setMessageChannel('WhatsApp');
                                        setMessageStatus(null);
                                    }}
                                >
                                    WhatsApp
                                </button>

                                <button
                                    className={`tab ${
                                        messageChannel === 'Email'
                                            ? 'active'
                                            : ''
                                    }`}
                                    onClick={() => {
                                        setMessageChannel('Email');
                                        setMessageStatus(null);
                                    }}
                                >
                                    <Mail size={14} />
                                    Email
                                </button>

                                <button
                                    className={`tab ${
                                        messageChannel === 'SMS'
                                            ? 'active'
                                            : ''
                                    }`}
                                    onClick={() => {
                                        setMessageChannel('SMS');
                                        setMessageStatus(null);
                                    }}
                                >
                                    <Smartphone size={14} />
                                    SMS
                                </button>
                            </div>

                            <div className="message-content">
                                {messageChannel === 'WhatsApp' ? (
                                    <div className="whatsapp-bubble">
                                        <p>Dear {firstName},</p>

                                        <p>
                                            {getCommunicationMessage()}
                                        </p>

                                        <p>
                                            Please select an option below to
                                            continue.
                                        </p>

                                        <div className="whatsapp-actions">
                                            <button
                                                className="wa-btn"
                                                onClick={() =>
                                                    setMessageStatus(
                                                        'Payment option selected.'
                                                    )
                                                }
                                            >
                                                Pay ₹{emi}
                                            </button>

                                            <button
                                                className="wa-btn"
                                                onClick={() =>
                                                    setMessageStatus(
                                                        'Assistance request selected.'
                                                    )
                                                }
                                            >
                                                Request Help
                                            </button>
                                        </div>
                                    </div>
                                ) : messageChannel === 'Email' ? (
                                    <div className="message-text-preview">
                                        <div className="email-preview-header">
                                            <strong>
                                                To:
                                            </strong>{' '}
                                            {firstName.toLowerCase()}@email.com
                                        </div>

                                        <div className="email-preview-header">
                                            <strong>
                                                Subject:
                                            </strong>{' '}
                                            Payment Reminder -{' '}
                                            {borrower.loanType} EMI
                                        </div>

                                        <div className="email-preview-body">
                                            {getCommunicationMessage()
                                                .split('\n')
                                                .map((line, index) => (
                                                    <p key={index}>
                                                        {line || '\u00A0'}
                                                    </p>
                                                ))}
                                        </div>
                                    </div>
                                ) : (
                                    <div className="message-text-preview">
                                        <div className="sms-preview-header">
                                            <Smartphone size={16} />
                                            <span>
                                                SMS to +91 98765 43210
                                            </span>
                                        </div>

                                        <p>
                                            {getCommunicationMessage()}
                                        </p>

                                        <span className="sms-character-count">
                                            {getCommunicationMessage().length}{' '}
                                            characters
                                        </span>
                                    </div>
                                )}
                            </div>

                            <div className="message-footer mt-4 flex justify-end gap-3">
                                <button
                                    className="btn btn-outline text-sm py-1"
                                    onClick={handleRegenerateMessage}
                                >
                                    <RefreshCw size={15} />
                                    Regenerate Message
                                </button>

                                <button
                                    className="btn btn-primary text-sm py-1"
                                    onClick={handleApproveAndSend}
                                >
                                    <Send size={15} />
                                    Approve & Send
                                </button>
                            </div>

                            {messageStatus && (
                                <div className="message-status mt-3">
                                    <CheckCircle2 size={16} />
                                    <span>{messageStatus}</span>
                                </div>
                            )}
                        </div>
                    </Card>

                    <Card
                        title="Borrower Repayment Assistant"
                        className="mt-6"
                    >
                        <div className="assistant-intro">
                            <p className="text-sm text-muted">
                                Preview of the self-service assistant{' '}
                                {firstName} will see once this is shared with
                                them.
                            </p>

                            <button
                                className="btn btn-primary text-sm py-1"
                                onClick={handleShareAssistant}
                            >
                                <Bot size={16} />
                                Send Repayment Assistant
                            </button>
                        </div>

                        {shareStatus && (
                            <div className="assistant-share-status">
                                <CheckCircle2 size={16} />
                                <span>{shareStatus}</span>
                            </div>
                        )}

                        <div className="assistant-chat-window">
                            {chatMessages.map((msg) => (
                                <div
                                    key={msg.id}
                                    className={`assistant-chat-row assistant-chat-row-${msg.sender}`}
                                >
                                    <div
                                        className={`assistant-chat-avatar assistant-chat-avatar-${msg.sender}`}
                                    >
                                        {msg.sender === 'assistant' ? (
                                            <Bot size={14} />
                                        ) : (
                                            borrower.name.charAt(0)
                                        )}
                                    </div>

                                    <div className="assistant-chat-bubble">
                                        {msg.text}
                                    </div>
                                </div>
                            ))}

                            {isAssistantTyping && (
                                <div className="assistant-chat-row assistant-chat-row-assistant">
                                    <div className="assistant-chat-avatar assistant-chat-avatar-assistant">
                                        <Bot size={14} />
                                    </div>

                                    <div className="assistant-chat-bubble assistant-chat-bubble-typing">
                                        <span className="assistant-typing-dot"></span>
                                        <span className="assistant-typing-dot"></span>
                                        <span className="assistant-typing-dot"></span>
                                    </div>
                                </div>
                            )}

                            <div ref={chatEndRef} />
                        </div>

                        <div className="assistant-quick-actions">
                            {QUICK_ACTIONS.map((action) => (
                                <button
                                    key={action}
                                    className="assistant-quick-action-btn"
                                    onClick={() =>
                                        handleSendMessage(action)
                                    }
                                    disabled={isAssistantTyping}
                                >
                                    {action}
                                </button>
                            ))}
                        </div>

                        <div className="assistant-chat-input-row">
                            <input
                                type="text"
                                className="assistant-chat-input"
                                placeholder="Type a message as the borrower..."
                                value={chatInput}
                                onChange={(e) =>
                                    setChatInput(e.target.value)
                                }
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter') {
                                        handleSendMessage();
                                    }
                                }}
                                disabled={isAssistantTyping}
                            />

                            <button
                                className="assistant-chat-send-btn"
                                onClick={() => handleSendMessage()}
                                disabled={
                                    isAssistantTyping ||
                                    !chatInput.trim()
                                }
                                title="Send"
                            >
                                <Send size={16} />
                            </button>
                        </div>
                    </Card>
                </div>
            </div>
        </div>
    );
}