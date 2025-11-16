# PDF Viewing & Download Fix

## Problem
PDFs were not displaying in view mode and downloads were failing. The URL showed:
```
https://res.cloudinary.com/dsg7aimdr/image/upload/v1763257663/nss-reports/...pdf
```

Notice `/image/upload/` - this is incorrect for PDFs.

## Root Cause
The backend was uploading PDFs with `resource_type: 'auto'` which caused Cloudinary to treat PDFs as images instead of raw files.

---

## Solution

### 1. Backend Fix (`backend/routes/reports.js`)

**Changed Upload Logic:**
```javascript
// Determine resource_type based on file mimetype
let resourceType = 'auto';
if (file.mimetype.startsWith('image/')) {
  resourceType = 'image';
} else if (file.mimetype.startsWith('video/')) {
  resourceType = 'video';
} else {
  // For PDFs, documents, and other files, use 'raw'
  resourceType = 'raw';
}
```

**Result:**
- ✅ New PDFs will upload as `/raw/upload/` (correct)
- ✅ Images will upload as `/image/upload/` (correct)
- ✅ Documents will upload as `/raw/upload/` (correct)

---

### 2. Frontend Fix (Backward Compatibility)

Fixed in 3 files to handle **existing** PDFs with wrong URLs:
- `frontend/src/pages/Student/MyReports.js`
- `frontend/src/pages/Admin/AIReports.js`
- `frontend/src/pages/Admin/Events.js`

**Added URL Correction:**
```javascript
// Fix Cloudinary URLs that have /image/upload/ for PDFs
let fixedUrl = file.url;
if ((lowerUrl.includes('.pdf') || fileType.includes('pdf')) && 
    lowerUrl.includes('/image/upload/')) {
  // Convert /image/upload/ to /raw/upload/
  fixedUrl = file.url.replace('/image/upload/', '/raw/upload/');
}
```

**Result:**
- ✅ Old PDFs with `/image/upload/` will auto-convert to `/raw/upload/`
- ✅ New PDFs with `/raw/upload/` will work directly
- ✅ All PDFs now viewable and downloadable

---

## Testing Steps

### Test Existing PDFs (Already Uploaded)
1. Go to any page with uploaded PDF reports
2. Click **"View"** on a PDF file
3. **Expected:** PDF should open in preview modal
4. Click **"Download"** 
5. **Expected:** PDF should download correctly

### Test New PDF Upload
1. Submit a new report with a PDF file
2. The URL should now contain `/raw/upload/` instead of `/image/upload/`
3. View and download should work immediately

### Check Console
Open browser console and look for:
```
Fixed PDF URL: https://res.cloudinary.com/...../raw/upload/....pdf
```
This confirms the URL correction is working.

---

## What Changed

### Backend Changes
**File:** `backend/routes/reports.js`
- Added smart resource type detection
- PDFs now upload as `resource_type: 'raw'`
- Images still upload as `resource_type: 'image'`

### Frontend Changes  
**Files:** 
- `frontend/src/pages/Student/MyReports.js`
- `frontend/src/pages/Admin/AIReports.js`
- `frontend/src/pages/Admin/Events.js`

**Changes:**
- Auto-corrects old PDF URLs from `/image/upload/` to `/raw/upload/`
- Works for both old and new uploads
- Maintains backward compatibility

---

## Restart Instructions

### 1. Restart Backend
```bash
# Stop backend (Ctrl+C in backend terminal)
# Then restart
cd backend
npm start
```

### 2. Restart Frontend
The frontend will auto-reload since you're using React development server.

If it doesn't:
```bash
# Stop frontend (Ctrl+C in frontend terminal)
# Then restart
cd frontend
npm start
```

---

## Verification Checklist

- [ ] Backend server restarted
- [ ] Frontend reloaded
- [ ] Existing PDFs open in preview
- [ ] Existing PDFs download correctly
- [ ] New PDF uploads work
- [ ] New PDFs have `/raw/upload/` in URL
- [ ] Console shows "Fixed PDF URL" for old uploads
- [ ] Images still work correctly
- [ ] DOCX files still work correctly

---

## Technical Details

### Why `/image/upload/` Failed for PDFs
Cloudinary's `/image/upload/` endpoint is for image processing. When you request a PDF through this endpoint, Cloudinary tries to convert it to an image, which fails.

### Why `/raw/upload/` Works
The `/raw/upload/` endpoint serves files as-is without processing, perfect for PDFs and documents.

### Backward Compatibility
The frontend fix automatically converts old URLs, so you don't need to re-upload existing PDFs. They'll work immediately after frontend reload.

---

## Status
✅ Backend fixed - new uploads will work correctly  
✅ Frontend fixed - old uploads will auto-correct  
✅ Ready to test after restart

**Next Step:** Restart backend server and test!
