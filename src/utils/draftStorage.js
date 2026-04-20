const STORAGE_KEY = 'proseframe_drafts';
const MAX_DRAFTS = 10;

export function getDrafts() {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

export function saveDraft(content) {
  if (!content.trim()) return null;

  const drafts = getDrafts();

  // Extract title from content (first line or first 50 chars)
  const title = content.split('\n')[0].replace(/^#+\s*/, '').trim().slice(0, 50) || content.slice(0, 50);

  // Check for duplicate content
  const existingIndex = drafts.findIndex(d => d.content === content);

  if (existingIndex !== -1) {
    // Update timestamp of existing draft, move to front
    drafts[existingIndex].timestamp = Date.now();
    drafts.unshift(drafts.splice(existingIndex, 1)[0]);
  } else {
    // Create new draft
    const newDraft = {
      id: `draft_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`,
      content,
      title,
      timestamp: Date.now(),
    };
    drafts.unshift(newDraft);

    // Enforce max limit
    while (drafts.length > MAX_DRAFTS) {
      drafts.pop();
    }
  }

  localStorage.setItem(STORAGE_KEY, JSON.stringify(drafts));
  return drafts;
}

export function deleteDraft(id) {
  const drafts = getDrafts().filter(d => d.id !== id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(drafts));
  return drafts;
}
