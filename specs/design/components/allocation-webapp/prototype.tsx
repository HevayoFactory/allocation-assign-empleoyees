import { useState, type ReactNode } from "react";
import {
  Alert, AppShell, Breadcrumbs, Button, Detail, Dialog, EmptyState, Field, Filters, Form, Heading, Screen, Section,
  Stat, StatGroup, Table, Tabs, Timeline, defineApp, useCollection, useDisplayState, useParams, useNav, useRole, useValue,
} from "@wso2/prototype-kit";

interface Employee { id: string; name: string; email: string; jobTitle: string; department: string }
interface Skill { id: string; name: string; category: string }
interface Level { id: string; name: string; rank: string }
interface EmployeeSkill { id: string; employeeId: string; employee: string; skill: string; level: string }
interface Engagement { id: string; name: string; client: string; startDate: string; endDate: string; status: string; managers: string }
interface Need { id: string; engagementId: string; engagement: string; role: string; skills: string; startDate: string; endDate: string; load: string; status: string }
interface Allocation { id: string; employeeId: string; employee: string; engagementId: string; engagement: string; startDate: string; endDate: string; load: string; phase: string }
interface HistoryEntry { id: string; allocationId: string; when: string; who: string; text: string }
interface Capacity { id: string; employee: string; w1: number; w2: number; w3: number; w4: number }
interface Sync { lastRun: string; status: string; count: string }

const employees: Employee[] = [
  { id: "e1", name: "Asha Perera", email: "asha.perera@acme.example", jobTitle: "Software Engineer", department: "Engineering" },
  { id: "e2", name: "Ravi Silva", email: "ravi.silva@acme.example", jobTitle: "Engagement Lead", department: "Delivery" },
  { id: "e3", name: "Maya Fernando", email: "maya.fernando@acme.example", jobTitle: "Resource Manager", department: "PMO" },
  { id: "e4", name: "Dan Wijesinghe", email: "dan.wijesinghe@acme.example", jobTitle: "Data Analyst", department: "Analytics" },
  { id: "e5", name: "Priya Nair", email: "priya.nair@acme.example", jobTitle: "QA Engineer", department: "Engineering" },
  { id: "e6", name: "Omar Haddad", email: "omar.haddad@acme.example", jobTitle: "Solution Architect", department: "Delivery" },
  { id: "e7", name: "Lena Fischer", email: "lena.fischer@acme.example", jobTitle: "Business Analyst", department: "Delivery" },
];
const skills: Skill[] = [
  { id: "s1", name: "TypeScript", category: "Engineering" },
  { id: "s2", name: "Ballerina", category: "Engineering" },
  { id: "s3", name: "Data analysis", category: "Analytics" },
  { id: "s4", name: "Test automation", category: "Quality" },
  { id: "s5", name: "Solution design", category: "Architecture" },
];
const levels: Level[] = [
  { id: "l1", name: "Beginner", rank: "1" },
  { id: "l2", name: "Intermediate", rank: "2" },
  { id: "l3", name: "Advanced", rank: "3" },
  { id: "l4", name: "Expert", rank: "4" },
];
const employeeSkills: EmployeeSkill[] = [
  { id: "es1", employeeId: "e1", employee: "Asha Perera", skill: "TypeScript", level: "Advanced" },
  { id: "es2", employeeId: "e1", employee: "Asha Perera", skill: "Ballerina", level: "Intermediate" },
  { id: "es3", employeeId: "e4", employee: "Dan Wijesinghe", skill: "Data analysis", level: "Expert" },
  { id: "es4", employeeId: "e5", employee: "Priya Nair", skill: "Test automation", level: "Advanced" },
  { id: "es5", employeeId: "e6", employee: "Omar Haddad", skill: "Solution design", level: "Expert" },
  { id: "es6", employeeId: "e6", employee: "Omar Haddad", skill: "Ballerina", level: "Advanced" },
  { id: "es7", employeeId: "e7", employee: "Lena Fischer", skill: "Data analysis", level: "Intermediate" },
];
const engagements: Engagement[] = [
  { id: "g1", name: "Core banking upgrade", client: "Northwind Bank", startDate: "2026-02-01", endDate: "2026-08-31", status: "Active", managers: "Ravi Silva" },
  { id: "g2", name: "Retail analytics platform", client: "Contoso Retail", startDate: "2026-03-01", endDate: "2026-09-30", status: "Active", managers: "Ravi Silva" },
  { id: "g3", name: "Claims portal", client: "Fabrikam Insurance", startDate: "2025-06-01", endDate: "2025-12-31", status: "Closed", managers: "Omar Haddad" },
];
const needs: Need[] = [
  { id: "n1", engagementId: "g1", engagement: "Core banking upgrade", role: "Backend developer", skills: "Ballerina", startDate: "2026-02-01", endDate: "2026-08-31", load: "60", status: "Open" },
  { id: "n2", engagementId: "g2", engagement: "Retail analytics platform", role: "Data analyst", skills: "Data analysis", startDate: "2026-03-01", endDate: "2026-09-30", load: "80", status: "Open" },
  { id: "n3", engagementId: "g1", engagement: "Core banking upgrade", role: "QA engineer", skills: "Test automation", startDate: "2026-03-01", endDate: "2026-08-31", load: "50", status: "Filled" },
];
const allocations: Allocation[] = [
  { id: "a1", employeeId: "e1", employee: "Asha Perera", engagementId: "g1", engagement: "Core banking upgrade", startDate: "2026-01-05", endDate: "2026-04-30", load: "70", phase: "Current" },
  { id: "a2", employeeId: "e5", employee: "Priya Nair", engagementId: "g1", engagement: "Core banking upgrade", startDate: "2026-03-01", endDate: "2026-08-31", load: "50", phase: "Upcoming" },
  { id: "a3", employeeId: "e4", employee: "Dan Wijesinghe", engagementId: "g2", engagement: "Retail analytics platform", startDate: "2026-02-01", endDate: "2026-09-30", load: "110", phase: "Current" },
  { id: "a4", employeeId: "e1", employee: "Asha Perera", engagementId: "g3", engagement: "Claims portal", startDate: "2025-06-01", endDate: "2025-12-31", load: "40", phase: "Past" },
];
const history: HistoryEntry[] = [
  { id: "h1", allocationId: "a1", when: "2026-01-12", who: "Maya Fernando", text: "Load changed from 60% to 70%" },
  { id: "h2", allocationId: "a1", when: "2026-01-05", who: "Maya Fernando", text: "Allocated at 60%" },
  { id: "h3", allocationId: "a2", when: "2026-02-10", who: "Maya Fernando", text: "Allocated at 50%" },
  { id: "h4", allocationId: "a3", when: "2026-01-20", who: "Maya Fernando", text: "Allocated at 110%" },
];
const capacity: Capacity[] = [
  { id: "e1", employee: "Asha Perera", w1: 70, w2: 70, w3: 70, w4: 70 },
  { id: "e2", employee: "Ravi Silva", w1: 40, w2: 40, w3: 40, w4: 40 },
  { id: "e4", employee: "Dan Wijesinghe", w1: 110, w2: 110, w3: 110, w4: 110 },
  { id: "e5", employee: "Priya Nair", w1: 0, w2: 50, w3: 50, w4: 50 },
  { id: "e6", employee: "Omar Haddad", w1: 60, w2: 60, w3: 60, w4: 60 },
  { id: "e7", employee: "Lena Fischer", w1: 0, w2: 0, w3: 0, w4: 0 },
];
const sync: Sync = { lastRun: "2026-01-15 06:00", status: "Succeeded", count: "7" };

