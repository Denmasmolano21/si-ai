import type { ChatMessage } from "@/types/chat";

type MessageItemProps = {
  message: ChatMessage;
};

function formatMessageTime(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";

  return new Intl.DateTimeFormat("id-ID", {
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}

export function MessageItem({ message }: MessageItemProps) {
  const isUser = message.role === "user";

  return (
    <article className={`message ${message.role}`} data-testid={`message-${message.id}`}>
      <div className="avatar">{isUser ? "KAMU" : "SI"}</div>
      <div className="message-body">
        <div className="message-meta">
          <span>{isUser ? "Kamu" : "Asisten SI"}</span>
          <span>{formatMessageTime(message.createdAt)}</span>
          {message.mode === "demo" && <span className="demo-tag">Jawaban demo</span>}
        </div>
        <div className="bubble">{message.content}</div>
      </div>
    </article>
  );
}
