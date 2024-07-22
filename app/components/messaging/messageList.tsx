'use client';
import React from 'react';
import { useEffect, useState, useRef, useCallback } from 'react';
import io from 'socket.io-client';

interface Message {
    id: number;
    sender_id: number;
    content: string;
    timestamp: string;
}

export default function MessageList({ userId, friendId }: { userId: number, friendId: number }) {
    const [messages, setMessages] = useState<Message[]>([]);
    const socketRef = useRef<any>(null);
    const chatboxRef = useRef<HTMLDivElement | null>(null);

    const fetchMessages = useCallback(async () => {
        const response = await fetch(`/api/messages/list?userId=${userId}&friendId=${friendId}`);
        const data = await response.json();
        setMessages(data);
    }, [userId, friendId]);

    useEffect(() => {
        fetchMessages();

        // Set up WebSocket connection
        socketRef.current = io('http://localhost:8080/messaging');
        
        socketRef.current.emit('join_conversation', { userId, friendId });
        socketRef.current.on('new_message', (message: Message) => {
            setMessages(prevMessages => [...prevMessages, message]);
        });

        // Clean up on unmount
        return () => {
            if (socketRef.current) {
                socketRef.current.disconnect();
            }
        };
    }, [userId, friendId, fetchMessages]);

    useEffect(() => {
        if (chatboxRef.current) {
            chatboxRef.current.scrollTop = chatboxRef.current.scrollHeight;
        }
    }, [messages]);

    // Format message content to wrap at linelength characters and move from right to left
    const formatMessage = (content: string, isSender: boolean) => {
        const words = content.split(' ');
        let lines: string[] = [];
        let currentLine = '';
        const linelength = 50;

        words.forEach(word => {
            if ((currentLine + word).length > linelength) {
                if (currentLine) {
                    lines.push(currentLine.trim());
                    currentLine = '';
                }
                if (word.length > linelength) {
                    while (word.length > linelength) {
                        lines.push(word.slice(0, linelength));
                        word = word.slice(linelength);
                    }
                    if (word) currentLine = word + ' ';
                } else {
                    currentLine = word + ' ';
                }
            } else {
                currentLine += word + ' ';
            }
        });

        if (currentLine) {
            lines.push(currentLine.trim());
        }

        return lines.map((line, index) => (
            <div key={index} className={`flex ${isSender ? 'justify-end' : 'justify-start'}`}>
                <span>{line}</span>
            </div>
        ));
    };

    return (
        <div ref={chatboxRef} className="min-h-64 h-auto max-h-[78vh] overflow-y-auto mb-4 p-2 border border-blue-900 rounded">
            {messages.map((message) => (
                <div key={message.id} className={`mb-2 flex ${message.sender_id === userId ? 'justify-end' : 'justify-start'}`}>
                    <div className={`p-2 rounded max-w-[75%] ${
                        message.sender_id === userId
                            ? 'border border-blue-400 bg-blue-500 text-white'
                            : 'border border-blue-900 bg-gray-900 text-blue-500'
                    }`}>
                        {formatMessage(message.content, message.sender_id === userId)}
                        {message.timestamp ? (
                            <div className="text-xs text-right text-gray-300">
                                {new Date(message.timestamp).toLocaleString()}
                            </div>
                        ) : (
                            <div className="text-xs text-right text-red-500">No timestamp</div>
                        )}
                    </div>
                </div>
            ))}
        </div>
    );
}