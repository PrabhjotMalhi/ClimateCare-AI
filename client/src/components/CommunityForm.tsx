import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertCommunitySubmissionSchema, type InsertCommunitySubmission } from "@shared/schema";
import { MessageSquare } from "lucide-react";

interface CommunityFormProps {
  onSubmit?: (data: InsertCommunitySubmission) => void;
}

export default function CommunityForm({ onSubmit }: CommunityFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<InsertCommunitySubmission>({
    resolver: zodResolver(insertCommunitySubmissionSchema),
    defaultValues: {
      location: "",
      message: "",
    },
  });

  const onSubmitForm = (data: InsertCommunitySubmission) => {
    console.log('Community submission:', data);
    onSubmit?.(data);
    reset();
  };

  return (
    <Card className="p-6" data-testid="card-community-form">
      <div className="flex items-center gap-2 mb-6">
        <MessageSquare className="h-5 w-5" />
        <h3 className="text-lg font-semibold">Community Portal</h3>
      </div>

      <form onSubmit={handleSubmit(onSubmitForm)} className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="location">Location</Label>
          <Input
            id="location"
            placeholder="e.g., Downtown, 123 Main St"
            {...register("location")}
            data-testid="input-location"
          />
          {errors.location && (
            <p className="text-sm text-destructive">{errors.location.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="message">Message</Label>
          <Textarea
            id="message"
            placeholder="Describe your concern or observation..."
            className="min-h-32 resize-none"
            {...register("message")}
            data-testid="input-message"
          />
          {errors.message && (
            <p className="text-sm text-destructive">{errors.message.message}</p>
          )}
        </div>

        <Button type="submit" className="w-full" data-testid="button-submit-community">
          Submit Report
        </Button>
      </form>
    </Card>
  );
}