const users: Record<string, { name: string; email: string }> = {
  "Resource Manager": { name: "Maya Fernando", email: "maya.fernando@acme.example" },
  "Engagement Manager": { name: "Ravi Silva", email: "ravi.silva@acme.example" },
  "Employee": { name: "Asha Perera", email: "asha.perera@acme.example" },
  "Administrator": { name: "Nimal Jayasuriya", email: "nimal.j@acme.example" },
};
const pct = (n: number) => `${n}%`;
const peak = (c: Capacity) => Math.max(c.w1, c.w2, c.w3, c.w4);

function Shell({ children }: { children: ReactNode }) {
  const role = useRole();
  return (
    <AppShell
      id="shell"
      user={users[role] ?? users["Employee"]!}
      nav={[
        { id: "nav.allocations", label: "Allocations", to: "screen.allocations" },
        { id: "nav.needs", label: "Open staffing needs", to: "screen.staffing-needs" },
        { id: "nav.availability", label: "Availability", to: "screen.availability" },
        { id: "nav.engagements", label: "Engagements", to: "screen.engagements" },
        { id: "nav.employees", label: "Employees", to: "screen.employees" },
        { id: "nav.skills", label: "Skills and levels", to: "screen.skills" },
        { id: "nav.hr-sync", label: "HR synchronisation", to: "screen.hr-sync" },
        { id: "nav.my-assignments", label: "My assignments", to: "screen.my-assignments" },
        { id: "nav.my-profile", label: "My profile", to: "screen.my-profile" },
      ]}
      account="screen.account"
      settings="screen.settings"
      signOut="screen.signed-out"
    >
      {children}
    </AppShell>
  );
}

function Employees() {
  const state = useDisplayState();
  const emps = useCollection<Employee>("employees");
  const es = useCollection<EmployeeSkill>("employeeSkills");
  const sk = useCollection<Skill>("skills");
  const lv = useCollection<Level>("levels");
  const [q, setQ] = useState("");
  const [skill, setSkill] = useState("Any skill");
  const [level, setLevel] = useState("Any level");
  const rankOf = (name: string) => lv.items.findIndex((l) => l.name === name) + 1;
  const minRank = level === "Any level" ? 0 : rankOf(level);
  const shown = state === "state.empty" ? [] : emps.items.filter((e) => {
    if (!`${e.name} ${e.jobTitle} ${e.department}`.toLowerCase().includes(q.toLowerCase())) return false;
    if (skill === "Any skill") return true;
    return es.items.some((x) => x.employeeId === e.id && x.skill === skill && rankOf(x.level) >= minRank);
  });
  return (
    <Shell>
      <Heading id="heading.employees" text="Employees" />
      {state === "state.failed" && (
        <Alert id="alert.hr-stale" tone="warning" title="Employee data may be out of date" text="The last HR synchronisation failed. Showing the last known directory." />
      )}
      <Section id="section.employees" title="Directory" count={shown.length} subtitle="Imported from the HR system. Only skills are maintained here.">
        <Filters id="filters.employees">
          <Field id="field.search" label="Search" type="text" value={q} onChange={setQ} placeholder="Name, role or department" />
          <Field id="field.skill" label="Skill" type="select" options={["Any skill", ...sk.items.map((s) => s.name)]} value={skill} onChange={setSkill} />
          <Field id="field.level" label="Minimum level" type="select" options={["Any level", ...lv.items.map((l) => l.name)]} value={level} onChange={setLevel} />
        </Filters>
        <Table
          id="table.employees"
          columns={["Name", "Job title", "Department", "Skills"]}
          rows={shown.map((e) => ({
            id: `employee.${e.id}`,
            cells: [e.name, e.jobTitle, e.department, es.items.filter((x) => x.employeeId === e.id).map((x) => `${x.skill} (${x.level})`).join(", ") || "None yet"],
            to: "screen.employee-detail",
            params: { employee: e.id },
          }))}
          empty={<EmptyState id="empty.employees" title="No employees match" text="Change the search or the skill filter." />}
        />
      </Section>
    </Shell>
  );
}

