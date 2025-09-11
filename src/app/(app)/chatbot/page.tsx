"use client";

import { useState, useRef, useEffect } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { generatePersonalizedAdvice, GeneratePersonalizedAdviceOutput } from "@/ai/flows/chatbot-personalized-advice";
import { Send } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { useAuth } from "@/context/auth-context";
import { useToast } from "@/hooks/use-toast";
import { mockAcademicEvents, mockMoodData } from "@/lib/data";

type Message = {
  sender: "user" | "assistant";
  text?: string;
  html?: string;
};

export default function ChatbotPage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [messages, setMessages] = useState<Message[]>([
    {
      sender: "assistant",
      html: "<p>Hello! I'm your personal wellness assistant. How are you feeling today? Feel free to share what's on your mind.</p>",
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollAreaRef.current) {
        // Not a great solution, but it works for now
        setTimeout(() => {
            const viewport = scrollAreaRef.current?.querySelector('[data-radix-scroll-area-viewport]');
            if (viewport) {
                viewport.scrollTop = viewport.scrollHeight;
            }
        }, 100);
    }
  }, [messages]);


  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage: Message = { sender: "user", text: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      // In a real app, this data would come from your database
      const academicDeadlines = mockAcademicEvents.map(e => `${e.title} on ${e.date.toLocaleDateString()}`).join(', ');
      // Use the last 7 days of mood data for context
      const recentMoodData = mockMoodData.slice(-7).map(m => `On ${m.date}, mood was ${m.intensity}/5`).join('; ');

      const response: GeneratePersonalizedAdviceOutput = await generatePersonalizedAdvice({
        moodData: recentMoodData || "User has not provided mood data yet.",
        academicDeadlines: academicDeadlines,
        chatHistory: messages.slice(-5).map(m => `${m.sender}: ${m.text || m.html}`).join('\n')
      });

      setMessages((prev) => [
        ...prev,
        {
          sender: "assistant",
          html: response.message_html,
        },
      ]);
    } catch (error) {
      console.error("Chatbot error:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "The AI assistant is currently unavailable. Please try again later.",
      });
      // Add a canned error response to the chat
      setMessages((prev) => [
        ...prev,
        {
          sender: "assistant",
          html: "<p>I'm having some trouble connecting right now. Please try again in a moment.</p>"
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-4 md:p-8 flex justify-center">
      <Card className="w-full max-w-3xl h-[80vh] flex flex-col">
        <CardHeader className="flex flex-row items-center gap-4">
            <Avatar>
                <AvatarImage src="https://picsum.photos/seed/ai-bot/100/100" data-ai-hint="illustration robot" />
                <AvatarFallback>AI</AvatarFallback>
            </Avatar>
            <div>
                <h1 className="text-xl font-bold tracking-tight">First-Aid Chatbot</h1>
                <p className="text-sm text-muted-foreground">Your AI-powered wellness assistant</p>
            </div>
        </CardHeader>
        <CardContent className="flex-1 overflow-hidden p-0">
          <ScrollArea className="h-full p-6" ref={scrollAreaRef}>
            <div className="space-y-6">
              {messages.map((message, index) => (
                <div
                  key={index}
                  className={cn(
                    "flex items-start gap-4",
                    message.sender === "user" ? "justify-end" : "justify-start"
                  )}
                >
                  {message.sender === "assistant" && (
                    <Avatar className="h-8 w-8">
                      <AvatarImage src="https://picsum.photos/seed/ai-bot/100/100" data-ai-hint="illustration robot" />
                      <AvatarFallback>AI</AvatarFallback>
                    </Avatar>
                  )}
                  <div
                    className={cn(
                      "max-w-[75%] rounded-lg p-3 text-sm",
                      message.sender === "user"
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted"
                    )}
                  >
                    {message.text && <p>{message.text}</p>}
                    {message.html && (
                      <div
                        className="prose prose-sm dark:prose-invert max-w-none"
                        dangerouslySetInnerHTML={{ __html: message.html }}
                      />
                    )}
                  </div>
                   {message.sender === "user" && user && (
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={user.avatarUrl} />
                      <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                  )}
                </div>
              ))}
              {isLoading && (
                 <div className="flex items-start gap-4 justify-start">
                     <Avatar className="h-8 w-8">
                         <AvatarImage src="https://picsum.photos/seed/ai-bot/100/100" data-ai-hint="illustration robot" />
                         <AvatarFallback>AI</AvatarFallback>
                     </Avatar>
                     <div className="bg-muted rounded-lg p-3 text-sm">
                        <div className="flex items-center gap-2">
                           <div className="h-2 w-2 bg-foreground/50 rounded-full animate-pulse [animation-delay:-0.3s]"></div>
                           <div className="h-2 w-2 bg-foreground/50 rounded-full animate-pulse [animation-delay:-0.15s]"></div>
                           <div className="h-2 w-2 bg-foreground/50 rounded-full animate-pulse"></div>
                        </div>
                     </div>
                 </div>
              )}
            </div>
          </ScrollArea>
        </CardContent>
        <CardFooter className="p-4 border-t">
          <form onSubmit={handleSendMessage} className="flex w-full items-start gap-2">
            <Textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type your message here..."
              className="flex-1 resize-none"
              rows={1}
              onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleSendMessage(e);
                  }
              }}
            />
            <Button type="submit" size="icon" disabled={isLoading || !input.trim()}>
              <Send className="h-4 w-4" />
              <span className="sr-only">Send</span>
            </Button>
          </form>
        </CardFooter>
      </Card>
    </div>
  );
}
