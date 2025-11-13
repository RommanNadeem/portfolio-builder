# Email Pre-fill Feature - Local Testing Guide 🧪

## ✅ Implementation Complete

The email pre-fill feature has been implemented with:
- **Subject:** "Saw your buildspace profile."
- **Body:** Personalized message with user's full name

## 🧪 How to Test Locally

### **1. Dev Server is Running**
The development server should now be running at:
```
http://localhost:3000
```

### **2. Test on a Published Portfolio**

#### **Step A: Make sure you have a published portfolio**
1. Go to `http://localhost:3000/editor`
2. Ensure you have an email address in your profile
3. Publish your portfolio (or use existing published one)

#### **Step B: Visit the public portfolio URL**
1. Go to `http://localhost:3000/[your-slug]`
   - Example: `http://localhost:3000/johndoe`
2. Look for the "Get in Touch" button in:
   - **Top navigation bar** (right side)
   - **Footer section** (below main CTA heading)

#### **Step C: Test the Email Pre-fill**

**Scenario 1: No Custom CTA URL Set**
1. Click "Get in Touch" button
2. Your default email client should open
3. **Verify:**
   - ✅ To: Your email address
   - ✅ Subject: `Saw your buildspace profile.`
   - ✅ Body contains: `Hi [Your Full Name],`
   - ✅ Body contains the full pre-written message

**Scenario 2: Custom CTA URL Set**
1. In editor, add a custom CTA URL (e.g., `https://calendly.com/your-link`)
2. Publish changes
3. Click "Get in Touch" button
4. **Verify:**
   - ✅ Opens your custom URL in new tab
   - ✅ No email client opens

---

## 📧 Expected Email Template

### **When No Custom URL is Set:**

**Email Client Opens With:**

```
To: yourname@example.com
Subject: Saw your buildspace profile.

Body:
Hi John Doe,

I came across your portfolio and I'm impressed by your work. I'd love to connect and explore potential collaboration opportunities.

Looking forward to hearing from you!

Best regards,
```

The visitor then:
1. Adds their name after "Best regards,"
2. Optionally customizes the message
3. Clicks Send

---

## 🔍 What to Check

### **Navigation Bar CTA:**
- [ ] Button appears if email OR custom URL exists
- [ ] Clicking opens email client (no custom URL)
- [ ] Email has correct subject
- [ ] Email has pre-filled body with full name
- [ ] Custom URL still works when set (opens in new tab)

### **Footer CTA:**
- [ ] Button appears if email OR custom URL exists
- [ ] Clicking opens email client (no custom URL)
- [ ] Email has correct subject
- [ ] Email has pre-filled body with full name
- [ ] Custom URL still works when set (opens in new tab)

### **Edge Cases:**
- [ ] Works if full name has special characters
- [ ] Works with different email addresses
- [ ] Fallback to "there" if no name provided
- [ ] Custom URL takes priority over email

### **Mobile Testing:**
- [ ] Button size appropriate on mobile
- [ ] Email client opens on mobile devices
- [ ] Pre-fill works on iOS Mail app
- [ ] Pre-fill works on Gmail mobile app

---

## 🐛 Common Issues & Solutions

### **Issue 1: Email client doesn't open**
**Solution:** Check that you have a default email client set on your system.
- macOS: Mail app should be set as default
- Windows: Outlook or Mail app
- Can also test by copying the mailto: link directly

### **Issue 2: Subject/body not pre-filled**
**Cause:** Some webmail clients (Gmail web) don't support mailto: pre-fill
**Solution:** This is normal - test with native email clients (Apple Mail, Outlook)

### **Issue 3: Line breaks don't show**
**Cause:** URL encoding issue
**Solution:** We use `\n` which becomes `%0A` - this works in most clients

### **Issue 4: Special characters in name break the link**
**Cause:** Characters not properly URL encoded
**Solution:** The `encodeURIComponent()` handles this automatically

---

## 🔗 Testing Different Scenarios

### **Test Case 1: Standard User**
```
Full Name: "John Smith"
Email: "john@example.com"
Custom URL: (empty)

Expected mailto: link:
mailto:john@example.com?subject=Saw%20your%20buildspace%20profile.&body=Hi%20John%20Smith%2C%0A%0AI%20came%20across...
```

### **Test Case 2: User with Custom URL**
```
Full Name: "Jane Doe"
Email: "jane@example.com"
Custom URL: "https://calendly.com/jane"

Expected:
Opens: https://calendly.com/jane (in new tab)
Email link: Not used
```

### **Test Case 3: Single Word Name**
```
Full Name: "Madonna"
Email: "madonna@example.com"
Custom URL: (empty)

Expected:
Body starts with: "Hi Madonna,"
```

### **Test Case 4: No Full Name**
```
Full Name: (empty)
Email: "unknown@example.com"
Custom URL: (empty)

Expected:
Body starts with: "Hi there,"
```

---

## 📱 Email Client Compatibility

### **Desktop Clients:**
- ✅ **Apple Mail (macOS)** - Full support
- ✅ **Outlook (Windows/Mac)** - Full support
- ✅ **Thunderbird** - Full support
- ⚠️ **Gmail Web** - Subject works, body may not pre-fill
- ⚠️ **Yahoo Web** - Limited support

### **Mobile Clients:**
- ✅ **Apple Mail (iOS)** - Full support
- ✅ **Gmail App (iOS/Android)** - Full support
- ✅ **Outlook Mobile** - Full support
- ✅ **Samsung Email** - Full support

---

## 🎯 What Success Looks Like

**Navigation CTA:**
1. Visitor hovers → cursor shows pointer
2. Visitor clicks → email client opens
3. Email is pre-addressed to portfolio owner
4. Subject is pre-filled
5. Body is pre-filled with personalized message
6. Visitor only needs to add their name and send

**Footer CTA:**
1. Same behavior as navigation
2. Prominent white button on dark background
3. Smooth interaction

**Conversion Optimization:**
- Lower friction (pre-written message)
- Professional tone (not spammy)
- Personal touch (uses their name)
- Clear subject (BuildSpace branding)

---

## 🚀 Next Steps After Testing

### **If Everything Works:**
1. Test on different email clients
2. Test on mobile devices
3. Commit the changes
4. Push to main
5. Deploy to production

### **If Issues Found:**
1. Note the specific email client
2. Check browser console for errors
3. Verify email format is correct
4. Test URL encoding

---

## 📊 Code Changes Summary

**New Code Added:**
- `getContactUrl()` helper function
- URL encoding for subject and body
- Smart fallback logic

**Files Modified:**
- `app/[slug]/page.tsx` - Main implementation

**No Breaking Changes:**
- Custom URLs still work exactly as before
- Email CTAs are now enhanced with pre-fill
- Backward compatible

---

## 💡 Testing Commands

### **To test the mailto: link directly:**
```bash
# Copy the generated link from browser inspector
# Should look like:
mailto:test@example.com?subject=Saw%20your%20buildspace%20profile.&body=Hi%20Test%20User%2C%0A%0AI%20came...
```

### **To check URL encoding:**
Open browser console and run:
```javascript
decodeURIComponent("Saw%20your%20buildspace%20profile.")
// Should output: "Saw your buildspace profile."
```

---

## ✅ Ready to Test!

1. **Open:** `http://localhost:3000/[your-slug]`
2. **Click:** "Get in Touch" button (nav or footer)
3. **Verify:** Email client opens with pre-filled content
4. **Report:** Any issues or success! 🎉

The dev server is running - go test it out! 🚀

