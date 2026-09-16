import Card from "../components/Card";
import PageHeader from "../components/PageHeader";

const FAQS = [
  {
    q: "What is Warden?",
    a: "A demo of a role-based operations platform: staff submit requests, an authorized manager or admin approves or rejects them, and every decision is recorded in an audit trail.",
  },
  {
    q: "Why can't I approve my own request?",
    a: "That's the maker/checker rule — the person who submits a request can never be the one who approves it, even if their role technically allows approvals. It's enforced by the server, not just hidden in the UI.",
  },
  {
    q: "What's the difference between the three roles?",
    a: "Staff can submit requests. Managers can also approve/reject and view the audit log. Admins can additionally manage users and roles. See the Roles & Permissions page for the full matrix.",
  },
  {
    q: "Where does the audit trail come from?",
    a: "Every request creation, approval, and rejection — plus every role or account-status change — writes a row to the audit log with who did it, when, and the before/after state.",
  },
];

export default function Help() {
  return (
    <div>
      <PageHeader title="Help" subtitle="Common questions about this demo." />
      <div className="space-y-3">
        {FAQS.map((item) => (
          <Card key={item.q} padded>
            <h2 className="text-sm font-semibold text-slate-900 mb-1.5">{item.q}</h2>
            <p className="text-sm text-slate-600 leading-relaxed">{item.a}</p>
          </Card>
        ))}
      </div>
    </div>
  );
}
