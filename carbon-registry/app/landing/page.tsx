"use client"

import React, { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ThemeToggle } from "@/components/theme-toggle"
import { 
  Leaf, 
  Shield, 
  Users, 
  ChevronDown, 
  ArrowRight, 
  CheckCircle, 
  Globe,
  TrendingUp,
  Lock,
  Zap,
  Eye,
  Star,
  LogIn
} from "lucide-react"
import { cn } from "@/lib/utils"

// Counter hook for number animations
function useCounter(end: number, duration: number = 2000) {
  const [count, setCount] = useState(0)
  const [isInView, setIsInView] = useState(false)
  
  useEffect(() => {
    if (!isInView) return
    
    let startTime: number
    const startValue = 0
    
    const animate = (currentTime: number) => {
      if (!startTime) startTime = currentTime
      const elapsed = currentTime - startTime
      const progress = Math.min(elapsed / duration, 1)
      
      // Easing function for smooth animation
      const easeOutExpo = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress)
      setCount(Math.floor(startValue + (end - startValue) * easeOutExpo))
      
      if (progress < 1) {
        requestAnimationFrame(animate)
      }
    }
    
    requestAnimationFrame(animate)
  }, [end, duration, isInView])
  
  return { count, setIsInView }
}

export default function LandingPage({ onSignInClick }: { onSignInClick?: () => void }) {
  const [scrollY, setScrollY] = useState(0)
  const [isVisible, setIsVisible] = useState(false)
  const heroRef = useRef<HTMLDivElement>(null)
  const featuresRef = useRef<HTMLDivElement>(null)
  const statsRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY)
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  useEffect(() => {
    setIsVisible(true)
  }, [])

  const scrollToSection = (ref: React.RefObject<HTMLDivElement>) => {
    ref.current?.scrollIntoView({ behavior: "smooth" })
  }

  const features = [
    {
      icon: Lock,
      title: "Blockchain Security",
      description: "Immutable records powered by cutting-edge blockchain technology",
      color: "text-blue-500"
    },
    {
      icon: Eye,
      title: "AI Verification",
      description: "Advanced AI algorithms for automated project verification",
      color: "text-green-500"
    },
    {
      icon: Globe,
      title: "Global Network",
      description: "Connect with authorities, NGOs, and regulators worldwide",
      color: "text-purple-500"
    },
    {
      icon: TrendingUp,
      title: "Real-time Analytics",
      description: "Track carbon credits and environmental impact in real-time",
      color: "text-orange-500"
    }
  ]

  const userTypes = [
    {
      icon: Shield,
      title: "NCCR",
      subtitle: "National Carbon Credit Regulators",
      description: "Oversee and validate carbon credit systems nationwide",
      features: ["System oversight", "Credit validation", "Policy management"],
      gradient: "from-blue-500 to-cyan-500"
    },
    {
      icon: Users,
      title: "Local Authorities",
      subtitle: "Regional Government Bodies", 
      description: "Review and approve local carbon offset projects",
      features: ["Project review", "Local compliance", "Community engagement"],
      gradient: "from-purple-500 to-pink-500"
    },
    {
      icon: Leaf,
      title: "NGOs",
      subtitle: "Environmental Organizations",
      description: "Submit and manage carbon offset projects",
      features: ["Project submission", "Impact tracking", "Community reporting"],
      gradient: "from-green-500 to-emerald-500"
    }
  ]

  const stats = [
    { number: 10000, suffix: "+", label: "Carbon Credits Issued", icon: Leaf },
    { number: 50, suffix: "+", label: "Verified Projects", icon: CheckCircle },
    { number: 25, suffix: "+", label: "Partner Organizations", icon: Users },
    { number: 99.9, suffix: "%", label: "System Uptime", icon: Zap }
  ]

  return (
    <div className="bg-gradient-to-b from-blue-50/60 via-purple-50/40 via-green-50/30 to-blue-50/50 dark:from-slate-800/80 dark:via-blue-900/70 dark:via-slate-700/80 dark:to-slate-800/85 overflow-x-hidden relative">
      {/* Global background orbs layer */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        {/* Large floating orbs that span across sections */}
        <div className="absolute top-20 -right-40 w-96 h-96 bg-gradient-to-br from-blue-300/20 to-purple-300/15 rounded-full blur-3xl animate-float" />
        <div className="absolute top-1/2 -left-40 w-80 h-80 bg-gradient-to-br from-green-300/25 to-emerald-300/20 rounded-full blur-3xl animate-float" style={{ animationDelay: '3s' }} />
        <div className="absolute bottom-20 right-1/4 w-88 h-88 bg-gradient-to-br from-rose-300/20 to-pink-300/15 rounded-full blur-3xl animate-float" style={{ animationDelay: '6s' }} />
        <div className="absolute top-1/3 left-1/3 w-72 h-72 bg-gradient-to-br from-cyan-300/18 to-sky-300/15 rounded-full blur-3xl animate-float" style={{ animationDelay: '1.5s' }} />
        <div className="absolute bottom-1/3 right-1/3 w-64 h-64 bg-gradient-to-br from-violet-300/22 to-indigo-300/18 rounded-full blur-3xl animate-float" style={{ animationDelay: '4.5s' }} />
      </div>
      {/* Navbar */}
      <nav className="fixed top-0 w-full z-50 bg-white/40 dark:bg-slate-800/70 backdrop-blur-lg border-b border-gray-200/30 dark:border-slate-600/50">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="relative">
                <Leaf className="h-8 w-8 text-green-500 animate-pulse" />
                <div className="absolute inset-0 h-8 w-8 rounded-full bg-green-500/20 animate-ping" />
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
                Carbon Registry
              </span>
            </div>
            
            <div className="hidden md:flex items-center space-x-8">
              <button 
                onClick={() => scrollToSection(featuresRef)}
                className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors"
              >
                Features
              </button>
              <button 
                onClick={() => scrollToSection(statsRef)}
                className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors"
              >
                About
              </button>
              <ThemeToggle />
            </div>
            
            {/* Mobile theme toggle */}
            <div className="md:hidden">
              <ThemeToggle />
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section 
        ref={heroRef}
        className="relative min-h-screen flex items-center justify-center pt-20 z-10"
      >
        {/* Local hero orbs */}
        <div className="absolute inset-0 overflow-visible pointer-events-none">
          {/* Original orbs */}
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-green-400/30 to-blue-400/30 rounded-full blur-3xl animate-float" />
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-purple-400/30 to-pink-400/30 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }} />
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-br from-yellow-400/20 to-red-400/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '4s' }} />
          
          {/* Additional medium-sized light orbs */}
          <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-gradient-to-br from-cyan-300/25 to-blue-300/20 rounded-full blur-2xl animate-float" style={{ animationDelay: '1s' }} />
          <div className="absolute top-3/4 right-1/4 w-72 h-72 bg-gradient-to-br from-rose-300/20 to-pink-300/15 rounded-full blur-2xl animate-float" style={{ animationDelay: '3s' }} />
          <div className="absolute top-1/2 right-1/3 w-56 h-56 bg-gradient-to-br from-emerald-300/25 to-teal-300/20 rounded-full blur-2xl animate-float" style={{ animationDelay: '1.5s' }} />
          <div className="absolute bottom-1/4 left-1/3 w-60 h-60 bg-gradient-to-br from-violet-300/20 to-indigo-300/15 rounded-full blur-2xl animate-float" style={{ animationDelay: '2.5s' }} />
          
          {/* Small accent orbs for more depth */}
          <div className="absolute top-20 left-1/5 w-32 h-32 bg-gradient-to-br from-lime-300/30 to-green-300/25 rounded-full blur-xl animate-float" style={{ animationDelay: '0.5s' }} />
          <div className="absolute bottom-32 right-1/5 w-40 h-40 bg-gradient-to-br from-sky-300/25 to-cyan-300/20 rounded-full blur-xl animate-float" style={{ animationDelay: '3.5s' }} />
          <div className="absolute top-1/3 right-1/6 w-36 h-36 bg-gradient-to-br from-amber-300/20 to-yellow-300/15 rounded-full blur-xl animate-float" style={{ animationDelay: '4.5s' }} />
          <div className="absolute bottom-1/3 left-1/6 w-28 h-28 bg-gradient-to-br from-fuchsia-300/25 to-purple-300/20 rounded-full blur-xl animate-float" style={{ animationDelay: '5s' }} />
          <div className="absolute top-3/5 left-2/3 w-44 h-44 bg-gradient-to-br from-teal-300/20 to-emerald-300/15 rounded-full blur-xl animate-float" style={{ animationDelay: '1.8s' }} />
          
          {/* Tiny sparkle orbs */}
          <div className="absolute top-1/6 right-2/5 w-20 h-20 bg-gradient-to-br from-white/40 to-blue-200/30 rounded-full blur-lg animate-float" style={{ animationDelay: '0.3s' }} />
          <div className="absolute bottom-1/5 left-2/5 w-24 h-24 bg-gradient-to-br from-white/35 to-green-200/25 rounded-full blur-lg animate-float" style={{ animationDelay: '2.8s' }} />
          <div className="absolute top-2/5 left-1/8 w-18 h-18 bg-gradient-to-br from-white/30 to-purple-200/20 rounded-full blur-md animate-float" style={{ animationDelay: '4.2s' }} />
          <div className="absolute bottom-2/5 right-1/8 w-22 h-22 bg-gradient-to-br from-white/40 to-pink-200/25 rounded-full blur-md animate-float" style={{ animationDelay: '3.7s' }} />
        </div>

        <div className="container mx-auto px-6 text-center relative z-10">
          <div className={cn(
            "transition-all duration-1000 transform",
            isVisible ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"
          )}>
            <h1 className="text-6xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-gray-900 via-green-600 to-blue-600 dark:from-white dark:via-green-400 dark:to-blue-400 bg-clip-text text-transparent leading-tight animate-gradient">
              The Future of
              <br />
              <span className="pulse">Carbon Credits</span>
            </h1>
            
            <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-3xl mx-auto leading-relaxed">
              Revolutionary blockchain platform connecting regulators, authorities, and NGOs 
              for transparent, verified carbon credit management worldwide.
            </p>
            
            <div className="flex flex-col gap-6 justify-center items-center mb-8">
              {/* Primary Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center w-full max-w-lg">
                <Button 
                  size="lg" 
                  className="w-full sm:w-auto bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 text-white px-8 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 animate-glow"
                >
                  Start Your Journey
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
                <Button 
                  variant="outline" 
                  size="lg"
                  className="w-full sm:w-auto border-2 border-gray-300 hover:border-gray-400 px-8 py-3 rounded-xl transition-all duration-300"
                >
                  Watch Demo
                </Button>
              </div>
              
              {/* Sign In Button */}
              <div className="w-full max-w-sm">
                <Button 
                  onClick={onSignInClick}
                  size="lg"
                  variant="outline"
                  className="w-full border-2 border-gradient-to-r from-green-500 to-blue-500 bg-gradient-to-r from-green-50 to-blue-50 hover:from-green-100 hover:to-blue-100 text-gray-800 font-semibold px-8 py-3 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 transform hover:scale-105 group"
                >
                  <LogIn className="mr-3 h-5 w-5 group-hover:scale-110 transition-transform" />
                  Sign In to Your Dashboard
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section ref={featuresRef} className="min-h-screen py-20 relative flex items-center z-10">
        {/* Local features orbs */}
        <div className="absolute inset-0 overflow-visible pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-green-400/30 to-blue-400/30 rounded-full blur-3xl animate-float" />
        <div className="absolute top-1/2 -left-32 w-72 h-72 bg-gradient-to-br from-yellow-400/20 to-red-400/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '3s' }} />
        <div className="absolute -bottom-32 right-1/4 w-64 h-64 bg-gradient-to-br from-purple-400/25 to-pink-400/25 rounded-full blur-3xl animate-float" style={{ animationDelay: '1.5s' }} />
        
        {/* Additional light orbs for features section */}
        <div className="absolute top-1/4 left-1/3 w-48 h-48 bg-gradient-to-br from-sky-300/20 to-cyan-300/15 rounded-full blur-2xl animate-float" style={{ animationDelay: '2s' }} />
        <div className="absolute bottom-1/4 right-1/3 w-56 h-56 bg-gradient-to-br from-rose-300/25 to-pink-300/20 rounded-full blur-2xl animate-float" style={{ animationDelay: '4s' }} />
        <div className="absolute top-3/4 left-1/5 w-40 h-40 bg-gradient-to-br from-lime-300/30 to-green-300/25 rounded-full blur-xl animate-float" style={{ animationDelay: '0.8s' }} />
        <div className="absolute top-1/6 right-1/5 w-32 h-32 bg-gradient-to-br from-amber-300/25 to-yellow-300/20 rounded-full blur-lg animate-float" style={{ animationDelay: '3.2s' }} />
        <div className="absolute bottom-1/3 left-1/8 w-36 h-36 bg-gradient-to-br from-indigo-300/20 to-purple-300/15 rounded-full blur-xl animate-float" style={{ animationDelay: '1.7s' }} />
        </div>
        
        <div className="container mx-auto px-6 relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
              Powered by Innovation
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Advanced technology stack ensuring security, transparency, and efficiency
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon
              return (
                <Card 
                  key={index}
                  className={cn(
                    "border-0 shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:scale-105 hover:-rotate-1 bg-gradient-to-br from-white to-gray-50 dark:from-slate-800/90 dark:to-slate-700/70 group cursor-pointer",
                    "animate-in slide-in-from-bottom duration-700",
                  )}
                  style={{ animationDelay: `${index * 150}ms` }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'scale(1.05) rotate(-1deg)'
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'scale(1) rotate(0deg)'
                  }}
                >
                  <CardContent className="p-6 text-center relative overflow-hidden">
                    {/* Hover effect background */}
                    <div className="absolute inset-0 bg-gradient-to-br from-transparent to-gray-100/50 dark:to-slate-600/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    
                    <div className={cn("inline-flex p-3 rounded-full mb-4 relative z-10 group-hover:animate-pulse", feature.color, "bg-current bg-opacity-10")}>
                      <Icon className={cn("h-6 w-6 transition-transform duration-300 group-hover:scale-110", feature.color)} />
                    </div>
                    <h3 className="text-xl font-semibold mb-2 group-hover:text-gray-900 dark:text-white dark:group-hover:text-gray-100 transition-colors">{feature.title}</h3>
                    <p className="text-gray-600 dark:text-gray-300 group-hover:text-gray-700 dark:group-hover:text-gray-200 transition-colors">{feature.description}</p>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>
      </section>

      {/* User Types Section */}
      <section className="py-20 relative z-10">
        {/* Local user types orbs */}
        <div className="absolute inset-0 overflow-visible pointer-events-none">
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-purple-400/30 to-pink-400/30 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }} />
        <div className="absolute top-1/3 -right-32 w-88 h-88 bg-gradient-to-br from-blue-400/25 to-green-400/25 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '4s' }} />
        <div className="absolute top-3/4 left-1/4 w-72 h-72 bg-gradient-to-br from-yellow-400/20 to-orange-400/20 rounded-full blur-3xl animate-float" style={{ animationDelay: '6s' }} />
        
        {/* Additional light orbs for user types section */}
        <div className="absolute top-1/5 left-2/3 w-52 h-52 bg-gradient-to-br from-emerald-300/25 to-teal-300/20 rounded-full blur-2xl animate-float" style={{ animationDelay: '1.2s' }} />
        <div className="absolute bottom-1/5 right-2/5 w-44 h-44 bg-gradient-to-br from-violet-300/30 to-indigo-300/25 rounded-full blur-xl animate-float" style={{ animationDelay: '3.8s' }} />
        <div className="absolute top-2/5 left-1/8 w-38 h-38 bg-gradient-to-br from-fuchsia-300/20 to-rose-300/15 rounded-full blur-lg animate-float" style={{ animationDelay: '2.5s' }} />
        <div className="absolute bottom-2/3 right-1/6 w-42 h-42 bg-gradient-to-br from-cyan-300/25 to-sky-300/20 rounded-full blur-xl animate-float" style={{ animationDelay: '4.5s' }} />
        <div className="absolute top-1/8 right-3/4 w-28 h-28 bg-gradient-to-br from-white/30 to-blue-200/25 rounded-full blur-md animate-float" style={{ animationDelay: '0.7s' }} />
        <div className="absolute bottom-1/8 left-3/4 w-34 h-34 bg-gradient-to-br from-white/35 to-green-200/30 rounded-full blur-lg animate-float" style={{ animationDelay: '5.2s' }} />
        </div>
        
        <div className="container mx-auto px-6 relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4 text-gray-900 dark:text-white">Built for Every Stakeholder</h2>
            <p className="text-xl text-gray-600 dark:text-gray-300">Tailored experiences for all carbon credit ecosystem participants</p>
          </div>
          
          <div className="grid lg:grid-cols-3 gap-8">
            {userTypes.map((type, index) => {
              const Icon = type.icon
              return (
                <Card 
                  key={index}
                  className={cn(
                    "border-0 shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:scale-105 overflow-hidden group bg-white dark:bg-slate-800/90",
                    "animate-in slide-in-from-bottom duration-700"
                  )}
                  style={{ animationDelay: `${index * 200}ms` }}
                >
                  <div className={cn("h-2 bg-gradient-to-r", type.gradient)} />
                  <CardContent className="p-8">
                    <div className="flex items-center space-x-3 mb-4">
                      <div className={cn("p-3 rounded-xl bg-gradient-to-r", type.gradient, "text-white")}>
                        <Icon className="h-6 w-6" />
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-gray-900 dark:text-white">{type.title}</h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400">{type.subtitle}</p>
                      </div>
                    </div>
                    
                    <p className="text-gray-600 dark:text-gray-300 mb-6">{type.description}</p>
                    
                    <div className="space-y-2">
                      {type.features.map((feature, featureIndex) => (
                        <div key={featureIndex} className="flex items-center space-x-2">
                          <CheckCircle className="h-4 w-4 text-green-500" />
                          <span className="text-sm text-gray-600 dark:text-gray-300">{feature}</span>
                        </div>
                      ))}
                    </div>
                    
                    <Button 
                      className={cn(
                        "w-full mt-6 bg-gradient-to-r text-white transition-all duration-300 group-hover:scale-105",
                        type.gradient
                      )}
                    >
                      Learn More
                    </Button>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section ref={statsRef} className="py-20 bg-gradient-to-r from-green-600 via-blue-600 to-purple-600 text-white relative z-10">
        {/* Local stats orbs */}
        <div className="absolute inset-0 overflow-visible pointer-events-none">
        <div className="absolute top-1/4 left-1/6 w-64 h-64 bg-gradient-to-br from-white/10 to-green-200/15 rounded-full blur-3xl animate-float" style={{ animationDelay: '1s' }} />
        <div className="absolute bottom-1/4 right-1/6 w-72 h-72 bg-gradient-to-br from-white/8 to-blue-200/12 rounded-full blur-3xl animate-float" style={{ animationDelay: '3s' }} />
        <div className="absolute top-1/2 left-1/3 w-48 h-48 bg-gradient-to-br from-white/12 to-purple-200/18 rounded-full blur-2xl animate-float" style={{ animationDelay: '2s' }} />
        <div className="absolute top-3/4 right-1/3 w-56 h-56 bg-gradient-to-br from-white/15 to-cyan-200/20 rounded-full blur-2xl animate-float" style={{ animationDelay: '4s' }} />
        <div className="absolute bottom-1/6 left-2/3 w-40 h-40 bg-gradient-to-br from-white/20 to-emerald-200/25 rounded-full blur-xl animate-float" style={{ animationDelay: '0.5s' }} />
        <div className="absolute top-1/6 right-2/3 w-36 h-36 bg-gradient-to-br from-white/18 to-pink-200/22 rounded-full blur-lg animate-float" style={{ animationDelay: '3.5s' }} />
        </div>
        
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-bold mb-4">Impact by Numbers</h2>
            <p className="text-xl text-green-100">Real results from our global carbon credit network</p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => {
              const Icon = stat.icon
              const { count, setIsInView } = useCounter(stat.number, 2000 + index * 500)
              
              return (
                <div 
                  key={index}
                  className={cn(
                    "text-center transform transition-all duration-700 hover:scale-110",
                    "animate-in zoom-in duration-700"
                  )}
                  style={{ animationDelay: `${index * 150}ms` }}
                  ref={(el) => {
                    if (el) {
                      const observer = new IntersectionObserver(
                        ([entry]) => {
                          if (entry.isIntersecting) {
                            setIsInView(true)
                          }
                        },
                        { threshold: 0.5 }
                      )
                      observer.observe(el)
                    }
                  }}
                >
                  <div className="inline-flex p-4 rounded-full bg-white/20 backdrop-blur-sm mb-4 group-hover:bg-white/30 transition-colors">
                    <Icon className="h-8 w-8 animate-pulse" />
                  </div>
                  <div className="text-4xl font-bold mb-2">
                    {stat.number === 99.9 ? count.toFixed(1) : count.toLocaleString()}{stat.suffix}
                  </div>
                  <div className="text-green-100">{stat.label}</div>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 relative z-10">
        {/* Local CTA orbs */}
        <div className="absolute inset-0 overflow-visible pointer-events-none">
        <div className="absolute top-1/3 left-1/5 w-60 h-60 bg-gradient-to-br from-green-300/25 to-emerald-300/20 rounded-full blur-2xl animate-float" style={{ animationDelay: '1.5s' }} />
        <div className="absolute bottom-1/3 right-1/5 w-68 h-68 bg-gradient-to-br from-blue-300/30 to-cyan-300/25 rounded-full blur-2xl animate-float" style={{ animationDelay: '3.5s' }} />
        <div className="absolute top-1/6 right-1/3 w-44 h-44 bg-gradient-to-br from-purple-300/20 to-violet-300/15 rounded-full blur-xl animate-float" style={{ animationDelay: '2.2s' }} />
        <div className="absolute bottom-1/6 left-1/3 w-52 h-52 bg-gradient-to-br from-rose-300/25 to-pink-300/20 rounded-full blur-xl animate-float" style={{ animationDelay: '4.2s' }} />
        <div className="absolute top-2/3 left-1/8 w-32 h-32 bg-gradient-to-br from-white/35 to-lime-200/30 rounded-full blur-lg animate-float" style={{ animationDelay: '0.8s' }} />
        <div className="absolute bottom-2/3 right-1/8 w-38 h-38 bg-gradient-to-br from-white/30 to-sky-200/25 rounded-full blur-md animate-float" style={{ animationDelay: '5s' }} />
        <div className="absolute top-1/2 left-2/3 w-28 h-28 bg-gradient-to-br from-amber-300/25 to-yellow-300/20 rounded-full blur-md animate-float" style={{ animationDelay: '1.8s' }} />
        </div>
        
        <div className="container mx-auto px-6 text-center">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-4xl font-bold mb-6 text-gray-900 dark:text-white">Ready to Transform Carbon Management?</h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 mb-8">
              Join thousands of organizations already using our platform to create a sustainable future.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg"
                className="bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 text-white px-12 py-4 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
              >
                Get Started Today
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button 
                variant="outline" 
                size="lg"
                className="border-2 border-gray-300 hover:border-gray-400 px-12 py-4 rounded-xl transition-all duration-300"
              >
                Contact Sales
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 dark:bg-slate-900 text-white py-12">
        {/* Local footer orbs */}
        <div className="absolute inset-0 overflow-visible pointer-events-none">
        <div className="absolute top-1/2 left-1/4 w-48 h-48 bg-gradient-to-br from-white/5 to-gray-300/8 rounded-full blur-2xl animate-float" style={{ animationDelay: '2s' }} />
        <div className="absolute bottom-1/3 right-1/4 w-56 h-56 bg-gradient-to-br from-green-400/10 to-blue-400/8 rounded-full blur-2xl animate-float" style={{ animationDelay: '4s' }} />
        <div className="absolute top-1/4 right-1/6 w-32 h-32 bg-gradient-to-br from-white/8 to-gray-200/10 rounded-full blur-xl animate-float" style={{ animationDelay: '1s' }} />
        </div>
        
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="flex items-center space-x-3 mb-4 md:mb-0">
              <Leaf className="h-8 w-8 text-green-500" />
              <span className="text-2xl font-bold">Carbon Registry</span>
            </div>
            
            <div className="flex items-center space-x-6">
              <span className="text-gray-400 dark:text-gray-500">© 2025 Carbon Registry. All rights reserved.</span>
              <div className="flex items-center space-x-1">
                <Star className="h-4 w-4 text-yellow-500 fill-current" />
                
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}