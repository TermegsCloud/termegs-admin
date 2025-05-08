import { create } from 'zustand';

export type SentOrder = {
  date: string;
  mode: 'GLS' | 'FOXPOST';
  order: string;
};

export type NotSentOrder = {
  date: string;
  order: string;
  item: string;
  qty: number;
};

export type ReturnOrder = {
  date: string;
  order: string;
  item: string;
  qty: number;
};

interface OrdersState {
  sentOrders: SentOrder[];
  notSentOrders: NotSentOrder[];
  returnOrders: ReturnOrder[];
  addSentOrder: (order: SentOrder) => void;
  addNotSentOrder: (order: NotSentOrder) => void;
  addReturnOrder: (order: ReturnOrder) => void;
  removeNotSentOrder: (orderNumber: string) => void;
}

export const useOrdersStore = create<OrdersState>((set: (fn: (state: OrdersState) => Partial<OrdersState>) => void) => ({
  sentOrders: [],
  notSentOrders: [],
  returnOrders: [],
  addSentOrder: (order: SentOrder) => set((state) => ({ sentOrders: [...state.sentOrders, order] })),
  addNotSentOrder: (order: NotSentOrder) => set((state) => ({ notSentOrders: [...state.notSentOrders, order] })),
  addReturnOrder: (order: ReturnOrder) => set((state) => ({ returnOrders: [...state.returnOrders, order] })),
  removeNotSentOrder: (orderNumber: string) => set((state) => ({ notSentOrders: state.notSentOrders.filter(o => o.order !== orderNumber) })),
})); 