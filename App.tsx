import React, { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import { RamadanDay, Booking } from './types';
import { RAMADAN_START_DATE, TOTAL_DAYS, CARETAKER_NAME, CARETAKER_PHONE, Icons, SUPABASE_URL, SUPABASE_ANON_KEY } from './constants';
import DayCard from './DayCard';
import BookingModal from './BookingModal';
import Header from './Header';

const supabase = SUPABASE_URL && SUPABASE_ANON_KEY ? createClient(SUPABASE_URL, SUPABASE_ANON_KEY) : null;
const SESSION_KEY = 'eeis_user_session';

const App: React.FC = () => {
  const [ramadanDays, setRamadanDays] = useState<RamadanDay[]>([]);
  const [selectedSlot, setSelectedSlot] = useState<{day: RamadanDay, type: 'iftar' | 'suhoor', existingBooking?: Booking} | null>(null);
  const [sessionId, setSessionId] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let sid = localStorage.getItem(SESSION_KEY);
    if (!sid) {
      sid = Math.random().toString(36).substring(7);
      localStorage.setItem(SESSION_KEY, sid);
    }
    setSessionId(sid);
    fetchData();
  }, []);

  const fetchData = async () => {
    setIsLoading(true);
    let bookings: Record<string, Booking> = {};

    if (supabase) {
      try {
        const { data, error } = await supabase.from('bookings').select('*');
        if (!error && data) {
          data.forEach((b: any) => {
            bookings[b.id] = {
              id: b.id,
              date: new Date(b.id.split('_')[0]),
              name: b.name,
              phone: b.phone,
              foodDetails: b.food_details,
              isBooked: true,
              bookedBySessionId: b.session_id,
              type: b.id.includes('suhoor') ? 'suhoor' : 'iftar'
            };
          });
        }
      } catch (e) {
        console.error("Supabase fetch error:", e);
      }
    }

    const days: RamadanDay[] = [];
    for (let i = 0; i < TOTAL_DAYS; i++) {
      const date = new Date(RAMADAN_START_DATE);
      date.setDate(date.getDate() + i);
      const dayOfWeek = date.getDay();
      const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
      const id = date.toISOString().split('T')[0];
      const dayNumber = i + 1;
      
      if (dayNumber === 27) {
        days.push({
          date,
          dayNumber,
          isWeekend,
          expectedAttendance: 75,
          iftarBooking: bookings[`${id}_iftar`],
          suhoorBooking: bookings[`${id}_suhoor`]
        });
      } else {
        days.push({
          date,
          dayNumber,
          isWeekend,
          expectedAttendance: isWeekend ? 75 : 25,
          booking: bookings[id]
        });
      }
    }
    setRamadanDays(days);
    setIsLoading(false);
  };

  const handleBooking = async (name: string, phone: string, food: string) => {
    if (!selectedSlot) return;
    const { day, type } = selectedSlot;
    const dateId = day.date.toISOString().split('T')[0];
    const finalId = day.dayNumber === 27 ? `${dateId}_${type}` : dateId;
    
    setSelectedSlot(null);

    if (supabase) {
      try {
        const { error } = await supabase.from('bookings').upsert([{
          id: finalId,
          name,
          phone,
          food_details: food,
          session_id: sessionId
        }]);
        
        if (error) {
          alert("Update failed. Please try again.");
          return;
        }
        await fetchData();
      } catch (err) {
        console.error("Booking error:", err);
      }
    }
  };

  const handleUnbook = async (dayId: string) => {
    if (!window.confirm("ARE YOU SURE? This will PERMANENTLY delete all details for this booking slot.")) return;

    setSelectedSlot(null);

    if (supabase) {
      try {
        const { error } = await supabase.from('bookings').delete().eq('id', dayId);
        if (error) throw error;
        await fetchData();
      } catch (err: any) {
        alert("Delete failed: " + err.message);
      }
    }
  };

  const bookedCount = ramadanDays.reduce((acc, d) => {
    if (d.dayNumber === 27) {
      return acc + (d.iftarBooking ? 1 : 0) + (d.suhoorBooking ? 1 : 0);
    }
    return acc + (d.booking ? 1 : 0);
  }, 0);

  const totalPossibleSlots = TOTAL_DAYS + 1;

  return (
    <div className="min-h-screen bg-slate-50 pb-40">
      <Header />

      <main className="max-w-4xl mx-auto px-2 md:px-4 -mt-16 relative z-10">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-40 text-center">
            <div className="w-16 h-16 border-4 border-emerald-100 border-t-emerald-700 rounded-full animate-spin"></div>
            <p className="mt-6 text-emerald-800 font-black uppercase tracking-[0.2em] text-[10px]">Updating Planner...</p>
          </div>
        ) : (
          <>
            <div className="bg-white rounded-[40px] shadow-2xl border-4 border-slate-950 p-8 mb-6 animate-in text-left mx-2">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-4xl font-black text-slate-900 tracking-tighter leading-none">
                    {bookedCount} <span className="text-slate-400">/ {totalPossibleSlots}</span>
                  </h2>
                  <p className="text-[9px] font-black uppercase tracking-[0.2em] text-emerald-600 mt-2">Slots Filled</p>
                </div>
                <div className="bg-emerald-800 text-white font-black px-8 py-4 rounded-[28px] text-3xl shadow-xl">
                  {Math.round((bookedCount / totalPossibleSlots) * 100)}%
                </div>
              </div>
              <div className="w-full bg-slate-100 h-6 rounded-full overflow-hidden p-1 border-2 border-slate-200 shadow-inner">
                <div 
                  className="bg-emerald-600 h-full rounded-full transition-all duration-1000" 
                  style={{ width: `${(bookedCount / totalPossibleSlots) * 100}%` }}
                ></div>
              </div>
            </div>

            <div className="bg-amber-100 border-4 border-slate-950 p-10 rounded-[40px] shadow-xl mb-10 animate-in mx-2 text-left relative overflow-hidden">
               <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
                  <Icons.Alert />
               </div>
               <div className="relative z-10">
                  <h3 className="text-slate-950 font-black text-4xl uppercase tracking-tighter mb-6 border-b-4 border-slate-950 pb-2 inline-block">Catering Policy</h3>
                  <div className="text-slate-950 text-xl font-extrabold space-y-4 leading-normal">
                    <p className="flex items-start"><span className="text-amber-600 mr-4">✦</span> <span>Arrive <strong>ONE HOUR</strong> before Iftar to find parking and transport food.</span></p>
                    <p className="flex items-start"><span className="text-amber-600 mr-4">✦</span> <span>Help with <strong>SERVING</strong> and <strong>CLEARING AWAY</strong> is mandatory.</span></p>
                    <p className="flex items-start"><span className="text-amber-600 mr-4">✦</span> <span><strong>ALL</strong> food waste, leftovers, and packaging must be removed immediately.</span></p>
                    <p className="flex items-start"><span className="text-amber-600 mr-4">✦</span> <span><strong>NO</strong> food or drinks should be left in the mosque fridge overnight.</span></p>
                    <p className="flex items-start"><span className="text-amber-600 mr-4">✦</span> <span>Coordination with <strong>{CARETAKER_NAME}</strong> ({CARETAKER_PHONE}) is essential.</span></p>
                  </div>
               </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 animate-in px-2">
              {ramadanDays.map((day) => (
                <DayCard 
                  key={day.date.toISOString()} 
                  day={day} 
                  sessionId={sessionId}
                  onSelect={(type, booking) => setSelectedSlot({day, type, existingBooking: booking})}
                />
              ))}
            </div>
          </>
        )}
      </main>

      <footer className="fixed bottom-0 left-0 right-0 p-8 z-50 flex justify-center pointer-events-none">
        <div className="bg-white/95 backdrop-blur-3xl border-4 border-slate-950 p-3 rounded-[36px] shadow-2xl flex items-center space-x-3 pointer-events-auto max-w-sm w-full">
          <a href={`tel:${CARETAKER_PHONE}`} className="w-full bg-emerald-800 text-white py-5 px-6 rounded-[24px] font-black text-[12px] uppercase tracking-widest text-center flex items-center justify-center space-x-2 shadow-xl border-b-4 border-emerald-950 transition-all active:translate-y-1 active:border-b-0">
            <Icons.Phone />
            <span>Call {CARETAKER_NAME}</span>
          </a>
        </div>
      </footer>

      {selectedSlot && (
        <BookingModal 
          day={selectedSlot.day} 
          type={selectedSlot.type} 
          initialData={selectedSlot.existingBooking}
          onClose={() => setSelectedSlot(null)} 
          onConfirm={handleBooking} 
          onDelete={handleUnbook}
        />
      )}
    </div>
  );
};

export default App;