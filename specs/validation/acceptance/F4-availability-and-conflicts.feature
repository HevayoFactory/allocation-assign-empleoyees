Feature: F4 Availability & conflicts

  @story-F4.1
  Rule: A resource manager sees each employee's total load over the coming weeks

    Scenario: Seeing the timeline
      Given "Asha Perera" is allocated at "70" percent across the next four weeks
      When Maya the resource manager opens availability
      Then "Asha Perera" shows "70%" in each of the four weeks

  @story-F4.2
  Rule: A resource manager finds employees with at least a given free load

    Scenario: Finding free employees
      Given "Asha Perera" has "30" percent free and "Dan Wijesinghe" has none
      When Maya looks for employees with at least "30" percent free
      Then "Asha Perera" is listed and "Dan Wijesinghe" is not

  @story-F4.3
  Rule: An allocation that takes an employee above 100 percent is allowed but flagged

    Scenario: Over-allocating
      Given "Asha Perera" is allocated at "70" percent
      When Maya allocates "Asha Perera" to "Retail analytics platform" at "50" percent
      Then the allocation is saved and a warning says "Asha Perera" is above 100 percent

  @story-F4.4
  Rule: A resource manager sees every currently over-allocated employee

    Scenario: Over-allocated list
      Given "Dan Wijesinghe" is allocated at "110" percent
      When Maya opens the over-allocated list
      Then "Dan Wijesinghe" is listed

    @negative
    Scenario: Others cannot see the conflicts list
      Given Asha the employee is signed in
      When Asha looks for the over-allocated list
      Then no other employee's load is shown to her

  @story-F4.5
  Rule: A resource manager sees employees with no allocation

    Scenario: Bench list
      Given "Lena Fischer" has no allocations
      When Maya opens the bench list
      Then "Lena Fischer" is listed
