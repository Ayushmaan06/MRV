"use client"

import { useAuth } from "@/contexts/auth-context"
import { LoginForm } from "@/components/login-form"
import { NGODashboard } from "@/components/dashboards/ngo-dashboard"
import { LocalAuthorityDashboard } from "@/components/dashboards/local-authority-dashboard"
import { NCCRDashboard } from "@/components/dashboards/nccr-dashboard"

export default function HomePage() {
  const { user, isLoading } = useAuth()

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-accent mx-auto"></div>
          <p className="mt-2 text-muted-foreground">Loading...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return <LoginForm />
  }

  // Route to appropriate dashboard based on user role
  switch (user.role) {
    case "NGO":
      return <NGODashboard />
    case "LOCAL_AUTHORITY":
      return <LocalAuthorityDashboard />
    case "NCCR":
      return <NCCRDashboard />
    default:
      return <LoginForm />
  }
}
