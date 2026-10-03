# Collections, notifications and Compare evidence

Before images are the five original screenshots supplied with the report. After images use the running app, live Cleveland Museum of Art data, and Chrome with desktop/mobile viewport emulation.

| Issue | Before | After |
| --- | --- | --- |
| New collection missing from the open save dialog | [Before](before/1-after-creating-a-collection.png) | [Created collection immediately shown and checked](after/1-after-creating-a-collection.png) |
| Three quick likes overlap notifications | [Before](before/2-after-liking-three-cards.png) | [Three separate notifications](after/2-after-liking-three-cards.png) |
| Phone notifications cover navigation | [Before](before/3-same-on-my-phone.png) | [Notifications stacked above navigation](after/3-same-on-my-phone.png) |
| Unequal desktop comparison frames | [Before](before/4-compare-page.png) | [Equal frames with uncropped images](after/4-compare-page.png) |
| Phone comparison columns are cramped | [Before](before/5-compare-page-on-my-phone.png) | [Single-column first work](after/5-compare-page-on-my-phone.png), [second work after scrolling](after/6-compare-phone-second-work.png) |

## Verification

- Created Winter light through the save dialog; verified its checked state immediately, toggled membership off/on, and checked it again after reload.
- Liked three cards quickly; verified three non-overlapping notifications on desktop and phone, individual dismissal, automatic expiry, and clearance above phone navigation.
- Added the same Monet and Turner works as the report through their artwork pages. Verified equal desktop frame heights, single-column phone layout, swap order and persistence after reload, remove, replacement from favorites, and opening/closing the image viewer.
- Checked Compare for horizontal overflow at 320, 390, 700, and 768 pixels wide. Main captures use 1280px desktop and 390px phone widths. Phone testing is viewport emulation, not a physical device.
- Production build and whitespace checks passed.

The reported notification before image is a cropped desktop detail; its after image shows the full desktop viewport. Live museum totals may differ from the original screenshots.
