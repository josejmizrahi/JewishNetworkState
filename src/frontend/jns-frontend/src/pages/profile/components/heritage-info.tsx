
import { Card, Input, Label } from '../../../components/ui';

export function HeritageInfo() {
  return (
    <Card className="p-6">
      <h3 className="text-lg font-semibold mb-4">Heritage Information</h3>
      <div className="grid gap-4">
        <div className="grid gap-2">
          <Label htmlFor="maternalLineage">Maternal Lineage</Label>
          <Input id="maternalLineage" placeholder="Maternal family history" />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="paternalLineage">Paternal Lineage</Label>
          <Input id="paternalLineage" placeholder="Paternal family history" />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="conversionDate">Conversion Date (if applicable)</Label>
          <Input id="conversionDate" type="date" />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="conversionAuthority">Conversion Authority</Label>
          <Input id="conversionAuthority" placeholder="Conversion authority" />
        </div>
      </div>
    </Card>
  );
}
