import { ability, getCurrentOrg } from '@/app/auth/auth/auth'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { OrganizationForm } from '../../organization-form'
import { ShutdownOrganizationButton } from './shutdown-organization-button'
import { getOrganization } from '@/app/http/get-organization'
import { Billing } from './billing'

export default async function Settings() {
  const currentOrg = await getCurrentOrg()
  const permisions = await ability()

  const canGetBilling = permisions?.can('get', 'Billing')
  const canUpdateOrganization = permisions?.can('update', 'Organization')
  const canShutdownOrganization = permisions?.can('delete', 'Organization')

  const { organization } = await getOrganization(currentOrg!)

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Settings</h1>

      <div className="space-y-4">
        {canUpdateOrganization && (
          <Card>
            <CardHeader>
              <CardTitle>Organization Settings</CardTitle>
              <CardDescription>
                Update your organization details
              </CardDescription>
            </CardHeader>
            <CardContent>
              <OrganizationForm
                isUpdating
                initialData={{
                  name: organization.name,
                  domain: organization.domain,
                  shouldAttachUsersByDomain:
                    organization.shouldAttachUsersByDomain,
                }}
              ></OrganizationForm>
            </CardContent>
          </Card>
        )}

        {canGetBilling && <Billing />}

        {canShutdownOrganization && (
          <div>
            <Card>
              <CardHeader>
                <CardTitle>Shutdown Organization</CardTitle>
                <CardDescription>
                  This will delete your organization and all its data
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="mb-2 text-sm text-red-500">
                  This action is irreversible. Please proceed with caution.
                </p>

                <ShutdownOrganizationButton />
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  )
}
