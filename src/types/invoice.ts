export type TemplateId = "classic" | "professional" | "corporate";

export type LineItem = {
  id: string;
  name: string;
  description: string;
  quantity: number;
  rate: number;
};

export type InvoiceState = {
  templateId: TemplateId;
  currencyCode: string;
  accentColor: string;
  pageColor: string;

  logoDataUrl: string | null;
  logoFileName: string | null;
  bbbeeLevel: string;
  companyName: string;
  companyAddress: string;
  companyEmail: string;
  companyPhone: string;
  taxId: string;
  registrationNumber: string;
  businessNumber: string;
  bankName: string;
  sortCode: string;
  accountNumber: string;
  showAdditionalBusinessDetails: boolean;

  billTo: string;
  shipTo: string;

  invoiceTitle: string;
  invoiceNumber: string;
  invoiceDate: string;
  dueDate: string;
  paymentTerms: string;
  poNumber: string;

  lineItems: LineItem[];

  taxRate: number;
  taxEnabled: boolean;
  discountAmount: number;
  discountEnabled: boolean;
  discountIsPercent: boolean;
  shippingAmount: number;
  shippingEnabled: boolean;
  amountPaid: number;

  notes: string;
  terms: string;
  signatureDataUrl: string | null;
  photos: string[];
};

export type InvoiceTotals = {
  subtotal: number;
  taxAmount: number;
  discountValue: number;
  shippingValue: number;
  total: number;
  balanceDue: number;
};

export type InvoiceTemplateData = InvoiceState & {
  currencySymbol: string;
  totals: InvoiceTotals;
};
