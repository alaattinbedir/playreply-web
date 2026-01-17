# PlayReply TODO

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

## Future Enhancements

### Apps Page
- [ ] Add platform selector when adding new app (Android/iOS dropdown)
- [ ] Show Apple ID field for iOS apps
- [ ] Platform-specific sync button behavior

### Reviews Page
- [ ] Platform filter in reviews list

### Settings
- [ ] iOS credentials management UI (API Key, Issuer ID, Key ID)
