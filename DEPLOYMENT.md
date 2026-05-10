# FitCoach AI — Deployment Guide

## Prerequisites

```bash
npm install -g eas-cli
eas login
```

---

## 1. EAS Project setup

```bash
# Link your project to EAS
eas init

# This prints your projectId — paste it into app.json extra.eas.projectId
```

---

## 2. Environment variables

Create `.env.production` (never commit):
```
EXPO_PUBLIC_SUPABASE_URL=https://yourproject.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
EXPO_PUBLIC_APP_ENV=production
```

Set Supabase secrets (Anthropic key server-side only):
```bash
npx supabase secrets set ANTHROPIC_API_KEY=sk-ant-...
```

---

## 3. Build for internal testing

```bash
# iOS — TestFlight
eas build --platform ios --profile preview

# Android — Internal track
eas build --platform android --profile preview

# Both at once
eas build --platform all --profile preview
```

---

## 4. Production build

```bash
eas build --platform all --profile production
```

---

## 5. Submit to stores

### App Store (iOS)
```bash
eas submit --platform ios --profile production
```

Requirements:
- Apple Developer account ($99/year)
- App Store Connect app created
- Fill in `eas.json` submit.production.ios fields
- App icon: 1024×1024 PNG, no alpha, no rounded corners
- Screenshots: 6.7", 6.1", 12.9" iPad (if supporting)
- Privacy policy URL required
- App description + keywords

### Play Store (Android)
```bash
eas submit --platform android --profile production
```

Requirements:
- Google Play Developer account ($25 one-time)
- Create app in Play Console
- Download service account JSON → `google-play-service-account.json`
- App icon: 512×512 PNG
- Feature graphic: 1024×500 PNG
- Screenshots: phone + 7" tablet

---

## 6. OTA updates (no app store review)

For JS-only changes after launch:
```bash
eas update --branch production --message "Fix: onboarding crash"
```

---

## 7. Pre-submission checklist

### App
- [ ] All placeholder screens replaced with real content
- [ ] App icon and splash screen assets created
- [ ] `app.json` bundleIdentifier and package set to your values
- [ ] `eas.json` submit fields filled in
- [ ] EAS projectId set in `app.json`
- [ ] Environment variables set for production
- [ ] Supabase RLS enabled on all tables
- [ ] Anthropic API key set as Supabase secret (NOT in app)
- [ ] Error boundary wrapping root component
- [ ] No `console.log` statements in production code

### Supabase
- [ ] All migrations applied (`npx supabase db push`)
- [ ] Edge Function deployed (`npx supabase functions deploy claude-proxy`)
- [ ] Anthropic key set (`npx supabase secrets set ANTHROPIC_API_KEY=...`)
- [ ] RLS enabled and tested on all tables
- [ ] Auth providers configured (email, Google, Apple)
- [ ] Daily database backups enabled

### App Store Connect
- [ ] App name: FitCoach AI
- [ ] Subtitle: AI Personal Trainer
- [ ] Category: Health & Fitness
- [ ] Age rating: 4+
- [ ] Privacy policy URL created
- [ ] Support URL
- [ ] App screenshots (all required sizes)
- [ ] App preview video (optional but boosts conversion)

---

## 8. Post-launch

```bash
# Monitor crash reports
eas diagnostics

# View build logs
eas build:list

# Push an update without resubmitting
eas update --branch production --message "Description of change"
```
