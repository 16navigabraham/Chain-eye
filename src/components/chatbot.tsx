
"use client"

import { useState } from 'react';
import { Button } from './ui/button';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from './ui/sheet';
import { MessageCircle, Send, Bot, User, Loader2 } from 'lucide-react';
import { Input } from './ui/input';
import { generateChatResponse } from '@/app/actions';
import { ChainEyeIcon } from './icons';
import { ScrollArea } from './ui/scroll-area';

interface ChatbotProps {
    address: string;
    blockchain: string;
}

interface Message {
    role: 'user' | 'model';
    content: string;
}

export function Chatbot({ address, blockchain }: ChatbotProps) {
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleSend = async () => {
        if (!input.trim()) return;

        const userMessage: Message = { role: 'user', content: input };
        setMessages(prev => [...prev, userMessage]);
        setInput('');
        setIsLoading(true);

        // Format history for the API
        const historyForApi = messages.map(msg => ({
            role: msg.role,
            content: [{ text: msg.content }]
        }));

        const result = await generateChatResponse({
            history: historyForApi,
            message: input,
            address,
            blockchain,
        });

        setIsLoading(false);
        if (result.success && result.response) {
            const modelMessage: Message = { role: 'model', content: result.response };
            setMessages(prev => [...prev, modelMessage]);
        } else {
            const errorMessage: Message = { role: 'model', content: "Sorry, I couldn't get a response. Please try again." };
            setMessages(prev => [...prev, errorMessage]);
        }
    };

    return (
        <Sheet>
            <SheetTrigger asChild>
                <Button size="icon" className="fixed bottom-8 right-8 h-16 w-16 rounded-full shadow-lg">
                    <MessageCircle className="h-8 w-8" />
                </Button>
            </SheetTrigger>
            <SheetContent className="w-full sm:max-w-lg flex flex-col">
                <SheetHeader>
                    <SheetTitle className="flex items-center gap-2">
                        <Bot />
                        ChainEye Assistant
                    </SheetTitle>
                    <SheetDescription>
                        Ask me anything about crypto or the current analysis.
                    </SheetDescription>
                </SheetHeader>
                <ScrollArea className="flex-grow my-4 pr-4">
                    <div className="space-y-4">
                        {messages.map((message, index) => (
                            <div key={index} className={`flex items-start gap-3 ${message.role === 'user' ? 'justify-end' : ''}`}>
                                {message.role === 'model' && <ChainEyeIcon className="h-6 w-6 text-primary flex-shrink-0" />}
                                <div className={`rounded-lg p-3 text-sm ${message.role === 'user' ? 'bg-primary text-primary-foreground' : 'bg-muted'}`}>
                                    <p>{message.content}</p>
                                </div>
                                {message.role === 'user' && <User className="h-6 w-6 flex-shrink-0" />}
                            </div>
                        ))}
                         {isLoading && (
                            <div className="flex items-start gap-3">
                                <ChainEyeIcon className="h-6 w-6 text-primary flex-shrink-0" />
                                <div className="rounded-lg p-3 text-sm bg-muted flex items-center">
                                    <Loader2 className="h-5 w-5 animate-spin"/>
                                </div>
                            </div>
                         )}
                    </div>
                </ScrollArea>
                <div className="flex gap-2">
                    <Input
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder="Ask a question..."
                        onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                        disabled={isLoading}
                    />
                    <Button onClick={handleSend} disabled={isLoading}>
                        <Send />
                    </Button>
                </div>
            </SheetContent>
        </Sheet>
    );
}
