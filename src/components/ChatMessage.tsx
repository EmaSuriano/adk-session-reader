import { useState } from 'react';
import type { SessionEvent } from '../types/session';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { JsonView, defaultStyles } from 'react-json-view-lite';
import 'react-json-view-lite/dist/index.css';
import './ChatMessage.css';

interface ChatMessageProps {
  event: SessionEvent;
}

export const ChatMessage = ({ event }: ChatMessageProps) => {
  const { content, author, timestamp } = event;
  const isUser = content.role === 'user' && author === 'user';
  const isModel = content.role === 'model';
  const [isExpanded, setIsExpanded] = useState(false);
  
  // Check if this message contains only function calls/responses (no text)
  const hasOnlyFunctions = content.parts.every(part => 
    part.functionCall || part.functionResponse
  );
  const hasFunctions = content.parts.some(part => 
    part.functionCall || part.functionResponse
  );

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
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
              {part.text}
            </ReactMarkdown>
          </div>
        );
      }

      // Function call
      if (part.functionCall) {
        return (
          <div key={index} className="function-call">
            <button 
              className="function-header function-toggle"
              onClick={() => setIsExpanded(!isExpanded)}
              aria-expanded={isExpanded}
            >
              <svg 
                className={`chevron-icon ${isExpanded ? 'expanded' : ''}`}
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"
                />
              </svg>
              <span className="function-name">{part.functionCall.name}</span>
              <span className="function-badge">Function Call</span>
            </button>
            {isExpanded && (
              <div className="function-args">
                <JsonView 
                  data={part.functionCall.args} 
                  shouldExpandNode={(level) => level < 2}
                  style={{
                    ...defaultStyles,
                    container: 'json-container',
                    label: 'json-label',
                    nullValue: 'json-null',
                    undefinedValue: 'json-undefined',
                    numberValue: 'json-number',
                    stringValue: 'json-string',
                    booleanValue: 'json-boolean',
                    otherValue: 'json-other',
                    punctuation: 'json-punctuation',
                  }}
                />
              </div>
            )}
          </div>
        );
      }

      // Function response
      if (part.functionResponse) {
        return (
          <div key={index} className="function-response">
            <button 
              className="function-header function-toggle"
              onClick={() => setIsExpanded(!isExpanded)}
              aria-expanded={isExpanded}
            >
              <svg 
                className={`chevron-icon ${isExpanded ? 'expanded' : ''}`}
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <span className="function-name">
                {part.functionResponse.name}
              </span>
              <span className="function-badge">Response</span>
            </button>
            {isExpanded && (
              <div className="function-result">
                <JsonView 
                  data={part.functionResponse.response} 
                  shouldExpandNode={(level) => level < 2}
                  style={{
                    ...defaultStyles,
                    container: 'json-container',
                    label: 'json-label',
                    nullValue: 'json-null',
                    undefinedValue: 'json-undefined',
                    numberValue: 'json-number',
                    stringValue: 'json-string',
                    booleanValue: 'json-boolean',
                    otherValue: 'json-other',
                    punctuation: 'json-punctuation',
                  }}
                />
              </div>
            )}
          </div>
        );
      }

      return null;
    });
  };

  return (
    <div
      className={`chat-message ${isUser ? 'user-message' : 'model-message'} ${hasOnlyFunctions ? 'function-only-message' : ''}`}
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
