import { useState } from 'react';
import { FileUpload } from './components/FileUpload';
import { SessionViewer } from './components/SessionViewer';
import { ThemeToggle } from './components/ThemeToggle';
import type { ADKSession } from './types/session';
import './App.css';

function App() {
  const [session, setSession] = useState<ADKSession | null>(null);

  const handleSessionLoad = (loadedSession: ADKSession) => {
    setSession(loadedSession);
  };

  const handleReset = () => {
    setSession(null);
  };

  return (
    <div className="app">
      <ThemeToggle />
      {!session ? (
        <div className="upload-screen">
          <div className="app-header">
            <div className="logo">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                />
              </svg>
            </div>
            <h1>Google ADK Session Viewer</h1>
            <p>
              View and explore your Google Agent Development Kit conversation
              sessions
            </p>
          </div>
          <FileUpload onSessionLoad={handleSessionLoad} />
        </div>
      ) : (
        <SessionViewer session={session} onReset={handleReset} />
      )}
    </div>
  );
}

export default App;