function EmployeeDetail() {
  const state = useDisplayState();
  const role = useRole();
  const { employee: id } = useParams();
  const emps = useCollection<Employee>("employees");
  const es = useCollection<EmployeeSkill>("employeeSkills");
  const sk = useCollection<Skill>("skills");
  const lv = useCollection<Level>("levels");
  const emp = (id ? emps.get(id) : undefined) ?? emps.items[0]!;
  const mine = es.items.filter((x) => x.employeeId === emp.id);
  const admin = role === "Administrator";
  return (
    <Shell>
      <Breadcrumbs id="crumbs.employee" items={[{ id: "crumb.employees", label: "Employees", to: "screen.employees" }, { id: "crumb.current", label: emp.name }]} />
      <Heading id="heading.employee" text={emp.name} />
      <Detail id="detail.employee" fields={[
        { label: "Email", value: emp.email }, { label: "Job title", value: emp.jobTitle }, { label: "Department", value: emp.department },
      ]} />
      <Section id="section.skills" title="Skills" count={mine.length} subtitle="Skills and proficiency maintained in this app.">
        <Table
          id="table.skills"
          columns={["Skill", "Level"]}
          rows={mine.map((x) => ({
            id: `skill.${x.id}`,
            cells: [x.skill, x.level],
            actions: admin ? [{ id: `skill.${x.id}.remove`, label: "Remove", emphasis: "danger" as const, onPress: () => es.remove(x.id) }] : [],
          }))}
          empty={<EmptyState id="empty.skills" title="No skills yet" text="An administrator assigns skills to this employee." />}
        />
      </Section>
      {admin && (
        <Section id="section.assign" title="Assign a skill">
          <Form
            id="form.assign-skill"
            onSubmit={(v) => es.create({ employeeId: emp.id, employee: emp.name, skill: v.skill ?? "", level: v.level ?? "" })}
            actions={<Button id="btn.assign-skill" label="Assign skill" emphasis="primary" submit />}
          >
            <Field id="field.assign-skill" name="skill" label="Skill" type="select" required options={sk.items.map((s) => s.name)} defaultValue={sk.items[0]?.name}
              error={state === "state.validation-error" ? "Choose a skill" : undefined} />
            <Field id="field.assign-level" name="level" label="Proficiency level" type="select" required options={lv.items.map((l) => l.name)} defaultValue={lv.items[0]?.name} />
          </Form>
        </Section>
      )}
    </Shell>
  );
}

function MyProfile() {
  const emps = useCollection<Employee>("employees");
  const es = useCollection<EmployeeSkill>("employeeSkills");
  const me = emps.get("e1") ?? emps.items[0]!;
  const mine = es.items.filter((x) => x.employeeId === me.id);
  return (
    <Shell>
      <Heading id="heading.my-profile" text="My profile" />
      <Detail id="detail.my-profile" fields={[
        { label: "Name", value: me.name }, { label: "Email", value: me.email }, { label: "Job title", value: me.jobTitle }, { label: "Department", value: me.department },
      ]} />
      <Section id="section.my-skills" title="My skills" count={mine.length}>
        <Table
          id="table.my-skills"
          columns={["Skill", "Level"]}
          rows={mine.map((x) => ({ id: `myskill.${x.id}`, cells: [x.skill, x.level] }))}
          empty={<EmptyState id="empty.my-skills" title="No skills recorded" text="An administrator records your skills." />}
        />
      </Section>
    </Shell>
  );
}

function Skills() {
  const state = useDisplayState();
  const sk = useCollection<Skill>("skills");
  const lv = useCollection<Level>("levels");
  return (
    <Shell>
      <Heading id="heading.skills" text="Skills and levels" />
      <Section id="section.skill-list" title="Skills" count={sk.items.length} subtitle="The skills employees can hold and needs can require.">
        <Table
          id="table.skill-list"
          columns={["Skill", "Category"]}
          rows={sk.items.map((s) => ({
            id: `skilldef.${s.id}`,
            cells: [s.name, s.category],
            actions: [{ id: `skilldef.${s.id}.remove`, label: "Remove", emphasis: "danger" as const, onPress: () => sk.remove(s.id) }],
          }))}
          empty={<EmptyState id="empty.skill-list" title="No skills" text="Add the first skill below." />}
        />
        <Form
          id="form.add-skill"
          title="Add a skill"
          onSubmit={(v) => sk.create({ name: v.name ?? "", category: v.category ?? "" })}
          actions={<Button id="btn.add-skill" label="Add skill" emphasis="primary" submit />}
        >
          <Field id="field.skill-name" name="name" label="Name" type="text" required error={state === "state.validation-error" ? "Enter a skill name" : undefined} />
          <Field id="field.skill-category" name="category" label="Category" type="text" />
        </Form>
      </Section>
      <Section id="section.levels" title="Proficiency levels" count={lv.items.length} subtitle="Ordered from lowest to highest.">
        <Table
          id="table.levels"
          columns={["Level", { label: "Rank", kind: "number" }]}
          rows={lv.items.map((l) => ({
            id: `level.${l.id}`,
            cells: [l.name, l.rank],
            actions: [{ id: `level.${l.id}.remove`, label: "Remove", emphasis: "danger" as const, onPress: () => lv.remove(l.id) }],
          }))}
        />
        <Form
          id="form.add-level"
          title="Add a level"
          onSubmit={(v) => lv.create({ name: v.name ?? "", rank: String(lv.items.length + 1) })}
          actions={<Button id="btn.add-level" label="Add level" emphasis="primary" submit />}
        >
          <Field id="field.level-name" name="name" label="Name" type="text" required />
        </Form>
      </Section>
    </Shell>
  );
}

