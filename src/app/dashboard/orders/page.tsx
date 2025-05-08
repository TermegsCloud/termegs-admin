"use client";

import { useState } from "react";
import { useOrdersStore } from "@/store/ordersStore";

export default function OrdersPage() {
  const [tab, setTab] = useState<"sent" | "notSent" | "returns">("sent");
  const [search, setSearch] = useState("");
  const [popup, setPopup] = useState<string | null>(null);
  const [showOrders, setShowOrders] = useState<string | null>(null);
  const sentOrders = useOrdersStore(s => s.sentOrders);
  const notSentOrders = useOrdersStore(s => s.notSentOrders);
  const returnOrders = useOrdersStore(s => s.returnOrders);
  const removeNotSentOrder = useOrdersStore(s => s.removeNotSentOrder);

  // Csoportosítás napokra
  const daysMap: Record<string, { GLS: string[]; FOXPOST: string[] }> = {};
  sentOrders.forEach(order => {
    if (!daysMap[order.date]) daysMap[order.date] = { GLS: [], FOXPOST: [] };
    daysMap[order.date][order.mode].push(order.order);
  });
  const days = Object.entries(daysMap).sort((a, b) => b[0].localeCompare(a[0]));

  // Automatikus áthelyezés: ha egy rendelés a sentOrders-ben is van, töröljük a notSentOrders-ből
  sentOrders.forEach(order => {
    if (notSentOrders.some(n => n.order === order.order)) {
      removeNotSentOrder(order.order);
    }
  });

  // Keresés logika
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = search.trim();
    if (!trimmed) return;
    if (sentOrders.some(o => o.order === trimmed)) {
      setPopup('Küldött');
      return;
    }
    if (notSentOrders.some(o => o.order === trimmed)) {
      setPopup('Nem küldött');
      return;
    }
    if (returnOrders.some(o => o.order === trimmed)) {
      setPopup('Visszaáru');
      return;
    }
    setPopup('Nincs ilyen rendelés');
  };

  return (
    <div className="min-h-screen bg-white flex flex-col items-center py-8">
      {/* Tabok */}
      <div className="flex space-x-4 mb-6">
        <button onClick={() => setTab("sent")} className={`px-6 py-2 rounded-t-lg font-bold text-lg ${tab === "sent" ? "bg-gray-600 text-white" : "bg-gray-400 text-white"}`}>Küldött</button>
        <button onClick={() => setTab("notSent")} className={`px-6 py-2 rounded-t-lg font-bold text-lg ${tab === "notSent" ? "bg-gray-600 text-white" : "bg-gray-400 text-white"}`}>Nem küldött</button>
        <button onClick={() => setTab("returns")} className={`px-6 py-2 rounded-t-lg font-bold text-lg ${tab === "returns" ? "bg-gray-600 text-white" : "bg-gray-400 text-white"}`}>Visszaáru</button>
      </div>

      {/* Kereső sáv */}
      <form onSubmit={handleSearch} className="mb-6 flex items-center space-x-2">
        <input
          type="text"
          placeholder="Rendelés szám keresése..."
          className="px-4 py-2 rounded border border-gray-400 text-lg"
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
        <button type="submit" className="px-4 py-2 rounded bg-gray-600 text-white font-semibold">Keresés</button>
      </form>
      {/* Pop-up */}
      {popup && (
        <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center z-50 bg-black bg-opacity-40">
          <div className="bg-white rounded-xl shadow-lg p-8 text-xl text-gray-900 flex flex-col items-center">
            <span>{popup}</span>
            <button className="mt-6 px-6 py-2 rounded bg-gray-600 text-white font-semibold" onClick={() => setPopup(null)}>OK</button>
          </div>
        </div>
      )}

      {/* Tartalom */}
      <div className="w-full max-w-5xl p-0 border-2 border-black rounded-xl">
        {tab === "sent" && (
          <div className="space-y-6">
            {days.length === 0 && <div className="text-white">Nincs küldött rendelés.</div>}
            <div className="flex flex-col gap-4">
              {days.map(([date, { GLS, FOXPOST }]) => (
                <div key={date} className="flex flex-row items-stretch bg-white rounded-xl cursor-pointer hover:bg-blue-50 transition" onClick={() => setShowOrders(date)}>
                  {/* Dátum oszlop */}
                  <div className="flex items-center justify-center bg-blue-900 text-white font-bold px-6 min-w-[120px] text-lg border-r-2 border-blue-200">
                    {date}
                  </div>
                  {/* Rendelések oszlopok */}
                  <div className="flex-1 flex flex-row divide-x divide-blue-200">
                    <div className="flex-1 p-4">
                      <div className="font-bold text-blue-900 mb-2">GLS</div>
                      <div className="text-blue-900 font-semibold">{GLS.length} db</div>
                    </div>
                    <div className="flex-1 p-4">
                      <div className="font-bold text-blue-900 mb-2">Foxpost</div>
                      <div className="text-blue-900 font-semibold">{FOXPOST.length} db</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            {/* Pop-up az adott nap összes rendeléséhez */}
            {showOrders && (
              <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center z-50 bg-black bg-opacity-40">
                <div className="bg-white rounded-xl p-8 text-xl text-gray-900 flex flex-col items-center min-w-[340px]">
                  <span className="font-bold mb-4">{showOrders}</span>
                  <div className="flex flex-row gap-8 w-full">
                    <div className="flex-1">
                      <div className="font-bold text-blue-900 mb-2">GLS</div>
                      {(daysMap[showOrders]?.GLS ?? []).length === 0 ? <div className="text-gray-400">-</div> : daysMap[showOrders]?.GLS.map((order, i) => (
                        <div key={i} className="text-blue-900 font-mono">{order}</div>
                      ))}
                    </div>
                    <div className="flex-1">
                      <div className="font-bold text-blue-900 mb-2">Foxpost</div>
                      {(daysMap[showOrders]?.FOXPOST ?? []).length === 0 ? <div className="text-gray-400">-</div> : daysMap[showOrders]?.FOXPOST.map((order, i) => (
                        <div key={i} className="text-blue-900 font-mono">{order}</div>
                      ))}
                    </div>
                  </div>
                  <button className="mt-6 px-6 py-2 rounded bg-gray-600 text-white font-semibold" onClick={() => setShowOrders(null)}>OK</button>
                </div>
              </div>
            )}
          </div>
        )}
        {tab === "notSent" && (
          <div className="bg-gray-300 rounded-2xl p-4">
            <table className="w-full text-left">
              <thead>
                <tr className="text-white bg-gray-500">
                  <th className="px-4 py-2">Dátum</th>
                  <th className="px-4 py-2">Rendelés szám</th>
                  <th className="px-4 py-2">Tétel neve</th>
                  <th className="px-4 py-2">Cikkszám</th>
                  <th className="px-4 py-2">Db</th>
                </tr>
              </thead>
              <tbody>
                {notSentOrders.map((row, i) => (
                  <tr key={i} className="border-b">
                    <td className="px-4 py-2">{row.date}</td>
                    <td className="px-4 py-2">{row.order}</td>
                    <td className="px-4 py-2">{row.item}</td>
                    <td className="px-4 py-2">-</td>
                    <td className="px-4 py-2">{row.qty}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        {tab === "returns" && (
          <div className="bg-gray-300 rounded-2xl p-4">
            <table className="w-full text-left">
              <thead>
                <tr className="text-white bg-gray-500">
                  <th className="px-4 py-2">Dátum</th>
                  <th className="px-4 py-2">Rendelés szám</th>
                  <th className="px-4 py-2">Tétel neve</th>
                  <th className="px-4 py-2">Cikkszám</th>
                  <th className="px-4 py-2">Db</th>
                </tr>
              </thead>
              <tbody>
                {returnOrders.map((row, i) => (
                  <tr key={i} className="border-b">
                    <td className="px-4 py-2">{row.date}</td>
                    <td className="px-4 py-2">{row.order}</td>
                    <td className="px-4 py-2">{row.item}</td>
                    <td className="px-4 py-2">-</td>
                    <td className="px-4 py-2">{row.qty}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
} 