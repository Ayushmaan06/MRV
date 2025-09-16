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
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50 relative overflow-hidden">
        {/* Animated Background Orbs */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-r from-blue-100/30 to-purple-100/30 rounded-full blur-3xl animate-float" />
          <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-gradient-to-r from-green-100/30 to-blue-100/30 rounded-full blur-3xl animate-float" style={{ animationDelay: '-3s' }} />
        </div>

        <div className="relative z-10 p-6 space-y-6">
        <div className="text-center space-y-3">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-green-600 via-blue-600 to-purple-600 bg-clip-text text-transparent">
            NGO Dashboard
          </h1>
          <p className="text-lg text-gray-600">
            Welcome back, {user?.name}
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="bg-white border-gray-200 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Credits Earned</CardTitle>
              <CheckCircle className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{approvedCredits}</div>
              <p className="text-xs text-gray-500">Carbon credits issued</p>
            </CardContent>
          </Card>

          <Card className="bg-white border-gray-200 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending Verifications</CardTitle>
              <AlertCircle className="h-4 w-4 text-yellow-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{submissions.filter((s) => s.status === "pending").length}</div>
              <p className="text-xs text-gray-500">Awaiting review</p>
            </CardContent>
          </Card>

          <Card className="bg-white border-gray-200 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Submissions</CardTitle>
              <Upload className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{submissions.length}</div>
              <p className="text-xs text-gray-500">Projects submitted</p>
            </CardContent>
          </Card>
        </div>

        {/* Upload Section */}
        <Card className="bg-white border-gray-200 shadow-lg">
          <CardHeader>
            <CardTitle>Upload New Project</CardTitle>
            <CardDescription>Submit photos and videos of your carbon offset project for verification</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button onClick={handleUpload} className="flex items-center space-x-2 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
                <Camera className="h-4 w-4" />
                <span>Upload Media</span>
              </Button>
              <div className="text-sm text-gray-500 flex items-center space-x-2">
                <MapPin className="h-4 w-4" />
                <span>GPS location and timestamp will be automatically captured</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Submissions List */}
        <Card className="bg-white border-gray-200 shadow-lg">
          <CardHeader>
            <CardTitle>Your Submissions</CardTitle>
            <CardDescription>Track the status of your project submissions</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {submissions.map((submission) => (
                <div key={submission.id} className="flex items-center justify-between p-4 bg-gray-50 border border-gray-200 rounded-xl hover:bg-gray-100 transition-all duration-300 shadow-sm">
                  <div className="space-y-1">
                    <div className="flex items-center space-x-2">
                      <h3 className="font-medium">{submission.title}</h3>
                      {getStatusIcon(submission.status)}
                    </div>
                    <div className="flex items-center space-x-4 text-sm text-gray-500">
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
                      <span className="text-sm font-medium text-blue-600">{submission.credits} credits</span>
                    )}
                    <Badge className={getStatusColor(submission.status)}>{submission.status}</Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
        </div>
      </div>
    </DashboardLayout>
  )
}
