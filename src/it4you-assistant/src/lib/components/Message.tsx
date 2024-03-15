import { SiOpenai } from 'react-icons/si';
import { HiUser } from 'react-icons/hi';
import { AiOutlineLoading } from 'react-icons/ai';

const Message = (props: any) => {
    const { message } = props;
    const { role, content: text } = message;

    const isUser = role === 'user';

    return (
        <div
            className={`group w-full text-white-900 dark:text-white-900 ${
                isUser ? 'dark:bg-black-100' : 'bg-black-50 dark:bg-[#411154]'
            }`}
        >
            <div className="text-base gap-4 md:gap-6 md:max-w-2xl lg:max-w-xl xl:max-w-3xl flex lg:px-0 m-auto w-full">
                <div className="flex flex-row gap-4 md:gap-6 md:max-w-2xl lg:max-w-xl xl:max-w-3xl p-4 md:py-6 lg:px-0 m-auto w-full">
                    <div className="w-8 flex flex-col relative items-end">
                        <div className="relative h-7 w-7 p-1 rounded-sm text-white flex items-center justify-center bg-black/75 text-opacity-100r">
                            {isUser ? (
                                <HiUser className="h-4 w-4 text-white" />
                            ) : (
                                <SiOpenai className="h-4 w-4 text-white" />
                            )}
                        </div>
                    </div>
                    <div className="relative flex w-[calc(100%-50px)] flex-col gap-1 md:gap-3 lg:w-[calc(100%-115px)]">
                        <div className="flex flex-grow flex-col gap-3">
                            <div className="min-h-20 flex flex-col items-start gap-4 whitespace-pre-wrap break-words">
                                <div className="markdown prose w-full break-words dark:prose-invert dark">
                                    {!isUser && text === null ? (
                                       <AiOutlineLoading className="h-6 w-6 animate-spin" style={{ animation: 'spin 1s linear infinite' }} />
                                    ) : (
                                        <p>{text}</p>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Message;
