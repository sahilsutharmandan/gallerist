# Lightbox repair evidence

The four `before` images are the screenshots supplied with the issue. The `after` images show the repaired app in Chrome at 1280 × 860, plus a 393 × 852 mobile viewport check.

| Issue | Before | After | Verified behavior |
| --- | --- | --- | --- |
| Zoom shifts toward a corner | [Before](before/1-lightbox-after-pressing-plus-twice.png) | [After](after/1-zoom.png) | Portrait of Dora Wheeler remains centered after two + clicks (225%). The unzoomed image fits the stage. |
| Dragging loses the image | [Before](before/2-lightbox-after-dragging-the-image.png) | [After](after/2-drag.png) | Extreme drags in both directions stop at the image edges; an axis that fits remains centered. |
| Next ignores Title A–Z | [Before](before/3-sorted-a-z-opened-third-card-then-next.png) | [After](after/3-sorted-next.png) | Opening the third sorted card, Adeline Ravoux, then Next shows Church Street El and 4 / 30. Previous and wraparound also follow the displayed list. |
| Closing jumps to the top | [Before](before/4-after-closing-the-lightbox.png) | [After](after/4-scroll-after-closing.png) | Closing restores scrollY = 1238 exactly. Compare the [position before opening](after/4-scroll-before-opening.png). Reopening starts at 100%; Escape also preserves the position. |

Additional [mobile drag evidence](after/5-mobile-drag.png). Zoom, drag bounds, and reset were also checked after resizing to 852 × 393.

## Validation

- Browser assertions passed for fitted and centered images, two-step zoom, extreme drag bounds, reset, wheel zoom, double-click zoom, Escape, keyboard previous, sorted next/previous/wraparound, closing at the same scroll position, and reopening at 100%.
- The browser used a fresh Cleveland Museum API response downloaded during this run and replayed for the list request to make navigation repeatable. Artwork images loaded from the museum CDN. No fixture or API changes were made to the app.
- `npm run build` passed.
- `git diff --check` passed.

Changes are limited to the zoom hook, lightbox stage sizing, Explore's viewer list, and scroll locking.
