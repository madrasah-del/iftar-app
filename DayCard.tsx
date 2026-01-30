import React from 'react';
import { RamadanDay, Booking } from './types';
import { Icons, PRAYER_TIMES } from './constants';

interface DayCardProps {
  day: RamadanDay;
  sessionId: string;
  onSelect: (type: 'iftar' | 'suhoor', existing?: Booking) => void;
}

const DayCard: React.FC<DayCardProps> = ({ day, sessionId, onSelect }) => {
  const isLastTen = day.dayNumber >= 21;
  const is27thNight = day.dayNumber === 27;
  
  const dayName = day.date.toLocaleDateString('en-GB', { weekday: 'short' });
  const dateNum = day.date.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });
  
  const prayerData = PRAYER_TIMES.find(p => p.day === day.dayNumber);
  const maghribTime = prayerData?.maghrib || "--:--";
  
  const calculateSuhoorTime = (fajrStr: string | undefined) => {
    if (!fajrStr) return "--:--";
    const [h, m] = fajrStr.split(':').map(Number);
    let totalMinutes = h * 60 + m - 45;
    if (totalMinutes < 0) totalMinutes += 1440;
    const hh = Math.floor(totalMinutes / 60).toString().padStart(2, '0');
    const mm = (totalMinutes % 60).toString().padStart(2, '0');
    return `${hh}:${mm}`;
  };

  const suhoorTime = calculateSuhoorTime(prayerData?.fajr);

  const renderBookingSlot = (booking: Booking | undefined, type: 'iftar' | 'suhoor' = 'iftar', label?: string) => {
    const isBooked = !!booking;
    const displayTime = type === 'iftar' ? maghribTime : suhoorTime;

    return (
      <div className="mt-3 first:mt-0">
        {label && <p className="text-[10px] font-black uppercase text-slate-500 tracking-widest mb-1">{label}</p>}
        {isBooked ? (
          <div className="space-y-2">
            <div 
              className="p-4 rounded-[28px] border-4 transition-all bg-white border-slate-950 shadow-sm relative overflow-hidden cursor-pointer hover:bg-slate-50"
              onClick={() => onSelect(type, booking)}
            >
              <div className="flex justify-between items-start mb-2">
                <p className="text-[8px] font-black uppercase text-slate-400 tracking-widest leading-none">
                  SPONSORED BY
                </p>
                <div className="bg-slate-900 text-white text-[10px] font-black px-2 py-1 rounded-lg flex items-center space-x-1">
                  <Icons.Clock />
                  <span>{displayTime}</span>
                </div>
              </div>
              <p className="text-3xl font-black text-slate-900 leading-tight uppercase tracking-tighter truncate">{booking.name}</p>
              
              <div className="mt-2 flex items-center justify-between">
                <div className="flex-1">
                  {booking.foodDetails && (
                    <p className="text-[14px] font-black text-emerald-900 leading-tight bg-emerald-100/50 p-2 rounded-xl italic">
                      Serving: {booking.foodDetails}
                    </p>
                  )}
                </div>
                <a 
                  href={`tel:${booking.phone}`} 
                  onClick={(e) => e.stopPropagation()} 
                  className="ml-2 bg-emerald-700 text-white p-3 rounded-2xl shadow-md active:scale-90 transition-all border-b-4 border-emerald-900"
                  title="Call Sponsor"
                >
                  <Icons.Phone />
                </a>
              </div>
              
              <button className="mt-4 w-full py-4 bg-slate-900 border-2 border-slate-950 text-white rounded-[20px] text-[12px] font-black uppercase tracking-widest shadow-md">
                Change Details
              </button>
            </div>
          </div>
        ) : (
          <button 
            onClick={() => onSelect(type)}
            className={`w-full py-10 rounded-[44px] text-[24px] font-black uppercase tracking-widest shadow-lg transition-all active:scale-95 border-4 border-slate-950 flex flex-col items-center justify-center space-y-1 ${
              is27thNight 
                ? 'bg-amber-600 text-white border-amber-800' 
                : isLastTen 
                  ? 'bg-indigo-800 text-white border-indigo-950' 
                  : 'bg-green-600 text-white border-green-800 hover:bg-green-700'
            }`}
          >
            <span className="leading-none">{is27thNight ? `Book ${type}` : 'Book Iftar'}</span>
            <span className="text-[24px] font-black tracking-tight leading-none pt-1">At {displayTime}</span>
          </button>
        )}
      </div>
    );
  };

  const allSlotsBooked = is27thNight 
    ? (!!day.iftarBooking && !!day.suhoorBooking)
    : (!!day.booking);

  return (
    <div className={`
      relative p-5 rounded-[40px] border-4 transition-all duration-300 flex flex-col text-left
      border-slate-950 min-h-[220px]
      ${allSlotsBooked ? 'bg-slate-200 grayscale-[0.2] opacity-90' : is27thNight ? 'bg-amber-50' : 'bg-white shadow-sm hover:shadow-xl'}
    `}>
      <div className="mb-4 flex justify-between items-start">
        <div>
          <h3 className={`text-xl font-black uppercase tracking-tighter mb-1 ${is27thNight ? 'text-amber-700' : isLastTen ? 'text-indigo-700' : 'text-slate-400'}`}>
            Ramadan Day {day.dayNumber}
          </h3>
          <p className="flex flex-col">
            <span className="text-[12px] font-black text-slate-500 uppercase tracking-widest">{dayName}</span>
            <span className="text-4xl font-black text-slate-900 tracking-tighter leading-none">{dateNum}</span>
          </p>
        </div>
        <div className={`flex flex-col items-center justify-center p-3 rounded-2xl border-4 ${is27thNight ? 'bg-amber-100 border-amber-300' : 'bg-slate-50 border-slate-200'}`}>
          <p className="text-[8px] font-black text-slate-400 uppercase leading-none mb-1">Expected</p>
          <div className="flex items-center space-x-1">
             <p className="text-2xl font-black text-slate-900 leading-none">{day.expectedAttendance}</p>
             <div className="scale-75"><Icons.Users /></div>
          </div>
        </div>
      </div>

      <div className="mt-auto">
        {is27thNight ? (
          <div className="grid grid-cols-1 gap-2">
            {renderBookingSlot(day.iftarBooking, 'iftar', '🌙 Iftar Slot')}
            {renderBookingSlot(day.suhoorBooking, 'suhoor', '🌅 Suhoor Slot')}
          </div>
        ) : (
          renderBookingSlot(day.booking)
        )}
      </div>
    </div>
  );
};

export default DayCard;