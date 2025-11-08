import CommunityForm from '../CommunityForm';

export default function CommunityFormExample() {
  return (
    <div className="p-4 max-w-md">
      <CommunityForm onSubmit={(data) => console.log('Form submitted:', data)} />
    </div>
  );
}
