import React, { useState, useEffect } from 'react';
import { RamadanDay, Booking } from './types';
import { Icons, CARETAKER_NAME } from './constants';

interface BookingModalProps {
  day: RamadanDay;
  type: 'iftar' | 'suhoor';
  initialData?: Booking;
  onClose: () => void;
  onConfirm: (name: string, phone: string, food: string) => void;
  onDelete: (id: string) => void;
}

const BookingModal: React.FC<BookingModalProps> = ({ day, type, initialData, onClose, onConfirm, onDelete }) => {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [food, setFood] = useState('');
  const [acceptedTerms, setAcceptedTerms] = useState(false);

  useEffect(() => {
    if (initialData) {
      setName(initialData.name);
      setPhone(initialData.phone);
      setFood(initialData.foodDetails || '');
      setAcceptedTerms(true);
    }
  }, [initialData]);

  const dateStr = day.date.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', weekday: 'long' });
  const isSuhoor = type === 'suhoor';
  const slotId = day.dayNumber === 27 ? `${day.date.toISOString().split('T')[0]}_${type}` : day.date.toISOString().split('T')[0];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name && phone && food && acceptedTerms) {
      onConfirm(name, phone, food);
    }
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/95 backdrop-blur-xl"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="bg-white rounded-[48px] w-full max-w-lg overflow-hidden shadow-2xl border-4 border-slate-950 max-h-[90vh] overflow-y-auto animate-in relative">
        <button 
          onClick={onClose} 
          className="absolute top-6 right-6 z-10 bg-slate-100 text-slate-400 p-3 rounded-full hover:text-slate-900 transition-colors"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M6 18L18 6M6 6l12 12"></path></svg>
        </button>

        <div className={`${isSuhoor ? 'bg-amber-600' : 'bg-emerald-700'} p-8 text-white border-b-4 border-slate-950`}>
           <h3 className="text-[10px] font-black uppercase tracking-widest opacity-80">
            {initialData ? 'Update Sponsorship' : 'Book Your Slot'}
           </h3>
           <p className="text-2xl font-black mt-1 leading-tight uppercase tracking-tighter">{dateStr}</p>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-[10px] font-black uppercase text-slate-500 tracking-widest mb-1.5">Sponsor Name</label>
              <input 
                required 
                type="text" 
                value={name} 
                onChange={(e) => setName(e.target.value)} 
                className="w-full p-4 bg-slate-100 border-2 border-slate-300 rounded-2xl outline-none font-black text-slate-950 text-xl focus:border-emerald-500" 
                placeholder="Full Name" 
              />
            </div>
            <div>
              <label className="block text-[10px] font-black uppercase text-slate-500 tracking-widest mb-1.5">Contact Phone</label>
              <input 
                required 
                type="tel" 
                value={phone} 
                onChange={(e) => setPhone(e.target.value)} 
                className="w-full p-4 bg-slate-100 border-2 border-slate-300 rounded-2xl outline-none font-black text-slate-950 text-xl focus:border-emerald-500" 
                placeholder="07xxx..." 
              />
            </div>
          </div>

          <div>
            <label className="block text-[10px] font-black uppercase text-slate-500 tracking-widest mb-1.5">What are you serving?</label>
            <textarea 
              required 
              rows={3}
              value={food} 
              onChange={(e) => setFood(e.target.value)} 
              className="w-full p-4 bg-slate-100 border-2 border-slate-300 rounded-2xl outline-none font-black text-lg text-slate-950 focus:border-emerald-500" 
              placeholder="e.g. Rice, Lamb Curry, Juice, Fruit..."
            />
          </div>

          <div className="bg-amber-50 p-6 rounded-3xl border-4 border-amber-200 text-xs text-amber-950 leading-snug font-bold">
              <p className="mb-3 uppercase tracking-widest underline decoration-amber-400 decoration-2 text-sm">Mandatory Rules:</p>
              <ul className="list-disc list-inside space-y-2">
                <li>Arrive <strong>ONE HOUR</strong> early for setup & parking.</li>
                <li>Serving help and <strong>CLEARING AWAY</strong> is mandatory.</li>
                <li>Expected guests: <strong>~{day.expectedAttendance} people</strong>.</li>
              </ul>
          </div>

          <label className="flex items-start space-x-3 cursor-pointer group p-2 rounded-xl hover:bg-slate-50 transition-colors">
            <input type="checkbox" checked={acceptedTerms} onChange={(e) => setAcceptedTerms(e.target.checked)} className="mt-1 w-6 h-6 accent-emerald-600 rounded-lg cursor-pointer shrink-0" required />
            <span className="text-[11px] font-black text-slate-500 uppercase tracking-tight group-hover:text-slate-900 transition-colors">I confirm I will help serve and clear everything away.</span>
          </label>

          <div className="flex flex-col space-y-3">
            <button 
              type="submit" 
              disabled={!acceptedTerms} 
              className={`w-full p-6 font-black uppercase text-[16px] tracking-widest text-white rounded-[32px] border-b-8 active:border-b-4 transform transition-all active:translate-y-1 ${acceptedTerms ? (isSuhoor ? 'bg-amber-600 border-amber-800' : 'bg-emerald-600 border-emerald-800') : 'bg-slate-300 border-slate-400'}`}>
              {initialData ? 'Update' : 'Confirm Slot'}
            </button>
            
            {initialData && (
              <button 
                type="button" 
                onClick={() => onDelete(slotId)}
                className="w-full p-5 font-black uppercase text-[12px] tracking-widest bg-red-600 text-white rounded-[24px] border-b-8 border-red-800 active:border-b-4 transition-all active:translate-y-1"
              >
                Permanently Delete Slot
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default BookingModal;