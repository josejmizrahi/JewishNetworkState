
import { Card, Label } from '../../../components/ui';
import { Switch } from '../../../components/ui';

export function PrivacySettings() {
  return (
    <Card className="p-6">
      <h3 className="text-lg font-semibold mb-4">Privacy Settings</h3>
      <div className="grid gap-4">
        <div className="flex items-center justify-between">
          <Label htmlFor="publicProfile">Public Profile</Label>
          <Switch id="publicProfile" />
        </div>
        <div className="flex items-center justify-between">
          <Label htmlFor="shareEndorsements">Share Endorsements</Label>
          <Switch id="shareEndorsements" />
        </div>
        <div className="flex items-center justify-between">
          <Label htmlFor="shareVerificationLevel">Share Verification Level</Label>
          <Switch id="shareVerificationLevel" />
        </div>
      </div>
    </Card>
  );
}
