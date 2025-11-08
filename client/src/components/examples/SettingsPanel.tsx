import { useState } from 'react';
import SettingsPanel from '../SettingsPanel';
import { Button } from '@/components/ui/button';

export default function SettingsPanelExample() {
  const [open, setOpen] = useState(false);
  const [colorblindMode, setColorblindMode] = useState(false);
  const [notifications, setNotifications] = useState(true);

  return (
    <div className="p-4">
      <Button onClick={() => setOpen(true)} data-testid="button-open-settings">
        Open Settings
      </Button>
      <SettingsPanel
        open={open}
        onOpenChange={setOpen}
        colorblindMode={colorblindMode}
        onColorblindModeChange={(value) => {
          setColorblindMode(value);
          console.log('Colorblind mode:', value);
        }}
        notifications={notifications}
        onNotificationsChange={(value) => {
          setNotifications(value);
          console.log('Notifications:', value);
        }}
      />
    </div>
  );
}
