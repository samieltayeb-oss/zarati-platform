# ZARATI R3 RFQ STATE MACHINE (Inquiries)

## Concept
An RFQ is NON-BINDING. It represents signaling/interest, not a legal contract.

## Canonical Status Vocabulary
*   `pending` (Submitted, awaiting farmer decision)
*   `accepted` (Farmer willing to negotiate off-platform)
*   `rejected` (Farmer declined)
*   `withdrawn` (Trader withdrew before acceptance)
*   `expired` (No farmer response before TTL)
*   `closed` (Negotiation concluded/ended after acceptance)

## Allowed Transitions
*   **Trader:** `pending` ➡️ `withdrawn`
*   **Farmer:** `pending` ➡️ `accepted` | `rejected`
*   **System (Cron):** `pending` ➡️ `expired`
*   **Buyer or Seller:** `accepted` ➡️ `closed`

## Terminal States
`rejected`, `withdrawn`, `expired`, `closed`.

## Expiration Mechanism
A scheduled cron process transitions stagnant `pending` RFQs to `expired` after a 7-day TTL.

## Mutual Contact Privacy Rule
*   **PENDING:** NO private direct contact exchange. Neither party sees phone/email.
*   **ACCEPTED:** Mutual-interest threshold reached. Controlled contact information is revealed to BOTH parties simultaneously via a secure server-side RPC/view that verifies identity, role, and RFQ acceptance status.
*   **Acceptance UI (AR):** "قبول هذا الطلب يسمح للطرفين برؤية تفاصيل الاتصال لمواصلة التفاوض خارج المنصة. هذا ليس بيعاً ملزماً."
*   **Acceptance UI (EN):** "Accepting this inquiry allows both parties to view contact details and continue negotiation off-platform. This is not a binding sale."
