# Tip Split

Coffee shop tip payout calculator. Built for a phone in the kitchen: big buttons, big numbers, no accounts, works offline.

On payout day someone pulls total hours from payroll or the POS, counts the envelope, and this app splits the cash. It does **not** keep a running hour log or a running tip pool. The staff list is the only thing saved on the phone. Each phone keeps its own list.

## Open it on a phone

Bookmark this link:

**https://dyllan-castia.github.io/grok-bot-apps/**

1. On the phone, open Safari (iPhone) or Chrome (Android).
2. Type or paste that link.
3. Optional: use the browser’s **Add to Home Screen** so it sits with the other apps.
4. Tap **Split tips**, type hours and the envelope, then **Split**.

No login. After the first load it still works if the kitchen Wi‑Fi drops. Names stay on that phone only.

If the link is a blank GitHub page, Dyllan: in the GitHub repo go to **Settings → Pages**, set Source to **GitHub Actions**, then wait for the **Deploy Tip Split** action on `main` to finish.

## Optional: Expo Go (Dyllan)

For a native preview from a laptop:

```sh
cd tip-split
npm install
npx expo start
```

Scan the QR code with **Expo Go** from the App Store or Play Store. This project uses **Expo SDK 54**, which is the version store Expo Go ships.

## Tests and web build

```sh
npm test
npx expo export --platform web
```

## How the split works

Tips are split **in proportion to hours**, using **integer cents** (never floating-point dollars). Each person gets `floor(envelopeCents × theirHours / totalHours)`. Any leftover cents go to the people with the largest remainders so the shares always add up to the envelope. Zero hours is $0. If nobody has hours, the app will not calculate.
