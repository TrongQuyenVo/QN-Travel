import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { RiCloseLine } from 'react-icons/ri';
import { FaComments, FaPaperPlane, FaHistory, FaTrash } from 'react-icons/fa';
import '../styles/ChatBox.css';

const ChatBox = () => {
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [isChatOpen, setIsChatOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [showHistory, setShowHistory] = useState(false);
    const [error, setError] = useState(null);
    const messagesEndRef = useRef(null);

    // Tự động cuộn xuống cuối khi có tin nhắn mới
    useEffect(() => {
        if (messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [messages]);

    useEffect(() => {
        if (isChatOpen && showHistory) {
            fetchChatHistory();
        }
    }, [isChatOpen, showHistory]);

    // 🟢 Lấy lịch sử chat từ backend
    const fetchChatHistory = async () => {
        setLoading(true);
        console.log("📥 Đang lấy lịch sử chat...");
        try {
            const response = await axios.get('http://localhost:5000/api/chat/history', {
                params: { userID: '64fa1a3b5e2c4b2d98a6e7f2' }, // Thay thế bằng ObjectId thật
            });

            console.log("✅ Lịch sử chat nhận được:", response.data);
            setMessages(response.data);
            setError(null);
        } catch (err) {
            console.error('❌ Lỗi khi lấy lịch sử chat:', err);
            setError('Không thể tải lịch sử trò chuyện');
        } finally {
            setLoading(false);
        }
    };

    // 🟢 Xóa lịch sử chat
    const clearChatHistory = async () => {
        if (!window.confirm('Bạn có chắc chắn muốn xóa toàn bộ lịch sử trò chuyện?')) return;
        setLoading(true);
        console.log("🗑 Xóa lịch sử chat...");

        try {
            await axios.delete('http://localhost:5000/api/chat/clear', {
                params: { userID: '64fa1a3b5e2c4b2d98a6e7f2' }, // Thay thế bằng ObjectId thật
            });

            console.log("✅ Đã xóa lịch sử chat!");
            setMessages([]);
            setError(null);
            alert('Đã xóa lịch sử trò chuyện');
        } catch (err) {
            console.error('❌ Lỗi khi xóa lịch sử chat:', err);
            setError('Không thể xóa lịch sử trò chuyện');
        } finally {
            setLoading(false);
        }
    };

    const handleSendMessage = async () => {
        if (newMessage.trim() === '' || loading) return;

        const userMessage = { sender: 'user', content: newMessage, timestamp: new Date() };
        setMessages(prevMessages => [...prevMessages, userMessage]);
        setNewMessage('');
        setLoading(true);

        try {
            const response = await axios.post('http://localhost:5000/api/chat/send', {
                userID: '64fa1a3b5e2c4b2d98a6e7f2', // Thay thế bằng ObjectId thật
                message: newMessage,
            });

            console.log("Phản hồi từ server:", response.data); // Kiểm tra phản hồi thực tế

            const aiReply = response.data.response?.trim() || "AI không có phản hồi.";
            const aiMessage = { sender: 'ai', content: aiReply, timestamp: new Date() };

            setMessages(prevMessages => [...prevMessages, aiMessage]);
        } catch (error) {
            console.error('Lỗi khi gửi tin nhắn:', error);
            setMessages(prevMessages => [...prevMessages, { sender: 'ai', content: "AI không có phản hồi.", timestamp: new Date() }]);
        } finally {
            setLoading(false);
        }
    };

    const formatTime = timestamp => new Date(timestamp).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });

    return (
        <div className="chatbox-container">
            {!isChatOpen ? (
                <div className="chat-icon" onClick={() => setIsChatOpen(true)} title="Mở chat">
                    <FaComments size={30} />
                </div>
            ) : (
                <div className="chat-box">
                    <div className="chat-header">
                        <h3>Trợ lý Du lịch Quảng Nam</h3>
                        <div className="chat-controls">
                            <button className="history-btn" onClick={() => setShowHistory(!showHistory)} title={showHistory ? "Ẩn lịch sử" : "Hiện lịch sử"}><FaHistory /></button>
                            {showHistory && <button className="clear-btn" onClick={clearChatHistory} title="Xóa lịch sử"><FaTrash /></button>}
                            <button className="close-btn" onClick={() => setIsChatOpen(false)} title="Đóng chat"><RiCloseLine /></button>
                        </div>
                    </div>
                    <div className="chat-messages">
                        {messages.length === 0 && !loading && (
                            <div className="welcome-message">
                                <p>Xin chào! Tôi là trợ lý du lịch Quảng Nam. Bạn có thể hỏi tôi về:</p>
                                <ul>
                                    <li>Các địa điểm du lịch nổi tiếng ở Quảng Nam</li>
                                    <li>Khách sạn và nhà nghỉ</li>
                                    <li>Đặc sản và ẩm thực địa phương</li>
                                    <li>Phương tiện di chuyển</li>
                                    <li>Lịch sử và văn hóa Quảng Nam</li>
                                </ul>
                            </div>
                        )}
                        {messages.map((message, index) => (
                            <div key={index} className={`chat-message ${message.sender}`}>
                                <div className="message-content">{message.content}</div>
                                {message.timestamp && <div className="message-time">{formatTime(message.timestamp)}</div>}
                            </div>
                        ))}
                        {loading && (
                            <div className="chat-message ai loading">
                                <div className="typing-indicator"><span></span><span></span><span></span></div>
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>
                    <div className="chat-input">
                        <input type="text" value={newMessage} onChange={(e) => setNewMessage(e.target.value)} placeholder="Nhập tin nhắn..." onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()} disabled={loading} />
                        <button onClick={handleSendMessage} disabled={loading || !newMessage.trim()} className="send-button"><FaPaperPlane /></button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ChatBox;