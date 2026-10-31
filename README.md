# RoamChina · Travel, unhurried

A native SwiftUI travel companion for iOS 18+: five tabs, a floating assistant on every screen, day-by-day plans, a draggable citywalk map, a community feed of member posts, and camera translation.

**Live demo: <https://wangwangbobo.github.io/ios-app-demo/>** — opens straight into the clickable app. All five tabs, the draggable route pins, community channels, the camera scan and the AI assistant really work. The native SwiftUI source lives in [`Lucia/`](Lucia/).

## Screens

- **Trip**: today at a glance — weather, booked palace slot, sunset — a three-question travel style check that names your trip persona, plus four expandable day plans with their stops
- **Plan**: hand-drawn citywalk map, editable pins you can drag, "Make a note" in the top right, Add place + Similar routes in the bottom bar; Pico keeps the same floating orb here as on every other tab
- **Community**: a masonry feed of member notes with search, channel filters and saves; publish your own local event
- **Translate**: live conversation, offline phrases, camera translation (a preset menu and street sign run the full scan flow)
- **Me**: journey reports first — every finished trip archived with new places, route rarity, a rarest-find award and a personal title — then attraction bookings with progress and passes; flights and hotel fold away as optional external sync
- Global: assistant sheet, place details, note poster, post composer, reorder mode, large-text mode

## Run

```bash
open Lucia.xcodeproj
```

Pick the `Lucia` scheme and an iPhone simulator, then ⌘R.

For a real device: Xcode → Settings → Accounts, sign in with your Apple ID, and switch the Team in Signing & Capabilities to your own account (a free account is fine; signatures last 7 days).

## Build an IPA

```bash
./build-ipa.sh
```

Builds a device Release, injects the app icon and writes `distribution/Lucia-1.0.0-unsigned.ipa`. The unsigned package needs to be re-signed with your own Apple ID through Sideloadly or AltStore before it installs on an iPhone.

## Layout

```
index.html           Interactive web edition entry (GitHub Pages)
app.css / app.js     Web edition styles and interactions
Lucia/               SwiftUI source
Lucia.xcodeproj      Project and shared scheme
AppIcon.png          1024 app icon (sliced at packaging time)
build-ipa.sh         Device build + icon injection + IPA packaging
```

## Notes

- No third-party dependencies. The map is drawn by hand with SwiftUI Canvas; MapKit is not used.
- Map pins, community posts, events, restaurant rankings and translation results are local demo data — no live services.
- Camera translation is a local simulation and does not open the camera or run OCR. Assistant replies are scripted locally.
- Design language: cream paper `#F4ECDC`, ink outlines, hard offset shadows, highlighter blocks and sticker doodles.
- Community covers and the Trip "Today at a glance" hero are real photos of Beijing and its food from Wikimedia Commons, each credited on the card and listed in [`img/posts/CREDITS.md`](img/posts/CREDITS.md). User-written notes without a photo fall back to the drawn sticker style.
