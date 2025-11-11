import type { SessionEvent } from '../types/session';
import './ChatMessage.css';

interface ChatMessageProps {
  event: SessionEvent;
}

export const ChatMessage = ({ event }: ChatMessageProps) => {
  const { content, author, timestamp } = event;
  const isUser = content.role === 'user' && author === 'user';
  const isModel = content.role === 'model';

  const formatTimestamp = (ts: number) => {
    const date = new Date(ts * 1000);
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });
  };

  const renderContent = () => {
    return content.parts.map((part, index) => {
      // User text message
      if (part.text && isUser) {
        return (
          <div key={index} className="message-text">
            {part.text}
          </div>
        );
      }

      // Model text response
      if (part.text && isModel) {
        return (
          <div key={index} className="message-text markdown-content">
            {formatMarkdown(part.text)}
          </div>
        );
      }

      // Function call
      if (part.functionCall) {
        return (
          <div key={index} className="function-call">
            <div className="function-header">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"
                />
              </svg>
              <span className="function-name">{part.functionCall.name}</span>
            </div>
            <div className="function-args">
              <pre>{JSON.stringify(part.functionCall.args, null, 2)}</pre>
            </div>
          </div>
        );
      }

      // Function response
      if (part.functionResponse) {
        return (
          <div key={index} className="function-response">
            <div className="function-header">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <span className="function-name">
                {part.functionResponse.name} Response
              </span>
            </div>
            <div className="function-result">
              <pre>
                {JSON.stringify(part.functionResponse.response, null, 2)}
              </pre>
            </div>
          </div>
        );
      }

      return null;
    });
  };

  const formatMarkdown = (text: string) => {
    // Simple markdown formatting
    const lines = text.split('\n');
    return lines.map((line, i) => {
      // Bold
      line = line.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
      // Italic
      line = line.replace(/\*(.*?)\*/g, '<em>$1</em>');

      return (
        <div key={i} dangerouslySetInnerHTML={{ __html: line || '<br/>' }} />
      );
    });
  };

  return (
    <div
      className={`chat-message ${isUser ? 'user-message' : 'model-message'}`}
    >
      <div className="message-header">
        <div className="author-info">
          <div className={`avatar ${isUser ? 'user-avatar' : 'model-avatar'}`}>
            {isUser ? (
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                />
              </svg>
            ) : (
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                />
              </svg>
            )}
          </div>
          <div className="author-details">
            <span className="author-name">{isUser ? 'User' : author}</span>
            <span className="timestamp">{formatTimestamp(timestamp)}</span>
          </div>
        </div>
        {event.modelVersion && (
          <span className="model-version">{event.modelVersion}</span>
        )}
      </div>
      <div className="message-content">{renderContent()}</div>
      {event.usageMetadata && (
        <div className="usage-metadata">
          <span title="Total Tokens">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01"
              />
            </svg>
            {event.usageMetadata.totalTokenCount}
          </span>
        </div>
      )}
    </div>
  );
};
