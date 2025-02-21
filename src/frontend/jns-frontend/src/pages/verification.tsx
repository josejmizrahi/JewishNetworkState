import * as React from "react"
import { Button, Card, CardContent, CardHeader, CardTitle, Input, Label } from "../components/ui"
import { FileCheck, Upload } from "lucide-react"

export default function Verification() {
  const [currentStep, setCurrentStep] = React.useState(1)
  const totalSteps = 3

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
        <Card>
          <CardHeader>
            <CardTitle>Step {currentStep}: Basic Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstName">First Name</Label>
                <Input id="firstName" placeholder="Enter your first name" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName">Last Name</Label>
                <Input id="lastName" placeholder="Enter your last name" />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="hebrewName">Hebrew Name</Label>
              <Input id="hebrewName" placeholder="Enter your Hebrew name" />
            </div>
            <Button className="w-full" onClick={() => setCurrentStep(Math.min(currentStep + 1, totalSteps))}>
              Continue
            </Button>
          </CardContent>
        </Card>

        {currentStep >= 2 && (
          <Card>
            <CardHeader>
              <CardTitle>Step 2: Document Upload</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="border-2 border-dashed rounded-lg p-6 text-center">
                <Upload className="mx-auto text-gray-400 mb-2" />
                <p className="text-sm text-muted-foreground">
                  Upload proof of Jewish heritage or conversion documents
                </p>
                <Button variant="outline" className="mt-4">Upload Documents</Button>
              </div>
            </CardContent>
          </Card>
        )}

        {currentStep >= 3 && (
          <Card>
            <CardHeader>
              <CardTitle>Step 3: Rabbi Reference</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="rabbiName">Rabbi's Name</Label>
                <Input id="rabbiName" placeholder="Enter your rabbi's name" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="synagogue">Synagogue/Community</Label>
                <Input id="synagogue" placeholder="Enter synagogue or community name" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="rabbiEmail">Rabbi's Email</Label>
                <Input id="rabbiEmail" type="email" placeholder="Enter rabbi's email" />
              </div>
              <Button className="w-full">Submit for Verification</Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
