/* eslint-disable */
// =====================================================
// FILE: frontend/src/pages/Chatbot/Chatbot.jsx
// DESKRIPSI: Chatbot page
// =====================================================

import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  PaperAirplaneIcon,
  ChatBubbleLeftRightIcon,
  UserIcon,
  ComputerDesktopIcon,
  FaceSmileIcon,
  StarIcon
} from '@heroicons/react/24/outline';

import { Typography, Card, Button, Input, Spinner } from '../../components/atoms';
import { useAuth } from '../../contexts/AuthContext';
import api from '../../services/api';

const Chatbot = () => {
  const { user } = useAuth();
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: 'Halo! Ada yang bisa saya bantu seputar donor darah?',
      sender: 'bot',
      timestamp: new Date()
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [showRating, setShowRating] = useState(false);
  const [rating, setRating] = useState(0);
  const [ratingMessage, setRatingMessage] = useState('');
  const messagesEndRef = useRef(null);
  const chatContainerRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!inputMessage.trim()) return;

    const userMessage = {
      id: Date.now(),
      text: inputMessage,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsTyping(true);

    try {
      const response = await api.post('/chatbot/message', {
        message: inputMessage
      });

      const botMessage = {
        id: Date.now() + 1,
        text: response.data.data.response,
        sender: 'bot',
        timestamp: new Date(),
        intent: response.data.data.intent,
        confidence: response.data.data.confidence
      };

      setMessages(prev => [...prev, botMessage]);
      
      // Show rating after 3 messages
      if (messages.length >= 3) {
        setShowRating(true);
      }
    } catch (error) {
      console.error('Chatbot error:', error);
      
      const errorMessage = {
        id: Date.now() + 1,
        text: 'Maaf, terjadi kesalahan. Silakan coba lagi atau hubungi customer service kami.',
        sender: 'bot',
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleQuickQuestion = (question) => {
    setInputMessage(question);
  };

  const handleRating = async () => {
    if (rating === 0) return;

    try {
      await api.post('/chatbot/rate', {
        rating,
        message: ratingMessage
      });
      setShowRating(false);
      setRating(0);
      setRatingMessage('');
    } catch (error) {
      console.error('Error submitting rating:', error);
    }
  };

  const quickQuestions = [
    'Syarat donor darah',
    'Dimana lokasi donor terdekat',
    'Cek stok darah',
    'Jadwal donor',
    'Manfaat donor darah',
    'Setelah donor'
  ];

  const formatTime = (date) => {
    return new Date(date).toLocaleTimeString('id-ID', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="h-[calc(100vh-8rem)] flex flex-col">
      {/* Header */}
      <Card className="rounded-b-none border-b-0 flex-shrink-0">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
            <ChatBubbleLeftRightIcon className="w-5 h-5 text-primary-600" />
          </div>
          <div>
            <Typography variant="h6" className="mb-1">
              Asisten DarahKita
            </Typography>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              <Typography variant="caption" color="secondary">
                Online • Siap membantu
              </Typography>
            </div>
          </div>
        </div>
      </Card>

      {/* Messages Container */}
      <div 
        ref={chatContainerRef}
        className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50"
      >
        {messages.map((message) => (
          <motion.div
            key={message.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div className={`flex items-start space-x-2 max-w-[70%] ${message.sender === 'user' ? 'flex-row-reverse space-x-reverse' : ''}`}>
              {/* Avatar */}
              <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                message.sender === 'user' 
                  ? 'bg-primary-100' 
                  : 'bg-gray-200'
              }`}>
                {message.sender === 'user' ? (
                  <UserIcon className="w-4 h-4 text-primary-600" />
                ) : (
                  <ComputerDesktopIcon className="w-4 h-4 text-gray-600" />
                )}
              </div>

              {/* Message Bubble */}
              <div>
                <div className={`
                  rounded-2xl p-3
                  ${message.sender === 'user'
                    ? 'bg-primary-600 text-white rounded-br-none'
                    : 'bg-white text-gray-900 rounded-bl-none shadow-sm'
                  }
                `}>
                  <Typography variant="body2" className="whitespace-pre-wrap">
                    {message.text}
                  </Typography>
                </div>
                
                {/* Timestamp */}
                <Typography 
                  variant="caption" 
                  color="secondary" 
                  className={`mt-1 block ${message.sender === 'user' ? 'text-right' : 'text-left'}`}
                >
                  {formatTime(message.timestamp)}
                </Typography>

                {/* Intent info (for bot messages) */}
                {message.sender === 'bot' && message.intent && (
                  <Typography variant="caption" color="secondary" className="mt-1 block">
                    Topik: {message.intent} • Akurasi: {Math.round(message.confidence * 100)}%
                  </Typography>
                )}
              </div>
            </div>
          </motion.div>
        ))}

        {/* Typing Indicator */}
        {isTyping && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex justify-start"
          >
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                <ComputerDesktopIcon className="w-4 h-4 text-gray-600" />
              </div>
              <div className="bg-white rounded-2xl p-4 shadow-sm">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
              </div>
            </div>
          </motion.div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Quick Questions */}
      <div className="bg-white px-4 py-2 border-t border-gray-200 overflow-x-auto">
        <div className="flex space-x-2">
          {quickQuestions.map((question, index) => (
            <button
              key={index}
              onClick={() => handleQuickQuestion(question)}
              className="flex-shrink-0 px-4 py-2 bg-gray-100 text-gray-700 rounded-full text-sm hover:bg-gray-200 transition-colors"
            >
              {question}
            </button>
          ))}
        </div>
      </div>

      {/* Rating Modal */}
      {showRating && (
        <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <Card className="max-w-md w-full mx-4">
            <Typography variant="h6" className="mb-4">
              Nilai Layanan Chatbot
            </Typography>
            
            <div className="space-y-4">
              {/* Star Rating */}
              <div className="flex justify-center space-x-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    onClick={() => setRating(star)}
                    className="focus:outline-none"
                  >
                    <StarIcon 
                      className={`w-8 h-8 ${
                        star <= rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
                      }`}
                    />
                  </button>
                ))}
              </div>

              {/* Feedback Input */}
              <Input
                placeholder="Kritik atau saran (opsional)"
                value={ratingMessage}
                onChange={(e) => setRatingMessage(e.target.value)}
              />

              {/* Actions */}
              <div className="flex space-x-2">
                <Button
                  variant="outline"
                  fullWidth
                  onClick={() => setShowRating(false)}
                >
                  Nanti
                </Button>
                <Button
                  variant="primary"
                  fullWidth
                  onClick={handleRating}
                  disabled={rating === 0}
                >
                  Kirim Penilaian
                </Button>
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* Input Form */}
      <form onSubmit={handleSendMessage} className="bg-white p-4 border-t border-gray-200">
        <div className="flex space-x-2">
          <Input
            type="text"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            placeholder="Ketik pesan Anda..."
            className="flex-1"
          />
          <Button
            type="submit"
            disabled={!inputMessage.trim() || isTyping}
          >
            <PaperAirplaneIcon className="w-5 h-5" />
          </Button>
        </div>

        {/* Typing indicator text */}
        <Typography variant="caption" color="secondary" className="mt-2 block text-center">
          Chatbot akan menjawab pertanyaan seputar donor darah, PMI, dan stok darah
        </Typography>
      </form>
    </div>
  );
};

export default Chatbot;