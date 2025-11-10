import {
  CopilotRuntime,
  ExperimentalEmptyAdapter,
  copilotRuntimeNextJSAppRouterEndpoint,
} from "@copilotkit/runtime";
import { HttpAgent } from "@ag-ui/client";
import { NextRequest } from "next/server";

// 1. You can use any service adapter here for multi-agent support. We use
//    the empty adapter since we're only using one agent.
const serviceAdapter = new ExperimentalEmptyAdapter();

// 2. Create the CopilotRuntime instance and utilize the ADK AG-UI
//    integration to setup the connection.
// Use environment variable to switch between local and production backend
const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "https://deepresearch-backend-103391268967.us-west1.run.app/";

const runtime = new CopilotRuntime({
  agents: {
    // Our AG-UI endpoint URL
    "dr_agent": new HttpAgent({ url: backendUrl }),
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