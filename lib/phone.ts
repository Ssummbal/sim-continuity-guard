const SAUDI_MOBILE = /^5\d{8}$/;

export function normalizeSaudiPhone(raw: string): string | null {
  let digits = raw.replace(/\D/g, "");

  if (digits.startsWith("00966")) {
    digits = digits.slice(2);
  }

  if (digits.startsWith("966")) {
    digits = digits.slice(3);
  } else if (digits.startsWith("0")) {
    digits = digits.slice(1);
  }

  if (!SAUDI_MOBILE.test(digits)) {
    return null;
  }

  return `+966${digits}`;
}

export function formatSaudiPhone(raw: string): string {
  const normalized = normalizeSaudiPhone(raw);

  if (!normalized) {
    return raw;
  }

  const local = normalized.slice(4);
  return `+966 ${local.slice(0, 2)} ${local.slice(2, 5)} ${local.slice(5)}`;
}
