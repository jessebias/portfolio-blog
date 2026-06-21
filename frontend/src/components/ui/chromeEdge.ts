import type { CSSProperties } from 'react';

// Metallic chrome bevel — a gradient ring masked to the element's 1.25px edge.
// Not uniform: a symmetric vertical gradient keeps the top and bottom edges lit
// (bright chrome at 0% and 100%) while the vertical side rails fade out through
// their middle — so the horizontal edges read as brushed chrome and the sides
// dissolve into the dark. `strength` dims the whole effect.
//
// Drop the returned style on an absolutely-positioned, `pointer-events-none`
// element whose border-radius matches its rounded container, e.g.:
//   <div aria-hidden className="absolute inset-0 rounded-3xl pointer-events-none z-30"
//        style={chromeEdge(0.45)} />
export const chromeEdge = (strength: number): CSSProperties => ({
    padding: 1.25,
    background:
        'linear-gradient(180deg, var(--chrome1) 0%, var(--chrome2) 6%, rgba(160,160,160,0.35) 24%, transparent 45%, transparent 55%, rgba(150,150,150,0.3) 76%, var(--chrome2) 94%, var(--chrome1) 100%)',
    WebkitMask: 'linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0)',
    WebkitMaskComposite: 'xor',
    maskComposite: 'exclude',
    opacity: strength,
});
