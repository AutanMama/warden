import Card from "../components/Card";
import PageHeader from "../components/PageHeader";

export default function Settings() {
  return (
    <div>
      <PageHeader title="Settings" subtitle="Account and workspace preferences." />
      <Card padded className="text-center text-sm text-slate-500 !py-10">
        Nothing configurable yet.
      </Card>
    </div>
  );
}