function HrSync() {
  const state = useDisplayState();
  const [info, setInfo] = useValue<Sync>("sync");
  return (
    <Shell>
      <Heading id="heading.hr-sync" text="HR synchronisation" />
      {state === "state.failed" && (
        <Alert id="alert.sync-failed" tone="error" title="Synchronisation failed" text="The HR system did not answer. The last known directory is still in use; try again shortly." />
      )}
      {state === "state.delayed" && (
        <Alert id="alert.sync-running" tone="info" title="Refresh in progress" text="Employee data is being refreshed and will appear in a few minutes." />
      )}
      <StatGroup>
        <Stat id="stat.last-run" label="Last synchronised" value={info.lastRun} hint="from the HR system" icon="Clock" />
        <Stat id="stat.count" label="Employees" value={info.count} hint="in the directory" icon="Users" tone="success" />
        <Stat id="stat.status" label="Last result" value={state === "state.failed" ? "Failed" : info.status} icon="Activity" tone={state === "state.failed" ? "error" : "success"} />
      </StatGroup>
      <Section id="section.refresh" title="Refresh" subtitle="Employees are read-only here; they change only in the HR system.">
        <Button id="btn.refresh" label="Refresh from HR" emphasis="primary" onPress={() => setInfo({ lastRun: "2026-01-15 09:30", status: "Succeeded", count: info.count })} />
      </Section>
    </Shell>
  );
}

function Engagements() {
  const state = useDisplayState();
  const role = useRole();
  const all = useCollection<Engagement>("engagements");
  const needs = useCollection<Need>("needs");
  const visible = role === "Engagement Manager" ? all.items.filter((e) => e.managers.includes("Ravi Silva")) : all.items;
  const shown = state === "state.empty" ? [] : visible;
  const open = needs.items.filter((n) => n.status === "Open" && visible.some((e) => e.id === n.engagementId)).length;
  return (
    <Shell>
      <Heading id="heading.engagements" text="Engagements" />
      <StatGroup>
        <Stat id="stat.engagements" label="Engagements" value={String(visible.length)} hint={role === "Engagement Manager" ? "that you manage" : "in total"} icon="Briefcase" />
        <Stat id="stat.open-needs" label="Open needs" value={String(open)} hint="still to staff" icon="ClipboardList" tone="warning" />
      </StatGroup>
      <Section
        id="section.engagements"
        title="Engagements"
        count={shown.length}
        subtitle="Open one to see its staffing needs and who is allocated."
        actions={role === "Administrator" ? <Button id="btn.new-engagement" label="New engagement" emphasis="primary" to="screen.engagement-edit" /> : undefined}
      >
        <Table
          id="table.engagements"
          columns={["Engagement", "Client", "Dates", { label: "Status", kind: "status" }]}
          rows={shown.map((e) => ({
            id: `engagement.${e.id}`,
            cells: [e.name, e.client, `${e.startDate} to ${e.endDate}`],
            status: { text: e.status, tone: e.status === "Active" ? "success" : "default" },
            to: "screen.engagement-detail",
            params: { engagement: e.id },
          }))}
          empty={<EmptyState id="empty.engagements" title="No engagements" text="Engagements appear here once an administrator creates them." />}
        />
      </Section>
    </Shell>
  );
}

function EngagementDetail() {
  const state = useDisplayState();
  const role = useRole();
  const { engagement: id } = useParams();
  const engs = useCollection<Engagement>("engagements");
  const needs = useCollection<Need>("needs");
  const allocs = useCollection<Allocation>("allocations");
  const sk = useCollection<Skill>("skills");
  const [editing, setEditing] = useState<string | null>(null);
  const eng = (id ? engs.get(id) : undefined) ?? engs.items[0]!;
  const myNeeds = needs.items.filter((n) => n.engagementId === eng.id);
  const myAllocs = allocs.items.filter((a) => a.engagementId === eng.id);
  const manager = role === "Engagement Manager";
  const current = editing && editing !== "new" ? needs.get(editing) : undefined;
  return (
    <Shell>
      <Breadcrumbs id="crumbs.engagement" items={[{ id: "crumb.engagements", label: "Engagements", to: "screen.engagements" }, { id: "crumb.current", label: eng.name }]} />
      <Heading
        id="heading.engagement"
        text={eng.name}
        actions={
          role === "Administrator" ? (
            <>
              <Button id="btn.edit-engagement" label="Edit" to="screen.engagement-edit" params={{ engagement: eng.id }} />
              <Button id="btn.close-engagement" label="Close engagement" emphasis="danger" disabled={eng.status === "Closed"} onPress={() => engs.update(eng.id, { status: "Closed" })} />
            </>
          ) : role === "Resource Manager" ? (
            <Button id="btn.fill-needs" label="Fill open needs" emphasis="primary" to="screen.staffing-needs" />
          ) : undefined
        }
      />
      <Detail id="detail.engagement" fields={[
        { label: "Client", value: eng.client }, { label: "Dates", value: `${eng.startDate} to ${eng.endDate}` },
        { label: "Status", value: eng.status }, { label: "Engagement managers", value: eng.managers },
      ]} />
      <Section
        id="section.needs"
        title="Staffing needs"
        count={myNeeds.length}
        subtitle="What this engagement needs staffed."
        actions={manager && eng.status === "Active" ? <Button id="btn.add-need" label="Add staffing need" emphasis="primary" onPress={() => setEditing("new")} /> : undefined}
      >
        <Table
          id="table.needs"
          columns={["Role", "Skills", "Dates", { label: "Load", kind: "number" }, { label: "Status", kind: "status" }]}
          rows={(state === "state.empty" ? [] : myNeeds).map((n) => ({
            id: `need.${n.id}`,
            cells: [n.role, n.skills, `${n.startDate} to ${n.endDate}`, pct(Number(n.load))],
            status: { text: n.status, tone: n.status === "Open" ? "warning" : "success" },
            actions: manager ? [
              { id: `need.${n.id}.edit`, label: "Edit", onPress: () => setEditing(n.id) },
              { id: `need.${n.id}.remove`, label: "Remove", emphasis: "danger" as const, onPress: () => needs.remove(n.id) },
            ] : [],
          }))}
          empty={<EmptyState id="empty.needs" title="No staffing needs" text="Add the roles this engagement needs." />}
        />
      </Section>
      <Section id="section.allocated" title="Allocated employees" count={myAllocs.length}>
        <Table
          id="table.allocated"
          columns={["Employee", "Dates", { label: "Load", kind: "number" }, { label: "Phase", kind: "status" }]}
          rows={myAllocs.map((a) => ({
            id: `alloc.${a.id}`,
            cells: [a.employee, `${a.startDate} to ${a.endDate}`, pct(Number(a.load))],
            status: { text: a.phase, tone: a.phase === "Current" ? "success" : a.phase === "Upcoming" ? "info" : "default" },
          }))}
          empty={<EmptyState id="empty.allocated" title="Nobody allocated yet" text="The resource manager allocates employees to this engagement." />}
        />
      </Section>
      <Dialog id="dialog.need" title={current ? "Edit staffing need" : "Add staffing need"} open={editing !== null} onClose={() => setEditing(null)}>
        {editing !== null && (
          <Form
            id="form.need"
            onSubmit={(v) => {
              const record = { engagementId: eng.id, engagement: eng.name, role: v.role ?? "", skills: v.skills ?? "", startDate: v.start ?? "", endDate: v.end ?? "", load: v.load ?? "0", status: "Open" };
              if (current) needs.update(current.id, record); else needs.create(record);
              setEditing(null);
            }}
            actions={<Button id="btn.save-need" label="Save need" emphasis="primary" submit />}
          >
            <Field id="field.need-role" name="role" label="Role" type="text" required defaultValue={current?.role} />
            <Field id="field.need-skills" name="skills" label="Required skill" type="select" options={sk.items.map((s) => s.name)} defaultValue={current?.skills ?? sk.items[0]?.name} />
            <Field id="field.need-start" name="start" label="Start date" type="date" required defaultValue={current?.startDate ?? eng.startDate} />
            <Field id="field.need-end" name="end" label="End date" type="date" required defaultValue={current?.endDate ?? eng.endDate} />
            <Field id="field.need-load" name="load" label="Load (% of working time)" type="number" required pattern="^(100|[1-9][0-9]?)$" patternMessage="Enter a whole number from 1 to 100"
              defaultValue={current?.load ?? "50"} error={state === "state.validation-error" ? "Enter a load between 1 and 100" : undefined} />
          </Form>
        )}
      </Dialog>
    </Shell>
  );
}

