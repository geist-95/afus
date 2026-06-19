1. Store Logo & Cover Photo Upload
The Problem: The Seller Settings page only provided text input fields for the logo and cover photo, forcing users to paste an image URL instead of actually uploading an image from their device.
The Fix: I modified SettingsPage.tsx to replace the standard text inputs with <input type="file">. I then added logic (URL.createObjectURL) to instantly preview the selected file and store the image data so it acts like a proper upload button.
2. Missing "More" Button for Dashboard Products
The Problem: The Seller Dashboard previews a maximum of 3 products. If a seller had 5 products, there was no way to navigate to see the rest of them directly from that list.
The Fix: I added a "More" (localized as "Plus" / "المزيد") button in DashboardPage.tsx that appears specifically when a seller has more than 3 products. It links directly to the full /dashboard/products manager page.
3. Fake Transactions Displayed
The Problem: The "Payout History" table on the Earnings & Credits page was hardcoded with dummy transaction data from "April/May 2026", making it look like payouts were occurring that you didn't initiate.
The Fix: I cleared the hardcoded dummy array in EarningsCreditsPage.tsx. The table will now correctly display actual payout data from your active database sessions (or show as empty if no payouts have occurred).
4. Incorrect Store Location on Storefront
The Problem: When viewing a shop's public storefront page, the location was hardcoded to fall back to the generic category/city name rather than the specific city configured by the merchant.
The Fix: I updated ShopClientWrapper.tsx to directly pull and display the shop.merchant_city value from the database instead of the fallback city object.
5. Products Disappearing When Switching to Arabic
The Problem: Products were rendering fine in English or French, but when the Arabic language was selected, the product grid would randomly empty out and say no products were found.
The Fix: I found a React state bug in ProductGrid.tsx. When the language changed, the component was failing to update its internal product list if the browser's local draft storage was empty. I rewrote the useEffect hook to ensure the product grid reliably re-renders the fetched data regardless of whether local drafts exist.
6. "Weddings" Category Products Not Showing in Incognito (Major Database Bug)
The Problem: You noticed that products created in the "Weddings" category showed up when logged in but disappeared completely in Incognito mode. This was actually a major database schema bug affecting 11 out of 17 categories. The database requires a strictly formatted UUID for the category_id. Only 6 legacy categories had UUIDs mapped. Because "Weddings" wasn't mapped, the backend rejected it and silently fell back to saving the product only in your browser's local storage (which doesn't exist in Incognito mode).
The Fix: I updated the legacyCategoryMapping in the core supabase.ts file to assign valid UUIDs for all 17 categories (including Weddings, Craft Supplies, Electronics, etc.). I then centralized this mapping logic across the app (ProductGrid, CategoryPage, ListingClientWrapper, new/page.tsx). Now, whenever anyone creates a product in any category, it gets properly mapped to a UUID and successfully saved to the actual database so everyone can see it.