import {
  CopilotRuntime,
  ExperimentalEmptyAdapter,
  copilotRuntimeNextJSAppRouterEndpoint,
} from "@copilotkit/runtime";
import { HttpAgent } from "@ag-ui/client";
import { NextRequest } from "next/server";
import { GoogleAuth } from 'google-auth-library';

// 1. You can use any service adapter here for multi-agent support. We use
//    the empty adapter since we're only using one agent.
const serviceAdapter = new ExperimentalEmptyAdapter();

// Use environment variable to switch between local and production backend
const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "https://deepresearch-backend-103391268967.us-west1.run.app/";

// Initialize Google Auth for ID token generation
const auth = new GoogleAuth();
const originalFetch = global.fetch;

/**
 * Override global fetch to add Google Cloud ID tokens for Cloud Run requests.
 * This allows HttpAgent to automatically use authenticated requests.
 */
const createAuthenticatedFetch = () => {
  return async (url: string | URL | Request, init?: RequestInit) => {
    const urlString = typeof url === 'string' ? url : url instanceof URL ? url.toString() : url.url;
    
    // Only add authentication for production Cloud Run URLs
    if (!urlString.includes('.run.app')) {
      return originalFetch(url, init);
    }

    try {
      // Get an ID token client for the backend URL
      const client = await auth.getIdTokenClient(backendUrl);
      const idToken = await client.idTokenProvider.fetchIdToken(backendUrl);

      // Add the ID token to the Authorization header
      const headers = new Headers(init?.headers);
      headers.set('Authorization', `Bearer ${idToken}`);

      return originalFetch(url, {
        ...init,
        headers,
      });
    } catch (error) {
      console.error('Error generating ID token:', error);
      // Fall back to unauthenticated request if token generation fails
      return originalFetch(url, init);
    }
  };
};

// Override global fetch for this module
global.fetch = createAuthenticatedFetch() as typeof fetch;

// 2. Create the CopilotRuntime instance and utilize the ADK AG-UI
//    integration to setup the connection.
const runtime = new CopilotRuntime({
  agents: {
    // Our AG-UI endpoint URL - will use the overridden global fetch
    "dr_agent": new HttpAgent({ 
      url: backendUrl,
    }),
  }
});

// 3. Build a Next.js API route that handles the CopilotKit runtime requests.
export const POST = async (req: NextRequest) => {
  const { handleRequest } = copilotRuntimeNextJSAppRouterEndpoint({
    runtime,
    serviceAdapter,
    endpoint: "/api/copilotkit",
  });

  return handleRequest(req);
};