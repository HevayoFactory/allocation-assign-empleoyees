# Data model

Employees come from the HR system; skills, engagements, staffing needs and allocations are owned by this app.

```mermaid
erDiagram
    EMPLOYEE ||--o{ EMPLOYEE_SKILL : has
    SKILL ||--o{ EMPLOYEE_SKILL : "rated in"
    PROFICIENCY_LEVEL ||--o{ EMPLOYEE_SKILL : "level of"
    EMPLOYEE ||--o{ ENGAGEMENT_MANAGER : "manages as"
    ENGAGEMENT ||--o{ ENGAGEMENT_MANAGER : "managed by"
    ENGAGEMENT ||--o{ STAFFING_NEED : requires
    SKILL ||--o{ STAFFING_NEED_SKILL : "required by"
    STAFFING_NEED ||--o{ STAFFING_NEED_SKILL : needs
    EMPLOYEE ||--o{ ALLOCATION : "is assigned"
    ENGAGEMENT ||--o{ ALLOCATION : staffed
    STAFFING_NEED |o--o{ ALLOCATION : "filled by"
    ALLOCATION ||--o{ ALLOCATION_EVENT : "recorded in"
    EMPLOYEE {
        string id PK
        string hrId "id in the HR system"
        string name
        string email
        string jobTitle
        string department
    }
    SKILL {
        string id PK
        string name
        string category
    }
    PROFICIENCY_LEVEL {
        string id PK
        string name
        int rank
    }
    EMPLOYEE_SKILL {
        string employeeId FK
        string skillId FK
        string levelId FK
    }
    ENGAGEMENT {
        string id PK
        string name
        string client
        date startDate
        date endDate
        string status "Active or Closed"
    }
    ENGAGEMENT_MANAGER {
        string engagementId FK
        string employeeId FK
    }
    STAFFING_NEED {
        string id PK
        string engagementId FK
        string role
        date startDate
        date endDate
        int loadPercent
    }
    STAFFING_NEED_SKILL {
        string staffingNeedId FK
        string skillId FK
    }
    ALLOCATION {
        string id PK
        string employeeId FK
        string engagementId FK
        string staffingNeedId FK "optional"
        date startDate
        date endDate
        int loadPercent
    }
    ALLOCATION_EVENT {
        string id PK
        string allocationId FK
        datetime at
        string actor
        string text
    }
    HR_SYNC_RUN {
        string id PK
        datetime ranAt
        string status
        int employeeCount
    }
```

An employee is created and updated only by the HR synchronisation. A staffing need counts as filled when its allocations cover its dates and load. Over-allocation (total load above 100% in a period) is derived from allocations, not stored.