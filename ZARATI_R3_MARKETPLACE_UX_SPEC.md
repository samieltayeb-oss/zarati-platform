# ZARATI R3 MARKETPLACE UX SPEC

## Arabic-First & Mobile-First
*   Zarati | زرعتي is natively RTL. All forms, grids, and progress bars must render RTL naturally.
*   Designed for low-bandwidth mobile use.

## Contact Privacy & Acceptance
*   When price is NULL, UI displays: "تواصل لمعرفة السعر" (Contact for price).
*   During `pending` status, no contact details are shown.
*   On RFQ Acceptance, mutual contact details are securely fetched and displayed with the disclaimer: "قبول هذا الطلب يسمح للطرفين برؤية تفاصيل الاتصال لمواصلة التفاوض خارج المنصة. هذا ليس بيعاً ملزماً."

## Farmer UX: Listing Creation (Progressive)
Progressive disclosure minimizes fields per step.
1.  **What & Where:** Crop selection, State/Market.
2.  **How Much & When:** Quantity, Unit, Available Dates.
3.  **Price & Details:** Asking Price (optional NULL), Quality notes.
4.  **Photos:** Mobile camera upload.
5.  **Review:** Publish.

## Trader UX: Discovery
*   **Search/Filter Bar:** Stick to top. Filters for Crop, State, Quantity, Date.
*   **RFQ Modal:** 1-click "Express Interest" with optional quantity/price fields.