function EngagementEdit() {
  const state = useDisplayState();
  const navigate = useNav();
  const { engagement: id } = useParams();
  const engs = useCollection<Engagement>("engagements");
  const emps = useCollection<Employee>("employees");
  const existing = id ? engs.get(id) : undefined;
  return (
    <Shell>
      <Breadcrumbs id="crumbs.edit" items={[{ id: "crumb.engagements", label: "Engagements", to: "screen.engagements" }, { id: "crumb.current", label: existing ? existing.name : "New engagement" }]} />
      <Heading id="heading.edit" text={existing ? "Edit engagement" : "New engagement"} />
      <Section id="section.edit" title="Engagement details">
        <Form
          id="form.engagement"
          onSubmit={(v) => {
            const record = { name: v.name ?? "", client: v.client ?? "", startDate: v.start ?? "", endDate: v.end ?? "", managers: v.managers ?? "" };
            if (existing) engs.update(existing.id, record); else engs.create({ ...record, status: "Active" });
            navigate.go("screen.engagements");
          }}
          actions={<Button id="btn.save-engagement" label="Save engagement" emphasis="primary" submit />}
        >
          <Field id="field.eng-name" name="name" label="Name" type="text" required defaultValue={existing?.name} error={state === "state.validation-error" ? "Enter an engagement name" : undefined} />
          <Field id="field.eng-client" name="client" label="Client" type="text" required defaultValue={existing?.client} />
          <Field id="field.eng-start" name="start" label="Start date" type="date" required defaultValue={existing?.startDate ?? "2026-02-01"} />
          <Field id="field.eng-end" name="end" label="End date" type="date" required defaultValue={existing?.endDate ?? "2026-12-31"} />
          <Field id="field.eng-managers" name="managers" label="Engagement manager" type="select" options={emps.items.map((e) => e.name)} defaultValue={existing?.managers ?? emps.items[1]?.name} />
        </Form>
      </Section>
    </Shell>
  );
}

function StaffingNeeds() {
  const state = useDisplayState();
  const needs = useCollection<Need>("needs");
  const open = state === "state.empty" ? [] : needs.items.filter((n) => n.status === "Open");
  return (
    <Shell>
      <Heading id="heading.needs" text="Open staffing needs" />
      <Section id="section.open-needs" title="Needs to fill" count={open.length} subtitle="Across every active engagement. Open one to see ranked candidates.">
        <Table
          id="table.open-needs"
          columns={["Engagement", "Role", "Skills", "Dates", { label: "Load", kind: "number" }]}
          rows={open.map((n) => ({
            id: `openneed.${n.id}`,
            cells: [n.engagement, n.role, n.skills, `${n.startDate} to ${n.endDate}`, pct(Number(n.load))],
            to: "screen.fill-need",
            params: { need: n.id },
          }))}
          empty={<EmptyState id="empty.open-needs" title="Everything is staffed" text="No open staffing needs right now." />}
        />
      </Section>
    </Shell>
  );
}

