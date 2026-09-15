import Card from "../components/Card";
import PageHeader from "../components/PageHeader";

export default function Help() {
  return (
    <div>
      <PageHeader title="Help" subtitle="Support and documentation." />
      <Card padded className="text-center text-sm text-slate-500 !py-10">
        No help articles yet.
      </Card>
    </div>
  );
}
