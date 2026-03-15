import os
from pathlib import Path

from dotenv import load_dotenv
from langchain_core.prompts import ChatPromptTemplate
from langchain_huggingface import ChatHuggingFace, HuggingFaceEndpoint

load_dotenv()

# Load system prompt from file so wording can be tuned without touching code
_SYSTEM_PROMPT = (
    Path(__file__).parent / "prompts" / "article_system_prompt.txt"
).read_text(encoding="utf-8")

_HUMAN_PROMPT = """\
Short description: {description}

Shark species: {shark_type}
Body part injured: {body_part}
Severity: {severity}
Victim survived: {survived}

Article:"""

_prompt = ChatPromptTemplate.from_messages(
    [("system", _SYSTEM_PROMPT), ("human", _HUMAN_PROMPT)]
)

_llm = HuggingFaceEndpoint(
    repo_id="Qwen/Qwen2.5-7B-Instruct",
    temperature=0.7,
    max_new_tokens=250,
    huggingfacehub_api_token=os.getenv("HUGGINGFACEHUB_API_TOKEN"),
)

_chain = _prompt | ChatHuggingFace(llm=_llm)


def generate_article(
    description: str,
    shark_type: str,
    body_part: str,
    severity: str,
    survived: bool,
) -> str:
    """
    Generate a sarcastic news article for a shark attack report.

    Returns the generated article text, or an empty string if the call fails.
    """
    try:
        response = _chain.invoke(
            {
                "description": description,
                "shark_type": shark_type,
                "body_part": body_part,
                "severity": severity,
                "survived": survived,
            }
        )
        return response.content
    except Exception as e:
        print(f"LLM article generation failed: {e}")
        return ""
