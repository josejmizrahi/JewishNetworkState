import { ScrollArea } from '../../components/ui';
import { PersonalInfoSection } from './components/personal-info';
import { PrivacySettings } from './components/privacy-settings';
import { HeritageInfo } from './components/heritage-info';

export default function ProfilePage() {
  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h2 className="text-2xl font-semibold tracking-tight">Profile</h2>
          <p className="text-sm text-muted-foreground">
            Manage your personal information and privacy settings
          </p>
        </div>
      </div>
      
      <ScrollArea className="h-[calc(100vh-16rem)] rounded-lg border p-6">
        <div className="grid gap-6">
          <PersonalInfoSection />
          <HeritageInfo />
          <PrivacySettings />
        </div>
      </ScrollArea>
    </div>
  );
}
