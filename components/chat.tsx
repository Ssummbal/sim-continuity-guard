"use client";

import {
  useEffect,
  useId,
  useRef,
  useState,
  type FormEvent,
} from "react";

type ChatRole = "user" | "assistant";

type ChatMessage = {
  id: string;
  role: ChatRole;
  content: string;
};

const MAX_MESSAGE_LENGTH = 500;

function errorMessageForStatus(status: number): string {
  switch (status) {
    case 400:
      return "That message could not be sent. Check it and try again.";
    case 401:
      return "Your session has expired. Reload the page and sign in again.";
    case 403:
      return "Your account is not approved to use the assistant.";
    case 429:
      return "You have reached the message limit. Please wait a few minutes and try again.";
    default:
      return "The assistant is unavailable right now. Please try again.";
  }
}

export function Chat({ className = "" }: { className?: string }) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const abortRef = useRef<AbortController | null>(null);
  const idRef = useRef(0);
  const headingId = useId();
  const inputId = useId();

  const isWaitingForAssistant =
    isSending && messages[messages.length - 1]?.role !== "assistant";

  useEffect(() => {
    const list = listRef.current;

    if (!list) {
      return;
    }

    list.scrollTop = list.scrollHeight;
  }, [messages, isSending]);

  useEffect(() => {
    return () => {
      abortRef.current?.abort();
    };
  }, []);

  function nextMessageId(role: ChatRole): string {
    idRef.current += 1;
    return `${role}-${idRef.current}`;
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const content = input.trim();

    if (!content || isSending) {
      return;
    }

    const userMessage: ChatMessage = {
      id: nextMessageId("user"),
      role: "user",
      content: content.slice(0, MAX_MESSAGE_LENGTH),
    };
    const nextMessages = [...messages, userMessage].slice(-6);

    setMessages(nextMessages);
    setInput("");
    setError(null);
    setIsSending(true);

    const controller = new AbortController();
    abortRef.current = controller;

    let assistantId: string | null = null;
    let assistantContent = "";

    function appendAssistantText(text: string) {
      assistantContent += text;

      if (assistantId === null) {
        assistantId = nextMessageId("assistant");
        const id = assistantId;
        setMessages((current) => [
          ...current,
          { id, role: "assistant", content: text },
        ]);
        return;
      }

      const id = assistantId;
      setMessages((current) =>
        current.map((message) =>
          message.id === id
            ? { ...message, content: message.content + text }
            : message,
        ),
      );
    }

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: nextMessages.map(({ role, content }) => ({
            role,
            content,
          })),
        }),
        signal: controller.signal,
      });

      if (!response.ok) {
        setError(errorMessageForStatus(response.status));
        return;
      }

      if (!response.body) {
        setError("The assistant returned an empty response. Please try again.");
        return;
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();

      while (true) {
        const { value, done } = await reader.read();

        if (done) {
          break;
        }

        const text = decoder.decode(value, { stream: true });

        if (text) {
          appendAssistantText(text);
        }
      }

      const finalText = decoder.decode();

      if (finalText) {
        appendAssistantText(finalText);
      }

      if (!assistantContent.trim()) {
        setError("The assistant returned an empty response. Please try again.");
      }
    } catch {
      if (!controller.signal.aborted) {
        setError("The assistant is unavailable right now. Please try again.");
      }
    } finally {
      abortRef.current = null;
      setIsSending(false);
    }
  }

  return (
    <section
      className={`card flex h-[26rem] flex-col overflow-hidden sm:h-[30rem] ${className}`}
      aria-labelledby={headingId}
    >
      <div className="flex flex-wrap items-start justify-between gap-3 border-b border-line bg-surface px-5 py-4 sm:px-6">
        <div className="min-w-0">
          <p className="eyebrow">Assistant</p>
          <h2
            id={headingId}
            className="mt-1.5 font-serif text-xl font-semibold tracking-tight sm:text-2xl"
          >
            Ask about number recycling
          </h2>
          <p className="mt-1 max-w-2xl text-sm leading-relaxed text-muted">
            General guidance only. The assistant cannot access cases, accounts
            or phone numbers.
          </p>
        </div>
        <span className="rounded-full border border-line bg-surface-muted px-3 py-1 text-[11px] font-semibold text-muted">
          AI-generated · human review required
        </span>
      </div>

      <div
        ref={listRef}
        role="log"
        aria-live="polite"
        aria-relevant="additions text"
        aria-busy={isSending}
        className="chat-scroll min-h-0 flex-1 overflow-y-auto bg-background/60 px-4 py-5 sm:px-6"
      >
        {messages.length === 0 ? (
          <div className="flex h-full items-center justify-center">
            <div className="max-w-sm text-center">
              <span
                className="mx-auto grid size-11 place-items-center rounded-full bg-accent-soft text-accent"
                aria-hidden="true"
              >
                <svg
                  viewBox="0 0 24 24"
                  className="size-5"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.7"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M21 12a8.5 8.5 0 0 1-8.5 8.5H6l-3 2v-6.2A8.5 8.5 0 1 1 21 12Z" />
                  <path d="M8 11h8" />
                  <path d="M8 14.5h5" />
                </svg>
              </span>
              <p className="mt-3 text-sm font-semibold text-foreground">
                Ask about number recycling
              </p>
              <p className="mt-1 text-sm leading-relaxed text-muted">
                Why numbers are reused, how ghost messages happen, or what
                people and banks can do to reduce the risk.
              </p>
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`chat-message flex ${
                  message.role === "user" ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={
                    message.role === "user"
                      ? "max-w-[78%] rounded-2xl rounded-br-md bg-primary px-4 py-3 text-sm leading-relaxed text-white shadow-[var(--shadow-sm)]"
                      : "max-w-[78%] rounded-2xl rounded-bl-md border border-line bg-surface-muted px-4 py-3 text-sm leading-relaxed text-foreground shadow-[var(--shadow-sm)]"
                  }
                >
                  <p className="whitespace-pre-wrap break-words">
                    {message.content}
                  </p>
                </div>
              </div>
            ))}

            {isWaitingForAssistant ? (
              <div
                className="chat-message flex justify-start"
                role="status"
                aria-label="Assistant is typing"
              >
                <div className="inline-flex items-center gap-1.5 rounded-2xl rounded-bl-md border border-line bg-surface-muted px-4 py-3 shadow-[var(--shadow-sm)]">
                  <span className="typing-dot" />
                  <span className="typing-dot" />
                  <span className="typing-dot" />
                  <span className="sr-only">Assistant is typing</span>
                </div>
              </div>
            ) : null}
          </div>
        )}
      </div>

      <div className="border-t border-line bg-surface px-4 py-3.5 sm:px-6 sm:py-4">
        {error ? (
          <p
            role="alert"
            className="mb-3 rounded-lg border border-risk-high/40 bg-risk-high-soft/50 px-3 py-2 text-sm text-risk-high"
          >
            {error}
          </p>
        ) : null}

        <form onSubmit={handleSubmit} aria-busy={isSending}>
          <label htmlFor={inputId} className="sr-only">
            Message
          </label>
          <div className="flex items-center gap-2 rounded-full border border-line bg-background p-1.5 pl-4 shadow-[var(--shadow-sm)] transition focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/15">
            <input
              id={inputId}
              type="text"
              value={input}
              onChange={(event) => setInput(event.target.value)}
              maxLength={MAX_MESSAGE_LENGTH}
              placeholder="Ask a general question about number recycling..."
              className="h-10 min-w-0 flex-1 bg-transparent text-sm text-foreground outline-none placeholder:text-muted/70 disabled:cursor-not-allowed"
              disabled={isSending}
              autoComplete="off"
            />
            <button
              type="submit"
              className="btn-primary h-10 shrink-0 rounded-full px-5"
              disabled={isSending || input.trim().length === 0}
            >
              {isSending ? "Sending..." : "Send"}
            </button>
          </div>
          <p className="mt-2 px-1 text-xs text-muted">
            {input.length}/{MAX_MESSAGE_LENGTH} characters. Do not share phone
            numbers, IDs or account details.
          </p>
        </form>
      </div>
    </section>
  );
}
