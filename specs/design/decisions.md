# Technical decisions

- \[architecture\] One API service owns all data; the HR system is read only through it, never from the browser. *assumed* (all)
- \[architecture\] Employees are synchronised from the HR system into the app's database on demand and on a schedule, rather than read live on every request. *assumed* (F1)
- \[data-model\] Load is stored as a whole percent of working time per allocation; availability is derived per week from allocations. *assumed* (F3, F4, F5)
- \[data-model\] An allocation's change history is an append-only event list, which also serves as the audit log. *assumed* (F3)
- \[security\] Engagement managers reach their engagements through /me/engagements, so they cannot read other engagements. *assumed* (F2, F3)
- \[security\] Employees are matched to the signed-in user by the email in the token. *assumed* (F1, F5)
- \[allocation-api\] Lists return 20 items per page by default. *assumed* (all)
- \[allocation-webapp\] The availability timeline shows the next four weeks. *assumed* (F4)