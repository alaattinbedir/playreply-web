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

### Reviews Page
- [x] Platform filter in reviews list
- [x] Platform icon in review cards

### Analytics Page
- [x] Platform icons in App Performance table

### n8n Workflows
- [x] fetch-ios-reviews.json - Fetch reviews from App Store
- [x] send-ios-reply.json - Send replies to App Store
- [x] Language auto-detection (AI detects from review text)
- [x] Regenerate button support for existing reviews

### Configuration
- [x] Service Account email configured in `.env.local`:
  ```
  NEXT_PUBLIC_GOOGLE_SERVICE_ACCOUNT_EMAIL=playreplyservice@playreply.iam.gserviceaccount.com
  ```

---

## iOS Platform Support - Completed

### Meta & SEO Updates
- [x] `src/app/layout.tsx` - Already includes iOS/App Store references

### Landing Page
- [x] `src/app/page.tsx` - Updated hero ("Respond to App Reviews") and footer text

### Legal Pages
- [x] `src/app/privacy/page.tsx` - Updated with App Store Connect credentials and Apple in data sharing
- [x] `src/app/terms/page.tsx` - Updated service description and Section 8 "Platform Integrations"

---

## Paddle Subscription Integration (Pending Approval)

### Plan Limits Enforcement
- [ ] `src/lib/api/stats.ts` - Update `getPlanUsage()` to return limits based on user's subscription
  - Currently returns hardcoded Free plan limits (2 apps, 50 replies)
  - Need to query user's Paddle subscription status
  - Return correct limits: Free (2/50), Starter (6/1500), Pro (20/10000)
  - Use `PLANS` from `src/lib/paddle/config.ts` as source of truth

### Reply Limit Enforcement
- [ ] Add check before generating AI reply to verify user hasn't exceeded monthly limit
- [ ] Show warning when approaching limit (80%, 90%, 100%)
- [ ] Block reply generation when limit reached, prompt upgrade

### App Limit Enforcement
- [ ] Already implemented: `canAddApp = plan.appsUsed < plan.appsLimit`
- [ ] Will work automatically once `getPlanUsage()` returns correct subscription limits

---

## Notification System - Completed

### Database
- [x] Created `user_notification_settings` table with RLS policies

### Backend API
- [x] `src/lib/api/notification-settings.ts` - CRUD for notification preferences
- [x] Updated `settings/page.tsx` to save preferences to database

### Email Service Integration
- [x] Email templates created (inline HTML in n8n workflows)
- [ ] **ACTION REQUIRED**: Set up Resend account and add API key to n8n
  1. Go to https://resend.com and create account
  2. Get API key from dashboard
  3. Add domain verification for `playreply.com`
  4. Create "Header Auth" credential in n8n with name "Resend API Key"
  5. Update workflows to use the new credential

### n8n Notification Workflows
- [x] `new-review-notification.json` - Webhook-triggered email alerts (ID: aA5uGo92DiBCLc7l)
- [x] `weekly-report.json` - Monday 09:00 weekly summary (ID: TnejZpPpkgarXt0I)

---

## Future Enhancements

### Known Issues Context
- [ ] App-specific known issues (e.g., "bug X exists, will be fixed in version Y")
- [ ] Include in AI prompt for better responses

### Error Handling
- [ ] Retry mechanism for failed API calls
- [ ] Better error messages in UI

### Performance
- [ ] Batch processing optimization for large number of reviews
- [ ] Caching for frequently accessed data
