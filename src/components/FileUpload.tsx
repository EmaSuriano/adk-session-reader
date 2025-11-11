import { useState, useCallback } from 'react';
import type { ADKSession } from '../types/session';
import './FileUpload.css';

interface FileUploadProps {
  onSessionLoad: (session: ADKSession) => void;
}

export const FileUpload = ({ onSessionLoad }: FileUploadProps) => {
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFile = useCallback(
    (file: File) => {
      setError(null);

      if (!file.name.endsWith('.json')) {
        setError('Please upload a JSON file');
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const content = e.target?.result as string;
          const session = JSON.parse(content) as ADKSession;

          // Basic validation
          if (!session.events || !Array.isArray(session.events)) {
            throw new Error('Invalid session format: missing events array');
          }

          onSessionLoad(session);
        } catch (err) {
          setError(
            `Error parsing file: ${
              err instanceof Error ? err.message : 'Unknown error'
            }`,
          );
        }
      };
      reader.readAsText(file);
    },
    [onSessionLoad],
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);

      const files = Array.from(e.dataTransfer.files);
      if (files.length > 0) {
        handleFile(files[0]);
      }
    },
    [handleFile],
  );

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    // Only set dragging to false if we're leaving the drop zone itself
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    const x = e.clientX;
    const y = e.clientY;

    if (
      x <= rect.left ||
      x >= rect.right ||
      y <= rect.top ||
      y >= rect.bottom
    ) {
      setIsDragging(false);
    }
  }, []);

  const handleDragEnter = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);

  const handleFileInput = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = e.target.files;
      if (files && files.length > 0) {
        handleFile(files[0]);
      }
    },
    [handleFile],
  );

  return (
    <div className="file-upload-container">
      <div
        className={`drop-zone ${isDragging ? 'dragging' : ''}`}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
      >
        <div className="drop-zone-content" style={{ pointerEvents: 'none' }}>
          <svg
            className="upload-icon"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
            />
          </svg>
          <h2>Drop your ADK session file here</h2>
          <p>or</p>
          <label
            htmlFor="file-input"
            className="file-input-label"
            style={{ pointerEvents: 'auto' }}
          >
            Browse Files
          </label>
          <input
            id="file-input"
            type="file"
            accept=".json"
            onChange={handleFileInput}
            style={{ display: 'none' }}
          />
          <p className="file-hint">Supports .json session files</p>
        </div>
      </div>
      {error && (
        <div className="error-message">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          {error}
        </div>
      )}
    </div>
  );
};
