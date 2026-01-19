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

## Notification System (Not Implemented)

> Currently UI-only - switches don't save or trigger anything

### Database
- [ ] Create `user_settings` table for notification preferences
  ```sql
  CREATE TABLE user_settings (
    user_id UUID PRIMARY KEY REFERENCES auth.users(id),
    email_notifications BOOLEAN DEFAULT true,
    new_review_alerts BOOLEAN DEFAULT true,
    weekly_reports BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
  );
  ```

### Email Service Integration
- [ ] Set up Resend (or SendGrid/AWS SES) for transactional emails
- [ ] Create email templates:
  - New review alert template
  - Weekly report template
  - Account notifications template

### Backend API
- [ ] `src/lib/api/user-settings.ts` - CRUD for notification preferences
- [ ] Update `settings/page.tsx` to save preferences to database

### n8n Notification Workflows
- [ ] `new-review-notification.json` - Send email when new review arrives
  - Trigger: After fetch-reviews inserts new review
  - Check user's notification preferences
  - Send email via Resend webhook
- [ ] `weekly-report.json` - Weekly summary email
  - Trigger: Cron (Monday 09:00)
  - Aggregate stats per user
  - Send personalized report

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
