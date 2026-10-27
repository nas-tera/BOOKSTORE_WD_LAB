# G.L. Bajaj Online Book Store

Web Designing Workshop (BCS353), Session 2026-27
Created by @Rishu | Roll no. 250192011303 | G.L. Bajaj Institute of Technology & Management

A five-page book store built with HTML5, CSS3 and vanilla JavaScript (no frameworks).

## Run it
Open `index.html` in any browser (double-click it). No server or install is needed.
Inter loads from Google Fonts when online; offline it falls back to system fonts.

## Files
| File | Purpose |
|---|---|
| index.html / home.html | Homepage (identical content) |
| login.html | Demo login with validation |
| registration.html | Registration form with validation |
| catalogue.html | 12 books, category filter, Add to Cart |
| cart.html | Quantities, totals, remove, demo checkout |
| styles.css | Theme (CSS variables), Grid/Flexbox layout, responsive rules |
| script.js | All behaviour |
| assets/logo.jpg, assets/book-covers/*.jpg | Local images (GL Bajaj crest and 12 real book covers) |

## Layout (CSS Grid)
- Header: grid with logo on the left, title and nav centred.
- Body `.layout`: two columns, a 240px sidebar and the main area (one column on mobile).
- Footer: creator credit and roll number.

## Important functions (for viva)
- `getCart()` / `saveCart()` read and write the cart array in `localStorage` (key `glbBookCart`), so the cart survives refresh. `saveCart` also updates the header badge.
- `addToCart(id)` adds a book or increases its quantity.
- `changeQty(id, change)` handles + and - (never below 1); `removeFromCart(id)` deletes a row.
- `cartTotal(cart)` sums price x quantity for every item.
- `renderCatalogue(category)` filters `BOOKS` and rebuilds the table; the category comes from the sidebar, the filter chips or the `?cat=` URL.
- `renderCart()` redraws the cart table, total and empty-cart message.
- `validateRegistration(data)` checks name, email (regex), 10-digit mobile (regex), password length of at least 6 and password match, and returns an object of error messages.
- `validateLogin()` checks that username and password are not too short. This is a demo: there is no real authentication, and the registration form stores nothing.
- Checkout is also a demo: it empties the cart and shows a message; no payment is processed.

## Theme
Deep blue #073B4C, ocean blue #087E8B, teal #0F9D9A, green #2EAD69, seafoam #E8F7F2, aqua #F1FAFA. Font: Inter. No orange or yellow.
