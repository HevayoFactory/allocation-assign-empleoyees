# Product-wide

Rules that apply to more than one feature.

## Requirements

- P1 Users sign in via SSO through the platform identity provider. \[org default\] Applies to: all.
- P2 An allocation is an employee on an engagement for a date range at a percentage of working time. Applies to: F3, F4, F5. *assumed*
- P3 Every allocation creation, change and removal is recorded in an audit log. Applies to: F3. *assumed*

## Decisions

- The app is standalone; no third-party integrations.
- An employee may be allocated beyond 100% of their time; the over-allocation is flagged, not blocked.
- Allocations need no approval; the resource manager decides alone.