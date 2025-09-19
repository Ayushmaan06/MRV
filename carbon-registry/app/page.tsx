"use client"

import { useState } from "react"
import { useAuth } from "@/contexts/auth-context"
import { LoginForm } from "@/components/login-form"
import { NGODashboard } from "@/components/dashboards/ngo-dashboard"
import { LocalAuthorityDashboard } from "@/components/dashboards/local-authority-dashboard"
import { NCCRDashboard } from "@/components/dashboards/nccr-dashboard"
import LandingPage from "./landing/page"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"

export default function HomePage() {
  const { user, isLoading } = useAuth()
  const [showLanding, setShowLanding] = useState(true)

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

  // If user is logged in, show their dashboard
  if (user) {
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

  // If no user and showing landing page
  if (showLanding) {
    return (
      <div className="relative">
        <LandingPage onSignInClick={() => setShowLanding(false)} />
      </div>
    )
  }

  // Show login form with back to landing option
  return (
    <div className="relative">
      <div className="fixed top-4 left-4 z-50">
        <Button 
          variant="ghost"
          onClick={() => setShowLanding(true)}
          className="flex items-center space-x-2"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back to Home</span>
        </Button>
      </div>
      <LoginForm />
    </div>
  )
}
