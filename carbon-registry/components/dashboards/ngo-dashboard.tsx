"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useAuth } from "@/contexts/auth-context"
import { Upload, Camera, MapPin, Clock, CheckCircle, XCircle, AlertCircle } from "lucide-react"
import { DashboardLayout } from "@/components/layout/dashboard-layout"

interface Submission {
  id: string
  title: string
  status: "pending" | "approved" | "rejected"
  uploadDate: string
  location: string
  credits?: number
}

export function NGODashboard() {
  const { user } = useAuth()
  const [submissions] = useState<Submission[]>([
    {
      id: "1",
      title: "Forest Restoration Project - Phase 1",
      status: "approved",
      uploadDate: "2024-01-15",
      location: "Ganges Basin, Brazil",
      credits: 150,
    },
    {
      id: "2",
      title: "Solar Panel Installation",
      status: "pending",
      uploadDate: "2024-01-20",
      location: "Rural Sikkim",
    },
    {
      id: "3",
      title: "Mangrove Restoration",
      status: "rejected",
      uploadDate: "2024-01-18",
      location: "Coastal India",
    },
  ])

  const handleUpload = () => {
    // Simulate AI verification step
    alert("AI verification initiated. Please wait while we analyze your submission...")
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "approved":
        return <CheckCircle className="h-4 w-4 text-green-600" />
      case "rejected":
        return <XCircle className="h-4 w-4 text-red-600" />
      default:
        return <AlertCircle className="h-4 w-4 text-yellow-600" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "approved":
        return "bg-green-100 text-green-800"
      case "rejected":
        return "bg-red-100 text-red-800"
      default:
        return "bg-yellow-100 text-yellow-800"
    }
  }

  const approvedCredits = submissions
    .filter((s) => s.status === "approved")
    .reduce((sum, s) => sum + (s.credits || 0), 0)

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground">NGO Dashboard</h1>
          <p className="text-muted-foreground">Welcome back, {user?.name}</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Credits Earned</CardTitle>
              <CheckCircle className="h-4 w-4 text-accent" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{approvedCredits}</div>
              <p className="text-xs text-muted-foreground">Carbon credits issued</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending Verifications</CardTitle>
              <AlertCircle className="h-4 w-4 text-yellow-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{submissions.filter((s) => s.status === "pending").length}</div>
              <p className="text-xs text-muted-foreground">Awaiting review</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Submissions</CardTitle>
              <Upload className="h-4 w-4 text-accent" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{submissions.length}</div>
              <p className="text-xs text-muted-foreground">Projects submitted</p>
            </CardContent>
          </Card>
        </div>

        {/* Upload Section */}
        <Card>
          <CardHeader>
            <CardTitle>Upload New Project</CardTitle>
            <CardDescription>Submit photos and videos of your carbon offset project for verification</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button onClick={handleUpload} className="flex items-center space-x-2">
                <Camera className="h-4 w-4" />
                <span>Upload Media</span>
              </Button>
              <div className="text-sm text-muted-foreground flex items-center space-x-2">
                <MapPin className="h-4 w-4" />
                <span>GPS location and timestamp will be automatically captured</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Submissions List */}
        <Card>
          <CardHeader>
            <CardTitle>Your Submissions</CardTitle>
            <CardDescription>Track the status of your project submissions</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {submissions.map((submission) => (
                <div key={submission.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="space-y-1">
                    <div className="flex items-center space-x-2">
                      <h3 className="font-medium">{submission.title}</h3>
                      {getStatusIcon(submission.status)}
                    </div>
                    <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                      <div className="flex items-center space-x-1">
                        <MapPin className="h-3 w-3" />
                        <span>{submission.location}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Clock className="h-3 w-3" />
                        <span>{submission.uploadDate}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    {submission.credits && (
                      <span className="text-sm font-medium text-accent">{submission.credits} credits</span>
                    )}
                    <Badge className={getStatusColor(submission.status)}>{submission.status}</Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}
