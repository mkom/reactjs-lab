import { useAuthStore } from '@/store/authStore'
import { PageHeader } from '@/components/PageHeader'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useState } from 'react'
import { User, Mail, Calendar, Save } from 'lucide-react'
import { toast } from 'sonner'

export const ProfilePage = () => {
  const user = useAuthStore((state) => state.user)
  const [isEditing, setIsEditing] = useState(false)
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
  })

  const handleSave = () => {
    toast.success('Profile updated successfully!')
    setIsEditing(false)
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Profile"
        description="Manage your account settings and preferences"
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-base font-semibold">Personal Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <div className="relative">
                  <User className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    disabled={!isEditing}
                    className="pl-9"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    disabled={!isEditing}
                    className="pl-9"
                  />
                </div>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="role">Role</Label>
              <div className="relative">
                <Calendar className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                <Input
                  id="role"
                  value={user?.role || 'user'}
                  disabled
                  className="pl-9 bg-slate-50"
                />
              </div>
            </div>
            <div className="flex gap-3 pt-4">
              {isEditing ? (
                <>
                  <Button onClick={handleSave}>
                    <Save className="h-4 w-4 mr-2" />
                    Save Changes
                  </Button>
                  <Button variant="outline" onClick={() => setIsEditing(false)}>
                    Cancel
                  </Button>
                </>
              ) : (
                <Button onClick={() => setIsEditing(true)}>
                  Edit Profile
                </Button>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base font-semibold">Profile Picture</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col items-center">
            <div className="h-24 w-24 bg-slate-100 rounded-full flex items-center justify-center mb-4">
              <User className="h-12 w-12 text-slate-400" />
            </div>
            <Button variant="outline" size="sm">
              Change Avatar
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}