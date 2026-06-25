def build_prompt(text, current_time=None):
    """
    Constructs the prompt for Gemini instructing it to extract productivity items
    from natural language and return a structured JSON object.
    """
    time_context = ""
    if current_time:
        time_context = f"\nNote: The current local reference date/time is {current_time}."

    prompt = f"""You are a professional natural language processing assistant.
Analyze the user's input text and extract multiple productivity items.
Each item must be classified as one of the following types: "task", "reminder", or "note".

For each extracted item, identify and format the following attributes:
1. "type": Either "task", "reminder", or "note".
2. "title": A concise, clear title summarizing the item (e.g., "Call Rahul", "Buy groceries"). Keep it under 255 characters.
3. "description" (use this for tasks and reminders) or "content" (use this for notes): Any additional details, subtasks, or context described in the text. Default to an empty string "" if none are found.
4. "category": Assign exactly one of the following category strings:
   - "Work"
   - "Study"
   - "Shopping"
   - "Personal"
   - "Health"
   - "Finance"
   - "Other"
5. "priority": Assign exactly one of the following strings:
   - "High"
   - "Medium"
   - "Low"
   Default to "Medium" if no priority is explicitly implied.
6. "due_date": If a date is mentioned (relative or absolute), parse it and represent it as:
   - "YYYY-MM-DD" formatted string (e.g., "2026-06-26") resolved using the current reference date context, OR
   - A short relative date string under 10 characters (e.g., "Tomorrow", "Friday").
   If no date is mentioned, return null.
7. "due_time": If a specific time is mentioned, format it as HH:MM or HH:MM:SS (preferably 24-hour, or 12-hour format under 8 characters, e.g., "10:00 AM", "14:30"). If no time is mentioned, return null.
8. "tags": An array of semantic tags representing keywords (e.g., "cloud", "security", "presentation"). All tags must be lowercase strings. Do not include spaces or special characters in individual tags.

{time_context}

Output Guidelines:
You MUST return a JSON object with a single root key "items" containing a list/array of the extracted item objects.
Do not wrap your output in markdown formatting, code blocks, or include any extra text. Output ONLY the raw JSON string.

Example Output Structure:
{{
  "items": [
    {{
      "type": "task",
      "title": "Call Rahul",
      "description": "",
      "category": "Work",
      "priority": "Medium",
      "due_date": "Tomorrow",
      "due_time": "10:00 AM",
      "tags": ["call", "rahul"]
    }},
    {{
      "type": "note",
      "title": "Hackathon ideas",
      "content": "Focus on AI integrations, simple Flask backends, and SQLite database.",
      "category": "Other",
      "priority": "Medium",
      "due_date": null,
      "due_time": null,
      "tags": ["hackathon", "ideas"]
    }}
  ]
}}

User Input Text to analyze:
"{text}"
"""
    return prompt
