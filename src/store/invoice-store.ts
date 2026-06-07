"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { nanoid } from "nanoid";
import type { InvoiceState, LineItem, TemplateId } from "@/types/invoice";

function todayIso(): string {
  return new Date().toISOString().slice(0, 10);
}

function createLineItem(
  partial?: Pick<LineItem, "name" | "description" | "rate">,
): LineItem {
  return {
    id: nanoid(),
    name: partial?.name ?? "",
    description: partial?.description ?? "",
    quantity: 1,
    rate: partial?.rate ?? 0,
  };
}

function createDefaultLineItems(): LineItem[] {
  return [
    createLineItem({
      name: "Planning",
      description:
        "Scoping, requirements, and project plan for the software build.",
      rate: 5000,
    }),
    createLineItem({
      name: "Design",
      description:
        "UI/UX wireframes and visual design for the application.",
      rate: 5000,
    }),
    createLineItem({
      name: "Development",
      description:
        "Coding and integration of the software per agreed scope.",
      rate: 15000,
    }),
    createLineItem({
      name: "Testing",
      description: "QA, fixes, and sign-off before delivery.",
      rate: 5000,
    }),
  ];
}

export const defaultInvoiceState: InvoiceState = {
  templateId: "classic",
  currencyCode: "ZAR",
  accentColor: "#1e3a5f",
  pageColor: "#ffffff",

  logoDataUrl: null,
  logoFileName: null,
  bbbeeLevel: "",
  companyName: "Orrbit Systems",
  companyAddress: "",
  companyEmail: "",
  companyPhone: "",
  taxId: "",
  registrationNumber: "",
  businessNumber: "",
  bankName: "",
  sortCode: "",
  accountNumber: "",
  showAdditionalBusinessDetails: false,

  billTo: "",
  shipTo: "",

  invoiceTitle: "INVOICE",
  invoiceNumber: "INV-001",
  invoiceDate: todayIso(),
  dueDate: "",
  paymentTerms: "",
  poNumber: "",

  lineItems: createDefaultLineItems(),

  taxRate: 15,
  taxEnabled: true,
  discountAmount: 0,
  discountEnabled: false,
  discountIsPercent: true,
  shippingAmount: 0,
  shippingEnabled: false,
  amountPaid: 0,

  notes: "",
  terms: "",
  signatureDataUrl: null,
  photos: [],
};

type InvoiceActions = {
  setField: <K extends keyof InvoiceState>(
    key: K,
    value: InvoiceState[K],
  ) => void;
  addLineItem: () => void;
  removeLineItem: (id: string) => void;
  updateLineItem: (id: string, patch: Partial<LineItem>) => void;
  setTemplateId: (id: TemplateId) => void;
  addPhoto: (dataUrl: string) => void;
  removePhoto: (index: number) => void;
  resetInvoice: () => void;
};

export type InvoiceStore = InvoiceState & InvoiceActions;

export const useInvoiceStore = create<InvoiceStore>()(
  persist(
    (set) => ({
      ...defaultInvoiceState,

      setField: (key, value) => set({ [key]: value }),

      addLineItem: () =>
        set((state) => ({
          lineItems: [...state.lineItems, createLineItem()],
        })),

      removeLineItem: (id) =>
        set((state) => {
          if (state.lineItems.length <= 1) return state;
          return {
            lineItems: state.lineItems.filter((item) => item.id !== id),
          };
        }),

      updateLineItem: (id, patch) =>
        set((state) => ({
          lineItems: state.lineItems.map((item) =>
            item.id === id ? { ...item, ...patch } : item,
          ),
        })),

      setTemplateId: (templateId) => set({ templateId }),

      addPhoto: (dataUrl) =>
        set((state) => {
          if (state.photos.length >= 3) return state;
          return { photos: [...state.photos, dataUrl] };
        }),

      removePhoto: (index) =>
        set((state) => ({
          photos: state.photos.filter((_, i) => i !== index),
        })),

      resetInvoice: () =>
        set({
          ...defaultInvoiceState,
          invoiceDate: todayIso(),
          lineItems: createDefaultLineItems(),
        }),
    }),
    {
      name: "invoice-storage",
    },
  ),
);
