import re
import logging
import json
from datetime import datetime
from database import db
from models import Task, Note
from services.gemini_service import get_gemini_service

logger = logging.getLogger(__name__)

# Caching state
_summary_cache = None
_summary_dirty = True

def mark_summary_dirty():
    """
    Flags the cached summary as dirty so it will be regenerated next time.
    """
    global _summary_dirty
    _summary_dirty = True
    logger.info("Productivity summary marked as DIRTY (cache invalidated)")

def is_date_yyyymmdd(date_str):
    if not date_str:
        return False
    return bool(re.match(r'^\d{4}-\d{2}-\d{2}$', date_str.strip()))

def is_due_today_task(task, today_str):
    if not task.due_date or task.status != 'Pending':
        return False
    due_clean = task.due_date.strip().lower()
    return due_clean == 'today' or due_clean == today_str

def is_overdue_task(task, today_str):
    if task.status != 'Pending' or not task.due_date:
        return False
    due_clean = task.due_date.strip().lower()
    if due_clean in ('today', 'tomorrow') or 'next' in due_clean:
        return False
    if due_clean == 'yesterday':
        return True
    if is_date_yyyymmdd(task.due_date):
        return due_clean < today_str
    return False

def generate_fallback_summary(tasks, notes):
    """
    Generates a fallback rule-based summary in case Gemini is unavailable.
    """
    today_str = datetime.now().strftime('%Y-%m-%d')
    overdue_count = sum(1 for t in tasks if is_overdue_task(t, today_str))
    due_today_count = sum(1 for t in tasks if is_due_today_task(t, today_str))
    high_prio_count = sum(1 for t in tasks if t.priority == 'High' and t.status == 'Pending')
    pending_count = sum(1 for t in tasks if t.status == 'Pending')
    completed_count = sum(1 for t in tasks if t.status == 'Completed')
    
    summary = f"You have {pending_count} pending tasks, with {due_today_count} due today"
    if overdue_count > 0:
        summary += f" and {overdue_count} overdue tasks"
    summary += f". You've completed {completed_count} tasks so far. "
    
    if high_prio_count > 0:
        summary += f"Make sure to address the {high_prio_count} high-priority tasks today."
    else:
        summary += "Keep up the consistent momentum!"
        
    suggestions = [
        "Focus on high-priority tasks first to maximize impact.",
        "Reschedule your overdue tasks to keep your timeline realistic.",
        "Review your recent notes to identify hidden action items."
    ]
    if due_today_count > 0:
        suggestions.append("Check off items due today before they become overdue.")
        
    return {
        "summary": summary,
        "suggestions": suggestions
    }

def generate_ai_summary(tasks, notes):
    """
    Queries Google Gemini to generate a concise summary and suggestions.
    Falls back to generate_fallback_summary if unconfigured or error occurs.
    """
    tasks_list = []
    for t in tasks:
        due = f"due {t.due_date}" if t.due_date else "no due date"
        desc = f" ({t.description[:50]}...)" if t.description else ""
        tasks_list.append(f"- [{t.status}] {t.title}{desc} | Priority: {t.priority} | Category: {t.category} | {due}")
    
    notes_list = []
    for n in notes:
        content = f": {n.content[:60]}..." if n.content else ""
        notes_list.append(f"- Note: {n.title}{content}")
        
    tasks_text = "\n".join(tasks_list) if tasks_list else "No tasks recorded."
    notes_text = "\n".join(notes_list) if notes_list else "No notes recorded."
    
    prompt = f"""You are a professional productivity coach.
Analyze the following list of tasks and notes for the user and generate:
1. A concise, encouraging summary of their day/productivity status (under 100 words).
2. 3 to 4 actionable AI suggestions or tips to optimize their focus (e.g. "Work on X first since it's high priority", "Break task Y down", "Reschedule task Z since it is overdue").

Here are the user's tasks:
{tasks_text}

Here are the user's notes:
{notes_text}

Return your response in raw JSON format matching this schema:
{{
  "summary": "concise summary text",
  "suggestions": [
    "actionable suggestion 1",
    "actionable suggestion 2",
    "actionable suggestion 3"
  ]
}}
Do not wrap your output in markdown code blocks or include any extra text. Output ONLY the raw JSON object.
"""
    logger.info("Generating AI summary using Gemini API...")
    try:
        service = get_gemini_service()
        response = service.model.generate_content(
            prompt,
            generation_config={"response_mime_type": "application/json"}
        )
        response_text = response.text
        
        # Clean markdown code block if present
        if response_text.startswith("```"):
            lines = response_text.splitlines()
            if lines[0].startswith("```json") or lines[0].startswith("```"):
                lines = lines[1:]
            if lines and lines[-1] == "```":
                lines = lines[:-1]
            response_text = "\n".join(lines).strip()
            
        data = json.loads(response_text)
        return {
            "summary": data.get('summary', ''),
            "suggestions": data.get('suggestions', [])
        }
    except Exception as e:
        logger.warning(f"Failed to generate AI summary using Gemini: {str(e)}. Using fallback.")
        return generate_fallback_summary(tasks, notes)

def get_summary_response_data(force_refresh=False):
    """
    Main function to construct and return the cached or freshly generated AI summary details.
    """
    global _summary_cache, _summary_dirty
    
    today_str = datetime.now().strftime('%Y-%m-%d')
    tasks = Task.query.all()
    notes = Note.query.all()
    
    # 1. Check cache eligibility
    if not force_refresh and not _summary_dirty and _summary_cache is not None:
        logger.info("Returning CACHED productivity summary.")
        summary_data = _summary_cache
    else:
        logger.info("Generating NEW productivity summary...")
        # Call Gemini or fallback
        ai_data = generate_ai_summary(tasks, notes)
        
        _summary_cache = ai_data
        _summary_dirty = False
        summary_data = ai_data

    # 2. Compute Priority Insights
    overdue_tasks = [t.to_dict() for t in tasks if is_overdue_task(t, today_str)]
    due_today_tasks = [t.to_dict() for t in tasks if is_due_today_task(t, today_str)]
    high_priority_tasks = [t.to_dict() for t in tasks if t.priority == 'High' and t.status == 'Pending']
    
    # Sort completed tasks descending by ID / updated_at
    completed_tasks = [t for t in tasks if t.status == 'Completed']
    completed_tasks.sort(key=lambda x: x.updated_at, reverse=True)
    recently_completed = [t.to_dict() for t in completed_tasks[:5]]
    
    insights = {
        "overdue": overdue_tasks,
        "due_today": due_today_tasks,
        "high_priority": high_priority_tasks,
        "recently_completed": recently_completed
    }

    # 3. Calculate Statistics
    pending_count = sum(1 for t in tasks if t.status == 'Pending')
    completed_count = len(completed_tasks)
    overdue_count = len(overdue_tasks)
    due_today_count = len(due_today_tasks)
    total_count = len(tasks)
    
    completion_rate = round((completed_count / total_count) * 100, 1) if total_count > 0 else 0.0

    statistics = {
        "pending_count": pending_count,
        "completed_count": completed_count,
        "overdue_count": overdue_count,
        "due_today_count": due_today_count,
        "completion_rate": completion_rate
    }
    
    return {
        "summary": summary_data.get('summary', ''),
        "suggestions": summary_data.get('suggestions', []),
        "insights": insights,
        "statistics": statistics
    }
