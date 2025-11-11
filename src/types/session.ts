export interface FunctionCall {
  id: string;
  name: string;
  args: Record<string, any>;
}

export interface FunctionResponse {
  id: string;
  name: string;
  response: Record<string, any>;
}

export interface ContentPart {
  text?: string;
  functionCall?: FunctionCall;
  functionResponse?: FunctionResponse;
}

export interface Content {
  parts: ContentPart[];
  role: 'user' | 'model';
}

export interface UsageMetadata {
  cachedContentTokenCount: number;
  candidatesTokenCount: number;
  promptTokenCount: number;
  totalTokenCount: number;
}

export interface Actions {
  stateDelta: Record<string, any>;
  artifactDelta: Record<string, any>;
  requestedAuthConfigs: Record<string, any>;
  requestedToolConfirmations: Record<string, any>;
}

export interface SessionEvent {
  id: string;
  invocationId: string;
  author: string;
  timestamp: number;
  content: Content;
  actions: Actions;
  modelVersion?: string;
  partial?: boolean;
  finishReason?: string;
  usageMetadata?: UsageMetadata;
  longRunningToolIds?: string[];
}

export interface ADKSession {
  id: string;
  appName: string;
  userId: string;
  state: Record<string, any>;
  events: SessionEvent[];
  lastUpdateTime: number;
}

