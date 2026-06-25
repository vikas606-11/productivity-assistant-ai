import os
import json
import logging
import google.generativeai as genai
from ai.prompt_builder import build_prompt

# Configure service-level logging
logger = logging.getLogger(__name__)

def get_gemini_service():
    """
    Factory function to initialize and retrieve the GeminiService instance.
    Reads the GEMINI_API_KEY environment variable.
    """
    api_key = os.getenv("GEMINI_API_KEY")
    if not api_key or api_key == "YOUR_API_KEY":
        raise ValueError("GEMINI_API_KEY is not configured in the environment or .env file.")
    
    genai.configure(api_key=api_key)
    return GeminiService()

class GeminiService:
    def __init__(self):
        # Use gemini-1.5-flash as it is fast, cost-effective, and supports JSON output schemas
        self.model = genai.GenerativeModel("gemini-1.5-flash")

    def capture_items(self, text, current_time=None):
        """
        Sends the natural language query to Gemini to parse into structured productivity items.
        Retries once if invalid JSON is returned or if the API call fails.
        """
        logger.info(f"Incoming natural language query to process: '{text}'")
        prompt = build_prompt(text, current_time)
        
        for attempt in range(2):
            try:
                logger.info(f"Calling Gemini API (Attempt {attempt + 1}/2)...")
                
                # Request JSON output using the generation_config response_mime_type setting
                response = self.model.generate_content(
                    prompt,
                    generation_config={"response_mime_type": "application/json"}
                )
                
                response_text = response.text
                logger.info(f"Gemini API Raw Response: {response_text}")
                
                # Clean up any potential markdown formatting tags in response text
                cleaned_text = self._clean_json_blocks(response_text)
                
                # Parse JSON content
                data = json.loads(cleaned_text)
                
                if "items" not in data:
                    raise ValueError("Root key 'items' is missing in Gemini response JSON.")
                
                return data
            except Exception as e:
                logger.warning(f"Failed to process Gemini response on attempt {attempt + 1}/2. Error: {str(e)}")
                if attempt == 1:
                    logger.error("Both attempts to process natural language using Gemini API failed.")
                    raise e

    def generate_tags(self, title, description=""):
        """
        Extracts 3 to 6 lowercase single-word semantic tags representing key technologies,
        topics, categories, or actions from a task's title and description.
        """
        prompt = f"""You are a professional natural language processing assistant.
Extract 3 to 6 semantic, lowercase, single-word tags representing key technologies, topics, categories, or actions from the following task details:
Title: "{title}"
Description: "{description or ''}"

Output Guidelines:
Return the result as a raw JSON array of strings, e.g. ["aws", "cloud", "security", "presentation"].
All tags must be lowercase. Do not include spaces or special characters in individual tags.
Do not wrap your output in markdown formatting, code blocks, or include any extra text. Output ONLY the raw JSON array.
"""
        logger.info(f"Generating semantic tags for title: '{title}'")
        try:
            response = self.model.generate_content(
                prompt,
                generation_config={"response_mime_type": "application/json"}
            )
            response_text = response.text
            cleaned_text = self._clean_json_blocks(response_text)
            tags = json.loads(cleaned_text)
            if isinstance(tags, list):
                return [str(tag).strip().lower() for tag in tags if str(tag).strip()]
            return []
        except Exception as e:
            logger.warning(f"Failed to generate tags using Gemini API: {str(e)}")
            raise e

    def _clean_json_blocks(self, text):
        """
        Strips markdown code blocks (e.g., ```json ... ```) from a text response if present.
        """
        text = text.strip()
        if text.startswith("```"):
            lines = text.splitlines()
            if lines[0].startswith("```json") or lines[0].startswith("```"):
                lines = lines[1:]
            if lines and lines[-1] == "```":
                lines = lines[:-1]
            text = "\n".join(lines).strip()
        return text

