Feature: F2 Engagements & staffing needs

  @story-F2.1
  Rule: An administrator creates and edits engagements

    Scenario: Creating an engagement
      Given Nimal the administrator is on the new engagement form
      When Nimal saves "Claims portal phase 2" for "Fabrikam Insurance" from "2026-04-01" to "2026-10-31" managed by "Ravi Silva"
      Then "Claims portal phase 2" appears in the engagement list as Active

    @negative
    Scenario: An engagement needs a name
      Given Nimal the administrator is on the new engagement form
      When Nimal saves an engagement with no name
      Then no engagement is added to the list

  @story-F2.2
  Rule: An engagement manager sees only the engagements they manage

    Scenario: Seeing my engagements
      Given "Ravi Silva" manages "Core banking upgrade" and "Omar Haddad" manages "Claims portal"
      When Ravi the engagement manager opens the engagement list
      Then the list shows "Core banking upgrade" and not "Claims portal"

  @story-F2.3
  Rule: An engagement manager adds staffing needs to an engagement they manage

    Scenario: Adding a need
      Given Ravi is viewing "Core banking upgrade"
      When Ravi adds a need for "Backend developer" with "Ballerina" from "2026-02-01" to "2026-08-31" at "60" percent
      Then the engagement lists an open need for "Backend developer" at "60" percent

    @negative
    Scenario: A load above 100 is rejected
      Given Ravi is viewing "Core banking upgrade"
      When Ravi adds a need for "Analyst" at "150" percent
      Then the engagement has the same number of needs as before

  @story-F2.4
  Rule: An engagement manager edits or removes needs on their own engagements

    Scenario: Removing a need
      Given "Core banking upgrade" has an open need for "Backend developer"
      When Ravi removes that need
      Then "Backend developer" is no longer listed

  @story-F2.5
  Rule: A resource manager sees all engagements with their open needs

    Scenario: Seeing open needs
      Given "Retail analytics platform" has an open need for "Data analyst"
      When Maya the resource manager opens the open staffing needs
      Then the list includes "Data analyst" for "Retail analytics platform"

  @story-F2.6
  Rule: Only an administrator closes an engagement, and a closed engagement takes no new allocations

    Scenario: Closing an engagement
      Given "Core banking upgrade" is Active
      When Nimal closes "Core banking upgrade"
      Then its status is Closed

    @negative
    Scenario: Allocating to a closed engagement
      Given "Claims portal" is Closed
      When Maya the resource manager starts a new allocation
      Then "Claims portal" is not offered as an engagement
