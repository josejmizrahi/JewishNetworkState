import { Card, CardContent, CardHeader, CardTitle } from "../ui/card"
import { Button } from "../ui/button"
import { CheckCircle, Circle, AlertCircle, Loader2 } from "lucide-react"
import { VerificationStep } from "../../types/verification"

interface StepCardProps {
  step: VerificationStep;
  isActive: boolean;
  onActivate: () => void;
}

const StatusIcon = ({ status }: { status: VerificationStep['status'] }) => {
  switch (status) {
    case 'completed':
      return <CheckCircle className="h-5 w-5 text-green-600" />;
    case 'error':
      return <AlertCircle className="h-5 w-5 text-red-600" />;
    case 'in-progress':
      return <Loader2 className="h-5 w-5 text-blue-600 animate-spin" />;
    default:
      return <Circle className="h-5 w-5 text-gray-400" />;
  }
};

export function StepCard({ step, isActive, onActivate }: StepCardProps) {
  return (
    <Card className={`transition-all duration-200 ${isActive ? 'ring-2 ring-primary' : ''}`}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <StatusIcon status={step.status} />
            {step.title}
          </CardTitle>
        </div>
        <p className="text-sm text-muted-foreground">{step.description}</p>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {step.requirements.map((req, index) => (
            <div key={index} className="flex items-center gap-2">
              <div className={`h-2 w-2 rounded-full ${req.completed ? 'bg-green-600' : 'bg-gray-300'}`} />
              <span className="text-sm">{req.description}</span>
            </div>
          ))}
          <Button
            className="w-full mt-4"
            variant={isActive ? "default" : "outline"}
            onClick={onActivate}
          >
            {isActive ? "Continue" : "Start"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
