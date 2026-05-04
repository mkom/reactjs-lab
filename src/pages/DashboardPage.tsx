import { useAuthStore } from '@/store/authStore'
import { PageHeader } from '@/components/PageHeader'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

import { 
  Sparkles, 
  Rocket, 
  BookOpen, 
  Github,
  ArrowRight 
} from 'lucide-react'
import { Link } from 'react-router-dom'


export const DashboardPage = () => {
  const user = useAuthStore((state) => state.user)

  return (
    <div className="space-y-6">
      <PageHeader
        title="Welcome!"
        description={`Hello, ${user?.name || 'User'}! This is your starter template dashboard.`}
      />

      {/* Welcome Card */}
      <Card className="bg-gradient-to-br from-slate-900 to-slate-800 text-white border-0">
        <CardContent className="pt-6 pb-6">
          <div className="flex items-start gap-4">
            <div className="p-3 bg-white/10 rounded-xl">
              <Sparkles className="h-8 w-8 text-white" />
            </div>
            <div className="flex-1">
              <h2 className="text-2xl font-semibold mb-2">ReactJS Starter Template</h2>
              <p className="text-slate-300 mb-4">
                A modern React boilerplate with TypeScript, Tailwind CSS, and best practices built-in.
              </p>
              <div className="flex flex-wrap gap-3">
                <Link to="/profile">
                  <Button variant="secondary" size="sm">
                    View Profile
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                </Link>
                <Link to="/settings">
                  <Button variant="outline" size="sm" className="border-white/20 text-white hover:bg-white/10">
                    Settings
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Feature Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <Card className="hover:border-slate-300 transition-colors">
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-semibold flex items-center gap-2">
              <Rocket className="h-5 w-5 text-blue-500" />
              Quick Start
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-slate-600">
              Start building your app by creating new pages in the pages/ directory.
            </p>
          </CardContent>
        </Card>
        <Card className="hover:border-slate-300 transition-colors">
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-semibold flex items-center gap-2">
              <BookOpen className="h-5 w-5 text-emerald-500" />
              Documentation
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-slate-600">
              Read AGENTS.md for coding conventions and patterns used in this template.
            </p>
          </CardContent>
        </Card>
        <Card className="hover:border-slate-300 transition-colors">
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-semibold flex items-center gap-2">
              <Github className="h-5 w-5 text-slate-700" />
              Contribute
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-slate-600">
              This template is open source. Feel free to customize it for your needs.
            </p>
          </CardContent>
        </Card>
      </div>

    </div>
  )
}
