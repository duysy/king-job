import React, { useState, useRef, useEffect } from "react";
import { Send, Loader2 } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

interface ChatMessage {
  id?: number;
  sender_address: string;
  sender_name?: string;
  content: string;
  created_at?: string;
}

interface ChatProps {
  messages: ChatMessage[];
  currentUserAddress: string;
  onSendMessage: (message: string) => void;
  isLoading?: boolean;
  className?: string;
}

const Chat: React.FC<ChatProps> = ({
  messages,
  currentUserAddress,
  onSendMessage,
  isLoading = false,
  className = "",
}) => {
  const [newMessage, setNewMessage] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = () => {
    if (!newMessage.trim()) return;
    onSendMessage(newMessage);
    setNewMessage("");
  };

  const formatMessageTime = (timestamp?: string) => {
    if (!timestamp) return "";
    return formatDistanceToNow(new Date(timestamp), { addSuffix: true });
  };

  return (
    <div className={`flex flex-col bg-white rounded-lg shadow ${className}`}>
      {/* Chat Header */}
      <div className="p-4 border-b border-gray-200">
        <h4 className="text-lg font-semibold text-gray-800">Messages</h4>
        <p className="text-sm text-gray-500">{messages.length} messages</p>
      </div>

      {/* Messages Container */}
      <div
        ref={chatContainerRef}
        className="flex-grow overflow-y-auto p-4 space-y-4 max-h-[50vh]"
        style={{
          backgroundImage:
            "radial-gradient(circle at center, #f0f4f8 2px, transparent 2px)",
          backgroundSize: "24px 24px",
        }}
      >
        {messages.length === 0 ? (
          <div className="flex items-center justify-center h-full text-gray-500">
            No messages yet. Start the conversation!
          </div>
        ) : (
          messages.map((msg, idx) => {
            const isCurrentUser = msg.sender_address === currentUserAddress;
            return (
              <div
                key={msg.id || idx}
                className={`flex ${isCurrentUser ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[75%] ${
                    isCurrentUser
                      ? "bg-blue-500 text-white rounded-l-lg rounded-br-lg"
                      : "bg-gray-100 text-gray-800 rounded-r-lg rounded-bl-lg"
                  } p-3 shadow-sm`}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-medium text-sm">
                      {isCurrentUser ? "You" : msg.sender_name || "Unknown"}
                    </span>
                    {msg.created_at && (
                      <span
                        className={`text-xs ${isCurrentUser ? "text-blue-100" : "text-gray-500"}`}
                      >
                        {formatMessageTime(msg.created_at)}
                      </span>
                    )}
                  </div>
                  <p className="break-words">{msg.content}</p>
                </div>
              </div>
            );
          })
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Message Input */}
      <div className="p-4 border-t border-gray-200">
        <div className="flex items-center gap-2">
          <div className="relative flex-grow">
            <input
              type="text"
              className="w-full px-4 py-2 border border-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all pr-12"
              placeholder="Type your message..."
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleSend();
                }
              }}
            />
            <button
              className={`absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-full ${
                newMessage.trim() && !isLoading
                  ? "text-blue-500 hover:bg-blue-50"
                  : "text-gray-400"
              } transition-colors`}
              onClick={handleSend}
              disabled={!newMessage.trim() || isLoading}
            >
              {isLoading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <Send className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>
        <p className="text-xs text-gray-500 mt-2">
          Press Enter to send, Shift + Enter for new line
        </p>
      </div>
    </div>
  );
};

export default Chat;
