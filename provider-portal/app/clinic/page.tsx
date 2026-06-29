'use client'

import ProviderLayout from '../portal-layout'
import { Hospital, Users, Calendar, MapPin, Activity, Settings, UserPlus, FileText } from 'lucide-react'

export default function ClinicPortal() {
  const staff = [
    { name: 'Dr. Johnathan Smith', role: 'Head Physician', status: 'On Duty' },
    { name: 'Dr. Sarah Wilson', role: 'General Practitioner', status: 'On Duty' },
    { name: 'Nurse Emily Davis', role: 'Senior Nurse', status: 'On Break' },
    { name: 'Dr. Michael Brown', role: 'Specialist', status: 'Off Duty' },
  ]

  const metrics = [
    { label: 'Patient Count', value: '84', icon: Users, color: 'text-blue-500' },
    { label: 'Available Beds', value: '12', icon: Activity, color: 'text-emerald-500' },
    { label: 'Today Appointments', value: '38', icon: Calendar, color: 'text-amber-500' },
    { label: 'Staff Online', value: '15', icon: ShieldCheck, color: 'text-primary' },
  ]

  function ShieldCheck(props: any) {
    return (
      <svg
        {...props}
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10" />
        <path d="m9 12 2 2 4-4" />
      </svg>
    )
  }

  return (
    <ProviderLayout>
      <div className="space-y-8">
        <header className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-3">
              <Hospital className="w-8 h-8 text-primary" />
              City Central Clinic
            </h1>
            <p className="text-muted-foreground mt-2 flex items-center gap-1">
              <MapPin className="w-4 h-4" /> 
              123 Medical Plaza, Health City
            </p>
          </div>
          <div className="flex gap-3">
            <button className="px-4 py-2 bg-primary text-primary-foreground rounded-lg flex items-center gap-2 font-medium hover:bg-primary/90 transition-colors shadow-sm">
              <UserPlus className="w-4 h-4" />
              Add Staff
            </button>
            <button className="px-4 py-2 bg-muted text-foreground rounded-lg flex items-center gap-2 font-medium hover:bg-muted/80 transition-colors">
              <Settings className="w-4 h-4" />
              Facility Settings
            </button>
          </div>
        </header>

        {/* Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {metrics.map((metric) => (
            <div key={metric.label} className="bg-card p-6 rounded-xl border border-border shadow-sm flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">{metric.label}</p>
                <h3 className="text-2xl font-bold mt-2">{metric.value}</h3>
              </div>
              <metric.icon className={`w-6 h-6 ${metric.color}`} />
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Staff List */}
          <section className="lg:col-span-2 bg-card rounded-xl border border-border shadow-sm overflow-hidden">
            <div className="p-6 border-b flex justify-between items-center">
              <h2 className="text-xl font-bold flex items-center gap-2">
                <Users className="w-5 h-5 text-primary" />
                Staff Attendance
              </h2>
              <button className="text-sm text-primary font-medium hover:underline">View All Staff</button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-muted/50">
                  <tr>
                    <th className="px-6 py-4 font-semibold text-sm">Staff Member</th>
                    <th className="px-6 py-4 font-semibold text-sm">Role</th>
                    <th className="px-6 py-4 font-semibold text-sm">Status</th>
                    <th className="px-6 py-4 font-semibold text-sm">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {staff.map((member, i) => (
                    <tr key={i} className="hover:bg-muted/30 transition-colors">
                      <td className="px-6 py-4 font-medium">{member.name}</td>
                      <td className="px-6 py-4 text-sm">{member.role}</td>
                      <td className="px-6 py-4 text-sm">
                        <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                          member.status === 'On Duty' ? 'bg-emerald-100 text-emerald-700' : 
                          member.status === 'On Break' ? 'bg-amber-100 text-amber-700' : 
                          'bg-muted text-muted-foreground'
                        }`}>
                          {member.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm">
                        <button className="text-primary hover:underline font-medium">Assign Task</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          {/* Quick Tasks Section */}
          <section className="bg-card rounded-xl border border-border shadow-sm p-6 flex flex-col">
            <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
              <FileText className="w-5 h-5 text-primary" />
              Administrative Tasks
            </h2>
            <div className="space-y-4 flex-1">
              {[
                { title: 'Approve Leave Request', subtitle: 'Nurse Emily (3 days)', priority: 'High' },
                { title: 'Inventory Reorder', subtitle: 'Medical gloves & masks', priority: 'Medium' },
                { title: 'Update Shift Schedule', subtitle: 'Next week (April 12-18)', priority: 'Low' },
              ].map((task, i) => (
                <div key={i} className="p-4 bg-muted/50 rounded-lg border-l-4 border-l-primary hover:bg-muted transition-colors cursor-pointer shadow-sm">
                  <div className="flex justify-between items-start mb-1">
                    <h3 className="font-bold text-sm">{task.title}</h3>
                    <span className={`text-[10px] font-bold px-2 py-1 rounded-full uppercase tracking-tighter ${
                      task.priority === 'High' ? 'bg-rose-100 text-rose-700' : 
                      task.priority === 'Medium' ? 'bg-amber-100 text-amber-700' : 
                      'bg-blue-100 text-blue-700'
                    }`}>
                      {task.priority}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground">{task.subtitle}</p>
                </div>
              ))}
            </div>
            <button className="w-full mt-6 py-3 bg-muted text-foreground border border-border rounded-lg font-bold hover:bg-muted/80 transition-colors flex items-center justify-center gap-2 shadow-sm">
              <FileText className="w-4 h-4" />
              Open Task Manager
            </button>
          </section>
        </div>
      </div>
    </ProviderLayout>
  )
}
