'use client'

import ProviderLayout from '../portal-layout'
import { Calendar, UserCircle, MessageSquare, Clipboard, Search, PlusCircle } from 'lucide-react'

export default function DoctorPortal() {
  const appointments = [
    { name: 'John Smith', time: '10:30 AM', reason: 'Flu symptoms', type: 'Virtual' },
    { name: 'Emily Davis', time: '11:15 AM', reason: 'Back pain follow-up', type: 'In-person' },
    { name: 'Michael Brown', time: '1:00 PM', reason: 'Prescription renewal', type: 'Virtual' },
  ]

  return (
    <ProviderLayout>
      <div className="space-y-8">
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold">Doctor's Workspace</h1>
            <p className="text-muted-foreground mt-2">Manage your patients, appointments, and consultations</p>
          </div>
          <div className="flex gap-3">
            <button className="px-4 py-2 bg-primary text-primary-foreground rounded-lg flex items-center gap-2 font-medium hover:bg-primary/90 transition-colors">
              <PlusCircle className="w-4 h-4" />
              Start Consultation
            </button>
            <button className="px-4 py-2 bg-muted text-foreground rounded-lg flex items-center gap-2 font-medium hover:bg-muted/80 transition-colors">
              <Search className="w-4 h-4" />
              Patient Records
            </button>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Appointments Column */}
          <div className="lg:col-span-2 space-y-6">
            <section className="bg-card rounded-xl border border-border shadow-sm">
              <div className="p-6 border-b flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-primary" />
                  <h2 className="text-xl font-bold">Today's Appointments</h2>
                </div>
                <span className="text-sm font-medium px-2 py-1 bg-primary/10 text-primary rounded-lg">{appointments.length} Total</span>
              </div>
              <div className="divide-y divide-border">
                {appointments.map((apt, i) => (
                  <div key={i} className="p-6 flex items-center justify-between hover:bg-muted/30 transition-colors">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-muted rounded-full flex items-center justify-center">
                        <UserCircle className="w-8 h-8 text-muted-foreground" />
                      </div>
                      <div>
                        <h3 className="font-bold text-lg">{apt.name}</h3>
                        <p className="text-sm text-muted-foreground">{apt.reason}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-primary">{apt.time}</p>
                      <p className="text-xs font-medium px-2 py-1 bg-muted rounded mt-1">{apt.type}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="p-4 border-t text-center">
                <button className="text-sm font-medium text-primary hover:underline">View Full Schedule</button>
              </div>
            </section>
          </div>

          {/* Sidebar Tools Column */}
          <div className="space-y-6">
            <section className="bg-card rounded-xl border border-border shadow-sm p-6">
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                <MessageSquare className="w-5 h-5 text-primary" />
                Unread Messages
              </h2>
              <div className="space-y-4">
                {[
                  { from: 'Anna Lee', preview: 'The symptoms persist after taking...', time: '10m ago' },
                  { from: 'Pharmacy Depot', preview: 'Prescription for Smith is ready...', time: '2h ago' },
                ].map((msg, i) => (
                  <div key={i} className="p-3 bg-muted/50 rounded-lg hover:bg-muted transition-colors cursor-pointer border border-transparent hover:border-border">
                    <div className="flex justify-between items-center mb-1">
                      <span className="font-bold text-sm">{msg.from}</span>
                      <span className="text-[10px] text-muted-foreground font-medium uppercase">{msg.time}</span>
                    </div>
                    <p className="text-xs text-muted-foreground line-clamp-1">{msg.preview}</p>
                  </div>
                ))}
              </div>
              <button className="w-full mt-4 py-2 text-sm font-medium border border-border rounded-lg hover:bg-muted transition-colors">
                Open Messenger
              </button>
            </section>

            <section className="bg-primary text-primary-foreground rounded-xl shadow-lg p-6 flex flex-col items-center text-center">
              <Clipboard className="w-10 h-10 mb-4 opacity-80" />
              <h3 className="text-lg font-bold">Quick Reports</h3>
              <p className="text-sm opacity-80 mt-2 mb-6">Generate daily summaries and patient logs in one click</p>
              <button className="w-full py-2 bg-white text-primary rounded-lg font-bold hover:bg-primary-foreground transition-colors shadow-md">
                Generate Summary
              </button>
            </section>
          </div>
        </div>
      </div>
    </ProviderLayout>
  )
}
