import { PageHeader } from '@/components/PageHeader'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useState } from 'react'
import { 
  Moon, 
  Sun, 
  Monitor, 
  Globe, 
  Bell, 
  Shield,
  Eye
} from 'lucide-react'

export const SettingsPage = () => {
  const [settings, setSettings] = useState({
    darkMode: false,
    language: 'en',
    emailNotifications: true,
    pushNotifications: false,
    twoFactor: false,
    publicProfile: true,
  })

  const toggleSetting = (key: keyof typeof settings) => {
    setSettings(prev => ({ ...prev, [key]: !prev[key] }))
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Settings"
        description="Manage your application preferences and configurations"
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-base font-semibold flex items-center gap-2">
              <Monitor className="h-5 w-5 text-slate-500" />
              Appearance
            </CardTitle>
            <CardDescription>Customize how the application looks</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-slate-100 rounded-lg">
                  {settings.darkMode ? (
                    <Moon className="h-4 w-4 text-slate-600" />
                  ) : (
                    <Sun className="h-4 w-4 text-slate-600" />
                  )}
                </div>
                <div>
                  <Label htmlFor="dark-mode" className="font-medium">Dark Mode</Label>
                  <p className="text-sm text-slate-500">Toggle dark/light theme</p>
                </div>
              </div>
              <Switch
                id="dark-mode"
                checked={settings.darkMode}
                onCheckedChange={() => toggleSetting('darkMode')}
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base font-semibold flex items-center gap-2">
              <Globe className="h-5 w-5 text-slate-500" />
              Language & Region
            </CardTitle>
            <CardDescription>Select your preferred language</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Language</Label>
              <Select 
                value={settings.language} 
                onValueChange={(value) => setSettings(prev => ({ ...prev, language: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select language" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="en">English</SelectItem>
                  <SelectItem value="id">Bahasa Indonesia</SelectItem>
                  <SelectItem value="es">Español</SelectItem>
                  <SelectItem value="fr">Français</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-xs text-slate-500">
                Note: Full i18n implementation required.
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base font-semibold flex items-center gap-2">
              <Bell className="h-5 w-5 text-slate-500" />
              Notifications
            </CardTitle>
            <CardDescription>Configure your notification preferences</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="email-notif" className="font-medium">Email Notifications</Label>
                <p className="text-sm text-slate-500">Receive updates via email</p>
              </div>
              <Switch
                id="email-notif"
                checked={settings.emailNotifications}
                onCheckedChange={() => toggleSetting('emailNotifications')}
              />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="push-notif" className="font-medium">Push Notifications</Label>
                <p className="text-sm text-slate-500">Receive browser notifications</p>
              </div>
              <Switch
                id="push-notif"
                checked={settings.pushNotifications}
                onCheckedChange={() => toggleSetting('pushNotifications')}
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base font-semibold flex items-center gap-2">
              <Shield className="h-5 w-5 text-slate-500" />
              Privacy & Security
            </CardTitle>
            <CardDescription>Manage your security settings</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="2fa" className="font-medium">Two-Factor Authentication</Label>
                <p className="text-sm text-slate-500">Add extra security to your account</p>
              </div>
              <Switch
                id="2fa"
                checked={settings.twoFactor}
                onCheckedChange={() => toggleSetting('twoFactor')}
              />
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-slate-100 rounded-lg">
                  <Eye className="h-4 w-4 text-slate-600" />
                </div>
                <div>
                  <Label htmlFor="public-profile" className="font-medium">Public Profile</Label>
                  <p className="text-sm text-slate-500">Make your profile visible to others</p>
                </div>
              </div>
              <Switch
                id="public-profile"
                checked={settings.publicProfile}
                onCheckedChange={() => toggleSetting('publicProfile')}
              />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}