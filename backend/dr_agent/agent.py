import os
from pathlib import Path
from dotenv import load_dotenv
from google.adk.agents import LlmAgent

# Load environment variables from .env file
env_path = Path(__file__).parent / '.env'
load_dotenv(dotenv_path=env_path)

gyanvarta_root_agent = LlmAgent(
    model='gemini-2.5-flash',
    name='agents',
    description='A helpful assistant for user questions.',
    instruction='Answer user questions to the best of your knowledge',
)
