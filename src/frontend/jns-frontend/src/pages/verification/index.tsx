import * as React from "react"
import { useState } from "react"
import { StepCard } from "../../components/verification/step-card"
import { DocumentUpload } from "../../components/verification/document-upload"
import { VERIFICATION_STEPS, DocumentType } from "../../types/verification"

export default function Verification() {
  const [currentStep, setCurrentStep] = useState(0)

  const handleUpload = async (file: File) => {
    // TODO: Implement actual file upload logic
    await new Promise(resolve => setTimeout(resolve, 2000));
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h2 className="text-2xl font-semibold tracking-tight">Identity Verification</h2>
          <p className="text-sm text-muted-foreground">
            Complete your verification steps to access all features
          </p>
        </div>
      </div>

      <div className="grid gap-6">
        {VERIFICATION_STEPS.map((step, index) => (
          <div key={step.id} className="space-y-6">
            <StepCard
              step={step}
              isActive={currentStep === index}
              onActivate={() => setCurrentStep(index)}
            />
            {currentStep === index && step.id === 'document-upload' && (
              <div className="grid gap-6 p-6 border rounded-lg bg-muted/50">
                <DocumentUpload
                  type="identity"
                  onUpload={handleUpload}
                />
                <DocumentUpload
                  type="heritage"
                  onUpload={handleUpload}
                />
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
