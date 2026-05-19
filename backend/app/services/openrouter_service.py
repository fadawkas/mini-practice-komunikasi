import json
import os
import re
import logging
import httpx
from typing import Optional

logger = logging.getLogger(__name__)

OPENROUTER_API_KEY = os.getenv("OPENROUTER_API_KEY", "")
OPENROUTER_MODEL = os.getenv("OPENROUTER_MODEL", "deepseek/deepseek-v4-flash")
OPENROUTER_BASE_URL = "https://openrouter.ai/api/v1/chat/completions"

FALLBACK_BAD_EXAMPLE = (
    "Pokoknya nanti bagian acara koordinasi ya."
)

FALLBACK_EVALUATION = {
    "score_clarity": 10,
    "score_completeness": 10,
    "score_tone": 10,
    "score_actionability": 10,
    "total_score": 40,
    "feedback": "Maaf, evaluasi AI gagal diproses. Silakan coba submit ulang."
}

SYSTEM_MESSAGE = (
    "You are a concise assistant. "
    "Return only the final answer in the requested format. "
    "Do not think step by step."
)


def _extract_json_object(raw_text: str) -> dict:
    """Extract the first JSON object from raw text.
    
    Removes markdown code fences, then finds the first valid JSON object
    using regex. Raises JSONDecodeError if no JSON object exists.
    """
    # Remove markdown code fences if present
    text = raw_text.strip()
    if text.startswith("```"):
        # Remove opening fence (possibly with language tag)
        text = re.sub(r'^```\w*\s*\n?', '', text)
        # Remove closing fence
        text = re.sub(r'\n?```\s*$', '', text)
        text = text.strip()

    # Try to find a JSON object by scanning for balanced braces
    brace_depth = 0
    start_idx = -1
    for i, ch in enumerate(text):
        if ch == '{':
            if brace_depth == 0:
                start_idx = i
            brace_depth += 1
        elif ch == '}':
            brace_depth -= 1
            if brace_depth == 0 and start_idx != -1:
                candidate = text[start_idx:i + 1]
                try:
                    return json.loads(candidate)
                except json.JSONDecodeError:
                    # More than one object? Reset and continue
                    start_idx = -1

    raise json.JSONDecodeError("No valid JSON object found in text", text, 0)


async def _call_openrouter(
    prompt: str,
    max_tokens: int = 500,
    temperature: float = 0.7,
    json_mode: bool = False,
) -> Optional[str]:
    if not OPENROUTER_API_KEY or OPENROUTER_API_KEY == "your_openrouter_api_key_here":
        logger.warning("OPENROUTER_API_KEY not set. Using fallback.")
        return None

    headers = {
        "Authorization": f"Bearer {OPENROUTER_API_KEY}",
        "Content-Type": "application/json",
    }

    messages = [
        {"role": "system", "content": SYSTEM_MESSAGE},
        {"role": "user", "content": prompt},
    ]

    payload = {
        "model": OPENROUTER_MODEL,
        "messages": messages,
        "max_tokens": max_tokens,
        "temperature": temperature,
        "reasoning": {
            "effort": "none",
            "exclude": True,
        },
    }

    if json_mode:
        payload["response_format"] = {"type": "json_object"}

    async with httpx.AsyncClient(timeout=45.0) as client:
        try:
            response = await client.post(OPENROUTER_BASE_URL, headers=headers, json=payload)
            response.raise_for_status()
            data = response.json()

            choices = data.get("choices")
            if not choices or not isinstance(choices, list) or len(choices) == 0:
                logger.warning(f"OpenRouter returned no choices. Response: {data}")
                return None

            message = choices[0].get("message")
            if not message:
                logger.warning(f"OpenRouter returned no message in choices[0]. Response: {data}")
                return None

            content = message.get("content")

            # Handle None content
            if content is None:
                finish_reason = choices[0].get("finish_reason", "unknown")
                logger.warning(
                    f"OpenRouter returned None content. finish_reason={finish_reason}. "
                    f"Full response: {data}"
                )
                return None

            # Handle list content (OpenRouter may return content as a list of parts)
            if isinstance(content, list):
                parts = []
                for part in content:
                    if isinstance(part, dict) and part.get("type") == "text":
                        parts.append(part.get("text", ""))
                content = "".join(parts)

            # Convert to string and strip
            content = str(content).strip()

            # Handle blank/empty content after stripping
            if not content:
                logger.warning(
                    f"OpenRouter returned blank/empty content after processing. "
                    f"Full response: {data}"
                )
                return None

            return content

        except Exception as e:
            logger.error(f"OpenRouter API call failed: {e}")
            return None


