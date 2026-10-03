# Explore display fixes

Before images are the supplied originals. After images use the live museum API at a 1280 × 900 viewport; counts may differ as the collection changes.

## Monet cards stay together across columns

Before

![Before](before/1-explore-search-monet.png)

After

![After](after/1-explore-search-monet.jpg)

## Filter bar clears the fixed header

Before

![Before](before/2-filter-bar-after-scrolling.png)

After

![After](after/2-filter-bar-after-scrolling.jpg)

## Start handle cannot pass the end handle

Before

![Before](before/3-date-range-after-dragging-left-handle.png)

After

![After](after/3-date-range-after-dragging-left-handle.jpg)

## Preset selection and BCE date labels

Before

![Before](before/4-date-range-presets.png)

After

![After](after/4-date-range-presets.jpg)

## Artist tooltip extends beyond the card without clipping

Before

![Before](before/5-hovering-the-artist-line.png)

After

![After](after/5-hovering-the-artist-line.jpg)

## Verification

- Monet: all rendered cards have one unbroken layout rectangle.
- Scrolled desktop: header bottom and filter top both measured 72px.
- Pointer drag of start past end clamps to 1600–1600. Keyboard end below start clamps to 1400–1400.
- Antiquity remains selected after moving the pointer away; label reads 3000 BCE–500.
- Artist tooltip is visible beyond the card body with overflow visible.
- At 393 × 852, page width is 393px and date panel stays within x=12–381px. Keyboard clamping also passes.
- Production build and git diff --check passed.

![Mobile date filter](after/6-mobile-date-filter.jpg)
