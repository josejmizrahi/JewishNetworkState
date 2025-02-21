import { Card, CardContent, CardHeader, CardTitle, Button } from "@/components/ui"
import { CheckCircle, Circle, AlertCircle, Loader2 } from "lucide-react"
import { VerificationStep } from "@/types/verification"

interface StepCardProps {
  step: VerificationStep;
  isActive: boolean;
  onActivate: () => void;
}

const StatusIcon = ({ status }: { status: VerificationStep['status'] }) => {
  switch (status) {
    case 'completed':
      return <CheckCircle className="h-5 w-5 text-primary" />;
    case 'error':
      return <AlertCircle className="h-5 w-5 text-destructive" />;
    case 'in-progress':
      return <Loader2 className="h-5 w-5 text-primary animate-spin" />;
    default:
      return <Circle className="h-5 w-5 text-muted-foreground" />;
  }
};

export function StepCard({ step, isActive, onActivate }: StepCardProps) {
  return (
    <Card className={`transition-all duration-200 ${isActive ? 'ring-2 ring-primary' : ''}`}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-lg">
            <StatusIcon status={step.status} />
            {step.title}
          </CardTitle>
        </div>
        <p className="text-sm text-muted-foreground mt-1">{step.description}</p>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {step.requirements.map((req, index) => (
            <div key={index} className="flex items-center gap-3">
              <div className={`h-1.5 w-1.5 rounded-full ${
                req.completed 
                  ? 'bg-primary' 
                  : 'bg-muted-foreground/30'
              }`} />
              <span className="text-sm text-muted-foreground">{req.description}</span>
            </div>
          ))}
          <Button
            className="w-full mt-6"
            variant={isActive ? "default" : "outline"}
            onClick={onActivate}
            disabled={step.status === 'completed'}
          >
            {step.status === 'completed' 
              ? 'Completed'
              : isActive 
                ? 'Continue' 
                : 'Start'
            }
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
