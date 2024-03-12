import { useEffect, useRef, useState } from "react";
import { FiSend } from "react-icons/fi";
import { BsPlusLg } from "react-icons/bs";
import useAutoResizeTextArea from "../hooks/useAutoResize";
import Message from "./Message";
import axios from "axios";

const Chat = (props: any) => {
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [showEmptyChat, setShowEmptyChat] = useState(true);
  const [conversation, setConversation] = useState<any[]>([]);
  const [message, setMessage] = useState("");
  const textAreaRef = useAutoResizeTextArea();
  const bottomOfChatRef = useRef<HTMLDivElement>(null);


  useEffect(() => {
    if (textAreaRef.current) {
      textAreaRef.current.style.height = "24px";
      textAreaRef.current.style.height = `${textAreaRef.current.scrollHeight}px`;
    }
  }, [message, textAreaRef]);

  useEffect(() => {
    if (bottomOfChatRef.current) {
      bottomOfChatRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [conversation]);

  const sendMessage = async (e: any) => {
    e.preventDefault();

    // Don't send empty messages
    if (message.length < 1) {
      setErrorMessage("Please enter a message.");
      return;
    } else {
      setErrorMessage("");
    }

    setIsLoading(true);

    // Add the message to the conversation
    setConversation([
      ...conversation,
      { content: message, role: "user" },
      { content: null, role: "system" },
    ]);

    // Clear the message & remove empty chat
    setMessage("");
    setShowEmptyChat(false);

    try {
		const response = await axios.post('/api/chat', { message: message });

        setConversation([
          ...conversation,
          { content: message, role: "user" },
          { content: response.data.response, role: "system" },
        ]);

		setIsLoading(false);
    } catch (error: any) {
      console.error(error);
      setErrorMessage(error.message);

      setIsLoading(false);
    }
  };

  const handleKeypress = (e: any) => {
    // It's triggers by pressing the enter key
    if (e.keyCode == 13 && !e.shiftKey) {
      sendMessage(e);
      e.preventDefault();
    }
  };

  const clearChat = () => {
    // Function to clear the chat
    setConversation([]);
    setShowEmptyChat(true);
  };


  return (
    <div className="flex max-w-full flex-1 flex-col">
		<nav className="sticky top-0 z-10 flex justify-between items-center bg-gray-800 p-4 text-white">
        <img src="/logo.png" alt="Logo" className="h-8 w-auto" />
        <button onClick={clearChat} className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded">
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
					<div className="w-full h-32 md:h-48 flex-shrink-0"></div>
                  <div ref={bottomOfChatRef}></div>
                </div>
              ) : null}
              {showEmptyChat ? (
                <div className="relative w-full flex flex-col h-full">
                  <h1 className="text-2xl sm:text-4xl font-semibold text-center text-gray-200 dark:text-gray-600 flex gap-2 items-center justify-center h-screen">
                    🤖 IT4YOU GPT 
                  </h1>
                </div>
              ) : null}
              <div className="flex flex-col items-center text-sm dark:bg-gray-800"></div>
            </div>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 w-full border-t md:border-t-0 dark:border-white/20 md:border-transparent md:dark:border-transparent md:bg-vert-light-gradient bg-white dark:bg-gray-800 md:!bg-transparent dark:md:bg-vert-dark-gradient pt-2">
          <form className="stretch mx-2 flex flex-row gap-3 last:mb-2 md:mx-4 md:last:mb-6 lg:mx-auto lg:max-w-2xl xl:max-w-3xl">
            <div className="relative flex flex-col h-full flex-1 items-stretch md:flex-col">
              {errorMessage ? (
                <div className="mb-2 md:mb-0">
                  <div className="h-full flex ml-1 md:w-full md:m-auto md:mb-2 gap-0 md:gap-2 justify-center">
                    <span className="text-red-500 text-sm">{errorMessage}</span>
                  </div>
                </div>
              ) : null}
              <div className="flex flex-col w-full py-2 flex-grow md:py-3 md:pl-4 relative border bg-white  dark:text-white dark:bg-gray-700 rounded-md shadow-[0_0_10px_rgba(0,0,0,0.10)] dark:shadow-[0_0_15px_rgba(0,0,0,0.10)]">
			  <textarea
				ref={textAreaRef}
				value={message}
				tabIndex={0}
				data-id="root"
				style={{
					height: "24px",
					maxHeight: "200px",
					"outline": "none",
					border: "none",
					width: "72vh"
				  }}
				placeholder="Send a message..."
				className="m-0 w-full border-none resize-none bg-transparent p-0 pr-7 focus:ring-0 focus-visible:ring-0 dark:bg-transparent pl-2 md:pl-0"
				onChange={(e) => setMessage(e.target.value)}
				onKeyDown={handleKeypress}
				></textarea>
                <button
                  disabled={isLoading || message?.length === 0}
                  onClick={sendMessage}
                  className="absolute p-1 rounded-md bottom-1.5 md:bottom-3 bg-transparent disabled:bg-gray-500 right-1 md:right-2 disabled:opacity-40"
                >
                  <FiSend className="h-4 w-4 " />
                </button>
              </div>
            </div>
          </form>
          <div className="px-3 pt-2 pb-3 text-center text-xs text-black/50 dark:text-white/50 md:px-4 md:pt-3 md:pb-6">
            <span>
              Build by <a style={{ color: '#afbb95'}} target="_blank" href='https://linkedin.com/in/ruben-manser'>Ruben Manser</a> |  <a style={{ color: '#afbb95'}} target="_blank" href='https://github.com/cryxnet/it4you-assistant'>Source Code</a>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Chat;