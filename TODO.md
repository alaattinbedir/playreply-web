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
- [x] Auto-sync reviews on page load
- [x] Polling: sync every 5 minutes while page is open
- [x] Sync status indicator in header (syncing/last sync time)
- [x] App icons fetched from App Store / Google Play
- [x] Auto-fetch icons for existing apps without icons

### Settings
- [x] iOS credentials management UI (Issuer ID, Key ID, Private Key)

### Security
- [x] Change Password dialog with validation
- [x] OAuth user detection (hide password change for Google users)
- [x] Two-Factor Authentication (TOTP) with QR code
- [x] Manual secret entry and copy to clipboard
- [x] 2FA enable/disable functionality
- [x] Supabase MFA enabled in dashboard

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

## Paddle Subscription Integration (Pending Production Approval)

### Completed
- [x] Paddle account created and products configured
- [x] Monthly pricing: Starter $9, Pro $29, Studio $79
- [x] Yearly pricing with 33% discount (4 months FREE):
  - Starter: $69/yr ($5.75/mo)
  - Pro: $229/yr ($19/mo)
  - Studio: $629/yr ($52/mo)
- [x] Monthly/Yearly toggle UI in Settings page
- [x] "4 months FREE" badge on yearly option
- [x] Checkout integration with Paddle.js
- [x] Webhook endpoint for subscription events
- [x] Sandbox environment configured and tested
- [x] Production environment variables in Vercel

### Waiting for Paddle Production Approval
- [ ] Test checkout flow on playreply.com
- [ ] Test webhook subscription events

### Plan Limits Enforcement (Post-Launch)
- [ ] `src/lib/api/stats.ts` - Update `getPlanUsage()` to return limits based on user's subscription
  - Currently returns hardcoded Free plan limits (2 apps, 50 replies)
  - Need to query user's Paddle subscription status
  - Return correct limits based on `PLANS` from `src/lib/paddle/config.ts`

### Reply Limit Enforcement (Post-Launch)
- [ ] Add check before generating AI reply to verify user hasn't exceeded monthly limit
- [ ] Show warning when approaching limit (80%, 90%, 100%)
- [ ] Block reply generation when limit reached, prompt upgrade

### App Limit Enforcement (Post-Launch)
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
- [x] Resend email service configured:
  1. ✅ Resend account created
  2. ✅ API key obtained (mobixo-key, Full Access)
  3. ✅ Domain verification for `playreply.com` (DNS records in Namecheap)
  4. ✅ "Resend API Key" Header Auth credential created in n8n
  5. ✅ Workflows activated and tested successfully

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
