"use client";

import { useMemo } from "react";
import { getCurrencySymbol } from "@/lib/currencies";
import { computeTotals } from "@/lib/invoice-math";
import { useInvoiceStore } from "@/store/invoice-store";
import type { InvoiceTemplateData } from "@/types/invoice";

export function useInvoiceTemplateData(): InvoiceTemplateData {
  const state = useInvoiceStore();

  return useMemo(() => {
    const {
      setField: _setField,
      addLineItem: _addLineItem,
      removeLineItem: _removeLineItem,
      updateLineItem: _updateLineItem,
      setTemplateId: _setTemplateId,
      addPhoto: _addPhoto,
      removePhoto: _removePhoto,
      resetInvoice: _resetInvoice,
      ...invoiceState
    } = state;

    return {
      ...invoiceState,
      currencySymbol: getCurrencySymbol(invoiceState.currencyCode),
      totals: computeTotals(invoiceState),
    };
  }, [state]);
}
