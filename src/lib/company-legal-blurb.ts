export const ORRBIT_LEGAL_NAME = "Orrbit Systems";

export type OrrbitLegalBlurbInput = {
  taxId: string;
  bbbeeLevel: string;
  registrationNumber: string;
  companyEmail: string;
  companyPhone: string;
};

function contactClause(email: string, phone: string): string | null {
  const trimmedEmail = email.trim();
  const trimmedPhone = phone.trim();
  if (trimmedEmail && trimmedPhone) {
    return `Enquiries may be directed to ${trimmedEmail} or ${trimmedPhone}.`;
  }
  if (trimmedEmail) {
    return `Enquiries may be directed to ${trimmedEmail}.`;
  }
  if (trimmedPhone) {
    return `Enquiries may be directed to ${trimmedPhone}.`;
  }
  return null;
}

export function getOrrbitLegalBlurb(data: OrrbitLegalBlurbInput): string {
  const sentences: string[] = [
    `${ORRBIT_LEGAL_NAME} is a technology services provider duly incorporated and operating in the Republic of South Africa.`,
  ];

  const taxId = data.taxId.trim();
  if (taxId) {
    sentences.push(
      `It is registered for value-added tax under registration number ${taxId}.`,
    );
  }

  const bbbeeLevel = data.bbbeeLevel.trim();
  if (bbbeeLevel) {
    sentences.push(
      `Broad-Based Black Economic Empowerment (B-BBEE) contributor status: ${bbbeeLevel}.`,
    );
  }

  const registrationNumber = data.registrationNumber.trim();
  if (registrationNumber) {
    sentences.push(
      `It is registered with the Companies and Intellectual Property Commission under company registration number ${registrationNumber}.`,
    );
  }

  const contact = contactClause(data.companyEmail, data.companyPhone);
  if (contact) {
    sentences.push(contact);
  }

  sentences.push(
    `${ORRBIT_LEGAL_NAME} conducts its business in compliance with the laws and applicable regulations of the Republic of South Africa.`,
  );

  return sentences.join(" ");
}
