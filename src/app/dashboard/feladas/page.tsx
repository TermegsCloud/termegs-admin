"use client";

import { useState } from "react";
import { useOrdersStore } from "@/store/ordersStore";

const today = new Date().toLocaleDateString("hu-HU");

export default function FeladasPage() {
  const [mode, setMode] = useState<"GLS" | "FOXPOST">("GLS");
  const [order, setOrder] = useState("");
  const [item, setItem] = useState("");
  const [qty, setQty] = useState(1);
  const [sendType, setSendType] = useState<'Küldés' | 'Vissza' | 'Nem ment'>('Küldés');

  const addSentOrder = useOrdersStore(s => s.addSentOrder);
  const addNotSentOrder = useOrdersStore(s => s.addNotSentOrder);
  const addReturnOrder = useOrdersStore(s => s.addReturnOrder);
  const sentOrders = useOrdersStore(s => s.sentOrders);

  // Szűrés: csak a mai naphoz tartozó rendelések
  const todaysGLS = sentOrders.filter(o => o.date === today && o.mode === 'GLS');
  const todaysFOXPOST = sentOrders.filter(o => o.date === today && o.mode === 'FOXPOST');

  const handleAdd = () => {
    const date = new Date().toLocaleDateString("hu-HU");
    if (sendType === 'Küldés') {
      if (!order) return;
      addSentOrder({ date, mode, order });
      setOrder("");
    } else {
      if (!order || !item || !qty) return;
      if (sendType === 'Nem ment') {
        addNotSentOrder({ date, order, item, qty: Number(qty) });
      } else {
        addReturnOrder({ date, order, item, qty: Number(qty) });
      }
      setOrder(""); setItem(""); setQty(1);
    }
  };

  return (
    <div className="min-h-screen w-full flex flex-col items-center py-8" style={{ background: 'linear-gradient(135deg, #d1fae5 0%, #164e63 100%)' }}>
      {/* Felső sor: dátum balra, buborékok jobbra */}
      <div className="w-full max-w-5xl">
        <div className="w-full flex flex-row justify-between items-center px-8 mb-12">
          <div className="text-xl font-semibold" style={{ color: '#082f49' }}>{today}</div>
          <div className="flex space-x-4">
            <div className="rounded-full px-6 py-2 text-base font-bold" style={{ background: '#164e63', color: '#f0fdfa' }}>
              Foxpost:<br /><span className="text-sm font-normal" style={{ color: '#082f49' }}>{todaysFOXPOST.length} db</span>
            </div>
            <div className="rounded-full px-6 py-2 text-base font-bold" style={{ background: '#164e63', color: '#f0fdfa' }}>
              GLS:<br /><span className="text-sm font-normal" style={{ color: '#082f49' }}>{todaysGLS.length} db</span>
            </div>
          </div>
        </div>
      </div>

      {/* Kétoszlopos grid */}
      <div className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch">
        {/* Bal oldal */}
        <div className="flex flex-col justify-center items-center space-y-6 bg-white bg-opacity-40 rounded-2xl p-8 shadow-md">
          {/* Új gombsor: Küldés, Vissza, Nem ment */}
          <div className="flex space-x-4 mb-4">
            {['Küldés', 'Vissza', 'Nem ment'].map(type => (
              <button
                key={type}
                onClick={() => setSendType(type as 'Küldés' | 'Vissza' | 'Nem ment')}
                className={`px-6 py-2 rounded-full font-bold text-base border transition-colors duration-150 ${sendType === type ? 'bg-[#164e63] text-[#f0fdfa] border-[#164e63]' : 'bg-[#f0fdfa] text-[#082f49] border-[#164e63]'}`}
              >
                {type}
              </button>
            ))}
          </div>
          {/* Dinamikus inputok */}
          {sendType === 'Küldés' ? (
            <>
              <div className="flex space-x-4 mb-2">
                <button onClick={() => setMode("GLS")}
                  className={`px-8 py-3 rounded-lg font-bold text-lg ${mode === "GLS" ? "bg-[#164e63] text-[#f0fdfa]" : "bg-[#f0fdfa] text-[#082f49] border border-[#164e63]"}`}>GLS</button>
                <button onClick={() => setMode("FOXPOST")}
                  className={`px-8 py-3 rounded-lg font-bold text-lg ${mode === "FOXPOST" ? "bg-[#164e63] text-[#f0fdfa]" : "bg-[#f0fdfa] text-[#082f49] border border-[#164e63]"}`}>FOXPOST</button>
              </div>
              <input
                type="text"
                placeholder="Rendelés szám"
                className="w-56 px-4 py-2 rounded bg-[#f0fdfa] border border-[#164e63] text-center text-lg"
                value={order}
                onChange={e => setOrder(e.target.value)}
                style={{ color: '#082f49' }}
              />
            </>
          ) : (
            <>
              <input
                type="text"
                placeholder="Rendelés szám"
                className="w-56 px-4 py-2 rounded bg-[#f0fdfa] border border-[#164e63] text-center text-lg"
                value={order}
                onChange={e => setOrder(e.target.value)}
                style={{ color: '#082f49' }}
              />
              <input
                type="text"
                placeholder="Termék"
                className="w-56 px-4 py-2 rounded bg-[#f0fdfa] border border-[#164e63] text-center text-lg"
                value={item}
                onChange={e => setItem(e.target.value)}
                style={{ color: '#082f49' }}
              />
              <input
                type="number"
                placeholder="Darab"
                className="w-56 px-4 py-2 rounded bg-[#f0fdfa] border border-[#164e63] text-center text-lg"
                value={qty}
                min={1}
                onChange={e => setQty(Number(e.target.value))}
                style={{ color: '#082f49' }}
              />
            </>
          )}
          <button onClick={handleAdd} className="w-56 px-4 py-2 rounded bg-[#164e63] text-[#f0fdfa] text-lg font-semibold hover:bg-[#082f49]">Felvesz</button>
        </div>
        {/* Jobb oldal */}
        <div className="flex flex-col justify-center items-center bg-[#164e63] rounded-2xl p-8 shadow-md min-h-[320px]">
          <div className="text-[#f0fdfa] text-lg font-semibold mb-2">Mai rendelések:</div>
          <div className="flex flex-row divide-x divide-[#082f49] bg-[#f0fdfa] rounded-xl w-full">
            <div className="flex-1 p-4">
              <div className="font-bold mb-2" style={{ color: '#082f49' }}>GLS</div>
              {todaysGLS.map((o, i) => <div key={i} className="font-bold" style={{ color: '#082f49' }}>{o.order}</div>)}
            </div>
            <div className="flex-1 p-4">
              <div className="font-bold mb-2" style={{ color: '#082f49' }}>Foxpost</div>
              {todaysFOXPOST.map((o, i) => <div key={i} className="font-bold" style={{ color: '#082f49' }}>{o.order}</div>)}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 