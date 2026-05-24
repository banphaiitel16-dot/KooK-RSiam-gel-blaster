export const GUN_SUBCATEGORIES = ["ปืนพก", "ปืนไรเฟิลจู่โจม", "ลูกซอง", "ปืนกลมือ"];

export const ACCESSORY_SUBCATEGORIES = [
  "กริปมือจับ",
  "ขาทราย",
  "ศูนย์เล็ง",
  "ด้ามจับปืน",
  "เลเซอร์",
  "ไฟฉาย",
  "แม็กกาซีน",
  "อะไหล่ภายในปืน",
  "ปากกระบอกปืนแต่ง",
];

export const BATTERY_SUBCATEGORIES = ["แบต 7.4v", "แบต 11.1v", "สายชาร์จ"];

export const GEL_BALL_SUBCATEGORIES = ["แบบมาตรฐาน", "แบบแข็ง"];

export const getCategoryPrefix = (category: string) => {
  if (category === "ปืนเจลไฟฟ้า" || GUN_SUBCATEGORIES.includes(category)) return "GB";
  if (category === "อุปกรณ์เสริม" || ACCESSORY_SUBCATEGORIES.includes(category)) return "ACC";
  if (category === "ชุดที่ชาร์จและแบตเตอรี่" || BATTERY_SUBCATEGORIES.includes(category)) return "BAT";
  if (category === "ลูกกระสุนเจล" || GEL_BALL_SUBCATEGORIES.includes(category)) return "GEL";
  return "GB";
};

export const generateNextProductId = (category: string, existingProducts: any[]) => {
  const prefix = getCategoryPrefix(category);
  const existingIds = existingProducts
    .map(p => p.id)
    .filter(id => id.toUpperCase().startsWith(`${prefix}-`))
    .map(id => parseInt(id.split('-')[1]) || 0);

  const maxId = existingIds.length > 0 ? Math.max(...existingIds) : 0;
  return `${prefix}-${(maxId + 1).toString().padStart(3, "0")}`;
};

export const checkIsAdmin = (email: string | null | undefined) => {
  if (!email) return false;
  const e = email.toLowerCase();
  return (
    e === "admin@kook.com" ||
    e === "assistant@kook.com"
  );
};
