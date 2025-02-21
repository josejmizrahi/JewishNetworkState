import * as React from "react"
import { useState } from "react"
import { StepCard } from "../../components/verification/step-card"
import { VERIFICATION_STEPS } from "../../types/verification"

export default function Verification() {
  const [currentStep, setCurrentStep] = useState(0)

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
          <StepCard
            key={step.id}
            step={step}
            isActive={currentStep === index}
            onActivate={() => setCurrentStep(index)}
          />
        ))}
      </div>
    </div>
  )
}
