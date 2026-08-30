# Tip Split

Coffee shop tip payout calculator. Built for a phone in the kitchen: big buttons, big numbers, no accounts, works offline.

On payout day someone pulls total hours from payroll or the POS, counts the envelope, and this app splits the cash. It does **not** keep a running hour log or a running tip pool. The staff list is the only thing saved on the phone.

## Run it on a phone

From this folder:

```sh
npx expo start
```

Install **Expo Go** from the App Store or Google Play, then scan the QR code. This project uses **Expo SDK 54**, which is the version store Expo Go actually ships. Newer Expo SDKs cannot open in that store app, and there is no update that fixes it.

The app stays on the device and does not need a login or the internet after the first load.

Web preview:

```sh
npx expo start --web
```

## Tests

```sh
npm test
```

## How the split works

Tips are split **in proportion to hours**, using **integer cents** (never floating-point dollars). Each person gets `floor(envelopeCents × theirHours / totalHours)`. Any leftover cents go to the people with the largest remainders so the shares always add up to the envelope. Zero hours is $0. If nobody has hours, the app will not calculate.
