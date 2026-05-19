export const formatMoney = (amount = 0) =>
  `${new Intl.NumberFormat('uz-UZ', {
    maximumFractionDigits: 0,
  }).format(Number(amount) || 0)} so'm`;

export const classNames = (...classes) => classes.filter(Boolean).join(' ');

export const todayISO = () => new Date().toISOString().slice(0, 10);
