import { useState, useEffect } from 'react';
import axios from 'axios';

export default function Messages({ orderId, userId, receiverId }) {
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');

    useEffect(() => {
        const fetchMessages = async () => {
            try {
                const response = await axios.get(`/api/messages/${orderId}`);
                setMessages(response.data);
            } catch (error) {
                console.error('Failed to fetch messages:', error);
            }
        };

        fetchMessages();
    }, [orderId]);

    const handleSendMessage = async () => {
        if (newMessage.trim() === '') return;

        try {
            const response = await axios.post('/api/messages', {
                orderId,
                receiverId,
                content: newMessage,
            });

            setMessages([...messages, response.data]);
            setNewMessage('');
        } catch (error) {
            console.error('Failed to send message:', error);
        }
    };

    return (
        <div className="bg-white p-4 rounded-lg shadow-md">
            <h2 className="text-xl font-bold mb-4">Messages</h2>
            <div className="space-y-4">
                {messages.map((message) => (
                    <div
                        key={message._id}
                        className={`p-2 rounded ${message.senderId === userId ? 'bg-green-100' : 'bg-gray-100'}`}
                    >
                        <p>{message.content}</p>
                        <p className="text-xs text-gray-500">{new Date(message.timestamp).toLocaleString()}</p>
                    </div>
                ))}
            </div>
            <div className="mt-4">
                <textarea
                    className="textarea textarea-bordered w-full"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    rows="3"
                    placeholder="Type your message..."
                ></textarea>
                <button className="btn btn-primary mt-2" onClick={handleSendMessage}>
                    Send
                </button>
            </div>
        </div>
    );
}
