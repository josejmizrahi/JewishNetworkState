
import { Card, Input, Label } from '../../../components/ui';

export function PersonalInfoSection() {
  return (
    <Card className="p-6">
      <h3 className="text-lg font-semibold mb-4">Personal Information</h3>
      <div className="grid gap-4">
        <div className="grid gap-2">
          <Label htmlFor="firstName">First Name</Label>
          <Input id="firstName" placeholder="First Name" />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="lastName">Last Name</Label>
          <Input id="lastName" placeholder="Last Name" />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="dateOfBirth">Date of Birth</Label>
          <Input id="dateOfBirth" type="date" />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="email">Email</Label>
          <Input id="email" type="email" placeholder="Email" />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="phone">Phone</Label>
          <Input id="phone" type="tel" placeholder="Phone" />
        </div>
        <div className="space-y-4 pt-4 border-t">
          <h4 className="font-medium">Address</h4>
          <div className="grid gap-2">
            <Label htmlFor="street">Street</Label>
            <Input id="street" placeholder="Street address" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="city">City</Label>
              <Input id="city" placeholder="City" />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="state">State</Label>
              <Input id="state" placeholder="State" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="country">Country</Label>
              <Input id="country" placeholder="Country" />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="postalCode">Postal Code</Label>
              <Input id="postalCode" placeholder="Postal code" />
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}
