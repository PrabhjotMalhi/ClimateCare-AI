import { useState } from 'react';
import RiskScoreModal from '../RiskScoreModal';
import { Button } from '@/components/ui/button';

export default function RiskScoreModalExample() {
  const [open, setOpen] = useState(false);

  return (
    <div className="p-4">
      <Button onClick={() => setOpen(true)} data-testid="button-open-modal">
        Explain Risk Score
      </Button>
      <RiskScoreModal open={open} onOpenChange={setOpen} />
    </div>
  );
}
