# Quick Testing Guide - File Viewing & Download Fix

## How to Test the Fixes

### Prerequisites
1. Have at least one event created
2. Have student reports submitted with various file types (PDF, DOCX, images)
3. Be logged in as Admin or Faculty to test admin features
4. Be logged in as Student to test student features

---

## Test Case 1: Student Viewing Their Own Reports

### Steps:
1. Login as a **Student**
2. Navigate to **My Reports** page
3. Click on any submitted report card
4. In the modal, scroll to "Attached Files" section
5. For each file:
   - Click **"View"** button → Should open preview modal
   - In preview modal, verify file displays correctly
   - Click **"Download"** button → Should download file with correct name
   - Close preview modal

### Expected Results:
- ✅ PDF files open directly in preview (no Google Docs Viewer)
- ✅ Images display correctly
- ✅ DOCX files open in Google Docs Viewer
- ✅ Download button works for all file types
- ✅ Toast notifications appear during operations

---

## Test Case 2: Admin Viewing Student Reports (AI Reports Dashboard)

### Steps:
1. Login as **Admin** or **Faculty**
2. Navigate to **AI Reports** page
3. Select filters (event, academic year)
4. Click on any report card to view details
5. Scroll to "Attached Files" section
6. For each file:
   - Click **"View"** button
   - Verify file preview
   - Click **"Download"** button
   - Verify file downloads

### Expected Results:
- ✅ All file types viewable and downloadable
- ✅ Preview modal opens correctly
- ✅ Download includes proper filename
- ✅ No "Permission denied" errors

---

## Test Case 3: Admin Viewing Event Submissions

### Steps:
1. Login as **Admin** or **Faculty**
2. Navigate to **Events** page
3. Find an event with submissions
4. Click "View Submissions" button
5. In the submissions modal, find reports with attachments
6. Test view and download for each file

### Expected Results:
- ✅ Submission files load correctly
- ✅ Preview works for all supported types
- ✅ Download saves files properly

---

## Test Different File Types

### PDF Files
```
Test: Upload and view a PDF report
Expected: 
- Opens directly in browser preview (not Google Docs Viewer)
- Downloads with correct .pdf extension
```

### DOCX Files
```
Test: Upload and view a Word document
Expected:
- Opens in Google Docs Viewer in preview modal
- Downloads as .docx file
```

### Image Files (JPG, PNG)
```
Test: Upload and view images
Expected:
- Displays directly in preview modal
- Downloads with correct image extension
```

---

## Error Scenarios to Test

### Test 1: Network Interruption
```
Steps:
1. Open preview modal
2. Turn off internet briefly
3. Try to download
Expected: Error toast with fallback message
```

### Test 2: Large Files
```
Steps:
1. Upload a large PDF (>5MB)
2. Try to view and download
Expected: Loading indicators, successful operation
```

---

## Quick Verification Checklist

- [ ] PDFs view without Google Docs Viewer
- [ ] PDFs download correctly
- [ ] DOCX files view in Google Docs Viewer
- [ ] DOCX files download correctly
- [ ] Images display in preview
- [ ] Images download correctly
- [ ] Toast notifications show during operations
- [ ] Error messages are user-friendly
- [ ] Preview modal has close button
- [ ] Download button works in preview modal
- [ ] All file types work in Student dashboard
- [ ] All file types work in Admin dashboard
- [ ] All file types work in Events submissions

---

## Common Issues & Solutions

### Issue: "Preview unavailable" error
**Solution**: File will auto-download instead - this is expected for unsupported types

### Issue: Download opens in new tab instead
**Solution**: This is the fallback behavior when direct download fails - still functional

### Issue: Google Docs Viewer shows "Preview not available"
**Solution**: The file might be too large or not publicly accessible - try downloading directly

---

## Browser Testing

Test in multiple browsers:
- [ ] Chrome/Edge
- [ ] Firefox
- [ ] Safari
- [ ] Mobile Chrome
- [ ] Mobile Safari

---

## Report Any Issues

If you find any problems:
1. Note the file type (PDF, DOCX, etc.)
2. Note which page you were on
3. Check browser console for errors
4. Note the exact error message shown

---

**Files Modified:**
- `frontend/src/pages/Admin/AIReports.js`
- `frontend/src/pages/Student/MyReports.js`
- `frontend/src/pages/Admin/Events.js`

**Status:** Ready for testing ✅
