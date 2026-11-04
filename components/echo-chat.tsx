"use client";

import {
  useEffect,
  useId,
  useRef,
  useState,
  type FormEvent,
} from "react";
import { EchoMascot, type EchoMood } from "@/components/echo-mascot";

type ChatRole = "user" | "assistant";

type ChatMessage = {
  id: string;
  role: ChatRole;
  content: string;
};

const MAX_MESSAGES = 6;
const MAX_MESSAGE_LENGTH = 500;

const STARTER_PROMPTS = [
  "Why do recycled numbers cause problems?",
  "I'm getting messages meant for someone else",
  "How do I protect my accounts before changing my number?",
  "What can banks and apps do about this?",
];

const SURPRISE_PROMPTS = [
  "Why do phone numbers get recycled in the first place?",
  "What exactly is a ghost message?",
  "How can a recycled number put my accounts at risk?",
  "What should I do if I receive a code for someone else?",
  "How do I move my important accounts away from SMS codes?",
  "What should I update before I give up my number?",
  "How can banks tell that a number has a new owner?",
  "What can mobile operators do to reduce recycling risk?",
];

const LOADING_LINES = [
  "Echo is rattling the chains...",
  "Checking the haunted inbox...",
  "Asking the spirits of old SIM cards...",
  "Polishing the crystal ball...",
  "Consulting the ghost of a flip phone...",
];

const WELCOME_MESSAGE: ChatMessage = {
  id: "echo-welcome",
  role: "assistant",
  content:
    "Hi, I'm Echo. I can explain why phone numbers get recycled, what ghost messages are, and how people, banks and operators can reduce the risk. What are you wondering about?",
};

function getInitialMessages(): ChatMessage[] {
  return [WELCOME_MESSAGE];
}

function pickSurprisePrompt(): string {
  return (
    SURPRISE_PROMPTS[Math.floor(Math.random() * SURPRISE_PROMPTS.length)] ??
    SURPRISE_PROMPTS[0]
  );
}

async function readErrorMessage(response: Response): Promise<string> {
  try {
    const payload: unknown = await response.json();

    if (
      typeof payload === "object" &&
      payload !== null &&
      "error" in payload &&
      typeof (payload as { error?: unknown }).error === "string"
    ) {
      return (payload as { error: string }).error;
    }
  } catch {
    return "Echo lost the thread. Please try again.";
  }

  return "Echo lost the thread. Please try again.";
}

