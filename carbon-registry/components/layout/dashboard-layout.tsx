"use client"

import type React from "react"

import { Button } from "@/components/ui/button"
import { useAuth } from "@/contexts/auth-context"
import { ThemeToggle } from "@/components/theme-toggle"
import { Leaf, LogOut, Bell, Home, Upload, CheckSquare, Award, Settings, Brain } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"

interface DashboardLayoutProps {
  children: React.ReactNode
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const { user, logout } = useAuth()
  const [notifications] = useState([
    { id: 1, message: "New submission from Green Earth NGO", type: "info", time: "2 min ago" },
    { id: 2, message: "Project verification completed", type: "success", time: "1 hour ago" },
    { id: 3, message: "Credits issued for Forest Restoration", type: "success", time: "3 hours ago" },
  ])
  const [showNotifications, setShowNotifications] = useState(false)

  const getNavigationItems = () => {
    switch (user?.role) {
      case "NGO":
        return [
          { icon: Home, label: "Dashboard", active: true },
          { icon: Upload, label: "Upload Project", active: false },
          { icon: CheckSquare, label: "My Submissions", active: false },
        ]
      case "LOCAL_AUTHORITY":
        return [
          { icon: Home, label: "Dashboard", active: true },
          { icon: CheckSquare, label: "Review Submissions", active: false },
          { icon: Award, label: "Verified Projects", active: false },
        ]
      case "NCCR":
        return [
          { icon: Home, label: "Dashboard", active: true },
          { icon: Award, label: "Issue Credits", active: false },
          { icon: Settings, label: "System Settings", active: false },
        ]
      default:
        return []
    }
  }

  const navigationItems = getNavigationItems()

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card sticky top-0 z-50">
        <div className="flex h-16 items-center justify-between px-6">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Leaf className="h-6 w-6 text-accent" />
              <span className="text-xl font-bold text-foreground">Carbon Registry</span>
            </div>
            <Badge variant="outline" className="text-xs">
              {user?.role.replace("_", " ")}
            </Badge>
          </div>

          <div className="flex items-center space-x-4">
            {/* Multimodal RAG button */}
            <Button
              variant="ghost"
              size="sm"
              className="flex items-center space-x-2"
              onClick={() => {
                window.open("http://localhost:8501", "_blank")
              }}
            >
              <Brain className="h-4 w-4" />
              <span className="hidden sm:inline">RAG</span>
            </Button>

            <ThemeToggle className="h-8 w-8" />

            {/* Notifications */}
            <div className="relative">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowNotifications(!showNotifications)}
                className="relative"
              >
                <Bell className="h-4 w-4" />
                {notifications.length > 0 && (
                  <span className="absolute -top-1 -right-1 h-3 w-3 bg-red-500 rounded-full text-xs"></span>
                )}
              </Button>

              {showNotifications && (
                <div className="absolute right-0 mt-2 w-80 bg-card border rounded-lg shadow-lg z-50">
                  <div className="p-4 border-b">
                    <h3 className="font-semibold text-card-foreground">Notifications</h3>
                  </div>
                  <div className="max-h-64 overflow-y-auto">
                    {notifications.map((notification) => (
                      <div key={notification.id} className="p-3 border-b last:border-b-0 hover:bg-muted/50">
                        <p className="text-sm text-card-foreground">{notification.message}</p>
                        <p className="text-xs text-muted-foreground mt-1">{notification.time}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <span className="text-sm text-muted-foreground">{user?.name}</span>
            <Button variant="outline" size="sm" onClick={logout}>
              <LogOut className="h-4 w-4 mr-2" />
              Sign Out
            </Button>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar Navigation */}
        <aside className="w-64 bg-sidebar border-r min-h-[calc(100vh-4rem)] p-4">
          <nav className="space-y-2">
            {navigationItems.map((item, index) => {
              const Icon = item.icon
              return (
                <Button
                  key={index}
                  variant={item.active ? "default" : "ghost"}
                  className="w-full justify-start"
                  size="sm"
                >
                  <Icon className="h-4 w-4 mr-2" />
                  {item.label}
                </Button>
              )
            })}
          </nav>

          {/* Quick Stats in Sidebar */}
          <div className="mt-8">
            <h3 className="text-sm font-semibold text-sidebar-foreground mb-3">Quick Stats</h3>
            <Card>
              <CardContent className="p-3">
                <div className="space-y-2 text-sm text-card-foreground">
                  {user?.role === "NGO" && (
                    <>
                      <div className="flex justify-between">
                        <span>Credits Earned:</span>
                        <span className="font-semibold">150</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Pending:</span>
                        <span className="font-semibold">1</span>
                      </div>
                    </>
                  )}
                  {user?.role === "LOCAL_AUTHORITY" && (
                    <>
                      <div className="flex justify-between">
                        <span>Pending Reviews:</span>
                        <span className="font-semibold">2</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Verified:</span>
                        <span className="font-semibold">1</span>
                      </div>
                    </>
                  )}
                  {user?.role === "NCCR" && (
                    <>
                      <div className="flex justify-between">
                        <span>Total Credits:</span>
                        <span className="font-semibold">355</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Active NGOs:</span>
                        <span className="font-semibold">3</span>
                      </div>
                    </>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-6">{children}</main>
      </div>

      {/* Click outside to close notifications */}
      {showNotifications && <div className="fixed inset-0 z-40" onClick={() => setShowNotifications(false)}></div>}
    </div>
  )
}