function FillNeed() {
  const { need: id } = useParams();
  const navigate = useNav();
  const needs = useCollection<Need>("needs");
  const emps = useCollection<Employee>("employees");
  const es = useCollection<EmployeeSkill>("employeeSkills");
  const cap = useCollection<Capacity>("capacity");
  const allocs = useCollection<Allocation>("allocations");
  const hist = useCollection<HistoryEntry>("history");
  const need = (id ? needs.get(id) : undefined) ?? needs.items.find((n) => n.status === "Open") ?? needs.items[0]!;
  const wanted = need.skills.split(", ").filter(Boolean);
  const ranked = emps.items
    .map((e) => {
      const has = es.items.filter((x) => x.employeeId === e.id).map((x) => x.skill);
      const matches = wanted.filter((w) => has.includes(w));
      const c = cap.get(e.id);
      const free = c ? 100 - peak(c) : 100;
      return { e, matches, free };
    })
    .filter((r) => r.matches.length > 0)
    .sort((a, b) => b.matches.length - a.matches.length || b.free - a.free);
  const allocate = (e: Employee) => {
    const aid = allocs.create({ employeeId: e.id, employee: e.name, engagementId: need.engagementId, engagement: need.engagement, startDate: need.startDate, endDate: need.endDate, load: need.load, phase: "Upcoming" });
    hist.create({ allocationId: aid, when: "2026-01-15", who: "Maya Fernando", text: `Allocated at ${need.load}% against ${need.role}` });
    needs.update(need.id, { status: "Filled" });
    navigate.go("screen.allocations");
  };
  return (
    <Shell>
      <Breadcrumbs id="crumbs.fill" items={[{ id: "crumb.needs", label: "Open staffing needs", to: "screen.staffing-needs" }, { id: "crumb.current", label: need.role }]} />
      <Heading id="heading.fill" text={`Fill: ${need.role}`} />
      <Detail id="detail.need" fields={[
        { label: "Engagement", value: need.engagement }, { label: "Required skill", value: need.skills },
        { label: "Dates", value: `${need.startDate} to ${need.endDate}` }, { label: "Load", value: pct(Number(need.load)) },
      ]} />
      <Section id="section.candidates" title="Candidates, best match first" count={ranked.length} subtitle="Ranked by matching skills, then free capacity. Over-allocation is allowed but flagged.">
        <Table
          id="table.candidates"
          columns={["Employee", "Matching skills", { label: "Free capacity", kind: "number" }, { label: "Fit", kind: "status" }]}
          rows={ranked.map((r) => ({
            id: `cand.${r.e.id}`,
            cells: [r.e.name, r.matches.join(", "), pct(Math.max(r.free, 0))],
            status: Number(need.load) <= r.free ? { text: "Fits", tone: "success" as const } : { text: "Would over-allocate", tone: "warning" as const },
            actions: [{ id: `cand.${r.e.id}.allocate`, label: "Allocate", onPress: () => allocate(r.e) }],
          }))}
          empty={<EmptyState id="empty.candidates" title="No matching employees" text="Nobody has the required skill yet." />}
        />
      </Section>
    </Shell>
  );
}

function Allocations() {
  const state = useDisplayState();
  const all = useCollection<Allocation>("allocations");
  const emps = useCollection<Employee>("employees");
  const engs = useCollection<Engagement>("engagements");
  const cap = useCollection<Capacity>("capacity");
  const hist = useCollection<HistoryEntry>("history");
  const [open, setOpen] = useState(false);
  const [warning, setWarning] = useState("");
  const active = engs.items.filter((e) => e.status === "Active");
  const rows = state === "state.empty" ? [] : all.items;
  const create = (v: Record<string, string>) => {
    const emp = emps.items.find((e) => e.name === v.employee) ?? emps.items[0]!;
    const eng = active.find((e) => e.name === v.engagement) ?? active[0]!;
    const load = Number(v.load ?? "0");
    const c = cap.get(emp.id);
    const total = (c ? peak(c) : 0) + load;
    const aid = all.create({ employeeId: emp.id, employee: emp.name, engagementId: eng.id, engagement: eng.name, startDate: v.start ?? "", endDate: v.end ?? "", load: String(load), phase: "Upcoming" });
    hist.create({ allocationId: aid, when: "2026-01-15", who: "Maya Fernando", text: `Allocated at ${load}%` });
    setWarning(total > 100 ? `${emp.name} is now at ${total}% of working time — above 100%.` : "");
    setOpen(false);
  };
  return (
    <Shell>
      <Heading id="heading.allocations" text="Allocations" />
      {warning !== "" && <Alert id="alert.over-allocated" tone="warning" title="Over-allocation" text={warning} />}
      <Section
        id="section.allocations"
        title="All allocations"
        count={rows.length}
        subtitle="Open an allocation to change its dates or load and see its history."
        actions={<Button id="btn.new-allocation" label="New allocation" emphasis="primary" onPress={() => setOpen(true)} />}
      >
        <Table
          id="table.allocations"
          columns={["Employee", "Engagement", "Dates", { label: "Load", kind: "number" }, { label: "Phase", kind: "status" }]}
          rows={rows.map((a) => ({
            id: `allocation.${a.id}`,
            cells: [a.employee, a.engagement, `${a.startDate} to ${a.endDate}`, pct(Number(a.load))],
            status: { text: a.phase, tone: a.phase === "Current" ? "success" : a.phase === "Upcoming" ? "info" : "default" },
            to: "screen.allocation-detail",
            params: { allocation: a.id },
            actions: [
              { id: `allocation.${a.id}.end`, label: "End", onPress: () => all.update(a.id, { phase: "Past" }) },
              { id: `allocation.${a.id}.remove`, label: "Remove", emphasis: "danger" as const, onPress: () => all.remove(a.id) },
            ],
          }))}
          empty={<EmptyState id="empty.allocations" title="No allocations yet" text="Allocate an employee to an engagement to begin." />}
        />
      </Section>
      <Dialog id="dialog.new-allocation" title="New allocation" open={open} onClose={() => setOpen(false)}>
        <Form
          id="form.new-allocation"
          onSubmit={create}
          actions={<Button id="btn.save-allocation" label="Allocate" emphasis="primary" submit />}
        >
          <Field id="field.alloc-employee" name="employee" label="Employee" type="select" options={emps.items.map((e) => e.name)} defaultValue={emps.items[0]?.name} />
          <Field id="field.alloc-engagement" name="engagement" label="Engagement" type="select" options={active.map((e) => e.name)} defaultValue={active[0]?.name} />
          <Field id="field.alloc-start" name="start" label="Start date" type="date" required defaultValue="2026-02-01" />
          <Field id="field.alloc-end" name="end" label="End date" type="date" required defaultValue="2026-06-30" />
          <Field id="field.alloc-load" name="load" label="Load (% of working time)" type="number" required pattern="^(100|[1-9][0-9]?)$" patternMessage="Enter a whole number from 1 to 100"
            defaultValue="50" error={state === "state.validation-error" ? "Enter a load between 1 and 100" : undefined} />
        </Form>
      </Dialog>
    </Shell>
  );
}

