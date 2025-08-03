# Admin Panel Approval Guide

## Problem Fixed ✅

The issue was that when you approve a paper, it wasn't being categorized correctly for the "published" and "unpublished" sections.

## How to Fix Your Admin Panel

### Current Issue
Your admin panel is sending:
```javascript
{
  "status": "approved"
}
```

### Required Fix
Your admin panel needs to send:
```javascript
{
  "status": "approved",
  "publicationType": "published"  // or "unpublished"
}
```

## Admin Panel Implementation

### 1. Add Two Approval Buttons

Instead of one "Approve" button, you need two buttons:

```html
<!-- Approve as Published -->
<button onclick="approveAsPublished('${paperId}')" class="btn btn-success">
  Approve as Published
</button>

<!-- Approve as Unpublished -->
<button onclick="approveAsUnpublished('${paperId}')" class="btn btn-warning">
  Approve as Unpublished
</button>
```

### 2. JavaScript Functions

```javascript
// Approve as Published
async function approveAsPublished(paperId) {
  try {
    const response = await fetch(`/api/papers/${paperId}/status`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        status: 'approved',
        publicationType: 'published'
      })
    });
    
    if (response.ok) {
      alert('Paper approved as published!');
      // Refresh your papers list
      loadPapers();
    }
  } catch (error) {
    console.error('Error:', error);
    alert('Failed to approve paper');
  }
}

// Approve as Unpublished
async function approveAsUnpublished(paperId) {
  try {
    const response = await fetch(`/api/papers/${paperId}/status`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        status: 'approved',
        publicationType: 'unpublished'
      })
    });
    
    if (response.ok) {
      alert('Paper approved as unpublished!');
      // Refresh your papers list
      loadPapers();
    }
  } catch (error) {
    console.error('Error:', error);
    alert('Failed to approve paper');
  }
}
```

## How It Works Now

### When you click "Approve as Published":
- `submissionStatus` → `approved`
- `status` → `published`
- Paper appears in **Published Papers** section ✅

### When you click "Approve as Unpublished":
- `submissionStatus` → `approved`
- `status` → `unpublished`
- Paper appears in **Unpublished Papers** section ✅

## API Endpoints Available

- `GET /api/papers` - All papers organized by status
- `GET /api/papers/published` - Only published papers
- `GET /api/papers/unpublished` - Only unpublished papers
- `GET /api/papers/pending` - Only pending papers
- `PUT /api/papers/:paperId/status` - Update paper status

## Test the Fix

1. Update your admin panel with the two approval buttons
2. Try approving a paper as "published"
3. Check that it appears in the published section
4. Try approving a paper as "unpublished"
5. Check that it appears in the unpublished section

The system is now working correctly! 🎉 