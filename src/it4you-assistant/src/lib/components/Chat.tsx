import { useEffect, useRef, useState } from 'react';
import { FiSend, FiMic, FiMicOff } from 'react-icons/fi';
import { BsPlusLg } from 'react-icons/bs';
import useAutoResizeTextArea from '../hooks/useAutoResize';
import Message from './Message';
import axios from 'axios';
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';

const Chat = (props: any) => {
    const [isLoading, setIsLoading] = useState(false);
    const [sendFlag, setSendFlag] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [showEmptyChat, setShowEmptyChat] = useState(true);
    const [conversation, setConversation] = useState<any[]>([]);
    const [message, setMessage] = useState('');
    const textAreaRef = useAutoResizeTextArea();
    const bottomOfChatRef = useRef<HTMLDivElement>(null);
    const [isRecording, setIsRecording] = useState(false);
    const [suggestions, setSuggestions] = useState([
        'Was macht man als Applikationsentwickler?',
        'Was für Lehrstellen bietet die SIX an?',
        'Wie kann ich mich bei der SIX bewerben?',
        'Was für ICT Lehrstellen gibt es?',
    ]);

    const { transcript, browserSupportsSpeechRecognition } = useSpeechRecognition();

    useEffect(() => {
      if (sendFlag && message.trim().length > 0) {
        sendMessage();
        setSendFlag(false); // Reset the flag after sending the message
      }
    }, [sendFlag, message]); // Depend on both sendFlag and message

    // When the component unmounts or before a new recording session starts, make sure to stop listening.
    useEffect(() => {
        return () => {
            SpeechRecognition.stopListening();
        };
    }, []);

    useEffect(() => {
      if (bottomOfChatRef.current) {
        bottomOfChatRef.current.scrollIntoView({ behavior: 'smooth' });
      }
    }, [conversation]);
  
    useEffect(() => {
        setMessage(transcript);
    }, [transcript]);

    useEffect(() => {
        if (!browserSupportsSpeechRecognition) {
            console.error("Browser doesn't support speech recognition.");
        }
    }, []);

    useEffect(() => {
        if (textAreaRef.current) {
            textAreaRef.current.style.height = '24px';
            textAreaRef.current.style.height = `${textAreaRef.current.scrollHeight}px`;
        }
    }, [message, textAreaRef]);

    useEffect(() => {
        if (bottomOfChatRef.current) {
            bottomOfChatRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [conversation]);

    const toggleRecording = (e: any) => {
        e.preventDefault();

        if (isRecording) {
            SpeechRecognition.stopListening();
            setIsRecording(false);
        } else {
            SpeechRecognition.startListening({ continuous: true });
            setIsRecording(true);
        }
    };

    const speakText = (text: string) => {
        const speechSynthesis = window.speechSynthesis;
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = 'de-DE';
        speechSynthesis.speak(utterance);
    };

    const sendMessage = async (e?: any) => {
      if (e) {
          e.preventDefault();
      }
  
      if (message.trim().length < 1) {
          setErrorMessage('Please enter a message.');
          return;
      }
  
      setIsLoading(true);
      setErrorMessage('');
  
      const userMessage = { content: message, role: 'user' };
      const botTypingMessage = { content: null, role: 'system' };
  
      setConversation(prev => [...prev, userMessage, botTypingMessage]);
      setMessage('');
      setShowEmptyChat(false);
  
      try {
          const response = await axios.post('/api/chat', { message: message });
          setConversation(prev => [...prev.slice(0, -1), { content: response.data.response, role: 'system' }]);
          speakText(response.data.response);
      } catch (error: any) {
          console.error(error);
          setErrorMessage(error.message || 'An error occurred');
      } finally {
          setIsLoading(false);
      }
  };

  const insertSuggestion = (suggestion: string) => {
    setMessage(suggestion); // This will trigger the useEffect above
    setSendFlag(true); // Set the flag to true to send the message
  };


  const handleKeypress = (e: any) => {
    // Triggers by pressing the enter key
    if (e.keyCode === 13 && !e.shiftKey) {
        e.preventDefault();
        sendMessage();
    }
};

    const clearChat = () => {
        // Function to clear the chat
        setConversation([]);
        setShowEmptyChat(true);
    };

    return (
      <div className="flex flex-col max-w-full flex-1">
      <nav className="sticky top-0 z-10 flex justify-between items-center bg-gray-800 p-4 text-white">
                <img src="/logo.png" alt="Logo" className="h-8 w-auto" />
                <button
                    onClick={clearChat}
                    className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
                >
                    Clear Chat
                </button>
            </nav>
            <div className="sticky top-0 z-10 flex items-center border-b border-white/20 bg-gray-800 pl-1 pt-1 text-gray-200 sm:pl-3 md:hidden">
                <h1 className="flex-1 text-center text-base font-normal">New chat</h1>
                <button type="button" className="px-3">
                    <BsPlusLg className="h-6 w-6" />
                </button>
            </div>
            <div className="relative h-full w-full transition-width flex flex-col overflow-hidden items-stretch flex-1">
                <div className="flex-1 overflow-hidden">
                    <div className="react-scroll-to-bottom--css-ikyem-79elbk h-full dark:bg-gray-800">
                        <div className="react-scroll-to-bottom--css-ikyem-1n7m0yu chat-history overflow-y-auto max-h-[calc(100vh-200px)]">
                            {!showEmptyChat && conversation.length > 0 ? (
                                <div className="flex flex-col items-center text-sm 0">
                                    {conversation.map((message, index) => (
                                        <Message key={index} message={message} />
                                    ))}
                                    <div ref={bottomOfChatRef}></div>
                                </div>
                            ) : null}
                            {showEmptyChat ? (
                                <div
                                    className="w-full h-full flex flex-col items-center justify-center"
                                    style={{ paddingTop: '15%' }}
                                >
                                    <h1 className="text-2xl sm:text-4xl font-semibold text-center text-gray-200 dark:text-gray-600 flex gap-2 items-center justify-center">
                                        IT4YOU GPT
                                    </h1>
                                </div>
                            ) : null}
                            <div className="flex flex-col items-center text-sm dark:bg-gray-800"></div>
                        </div>
                    </div>
                </div>
                <div className="absolute bottom-0 left-0 w-full border-t md:border-t-0 dark:border-white/20 md:border-transparent md:dark:border-transparent md:bg-vert-light-gradient bg-white dark:bg-gray-800 md:!bg-transparent dark:md:bg-vert-dark-gradient pt-2">
                    {showEmptyChat ? (
                        <div className="full flex mb-2 justify-center items-end bg-transparent">
                            <div className="grid grid-cols-2 gap-2">
                                {suggestions.map((suggestion, index) => (
                                    <button
                                        key={index}
                                        onClick={() => insertSuggestion(suggestion)}
                                        className="block max-w-sm p-3 bg-white border border-gray-200 rounded-lg shadow hover:bg-gray-100 dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700"
                                        style={{ maxWidth: '330px' }}
                                    >
                                        {suggestion}
                                    </button>
                                ))}
                            </div>
                        </div>
                    ) : null}
                    <form className="stretch mx-2 flex flex-row gap-3 last:mb-2 md:mx-4 md:last:mb-6 lg:mx-auto lg:max-w-2xl xl:max-w-3xl">
                        <div className="relative flex flex-col h-full flex-1 items-stretch md:flex-col">
                            {errorMessage ? (
                                <div className="mb-2 md:mb-0">
                                    <div className="h-full flex ml-1 md:w-full md:m-auto md:mb-2 gap-0 md:gap-2 justify-center">
                                        <span className="text-red-500 text-sm">{errorMessage}</span>
                                    </div>
                                </div>
                            ) : null}
                            <div className="flex items-center justify-between bg-white p-4 rounded-b-lg shadow">
                                <textarea
                                    ref={textAreaRef}
                                    value={message}
                                    tabIndex={0}
                                    data-id="root"
                                    style={{
                                        height: '24px',
                                        maxHeight: '200px',
                                        outline: 'none',
                                        border: 'none',
                                        width: '72vh',
                                    }}
                                    placeholder="Send a message..."
                                    className="m-0 w-full border-none resize-none bg-transparent p-0 pr-7 focus:ring-0 focus-visible:ring-0 dark:bg-transparent pl-2 md:pl-0"
                                    onChange={(e) => setMessage(e.target.value)}
                                    onKeyDown={handleKeypress}
                                ></textarea>
                                <div className="flex items-center space-x-2">
                                    <button
                                        onClick={toggleRecording}
                                        className={`p-3 rounded-full transition-colors ${isRecording ? 'bg-red-500' : 'bg-gray-200 hover:bg-gray-300'}`}
                                        aria-label="Microphone"
                                    >
                                        <FiMic className={`w-5 h-5 ${isRecording ? 'text-white' : 'text-gray-500'}`} />
                                    </button>
                                    <button
                                        disabled={isLoading || message?.length === 0}
                                        onClick={sendMessage}
                                        className="inline-flex items-center justify-center p-3 rounded-full bg-gradient-to-r from-red-500 to-red-600 hover:bg-gradient-to-r hover:from-red-600 hover:to-red-700 disabled:from-gray-300 disabled:to-gray-300 disabled:cursor-not-allowed shadow-lg transition-all duration-300 ease-in-out"
                                    >
                                        <FiSend className="text-white transition-colors duration-300 ease-in-out disabled:text-gray-500" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    </form>
                    <div className="px-3 pt-2 pb-3 text-center text-xs text-black/50 dark:text-white/50 md:px-4 md:pt-3 md:pb-6">
                        <span>
                            Build by{' '}
                            <a style={{ color: '#afbb95' }} target="_blank" href="https://linkedin.com/in/ruben-manser">
                                Ruben Manser
                            </a>{' '}
                            |{' '}
                            <a
                                style={{ color: '#afbb95' }}
                                target="_blank"
                                href="https://github.com/cryxnet/it4you-assistant"
                            >
                                Source Code
                            </a>
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Chat;
