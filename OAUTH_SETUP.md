# OAuth Setup Guide — Google + Apple

## 1. Install required packages

```bash
npx expo install expo-web-browser expo-auth-session expo-apple-authentication
```

---

## 2. Update app.json

Add the scheme and Apple authentication plugin:

```json
{
  "expo": {
    "scheme": "fitcoachai",
    "ios": {
      "bundleIdentifier": "com.yourname.fitcoachai",
      "usesAppleSignIn": true
    },
    "plugins": [
      "expo-apple-authentication"
    ]
  }
}
```

---

## 3. Set up Google OAuth in Supabase

1. Go to [console.cloud.google.com](https://console.cloud.google.com)
2. Create a new project (or use existing)
3. Go to **APIs & Services → Credentials**
4. Click **Create Credentials → OAuth 2.0 Client ID**
5. Set Application type to **Web application**
6. Add Authorised redirect URI:
   ```
   https://YOUR_PROJECT_REF.supabase.co/auth/v1/callback
   ```
7. Copy the **Client ID** and **Client Secret**

Then in Supabase:
1. Go to **Authentication → Providers → Google**
2. Enable Google
3. Paste Client ID and Client Secret
4. Save

---

## 4. Set up Apple Sign In in Supabase

### Apple Developer Console
1. Go to [developer.apple.com](https://developer.apple.com)
2. Go to **Certificates, Identifiers & Profiles → Identifiers**
3. Select your App ID → enable **Sign In with Apple**
4. Go to **Keys** → create a new key
5. Enable **Sign In with Apple** → Configure
6. Select your Primary App ID
7. Download the `.p8` key file — **keep this safe, you can only download once**

### Supabase
1. Go to **Authentication → Providers → Apple**
2. Enable Apple
3. Fill in:
   - **Services ID**: `com.yourname.fitcoachai`
   - **Apple Team ID**: found in top-right of developer.apple.com
   - **Key ID**: from the key you created
   - **Private Key**: contents of the `.p8` file
4. Add callback URL in Apple:
   ```
   https://YOUR_PROJECT_REF.supabase.co/auth/v1/callback
   ```

---

## 5. Add redirect URL to Supabase

In Supabase → **Authentication → URL Configuration**:

Add to **Redirect URLs**:
```
fitcoachai://auth/callback
```

---

## 6. Test on a physical device

OAuth requires a physical device — it won't work in Expo Go on a simulator.

```bash
# Build a development client
eas build --platform ios --profile development
eas build --platform android --profile development
```

Or use expo-dev-client:
```bash
npx expo install expo-dev-client
npx expo run:ios
npx expo run:android
```

---

## Common errors

| Error | Fix |
|-------|-----|
| `redirect_uri_mismatch` | Add `fitcoachai://auth/callback` to Supabase redirect URLs |
| `Apple sign in not available` | Must be on a real iOS device, not simulator |
| `ERR_REQUEST_CANCELED` | User tapped cancel — safe to ignore |
| `No identity token` | Rebuild the app after adding `usesAppleSignIn: true` to app.json |