function AllocationDetail() {
  const state = useDisplayState();
  const navigate = useNav();
  const { allocation: id } = useParams();
  const all = useCollection<Allocation>("allocations");
  const hist = useCollection<HistoryEntry>("history");
  const a = (id ? all.get(id) : undefined) ?? all.items[0]!;
  const entries = hist.items.filter((h) => h.allocationId === a.id);
  return (
    <Shell>
      <Breadcrumbs id="crumbs.allocation" items={[{ id: "crumb.allocations", label: "Allocations", to: "screen.allocations" }, { id: "crumb.current", label: `${a.employee} on ${a.engagement}` }]} />
      <Heading id="heading.allocation" text={`${a.employee} on ${a.engagement}`}
        actions={<Button id="btn.end-allocation" label="End allocation" emphasis="danger" onPress={() => { all.update(a.id, { phase: "Past" }); navigate.go("screen.allocations"); }} />} />
      <Detail id="detail.allocation" fields={[
        { label: "Dates", value: `${a.startDate} to ${a.endDate}` }, { label: "Load", value: pct(Number(a.load)) }, { label: "Phase", value: a.phase },
      ]} />
      <Section id="section.change" title="Change allocation">
        <Form
          id="form.change-allocation"
          onSubmit={(v) => {
            all.update(a.id, { startDate: v.start ?? a.startDate, endDate: v.end ?? a.endDate, load: v.load ?? a.load });
            hist.create({ allocationId: a.id, when: "2026-01-15", who: "Maya Fernando", text: `Changed to ${v.load}% from ${v.start} to ${v.end}` });
          }}
          actions={<Button id="btn.save-change" label="Save changes" emphasis="primary" submit />}
        >
          <Field id="field.change-start" name="start" label="Start date" type="date" required defaultValue={a.startDate} />
          <Field id="field.change-end" name="end" label="End date" type="date" required defaultValue={a.endDate} />
          <Field id="field.change-load" name="load" label="Load (% of working time)" type="number" required pattern="^(100|[1-9][0-9]?)$" patternMessage="Enter a whole number from 1 to 100"
            defaultValue={a.load} error={state === "state.validation-error" ? "Enter a load between 1 and 100" : undefined} />
        </Form>
      </Section>
      <Timeline id="timeline.history" title="Change history" entries={entries.map((h) => ({ when: h.when, who: h.who, text: h.text }))} />
    </Shell>
  );
}

function Availability() {
  const state = useDisplayState();
  const emps = useCollection<Employee>("employees");
  const cap = useCollection<Capacity>("capacity");
  const [minFree, setMinFree] = useState("30");
  const rows = state === "state.empty" ? [] : cap.items;
  const nameOf = (c: Capacity) => emps.get(c.id)?.name ?? c.employee;
  const status = (c: Capacity) => (peak(c) > 100 ? { text: "Over-allocated", tone: "error" as const } : peak(c) === 0 ? { text: "On the bench", tone: "info" as const } : { text: "Allocated", tone: "success" as const });
  const over = rows.filter((c) => peak(c) > 100);
  const bench = rows.filter((c) => peak(c) === 0);
  const available = rows.filter((c) => 100 - peak(c) >= Number(minFree || "0"));
  return (
    <Shell>
      <Heading id="heading.availability" text="Availability and conflicts" />
      {over.length > 0 && <Alert id="alert.conflicts" tone="warning" title="Over-allocation" text={`${over.length} employee(s) are above 100% of their time in at least one of the next four weeks.`} />}
      <StatGroup>
        <Stat id="stat.over" label="Over-allocated" value={String(over.length)} hint="employees above 100%" icon="TriangleAlert" tone="error" />
        <Stat id="stat.bench" label="On the bench" value={String(bench.length)} hint="no allocation" icon="User" tone="warning" />
        <Stat id="stat.tracked" label="Employees tracked" value={String(rows.length)} hint="next four weeks" icon="Users" />
      </StatGroup>
      <Tabs
        id="tabs.availability"
        tabs={[
          {
            id: "tab.timeline", label: "Timeline",
            content: (
              <Table
                id="table.timeline"
                columns={["Employee", { label: "Week of 12 Jan", kind: "number" }, { label: "19 Jan", kind: "number" }, { label: "26 Jan", kind: "number" }, { label: "2 Feb", kind: "number" }, { label: "Status", kind: "status" }]}
                rows={rows.map((c) => ({ id: `tl.${c.id}`, cells: [nameOf(c), pct(c.w1), pct(c.w2), pct(c.w3), pct(c.w4)], status: status(c) }))}
                empty={<EmptyState id="empty.timeline" title="No data" text="Allocations appear here once made." />}
              />
            ),
          },
          {
            id: "tab.find", label: "Find available",
            content: (
              <>
                <Filters id="filters.available">
                  <Field id="field.avail-from" label="From" type="date" defaultValue="2026-01-19" />
                  <Field id="field.avail-to" label="To" type="date" defaultValue="2026-02-13" />
                  <Field id="field.min-free" label="Minimum free load (%)" type="number" value={minFree} onChange={setMinFree} />
                </Filters>
                <Table
                  id="table.available"
                  columns={["Employee", { label: "Free capacity", kind: "number" }]}
                  rows={available.map((c) => ({ id: `av.${c.id}`, cells: [nameOf(c), pct(100 - peak(c))] }))}
                  empty={<EmptyState id="empty.available" title="Nobody is free enough" text="Lower the minimum free load or change the period." />}
                />
              </>
            ),
          },
          {
            id: "tab.over", label: "Over-allocated",
            content: (
              <Table
                id="table.over"
                columns={["Employee", { label: "Peak load", kind: "number" }]}
                rows={over.map((c) => ({ id: `ov.${c.id}`, cells: [nameOf(c), pct(peak(c))] }))}
                empty={<EmptyState id="empty.over" title="No conflicts" text="Nobody is above 100%." />}
              />
            ),
          },
          {
            id: "tab.bench", label: "On the bench",
            content: (
              <Table
                id="table.bench"
                columns={["Employee"]}
                rows={bench.map((c) => ({ id: `bn.${c.id}`, cells: [nameOf(c)] }))}
                empty={<EmptyState id="empty.bench" title="Nobody on the bench" text="Everyone has an allocation." />}
              />
            ),
          },
        ]}
      />
    </Shell>
  );
}

