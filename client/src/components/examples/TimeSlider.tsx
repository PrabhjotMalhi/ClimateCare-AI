import TimeSlider from '../TimeSlider';

export default function TimeSliderExample() {
  return (
    <div className="p-4">
      <TimeSlider onDateChange={(date) => console.log('Selected date:', date)} />
    </div>
  );
}
