import { getSettings } from "@/lib/settings";
import { isWithinRegistrationWindow } from "@/lib/dates";
import { RegistrationForm } from "@/components/register/RegistrationForm";
import { ClosedRegistration } from "@/components/register/ClosedRegistration";

export default async function RegisterPage() {
  const settings = await getSettings();
  const windowOpen = isWithinRegistrationWindow(settings);

  if (!windowOpen) {
    return <ClosedRegistration />;
  }

  return <RegistrationForm />;
}
