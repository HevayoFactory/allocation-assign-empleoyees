Feature: F1 Employees & skills

  @story-F1.1
  Rule: A resource manager can find employees from the HR directory by name, role or department

    Scenario: Searching by department
      Given the directory holds "Priya Nair" in "Engineering" and "Omar Haddad" in "Delivery"
      When Maya the resource manager searches for "Delivery"
      Then the list shows "Omar Haddad" and not "Priya Nair"

  @story-F1.2
  Rule: A resource manager can filter employees by skill and minimum proficiency level

    Scenario: Filtering by skill and level
      Given "Omar Haddad" holds "Ballerina" at "Advanced" and "Asha Perera" holds "Ballerina" at "Intermediate"
      When Maya filters for "Ballerina" at minimum level "Advanced"
      Then the list shows "Omar Haddad" and not "Asha Perera"

  @story-F1.3
  Rule: Only an administrator maintains the skill list and proficiency levels

    Scenario: Adding a skill
      Given Nimal the administrator sees the skill list
      When Nimal adds the skill "Kubernetes" in category "Engineering"
      Then "Kubernetes" appears in the skill list

    @negative
    Scenario: A resource manager cannot add a skill
      Given Maya the resource manager is signed in
      When Maya looks for a way to add the skill "Rust"
      Then the skill list is unchanged

  @story-F1.4
  Rule: Only an administrator assigns skills with a level to an employee

    Scenario: Assigning a skill
      Given "Lena Fischer" has no "Ballerina" skill
      When Nimal assigns "Ballerina" at "Beginner" to "Lena Fischer"
      Then "Lena Fischer" shows "Ballerina" at "Beginner"

    @negative
    Scenario: An employee cannot assign skills to herself
      Given Asha the employee is viewing her own profile
      When Asha looks for a way to add the skill "Solution design"
      Then her skills are unchanged

  @story-F1.5
  Rule: An employee sees only her own profile and skills

    Scenario: Viewing my profile
      Given "Asha Perera" holds "TypeScript" at "Advanced"
      When Asha opens her profile
      Then she sees "TypeScript" at "Advanced"

    @negative
    Scenario: Another employee's profile is not available
      Given Asha the employee is signed in
      When Asha tries to open the profile of "Dan Wijesinghe"
      Then Dan's profile is not shown to her

  @story-F1.6
  Rule: An administrator sees when employees were last synchronised from the HR system and can refresh them

    Scenario: Refreshing from HR
      Given Nimal sees the last synchronisation time
      When Nimal refreshes from the HR system
      Then the last synchronisation time is later than before

    @negative
    Scenario: A resource manager cannot refresh HR data
      Given Maya the resource manager is signed in
      When Maya looks for a way to refresh from the HR system
      Then the last synchronisation time is unchanged
