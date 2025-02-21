import { useState, useEffect } from "react"
import { StepCard } from "../../components/verification/step-card"
import { DocumentUpload } from "../../components/verification/document-upload"
import { Pagination } from "../../components/ui/pagination"
import { VERIFICATION_STEPS } from "../../types/verification"

const STEPS_PER_PAGE = 3

export default function Verification() {
  const [currentPage, setCurrentPage] = useState(1);
  const [currentStep, setCurrentStep] = useState(0);

  const totalPages = Math.ceil(VERIFICATION_STEPS.length / STEPS_PER_PAGE);
  const currentSteps = VERIFICATION_STEPS.slice(
    (currentPage - 1) * STEPS_PER_PAGE,
    currentPage * STEPS_PER_PAGE
  );

  const handleUpload = async (file: File) => {
    // TODO: Implement actual file upload logic
    await new Promise(resolve => setTimeout(resolve, 2000));
  };

  useEffect(() => {
    // Reset current step when page changes
    setCurrentStep((currentPage - 1) * STEPS_PER_PAGE);
  }, [currentPage]);

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
        {currentSteps.map((step, index) => (
          <div key={step.id} className="space-y-6">
            <StepCard
              step={step}
              isActive={currentStep === index + (currentPage - 1) * STEPS_PER_PAGE}
              onActivate={() => setCurrentStep(index + (currentPage - 1) * STEPS_PER_PAGE)}
            />
            {currentStep === index + (currentPage - 1) * STEPS_PER_PAGE && step.id === 'document-upload' && (
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

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
      />
    </div>
  )
}
