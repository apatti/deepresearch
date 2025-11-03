import uvicorn
from fastapi import FastAPI, Request, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from ag_ui_adk import ADKAgent, add_adk_fastapi_endpoint

try:
    from dr_agent.agent import root_agent
except ImportError:
    print("Error: dr_agent.agent not found")
    exit(1)

app = FastAPI(title="GyanVarta backend")
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

def create_agent_for_request(request: Request):
    user_id = request.headers.get("x-user-id")
    if not user_id:
        raise HTTPException(status_code=401, detail="User ID not found")
    
    return ADKAgent(
        adk_agent=root_agent,
        app_name="GyanVarta",
        user_id=user_id,
        session_timeout_seconds=3600,
        use_in_memory_services=True,
    )
    

# Add ADK endpoint to the FastAPI app.
add_adk_fastapi_endpoint(
    app,
    agent_factory=create_agent_for_request,
    path="/",
)

@app.get("/health")
def health():
    return {"status": "ok"}


if __name__ == "__main__":
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=6012,
        reload=True,
    )