Feature: F5 My assignments

  @story-F5.1
  Rule: An employee sees their current and upcoming assignments

    Scenario: Seeing current assignments
      Given "Asha Perera" is allocated to "Core banking upgrade" from "2026-01-05" to "2026-04-30" at "70" percent
      When Asha opens my assignments
      Then she sees "Core banking upgrade", its dates and "70%"

  @story-F5.2
  Rule: An employee sees their past assignments

    Scenario: Seeing past assignments
      Given "Asha Perera" finished "Claims portal" on "2025-12-31"
      When Asha opens my assignments
      Then "Claims portal" is listed under past assignments

  @story-F5.3
  Rule: An employee sees their own free capacity in the coming weeks

    Scenario: Free capacity
      Given "Asha Perera" is allocated at "70" percent
      When Asha opens my assignments
      Then she sees "30%" free for each of the coming weeks

  @story-F5.1
  Rule: An employee sees only their own assignments

    @negative
    Scenario: Other people's assignments are not shown
      Given "Priya Nair" is allocated to "Core banking upgrade"
      When Asha opens my assignments
      Then "Priya Nair" is not shown
