import React, { useEffect, useRef, useState } from 'react';
import { MdAttachFile, MdSend } from 'react-icons/md';
import { useChatContext } from '../Context/ChatContext';
import SockJS from 'sockjs-client';
import { baseURL, getMessages } from '../Service/RoomService';
import { Stomp } from '@stomp/stompjs';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router';
import { timeAgo } from '../Service/ShowTime';

function ChatPage() {
  const { roomId, currentUser, connected, setConnected, setRoomId, setCurrentUser } = useChatContext();
  const navigate = useNavigate();
  const chatBoxRef = useRef(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const stompClientRef = useRef(null);
  const subscriptionRef = useRef(null);

  // 🚀 Load messages from DB
  useEffect(() => {
    async function loadMessages() {
      try {
        const oldMessages = await getMessages(roomId);
        oldMessages.sort((a, b) => new Date(a.timeStamp) - new Date(b.timeStamp));
        setMessages(oldMessages);
      } catch (error) {
        toast.error("Failed to load messages");
        console.error(error);
      }
    }

    if (roomId) {
      loadMessages();
    }
  }, [roomId]);

  // 🔄 Auto-scroll to bottom
  useEffect(() => {
    const timeout = setTimeout(() => {
      if (chatBoxRef.current) {
        chatBoxRef.current.scroll({
          top: chatBoxRef.current.scrollHeight,
          behavior: 'smooth',
        });
      }
    }, 100); // small delay to wait for DOM update
    return () => clearTimeout(timeout);
  }, [messages]);

  // 🔒 Redirect if not connected
  useEffect(() => {
    if (!connected || !roomId || !currentUser) {
      navigate('/');
    }
  }, [connected, roomId, currentUser]);

  // 🔌 Setup WebSocket connection
  useEffect(() => {
    const socket = new SockJS(`${baseURL.replace('/room', '')}/chat`);
    const client = Stomp.over(socket);

    client.connect({}, () => {
      stompClientRef.current = client;
      toast.success('Connected to chat');

      const subscription = client.subscribe(`/topic/room/${roomId}`, (message) => {
        const newMessage = JSON.parse(message.body);
        setMessages((prev) => {
          const updated = [...prev, newMessage];
          return updated.sort((a, b) => new Date(a.timeStamp) - new Date(b.timeStamp));
        });
      });

      subscriptionRef.current = subscription;
    }, (error) => {
      toast.error('WebSocket connection failed');
      console.error(error);
    });

    return () => {
      if (subscriptionRef.current) {
        subscriptionRef.current.unsubscribe();
        subscriptionRef.current = null;
      }
      if (stompClientRef.current) {
        stompClientRef.current.disconnect(() => {
          console.log('WebSocket disconnected');
        });
        stompClientRef.current = null;
      }
    };
  }, [roomId]);

  // 📨 Send message
  const sendMessage = () => {
    if (stompClientRef.current && input.trim()) {
      const msgObject = {
        content: input,
        sender: currentUser,
        timeStamp: new Date().toISOString() // important: backend should expect this
      };
      stompClientRef.current.send(`/app/sendMessage/${roomId}`, {}, JSON.stringify(msgObject));
      setInput('');
    }
  };

  // 🔓 Leave Room
  const handleLogout = () => {
    if (stompClientRef.current) {
      stompClientRef.current.disconnect();
      stompClientRef.current = null;
    }
    setConnected(false);
    setRoomId('');
    setCurrentUser('');
    navigate('/');
  };

  return (
    <div>
      {/* 🧭 Header */}
      <header className='flex justify-around border-gray-50 shadow p-5 items-center fixed w-full bg-white z-10'>
        <div><h1 className='text-xl font-semibold'>Room: <span>{roomId}</span></h1></div>
        <div><h1 className='text-xl font-semibold'>User: <span>{currentUser}</span></h1></div>
        <div><button onClick={handleLogout} className='bg-red-500 px-3 py-2 rounded-full text-white'>Leave Room</button></div>
      </header>

      {/* 💬 Message List */}
      <main ref={chatBoxRef} className="pt-24 pb-24 px-4 overflow-auto h-screen mx-auto bg-slate-600 w-2/3">
        <div className="text-white space-y-4">
          {messages.map((message, index) => {
            const isSender = message.sender === currentUser;
            return (
              <div key={index} className={`flex ${isSender ? 'justify-end' : 'justify-start'}`}>
                <div className={`p-3 rounded w-fit max-w-[80%] ${isSender ? 'bg-blue-700' : 'bg-green-800'}`}>
                  <p className="text-sm text-gray-300 font-bold">
                    {message.sender}
                    <span className="ml-3 text-gray-400 text-xs font-normal">
                      {timeAgo(message.timeStamp)}
                    </span>
                  </p>
                  <p className="text-base">{message.content}</p>
                </div>
              </div>
            );
          })}
        </div>
      </main>

      {/* 🧾 Message Input */}
      <div className='fixed bottom-0 w-full h-16'>
        <div className='h-full p-3 flex justify-between w-2/3 mx-auto bg-gray-300'>
          <input
            type="text"
            placeholder='Type your message here...'
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
            className='w-full outline-none bg-transparent'
          />
          <div className='flex gap-2'>
            <button onClick={sendMessage} className='bg-green-600 h-9 w-9 flex justify-center items-center text-white rounded-full'>
              <MdSend />
            </button>
            <button className='bg-pink-600 h-9 w-9 flex justify-center items-center text-white rounded-full'>
              <MdAttachFile />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ChatPage;
