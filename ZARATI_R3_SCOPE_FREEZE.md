# ZARATI R3: SCOPE FREEZE (Marketplace Foundation)

## Objective
To build the foundational digital infrastructure necessary for farmers to signal supply and for traders to discover it. R3 is strictly a discovery and matching layer, NOT a transactional engine.

## In-Scope Capabilities (Must Build)

1.  **Listing Creation (Farmers/Cooperatives):**
    *   Ability to create a crop listing (Crop type, quantity, location, expected harvest date, quality metrics).
    *   Image upload capabilities (managed via Supabase Storage).
2.  **Discovery & Filtering (Traders):**
    *   Search listings by crop, region, volume, and date.
    *   Sort by relevance and recency.
3.  **Request for Quote (RFQ) System:**
    *   Traders can submit an RFQ expressing interest in a specific listing.
    *   Farmers can view and accept/reject RFQs (this is a signaling mechanism, not a binding contract).
4.  **Moderation Foundation:**
    *   Basic admin tools to flag or remove inappropriate listings.
5.  **Strict Row Level Security (RLS):**
    *   Enforce data privacy: Traders cannot see other traders' RFQs; farmers only see RFQs directed at them.

## Explicitly Out-of-Scope (Do Not Build)

*   **Escrow & Payments:** Zarati will not hold funds.
*   **Bankak / Payment Gateway Integration:** No technical integration with banking systems.
*   **Logistics & Delivery:** Zarati does not manage trucks or warehouses.
*   **Binding Digital Contracts:** The platform facilitates discovery; off-platform negotiation finalizes the deal.
*   **Complex Bidding/Auction Engines:** Stick to simple RFQ signaling.

## Pre-Requisites for Development
*   Approval of the `ZARATI_R3_DATABASE_SCHEMA_DESIGN` document (to be created in the next phase).
*   UI/UX finalized for the listing creation flow.
