import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Play, Pause } from "lucide-react";
import { format, addDays } from "date-fns";

interface TimeSliderProps {
  onDateChange?: (date: Date) => void;
  initialDate?: Date;
}

export default function TimeSlider({ onDateChange, initialDate = new Date() }: TimeSliderProps) {
  const [dayIndex, setDayIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  const dates = Array.from({ length: 7 }, (_, i) => addDays(initialDate, i));

  const handleSliderChange = (value: number[]) => {
    const newIndex = value[0];
    setDayIndex(newIndex);
    onDateChange?.(dates[newIndex]);
  };

  const togglePlay = () => {
    setIsPlaying(!isPlaying);
    console.log(`Time slider ${!isPlaying ? 'playing' : 'paused'}`);
  };

  return (
    <Card className="p-4" data-testid="card-time-slider">
      <div className="flex items-center gap-4">
        <Button
          size="icon"
          variant="outline"
          onClick={togglePlay}
          data-testid="button-play-pause"
        >
          {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
        </Button>
        
        <div className="flex-1 space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium">
              {format(dates[dayIndex], "EEEE, MMM d")}
            </span>
            <span className="text-xs text-muted-foreground font-mono">
              Day {dayIndex + 1} of 7
            </span>
          </div>
          
          <Slider
            value={[dayIndex]}
            onValueChange={handleSliderChange}
            max={6}
            step={1}
            className="w-full"
            data-testid="slider-time"
          />
          
          <div className="flex justify-between text-xs text-muted-foreground">
            {dates.map((date, idx) => (
              <span key={idx} className={idx === dayIndex ? "font-semibold text-foreground" : ""}>
                {format(date, "EEE")}
              </span>
            ))}
          </div>
        </div>
      </div>
    </Card>
  );
}
