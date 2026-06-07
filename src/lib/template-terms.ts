import type { TemplateId } from "@/types/invoice";

const TEMPLATE_TERMS: Record<TemplateId, string> = {
  classic: `Payment is due within the agreed period stated on this invoice. Late payments may incur interest at the prevailing rate. Goods remain the property of the seller until paid in full. All amounts are quoted in the currency shown unless otherwise agreed in writing.`,
  professional: `Please reference the invoice number on all payments. Payment terms apply from the invoice date. Disputes must be raised within 7 business days of receipt. Bank charges are for the payer's account unless agreed otherwise.`,
  corporate: `This invoice constitutes a formal demand for payment in accordance with the payment terms stated herein. Value-added tax (VAT) is included in the amounts shown where applicable. All electronic funds transfer (EFT) payments must quote this invoice number as the payment reference. Without prejudice to any other right or remedy available at law, the Supplier reserves the right to suspend the provision of services in respect of any account on which amounts remain overdue.`,
  modern: `Payment is due by the date shown above. Please include the invoice number as your payment reference. If you have any questions about this invoice, contact us before the due date.`,
  minimal: `Payment terms apply from the invoice date. Quote the invoice number on all remittances. Disputes must be notified in writing within 7 business days of receipt.`,
  executive: `This invoice is payable in accordance with the stated payment terms. VAT is included where applicable. EFT payments must reference this invoice number. The supplier may suspend services on overdue accounts without prejudice to other remedies at law.`,
};

export function getDisplayTerms(
  templateId: TemplateId,
  userTerms: string,
): string {
  const base = TEMPLATE_TERMS[templateId];
  const trimmed = userTerms.trim();
  if (!trimmed) return base;
  return `${base}\n\n${trimmed}`;
}
