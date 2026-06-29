'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Brain, MessageCircle, Pill, MapPin, Calendar, ArrowRight, FileX, Activity, HeartPulse, ShieldCheck, Stethoscope } from 'lucide-react'
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { motion } from 'framer-motion'

export default function DashboardPage() {
  const quickActions = [
    {
      icon: Brain,
      title: 'Check Symptoms',
      description: 'Describe your symptoms and get AI-powered insights',
      href: '/app/symptom-checker',
      color: 'text-primary',
      bgBase: 'bg-primary/5',
      bgHover: 'group-hover:bg-primary',
      borderHover: 'hover:border-primary/30 hover:ring-2 hover:ring-primary/10'
    },
    {
      icon: MessageCircle,
      title: 'Chat with Doctor',
      description: 'Connect with qualified doctors instantly',
      href: '/app/doctor-chat',
      color: 'text-indigo-500 dark:text-indigo-400',
      bgBase: 'bg-indigo-500/5',
      bgHover: 'group-hover:bg-indigo-500',
      borderHover: 'hover:border-indigo-500/30 hover:ring-2 hover:ring-indigo-500/10'
    },
    {
      icon: Pill,
      title: 'Pharmacy',
      description: 'Browse and order medications online',
      href: '/app/pharmacy',
      color: 'text-emerald-500 dark:text-emerald-400',
      bgBase: 'bg-emerald-500/5',
      bgHover: 'group-hover:bg-emerald-500',
      borderHover: 'hover:border-emerald-500/30 hover:ring-2 hover:ring-emerald-500/10'
    },
    {
      icon: MapPin,
      title: 'Find Clinics',
      description: 'Locate nearby hospitals and clinics',
      href: '/app/clinics',
      color: 'text-orange-500 dark:text-orange-400',
      bgBase: 'bg-orange-500/5',
      bgHover: 'group-hover:bg-orange-500',
      borderHover: 'hover:border-orange-500/30 hover:ring-2 hover:ring-orange-500/10'
    },
    {
      icon: Calendar,
      title: 'Appointments',
      description: 'Schedule appointments with doctors',
      href: '/app/appointments',
      color: 'text-pink-500 dark:text-pink-400',
      bgBase: 'bg-pink-500/5',
      bgHover: 'group-hover:bg-pink-500',
      borderHover: 'hover:border-pink-500/30 hover:ring-2 hover:ring-pink-500/10'
    },
  ]

  const healthData = [
    { name: 'Jan', score: 75 },
    { name: 'Feb', score: 78 },
    { name: 'Mar', score: 85 },
    { name: 'Apr', score: 82 },
    { name: 'May', score: 90 },
    { name: 'Jun', score: 95 },
  ]

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: 'spring' as const, stiffness: 300, damping: 24 } }
  }

  return (
    <div className="space-y-8 md:space-y-10 max-w-7xl mx-auto pb-20">
      {/* Welcome Section */}
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-2 border-b border-border/50">
        <div>
          <h1 className="text-3xl md:text-4xl font-extrabold text-foreground mb-2 tracking-tight">Welcome back to <span className="text-primary">Smart Healthcare</span></h1>
          <p className="text-muted-foreground text-base md:text-lg font-medium">Your complete healthcare solution in one unified dashboard.</p>
        </div>
        <div className="flex gap-3">
          <Link href="/app/profile">
            <Button variant="outline" size="lg" className="rounded-xl font-bold shadow-sm hover:shadow-md transition-all">Profile Settings</Button>
          </Link>
          <Button size="lg" className="rounded-xl font-bold shadow-[0_4px_14px_0_rgba(10,132,255,0.39)] hover:shadow-[0_6px_20px_rgba(10,132,255,0.23)] hover:-translate-y-0.5 transition-all">Customize</Button>
        </div>
      </motion.div>

      <motion.div variants={containerVariants} initial="hidden" animate="show" className="space-y-8">
        
        {/* Health Stats Section */}
        <motion.div variants={itemVariants}>
          <div className="flex items-center gap-2 mb-5">
            <Activity className="w-5 h-5 text-primary" />
            <h2 className="text-xl font-extrabold text-foreground uppercase tracking-widest">Your Health Overview</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <Card className="p-6 md:p-8 flex flex-col justify-center items-center text-center shadow-lg border-0 ring-1 ring-border/50 bg-gradient-to-br from-background to-muted/20 hover:shadow-xl transition-all rounded-2xl group">
              <div className="text-muted-foreground font-bold text-xs uppercase tracking-widest flex items-center gap-2 mb-4">
                <Stethoscope className="w-4 h-4 text-primary" />
                Last Consultation
              </div>
              <div className="text-xl font-bold text-foreground bg-background p-5 rounded-full mb-4 shadow-sm group-hover:scale-110 transition-transform ring-1 ring-border/50">
                <FileX className="w-8 h-8 text-muted-foreground/50" />
              </div>
              <div className="text-lg font-extrabold text-card-foreground line-clamp-1">No recent visit</div>
              <p className="text-muted-foreground font-medium text-sm mt-1">Book an appointment today</p>
            </Card>
            
            <Card className="p-6 md:p-8 shadow-lg border-0 ring-1 ring-primary/20 bg-primary/5 hover:shadow-xl transition-all rounded-2xl relative overflow-hidden group">
              <div className="absolute -right-6 -top-6 bg-primary/10 w-32 h-32 rounded-full blur-2xl group-hover:bg-primary/20 transition-all"></div>
              <div className="relative z-10">
                <div className="text-primary font-bold text-xs uppercase tracking-widest flex items-center gap-2 mb-4">
                  <Calendar className="w-4 h-4" />
                  Upcoming Appointments
                </div>
                <div className="text-5xl font-black text-foreground mb-1 font-mono tracking-tighter">0</div>
                <p className="text-muted-foreground font-medium text-sm mt-2">Schedule your next checkup</p>
              </div>
            </Card>
            
            <Card className="p-6 md:p-8 shadow-lg border-0 ring-1 ring-emerald-500/20 bg-emerald-500/5 hover:shadow-xl transition-all rounded-2xl relative overflow-hidden group">
              <div className="absolute -right-6 -top-6 bg-emerald-500/10 w-32 h-32 rounded-full blur-2xl group-hover:bg-emerald-500/20 transition-all"></div>
              <div className="relative z-10">
                <div className="text-emerald-600 dark:text-emerald-400 font-bold text-xs uppercase tracking-widest flex items-center gap-2 mb-4">
                  <Pill className="w-4 h-4" />
                  Active Prescriptions
                </div>
                <div className="text-5xl font-black text-foreground mb-1 font-mono tracking-tighter">0</div>
                <p className="text-muted-foreground font-medium text-sm mt-2">View and refill medications</p>
              </div>
            </Card>
          </div>
        </motion.div>

        {/* Wellness Chart */}
        <motion.div variants={itemVariants}>
          <Card className="p-6 md:p-8 shadow-xl border-0 ring-1 ring-border/50 bg-card rounded-3xl">
            <div className="flex items-center gap-3 mb-8">
              <div className="p-2 bg-red-500/10 rounded-lg">
                <HeartPulse className="w-6 h-6 text-red-500" />
              </div>
              <h3 className="font-extrabold text-foreground text-xl tracking-tight">Wellness Score Trend <span className="text-muted-foreground text-base font-medium ml-2">(Last 6 Months)</span></h3>
            </div>
            <div className="h-[280px] w-full mt-4">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={healthData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.4}/>
                      <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="4 4" vertical={false} stroke="hsl(var(--border))" opacity={0.6} />
                  <XAxis dataKey="name" stroke="hsl(var(--foreground))" opacity={0.5} fontSize={13} fontFamily="inherit" fontWeight={600} tickLine={false} axisLine={false} dy={10} />
                  <YAxis stroke="hsl(var(--foreground))" opacity={0.5} fontSize={13} fontFamily="inherit" fontWeight={600} tickLine={false} axisLine={false} dx={-10} />
                  <Tooltip
                    contentStyle={{ backgroundColor: 'hsl(var(--background))', borderColor: 'hsl(var(--border))', borderRadius: '12px', boxShadow: '0 4px 20px rgba(0,0,0,0.1)', fontWeight: 600 }}
                    itemStyle={{ color: 'hsl(var(--primary))', fontWeight: 800 }}
                  />
                  <Area type="monotone" dataKey="score" stroke="hsl(var(--primary))" strokeWidth={4} fillOpacity={1} fill="url(#colorScore)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </motion.div>

        {/* Quick Actions */}
        <motion.div variants={itemVariants} className="pt-4">
          <h2 className="text-xl font-extrabold text-foreground uppercase tracking-widest mb-6">Explore Services</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-5">
            {quickActions.map((action, idx) => {
              const Icon = action.icon
              return (
                <Link key={idx} href={action.href} className="block h-full">
                  <Card className={`p-6 border-transparent bg-card shadow-md transition-all duration-300 h-full group flex flex-col rounded-2xl ${action.borderHover}`}>
                    <div className={`p-3.5 rounded-2xl inline-flex items-center justify-center mb-5 transition-colors shadow-sm ${action.bgBase} ${action.bgHover}`}>
                      <Icon className={`w-7 h-7 transition-colors ${action.color} group-hover:text-white`} />
                    </div>
                    <h3 className="font-extrabold text-lg text-card-foreground mb-2 tracking-tight leading-tight">{action.title}</h3>
                    <p className="text-sm font-medium text-muted-foreground mb-6 leading-relaxed flex-1">{action.description}</p>
                    <div className={`flex items-center text-sm font-bold opacity-0 -translate-y-2 group-hover:translate-y-0 group-hover:opacity-100 transition-all ${action.color}`}>
                      Get Started <ArrowRight className="w-4 h-4 ml-1" />
                    </div>
                  </Card>
                </Link>
              )
            })}
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 pt-6">
          {/* Getting Started */}
          <motion.div variants={itemVariants} className="lg:col-span-2">
            <Card className="bg-gradient-to-br from-primary/10 via-background to-background p-8 md:p-10 border-0 shadow-lg ring-1 ring-primary/20 rounded-3xl h-full flex flex-col justify-center">
              <h2 className="text-2xl md:text-3xl font-extrabold text-foreground mb-8 tracking-tight">How it works</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 relative">
                <div className="hidden sm:block absolute top-[28px] left-[10%] right-[10%] h-0.5 bg-primary/20 z-0"></div>
                
                <div className="relative z-10 flex flex-col gap-4 bg-background/50 p-6 rounded-2xl border border-border/50 backdrop-blur-sm">
                  <span className="flex items-center justify-center w-12 h-12 rounded-2xl bg-primary text-white font-black text-xl shadow-md">1</span>
                  <div>
                    <h4 className="font-extrabold mb-1">Check Symptoms</h4>
                    <span className="text-sm font-medium text-muted-foreground leading-relaxed block">Use our AI to get instant health insights based on your condition.</span>
                  </div>
                </div>
                
                <div className="relative z-10 flex flex-col gap-4 bg-background/50 p-6 rounded-2xl border border-border/50 backdrop-blur-sm">
                  <span className="flex items-center justify-center w-12 h-12 rounded-2xl bg-primary text-white font-black text-xl shadow-md">2</span>
                  <div>
                    <h4 className="font-extrabold mb-1">Consult Doctors</h4>
                    <span className="text-sm font-medium text-muted-foreground leading-relaxed block">Chat or book appointments securely for professional medical advice.</span>
                  </div>
                </div>
                
                <div className="relative z-10 flex flex-col gap-4 bg-background/50 p-6 rounded-2xl border border-border/50 backdrop-blur-sm">
                  <span className="flex items-center justify-center w-12 h-12 rounded-2xl bg-primary text-white font-black text-xl shadow-md">3</span>
                  <div>
                    <h4 className="font-extrabold mb-1">Order Medicines</h4>
                    <span className="text-sm font-medium text-muted-foreground leading-relaxed block">Prescriptions delivered right to your door with fast local delivery.</span>
                  </div>
                </div>
                
                <div className="relative z-10 flex flex-col gap-4 bg-background/50 p-6 rounded-2xl border border-border/50 backdrop-blur-sm">
                  <span className="flex items-center justify-center w-12 h-12 rounded-2xl bg-primary text-white font-black text-xl shadow-md">4</span>
                  <div>
                    <h4 className="font-extrabold mb-1">Find Clinics</h4>
                    <span className="text-sm font-medium text-muted-foreground leading-relaxed block">Locate nearby facilities for immediate in-person appointments.</span>
                  </div>
                </div>
              </div>
            </Card>
          </motion.div>

          {/* Educational Resources */}
          <motion.div variants={itemVariants} className="lg:col-span-1">
            <Card className="p-8 shadow-lg border-0 ring-1 ring-border/50 rounded-3xl h-full flex flex-col bg-card">
              <h2 className="text-xl font-extrabold text-card-foreground mb-6 uppercase tracking-widest flex items-center gap-2">
                <Brain className="w-5 h-5 text-primary" /> Learned Today
              </h2>
              <div className="space-y-4 flex-1">
                <Link href="#" className="block p-5 rounded-2xl border border-border/60 hover:border-primary/50 bg-background hover:bg-primary/5 transition-all group">
                  <h3 className="font-extrabold text-foreground group-hover:text-primary transition-colors mb-2 leading-tight tracking-tight">Understanding Heart Health</h3>
                  <p className="text-sm font-medium text-muted-foreground leading-relaxed">Learn the top 5 habits to maintain a healthy cardiovascular system for life.</p>
                </Link>
                <Link href="#" className="block p-5 rounded-2xl border border-border/60 hover:border-primary/50 bg-background hover:bg-primary/5 transition-all group">
                  <h3 className="font-extrabold text-foreground group-hover:text-primary transition-colors mb-2 leading-tight tracking-tight">Nutrition 101 Video</h3>
                  <p className="text-sm font-medium text-muted-foreground leading-relaxed">Watch our latest 10-minute seminar on balancing essential macronutrients.</p>
                </Link>
              </div>
              <Link href="#" className="block mt-6 pt-4 border-t border-border/50 text-center text-sm text-primary font-extrabold uppercase tracking-widest hover:text-primary/80 transition-colors">
                Browse all resources →
              </Link>
            </Card>
          </motion.div>
        </div>

        {/* Security & Privacy Banner */}
        <motion.div variants={itemVariants} className="mt-4 bg-muted/30 border border-border/50 rounded-2xl p-6 md:p-8 flex flex-col sm:flex-row gap-6 justify-between items-center relative overflow-hidden">
          <div className="absolute inset-y-0 left-0 w-2 bg-primary"></div>
          <div className="text-muted-foreground flex items-start sm:items-center gap-4">
            <div className="p-3 bg-background rounded-full shadow-sm hidden sm:block">
              <ShieldCheck className="w-6 h-6 text-primary" />
            </div>
            <div>
              <p className="font-extrabold text-foreground mb-1 text-base tracking-tight">Security & Privacy First</p>
              <p className="text-sm font-medium leading-relaxed max-w-3xl">We use industry-standard bank-level encryption for your health data. Remember to change your password every 90 days and log out of shared computers.</p>
            </div>
          </div>
          <div className="flex gap-4 shrink-0 sm:ml-auto w-full sm:w-auto">
            <Link href="/privacy">
              <Button variant="outline" className="w-full sm:w-auto rounded-xl font-bold bg-background shadow-sm">Privacy</Button>
            </Link>
            <Link href="/app/profile">
              <Button variant="secondary" className="w-full sm:w-auto rounded-xl font-bold bg-muted hover:bg-muted/80 shadow-sm">Security</Button>
            </Link>
          </div>
        </motion.div>

      </motion.div>
    </div>
  )
}
