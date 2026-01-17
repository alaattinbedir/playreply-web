# PlayReply TODO

## Completed

### Apps Page
- [x] Add platform selector when adding new app (Android/iOS tabs)
- [x] Show Apple ID field for iOS apps
- [x] Platform icons in app list
- [x] iOS credentials warning/success status
- [x] "Setup Required" badge for iOS apps without credentials
- [x] Updated Android setup guide with shared SA model
- [x] Copy button for SA email

### Settings
- [x] iOS credentials management UI (Issuer ID, Key ID, Private Key)

---

## iOS Platform Support - Remaining Tasks

### Meta & SEO Updates
- [ ] `src/app/layout.tsx` - Update meta title, description, keywords to include iOS/App Store
  - Line 15: "AI-Powered Google Play Review Responses" → include App Store
  - Line 16-17: Description and keywords
  - Lines 20-21, 28-29: OpenGraph and Twitter meta

### Landing Page
- [ ] `src/app/page.tsx` - Update hero and footer text
  - Line 78: "Respond to Google Play Reviews with..." → include App Store
  - Line 264: Footer description

### Legal Pages
- [ ] `src/app/privacy/page.tsx` - Update privacy policy
  - Line 6: Meta description
  - Line 44: "Google Play Console credentials" → include App Store Connect
  - Line 93: Third-party services list

- [ ] `src/app/terms/page.tsx` - Update terms of service
  - Line 6: Meta description
  - Line 41: Service description
  - Lines 107-111: Section 8 "Google Play Integration" → "App Store Integration"

---

## Configuration (Completed)

### Google Service Account Email
- [x] Service Account email configured in `.env.local`:
  ```
  NEXT_PUBLIC_GOOGLE_SERVICE_ACCOUNT_EMAIL=playreplyservice@playreply.iam.gserviceaccount.com
  ```

---

## Future Enhancements

### Reviews Page
- [ ] Platform filter in reviews list
- [ ] Platform icon in review cards

### n8n Workflows
- [ ] fetch-ios-reviews.json - Fetch reviews from App Store
- [ ] send-ios-reply.json - Send replies to App Store
