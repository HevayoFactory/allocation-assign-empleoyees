Feature: F3 Allocation

  @story-F3.1
  Rule: A resource manager allocates an employee to an active engagement with dates and load, with no approval step

    Scenario: Allocating an employee
      Given Maya the resource manager has "Priya Nair" free at "100" percent
      When Maya allocates "Priya Nair" to "Core banking upgrade" from "2026-03-01" to "2026-08-31" at "50" percent
      Then "Priya Nair" is listed on "Core banking upgrade" at "50" percent

    @negative
    Scenario: A load of zero is rejected
      Given Maya is on the new allocation form
      When Maya allocates "Priya Nair" at "0" percent
      Then no allocation is added to the list

  @story-F3.2
  Rule: A resource manager can allocate an employee against an open staffing need

    Scenario: Filling a need
      Given "Core banking upgrade" has an open need for "Backend developer" at "60" percent
      When Maya allocates "Omar Haddad" against that need
      Then the need is shown as Filled and "Omar Haddad" is allocated at "60" percent

  @story-F3.3
  Rule: A resource manager changes the dates or load of an allocation

    Scenario: Changing the load
      Given "Asha Perera" is allocated to "Core banking upgrade" at "70" percent
      When Maya changes that allocation to "60" percent
      Then the allocation shows "60" percent

  @story-F3.4
  Rule: A resource manager ends or removes an allocation

    Scenario: Ending an allocation
      Given "Asha Perera" has a current allocation on "Core banking upgrade"
      When Maya ends that allocation
      Then the allocation is shown as Past

  @story-F3.5
  Rule: Candidates for a need are ranked by skill match, then free capacity

    Scenario: Ranking candidates
      Given a need requires "Ballerina" and "Omar Haddad" holds it at "Advanced" with free capacity
      When Maya opens that need
      Then "Omar Haddad" is listed and employees without "Ballerina" are not

  @story-F3.6
  Rule: An engagement manager sees the allocations on their own engagements only

    Scenario: Seeing who is allocated
      Given "Priya Nair" is allocated to "Core banking upgrade" managed by "Ravi Silva"
      When Ravi opens "Core banking upgrade"
      Then he sees "Priya Nair" among the allocated employees

    @negative
    Scenario: An engagement manager cannot allocate
      Given Ravi the engagement manager is viewing "Core banking upgrade"
      When Ravi looks for a way to allocate an employee
      Then the allocated employees are unchanged

  @story-F3.7
  Rule: Every change to an allocation is recorded in its history

    Scenario: Viewing history
      Given Maya changed an allocation of "Asha Perera" from "60" to "70" percent
      When Maya opens that allocation
      Then the history shows the change from "60" to "70" percent with Maya's name
