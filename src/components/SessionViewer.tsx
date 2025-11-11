import type { ADKSession } from '../types/session';
import { ChatMessage } from './ChatMessage';
import './SessionViewer.css';

interface SessionViewerProps {
  session: ADKSession;
  onReset: () => void;
}

export const SessionViewer = ({ session, onReset }: SessionViewerProps) => {
  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp * 1000);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getTotalTokens = () => {
    return session.events.reduce((total, event) => {
      return total + (event.usageMetadata?.totalTokenCount || 0);
    }, 0);
  };

  const getMessageCount = () => {
    return session.events.filter((event) =>
      event.content.parts.some((part) => part.text),
    ).length;
  };

  const getFunctionCallCount = () => {
    return session.events.filter((event) =>
      event.content.parts.some((part) => part.functionCall),
    ).length;
  };

  return (
    <div className="session-viewer">
      <header className="session-header">
        <div className="header-content">
          <div className="session-info">
            <h1 className="session-title">{session.appName}</h1>
            <div className="session-meta">
              <span className="session-id">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M7 20l4-16m2 16l4-16M6 9h14M4 15h14"
                  />
                </svg>
                {session.id}
              </span>
              <span className="session-date">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
                {formatDate(session.lastUpdateTime)}
              </span>
            </div>
          </div>
        </div>
        <div className="session-stats-row">
          <div className="session-stats">
            <div className="stat">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                />
              </svg>
              <div>
                <span className="stat-value">{getMessageCount()}</span>
                <span className="stat-label">Messages</span>
              </div>
            </div>
            <div className="stat">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"
                />
              </svg>
              <div>
                <span className="stat-value">{getFunctionCallCount()}</span>
                <span className="stat-label">Function Calls</span>
              </div>
            </div>
            <div className="stat">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01"
                />
              </svg>
              <div>
                <span className="stat-value">
                  {getTotalTokens().toLocaleString()}
                </span>
                <span className="stat-label">Total Tokens</span>
              </div>
            </div>
            <button className="reset-button" onClick={onReset}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"
                />
              </svg>
              Load New Session
            </button>
          </div>
        </div>
      </header>

      <div className="chat-container">
        <div className="chat-messages">
          {session.events.map((event) => (
            <ChatMessage key={event.id} event={event} />
          ))}
        </div>
      </div>
    </div>
  );
};
