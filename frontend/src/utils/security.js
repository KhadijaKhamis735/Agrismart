export const sanitizeText = (value) => String(value || "").replace(/[<>`]/g, "").trim();

export const passwordStrength = (password) => {
  const value = String(password || "");
  let score = 0;

  if (value.length >= 8) score += 1;
  if (/[A-Z]/.test(value) && /[a-z]/.test(value)) score += 1;
  if (/\d/.test(value)) score += 1;
  if (/[^A-Za-z0-9]/.test(value)) score += 1;

  const labels = ["Very weak", "Weak", "Fair", "Strong", "Very strong"];
  const colors = ["bg-red-500", "bg-orange-500", "bg-yellow-500", "bg-green-500", "bg-emerald-600"];

  return {
    score,
    percent: (score / 4) * 100,
    label: labels[score],
    color: colors[score],
  };
};