export function EchoChat() {
  const [messages, setMessages] = useState<ChatMessage[]>(getInitialMessages);
  const [input, setInput] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [mood, setMood] = useState<EchoMood>("idle");
  const [loadingLineIndex, setLoadingLineIndex] = useState(0);
  const listRef = useRef<HTMLDivElement>(null);
  const abortRef = useRef<AbortController | null>(null);
  const celebrateTimerRef = useRef<number | null>(null);
  const idRef = useRef(0);
  const headingId = useId();
  const inputId = useId();

  const isWaitingForAssistant =
    isSending && messages[messages.length - 1]?.role !== "assistant";
  const hasUserMessage = messages.some((message) => message.role === "user");

  useEffect(() => {
    const list = listRef.current;

    if (!list) {
      return;
    }

    list.scrollTop = list.scrollHeight;
  }, [messages, isSending]);

  useEffect(() => {
    if (!isSending) {
      return;
    }

    const interval = window.setInterval(() => {
      setLoadingLineIndex(
        (current) => (current + 1) % LOADING_LINES.length,
      );
    }, 2200);

    return () => window.clearInterval(interval);
  }, [isSending]);

  useEffect(() => {
    return () => {
      abortRef.current?.abort();

      if (celebrateTimerRef.current !== null) {
        window.clearTimeout(celebrateTimerRef.current);
      }
    };
  }, []);

  function nextMessageId(role: ChatRole): string {
    idRef.current += 1;
    return `${role}-${idRef.current}`;
  }

  function showHappyMood() {
    setMood("happy");

    if (celebrateTimerRef.current !== null) {
      window.clearTimeout(celebrateTimerRef.current);
    }

    celebrateTimerRef.current = window.setTimeout(() => {
      setMood("idle");
      celebrateTimerRef.current = null;
    }, 2600);
  }

  async function sendMessage(rawContent: string) {
    const content = rawContent.trim().slice(0, MAX_MESSAGE_LENGTH);

    if (!content || isSending) {
      return;
    }

    const userMessage: ChatMessage = {
      id: nextMessageId("user"),
      role: "user",
      content,
    };
    const requestMessages = [...messages, userMessage]
      .slice(-MAX_MESSAGES)
      .map(({ role, content: messageContent }) => ({
        role,
        content: messageContent,
      }));

    setMessages((current) => [...current, userMessage]);
    setInput("");
    setError(null);
    setLoadingLineIndex(0);
    setIsSending(true);
    setMood("thinking");

    if (celebrateTimerRef.current !== null) {
      window.clearTimeout(celebrateTimerRef.current);
      celebrateTimerRef.current = null;
    }

    const controller = new AbortController();
    abortRef.current = controller;

    let assistantId: string | null = null;
    let assistantContent = "";
    let completed = false;

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
        body: JSON.stringify({ messages: requestMessages }),
        signal: controller.signal,
      });

      if (!response.ok) {
        setError(await readErrorMessage(response));
        return;
      }

      if (!response.body) {
        setError("Echo returned an empty response. Please try again.");
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
        setError("Echo returned an empty response. Please try again.");
        return;
      }

      completed = true;
      showHappyMood();
    } catch {
      if (!controller.signal.aborted) {
        setError("Echo is unavailable right now. Please try again.");
      }
    } finally {
      abortRef.current = null;
      setIsSending(false);

      if (!completed) {
        setMood("idle");
      }
    }
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    void sendMessage(input);
  }

  function handleSurprise() {
    void sendMessage(pickSurprisePrompt());
  }

  return (
    <section
      className="card overflow-hidden border-ghost-strong/20 shadow-[0_24px_70px_-36px_var(--ghost-shadow)]"
      aria-labelledby={headingId}
    >
      <div className="grid gap-5 border-b border-ghost-strong/15 bg-[radial-gradient(circle_at_12%_20%,var(--ghost-soft),transparent_52%)] px-5 py-6 sm:grid-cols-[auto_1fr] sm:items-center sm:px-7 sm:py-7">
        <EchoMascot
          mood={mood}
          idPrefix="chat-echo"
          className="mx-auto w-28 sm:mx-0 sm:w-32"
        />

        <div className="text-center sm:text-left">
          <p className="eyebrow text-ghost-strong">Echo&apos;s parlour</p>
          <h2
            id={headingId}
            className="mt-1.5 font-serif text-2xl font-semibold tracking-tight sm:text-3xl"
          >
            Ask a friendly ghost about ghost messages
          </h2>
          <p className="mx-auto mt-2 max-w-2xl text-sm leading-relaxed text-muted sm:mx-0">
            Echo explains number recycling, SMS recovery risk, and practical
            ways to protect your accounts. Echo cannot see your number, cases,
            or accounts.
          </p>
          <div className="mt-3 flex flex-wrap justify-center gap-2 sm:justify-start">
            <span className="rounded-full border border-ghost-strong/25 bg-ghost-soft px-3 py-1 text-[11px] font-semibold text-ghost-strong">
              Public explainer
            </span>
            <span className="rounded-full border border-line bg-surface px-3 py-1 text-[11px] font-semibold text-muted">
              AI-generated
            </span>
            <span className="rounded-full border border-line bg-surface px-3 py-1 text-[11px] font-semibold text-muted">
              No case access
            </span>
          </div>
        </div>
      </div>

      <div
        ref={listRef}
        role="log"
        aria-live="polite"
        aria-relevant="additions text"
        aria-busy={isSending}
        className="echo-chat-scroll h-[25rem] overflow-y-auto border-b border-ghost-strong/15 bg-background/70 px-4 py-5 sm:h-[27rem] sm:px-7"
      >
        <div className="space-y-4">
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
                    ? "max-w-[84%] rounded-2xl rounded-br-md bg-primary px-4 py-3 text-sm leading-relaxed text-white shadow-[var(--shadow-sm)] sm:max-w-[78%]"
                    : "max-w-[88%] rounded-2xl rounded-bl-md border border-ghost-strong/20 bg-ghost-soft/80 px-4 py-3 text-sm leading-relaxed text-foreground shadow-[var(--shadow-sm)] sm:max-w-[78%]"
                }
              >
                {message.role === "assistant" ? (
                  <span className="mb-1.5 block text-[10px] font-semibold uppercase tracking-[0.16em] text-ghost-strong">
                    Echo
                  </span>
                ) : null}
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
              aria-label="Echo is thinking"
            >
              <div className="max-w-[88%] rounded-2xl rounded-bl-md border border-ghost-strong/20 bg-ghost-soft/80 px-4 py-3 shadow-[var(--shadow-sm)] sm:max-w-[78%]">
                <span className="mb-1.5 block text-[10px] font-semibold uppercase tracking-[0.16em] text-ghost-strong">
                  Echo
                </span>
                <div className="flex flex-wrap items-center gap-2.5">
                  <span className="inline-flex items-center gap-1.5">
                    <span className="typing-dot" />
                    <span className="typing-dot" />
                    <span className="typing-dot" />
                  </span>
                  <span className="text-xs text-muted">
                    {LOADING_LINES[loadingLineIndex]}
                  </span>
                </div>
                <span className="sr-only">Echo is thinking</span>
              </div>
            </div>
          ) : null}
        </div>
      </div>

      <div className="bg-surface px-4 py-4 sm:px-7 sm:py-5">
        {!hasUserMessage ? (
          <div className="mb-4">
            <p className="mb-2 text-xs font-semibold uppercase tracking-[0.14em] text-muted">
              Try one of these
            </p>
            <div className="flex flex-wrap gap-2">
              {STARTER_PROMPTS.map((prompt) => (
                <button
                  key={prompt}
                  type="button"
                  onClick={() => void sendMessage(prompt)}
                  disabled={isSending}
                  className="rounded-full border border-ghost-strong/25 bg-ghost-soft px-3.5 py-2 text-left text-xs font-semibold text-ghost-strong transition hover:border-ghost-strong/50 hover:bg-ghost-strong/10 focus-visible:outline-ghost-strong disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {prompt}
                </button>
              ))}
              <button
                type="button"
                onClick={handleSurprise}
                disabled={isSending}
                className="inline-flex items-center gap-1.5 rounded-full border border-ghost-strong/30 bg-surface px-3.5 py-2 text-xs font-semibold text-ghost-strong transition hover:bg-ghost-soft focus-visible:outline-ghost-strong disabled:cursor-not-allowed disabled:opacity-60"
              >
                <svg
                  viewBox="0 0 20 20"
                  className="size-3.5"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.6"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <path d="M10 2.5l1.5 4.2L15.5 8l-4 1.3L10 13.5 8.5 9.3 4.5 8l4-1.3L10 2.5Z" />
                  <path d="M15.5 13l.8 2.2 2.2.8-2.2.8-.8 2.2-.8-2.2-2.2-.8 2.2-.8.8-2.2Z" />
                </svg>
                Surprise me
              </button>
            </div>
          </div>
        ) : null}

        {error ? (
          <p
            role="alert"
            className="mb-3 rounded-xl border border-risk-high/40 bg-risk-high-soft/50 px-3.5 py-2.5 text-sm text-risk-high"
          >
            {error}
          </p>
        ) : null}

        <p className="mb-3 rounded-xl border border-line bg-background/70 px-3.5 py-2.5 text-xs leading-relaxed text-muted">
          General information only, not legal or financial advice. Please
          don&apos;t type phone numbers or personal IDs.
        </p>

        <form onSubmit={handleSubmit} aria-busy={isSending}>
          <label htmlFor={inputId} className="sr-only">
            Ask Echo a question
          </label>
          <div className="flex items-center gap-2 rounded-full border border-line bg-background p-1.5 pl-4 shadow-[var(--shadow-sm)] transition focus-within:border-ghost-strong focus-within:ring-2 focus-within:ring-ghost-strong/20">
            <input
              id={inputId}
              type="text"
              value={input}
              onChange={(event) => setInput(event.target.value)}
              maxLength={MAX_MESSAGE_LENGTH}
              placeholder="Ask Echo about number recycling..."
              className="h-10 min-w-0 flex-1 bg-transparent text-sm text-foreground outline-none placeholder:text-muted/70 disabled:cursor-not-allowed"
              disabled={isSending}
              autoComplete="off"
              enterKeyHint="send"
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
            {input.length}/{MAX_MESSAGE_LENGTH} characters. Keep personal
            details out of the chat.
          </p>
        </form>
      </div>
    </section>
  );
}