async def generate_bad_communication() -> str:
    prompt = (
        "You are creating a mini practice case for internal communication training "
        "in an Indonesian university student organization or event committee.\n\n"
        "Create ONE bad internal communication message in Bahasa Indonesia.\n\n"
        "Context examples:\n"
        "- student organization committee\n"
        "- campus event preparation\n"
        "- division coordination\n"
        "- acara, humas, konsumsi, perlengkapan, publikasi, sekretaris, bendahara\n"
        "- coordination between ketua, koordinator, PIC, and anggota\n\n"
        "The bad message must have at least 3 of these problems:\n"
        "- unclear task\n"
        "- unclear PIC or person responsible\n"
        "- unclear deadline\n"
        "- unclear expected output\n"
        "- unclear reporting/follow-up channel\n"
        "- too vague or creates assumptions\n"
        "- too demanding or not polite enough\n"
        "- no coordination details\n\n"
        "Rules:\n"
        "- Use realistic Bahasa Indonesia used in campus organizations.\n"
        "- Maximum 2 sentences.\n"
        "- Make it clearly improvable, but not offensive.\n"
        "- Do not mention that it is bad.\n"
        "- Do not think step by step.\n"
        "- Return only the final bad communication message.\n"
        "- Do not include reasoning, explanation, labels, or markdown."
    )

    result = await _call_openrouter(prompt, max_tokens=300, temperature=0.7)
    if result:
        return result
    return FALLBACK_BAD_EXAMPLE


async def evaluate_answer(bad_example: str, participant_answer: str) -> dict:
    prompt = (
        "You are an evaluator for a mini practice on internal communication "
        "in an Indonesian university student organization.\n\n"
        "The participant was given this bad internal communication example:\n"
        f'"{bad_example}"\n\n'
        "The participant rewrote it as:\n"
        f'"{participant_answer}"\n\n'
        "Evaluate whether the rewritten message is suitable for internal communication "
        "in a campus organization or event committee.\n\n"
        "Use these criteria:\n"
        "1. Clarity: The task is clear and easy to understand.\n"
        "2. Completeness: The message includes task, PIC/person responsible, deadline, "
        "expected output, and follow-up/reporting channel.\n"
        "3. Tone: The message is polite, respectful, and constructive.\n"
        "4. Actionability: The receiver can immediately understand what to do next.\n\n"
        "Important scoring rules:\n"
        "- Each category must be scored from 0 to 25.\n"
        "- Be fair but strict.\n"
        "- Do not give a perfect score if PIC, deadline, output, or follow-up channel is missing.\n"
        "- If the answer is still vague, score clarity and actionability lower.\n"
        "- If the answer sounds rude or too demanding, score tone lower.\n"
        "- Feedback must be in Bahasa Indonesia.\n"
        "- Feedback should mention one strength and one improvement suggestion.\n\n"
        "Format rules:\n"
        "- Do not think step by step.\n"
        "- Return only the JSON object.\n"
        "- Do not include reasoning, explanation, markdown, or code fences.\n"
        "- Do not use markdown.\n"
        "- Do not wrap the JSON in code fences.\n"
        "- Do not return any explanations outside the JSON.\n"
        "- If unsure, still return the JSON object.\n"
        "- Do not give a perfect score if PIC, deadline, output, or follow-up channel is missing.\n"
        "- If the answer is still vague, lower clarity and actionability.\n"
        "- If the tone is rude or too demanding, lower tone.\n\n"
        "Return ONLY valid JSON with this exact structure:\n"
        "{\n"
        '  "score_clarity": number,\n'
        '  "score_completeness": number,\n'
        '  "score_tone": number,\n'
        '  "score_actionability": number,\n'
        '  "feedback": "short feedback in Bahasa Indonesia"\n'
        "}"
    )

    result = await _call_openrouter(prompt, max_tokens=700, temperature=0.2, json_mode=True)
    if result:
        try:
            parsed = _extract_json_object(result)
            clarity = max(0, min(25, int(parsed.get("score_clarity", 0))))
            completeness = max(0, min(25, int(parsed.get("score_completeness", 0))))
            tone = max(0, min(25, int(parsed.get("score_tone", 0))))
            actionability = max(0, min(25, int(parsed.get("score_actionability", 0))))

            validated = {
                "score_clarity": clarity,
                "score_completeness": completeness,
                "score_tone": tone,
                "score_actionability": actionability,
                "total_score": clarity + completeness + tone + actionability,
                "feedback": parsed.get("feedback", "Evaluasi berhasil."),
            }
            return validated
        except (json.JSONDecodeError, ValueError, TypeError) as e:
            logger.error(f"Failed to parse evaluation JSON: {e}")
            return FALLBACK_EVALUATION

    return FALLBACK_EVALUATION