function MyAssignments() {
  const state = useDisplayState();
  const all = useCollection<Allocation>("allocations");
  const cap = useCollection<Capacity>("capacity");
  const mine = state === "state.empty" ? [] : all.items.filter((a) => a.employeeId === "e1");
  const upcoming = mine.filter((a) => a.phase !== "Past");
  const past = mine.filter((a) => a.phase === "Past");
  const c = cap.get("e1") ?? cap.items[0]!;
  const weeks: [string, number][] = [["12 Jan", c.w1], ["19 Jan", c.w2], ["26 Jan", c.w3], ["2 Feb", c.w4]];
  const row = (a: Allocation) => ({
    id: `mine.${a.id}`,
    cells: [a.engagement, `${a.startDate} to ${a.endDate}`, pct(Number(a.load))],
    status: { text: a.phase, tone: a.phase === "Current" ? ("success" as const) : a.phase === "Upcoming" ? ("info" as const) : ("default" as const) },
  });
  return (
    <Shell>
      <Heading id="heading.my-assignments" text="My assignments" />
      <StatGroup>
        <Stat id="stat.my-load" label="Current load" value={pct(c.w1)} hint="of working time this week" icon="Gauge" />
        <Stat id="stat.my-free" label="Free capacity" value={pct(Math.max(100 - c.w1, 0))} hint="this week" icon="CalendarCheck" tone="success" />
      </StatGroup>
      <Section id="section.current" title="Current and upcoming" count={upcoming.length}>
        <Table
          id="table.current"
          columns={["Engagement", "Dates", { label: "Load", kind: "number" }, { label: "Phase", kind: "status" }]}
          rows={upcoming.map(row)}
          empty={<EmptyState id="empty.current" title="No assignments" text="You have no current or upcoming assignments." />}
        />
      </Section>
      <Section id="section.past" title="Past assignments" count={past.length}>
        <Table
          id="table.past"
          columns={["Engagement", "Dates", { label: "Load", kind: "number" }, { label: "Phase", kind: "status" }]}
          rows={past.map(row)}
          empty={<EmptyState id="empty.past" title="No past assignments" text="Finished assignments appear here." />}
        />
      </Section>
      <Section id="section.capacity" title="Free capacity, coming weeks">
        <Table
          id="table.capacity"
          columns={["Week of", { label: "Load", kind: "number" }, { label: "Free", kind: "number" }]}
          rows={weeks.map(([w, n]) => ({ id: `cap.${w}`, cells: [w, pct(n), pct(Math.max(100 - n, 0))] }))}
        />
      </Section>
    </Shell>
  );
}

function Account() {
  const role = useRole();
  const u = users[role] ?? users["Employee"]!;
  return (
    <Shell>
      <Heading id="heading.account" text="Account" />
      <Detail id="detail.account" fields={[{ label: "Name", value: u.name }, { label: "Email", value: u.email }, { label: "Role", value: role }]} />
    </Shell>
  );
}

function Settings() {
  const navigate = useNav();
  return (
    <Shell>
      <Heading id="heading.settings" text="Settings" />
      <Form
        id="form.settings"
        onSubmit={() => navigate.go("screen.account")}
        actions={<Button id="btn.save-settings" label="Save settings" emphasis="primary" submit />}
      >
        <Field id="field.notify" label="Email me when my assignments change" type="switch" defaultValue="on" />
      </Form>
    </Shell>
  );
}

function SignedOut() {
  return (
    <Screen>
      <Heading id="heading.signed-out" text="You are signed out" />
      <Button id="btn.sign-in" label="Sign in" emphasis="primary" to="screen.account" />
    </Screen>
  );
}

export default defineApp({
  screens: {
    "screen.allocations": Allocations,
    "screen.allocation-detail": AllocationDetail,
    "screen.staffing-needs": StaffingNeeds,
    "screen.fill-need": FillNeed,
    "screen.availability": Availability,
    "screen.employees": Employees,
    "screen.employee-detail": EmployeeDetail,
    "screen.engagements": Engagements,
    "screen.engagement-detail": EngagementDetail,
    "screen.engagement-edit": EngagementEdit,
    "screen.skills": Skills,
    "screen.hr-sync": HrSync,
    "screen.my-profile": MyProfile,
    "screen.my-assignments": MyAssignments,
    "screen.account": Account,
    "screen.settings": Settings,
    "screen.signed-out": SignedOut,
  },
  data: { employees, skills, levels, employeeSkills, engagements, needs, allocations, history, capacity, sync },
});
