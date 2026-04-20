// נתוני הצ'קליסט לבדיקת אמבולנס
// הנתונים נלקחו בדיוק מהרשימה של המשתמש, מאורגנים לפי קטגוריות ותתי־קטגוריות
// כל פריט מקבל id ייחודי כדי לשמור את מצב הסימון ב-localStorage

export type ChecklistItem = {
  id: string
  label: string
  hint?: string // הבהרה/כמות/תוקף
}

export type SubGroup = {
  title: string
  items: ChecklistItem[]
}

export type Section = {
  id: number
  title: string
  icon: string
  items?: ChecklistItem[]
  groups?: SubGroup[]
}

export const sections: Section[] = [
  {
    id: 1,
    title: 'קרש גב',
    icon: '🦴',
    items: [
      { id: '1-1', label: 'קרש גב + מנייח להאד וויס' },
      { id: '1-2', label: 'רצועות לקיבוע', hint: '3–6 יחידות' },
      { id: '1-3', label: 'צווארונים למבוגר', hint: '2 יחידות' },
      { id: '1-4', label: 'צווארון לילד', hint: '1 יחידה' },
      { id: '1-5', label: 'כריות הד וויס עם רצועות בפנים' },
      { id: '1-6', label: 'לוח גב אלומיניום' },
    ],
  },
  {
    id: 2,
    title: 'חמצן גדול',
    icon: '🫁',
    items: [
      { id: '2-1', label: 'בדיקת לחץ במיכל', hint: 'PSI או BAR' },
    ],
  },
  {
    id: 3,
    title: 'חמצן קטן + חמצן רזרבי',
    icon: '💨',
    items: [
      { id: '3-1', label: 'בדיקת לחץ במיכלים', hint: 'PSI או BAR' },
      { id: '3-2', label: 'מסכות חמצן מבוגר', hint: '2 יחידות' },
      { id: '3-3', label: 'מסכת חמצן ילד', hint: '1 יחידה' },
      { id: '3-4', label: 'משקפי חמצן מבוגר', hint: '1 יחידה' },
    ],
  },
  {
    id: 4,
    title: 'דפי + מוניטור',
    icon: '📟',
    items: [
      { id: '4-1', label: 'תקינות המכשיר' },
      { id: '4-2', label: 'סוללה' },
      { id: '4-3', label: 'מדבקות רזרביות' },
      { id: '4-4', label: 'סכין גילוח' },
    ],
  },
  {
    id: 5,
    title: 'תיק אמבו',
    icon: '🎒',
    groups: [
      {
        title: 'תא גדול',
        items: [
          { id: '5a-1', label: 'תיק מדל״ד' },
          { id: '5a-2', label: 'אמבו' },
          { id: '5a-3', label: 'שקית העשרה' },
          { id: '5a-4', label: 'צינור לחמצן' },
          { id: '5a-5', label: 'מסכה 5' },
          { id: '5a-6', label: 'מסכה 2' },
          { id: '5a-7', label: 'מסנן ויראלי' },
          { id: '5a-8', label: 'פח מחטים' },
          { id: '5a-9', label: 'סקשן' },
        ],
      },
      {
        title: 'תא אמצעי',
        items: [
          { id: '5b-1', label: 'תיק סוכר', hint: '10 סטיקים, 10 דוקרנים, 10 פלסטרים/פדי גזה, גלוקומטר עם סוללה, 2 גלוקוג׳ל בתוקף, 5–10 כדורי אספירין בתוקף' },
          { id: '5b-2', label: 'ערכת עירוי', hint: 'בתוקף' },
          { id: '5b-3', label: 'ת.א', hint: '2 יחידות' },
          { id: '5b-4', label: 'תחבושת המוסטטית' },
          { id: '5b-5', label: 'CAT', hint: '1 יחידה' },
          { id: '5b-6', label: 'ת.ב', hint: '1 יחידה' },
          { id: '5b-7', label: 'משולשי בד', hint: '2 יחידות' },
          { id: '5b-8', label: 'חסם עורקים', hint: '1 יחידה' },
          { id: '5b-9', label: 'שקיות הקאה', hint: '2 יחידות' },
          { id: '5b-10', label: 'אשרמן' },
          { id: '5b-11', label: 'מזרק אפיפן' },
        ],
      },
      {
        title: 'תא קטן',
        items: [
          { id: '5c-1', label: 'Airway 1', hint: 'אדום' },
          { id: '5c-2', label: 'Airway 2', hint: 'כתום' },
          { id: '5c-3', label: 'Airway 3', hint: 'ירוק' },
          { id: '5c-4', label: 'Airway 4', hint: 'לבן' },
          { id: '5c-5', label: 'קטטרים כחולים', hint: '2 יחידות, מידה 8' },
          { id: '5c-6', label: 'קטטרים אדומים', hint: '2 יחידות, מידה 18' },
        ],
      },
    ],
  },
  {
    id: 6,
    title: 'תיק אמבו בייבי',
    icon: '👶',
    items: [
      { id: '6-1', label: 'אמבו ילדים' },
      { id: '6-2', label: 'שרוול לחץ דם לילדים' },
      { id: '6-3', label: 'מסכת הנשמה 0' },
      { id: '6-4', label: 'מסנן ויראלי' },
      { id: '6-5', label: 'מזרק אפיפן ילדים' },
      { id: '6-6', label: 'מנתבי אוויר שחורים', hint: '2 יחידות' },
      { id: '6-7', label: 'מנתבי אוויר תכלת', hint: '2 יחידות (0+00)' },
      { id: '6-8', label: 'שמיכת עטיפה ליילוד' },
      { id: '6-9', label: 'קטטר ירוק', hint: '1 יחידה, מידה 6' },
      { id: '6-10', label: 'קטטר כחול', hint: '1 יחידה, מידה 8' },
    ],
  },
  {
    id: 7,
    title: 'ערכת לידה',
    icon: '🤱',
    items: [
      { id: '7-1', label: 'תוקף' },
      { id: '7-2', label: 'שלמות האריזה' },
    ],
  },
  {
    id: 8,
    title: 'תיק חבישה',
    icon: '🩹',
    items: [
      { id: '8-1', label: 'פדי גזה', hint: '10 יחידות' },
      { id: '8-2', label: 'פלסטרים', hint: '10 יחידות' },
      { id: '8-3', label: 'תחבושות אישיות', hint: '5 יחידות' },
      { id: '8-4', label: 'משולשי בד', hint: '5 יחידות' },
      { id: '8-5', label: 'חסם עורקים', hint: '2 יחידות' },
      { id: '8-6', label: 'תחבושות בינוניות', hint: '2 יחידות' },
      { id: '8-7', label: 'סד לקיבוע', hint: '1 יחידה' },
      { id: '8-8', label: 'מלע״כ' },
      { id: '8-9', label: 'סביעור', hint: 'בתוקף' },
      { id: '8-10', label: 'מיקרופור' },
    ],
  },
  {
    id: 9,
    title: 'תאים + מתחת לספסל',
    icon: '📦',
    groups: [
      {
        title: 'בתאים (בכללי)',
        items: [
          { id: '9a-1', label: 'משולשי בד', hint: '5 יחידות' },
          { id: '9a-2', label: 'תחבושות אישיות', hint: '2 יחידות' },
          { id: '9a-3', label: 'תחבושת בינונית', hint: '1 יחידה' },
          { id: '9a-4', label: 'שמיכת הצלה', hint: '1 יחידה' },
          { id: '9a-5', label: 'חסם עורקים', hint: '1 יחידה' },
          { id: '9a-6', label: 'אשרמן', hint: '1 יחידה' },
          { id: '9a-7', label: 'Airway 2, 3, 4' },
          { id: '9a-8', label: 'סכין גילוח' },
          { id: '9a-9', label: 'פדי גזה', hint: '10 יחידות' },
          { id: '9a-10', label: 'סביעור', hint: 'בתוקף' },
          { id: '9a-11', label: 'מיקרופור', hint: '1 יחידה' },
          { id: '9a-12', label: 'אמבו תקין + שקית העשרה + מסכת 5,2 + מסנן ויראלי + צינור חמצן' },
          { id: '9a-13', label: 'מרסס לכלור + טבליות כלור', hint: 'לא לפתוח' },
          { id: '9a-14', label: 'ערכת עירוי' },
          { id: '9a-15', label: 'בקבוקי מים', hint: '2 יחידות × 500 מ״ל' },
          { id: '9a-16', label: 'כוסות', hint: '10+-' },
          { id: '9a-17', label: 'פח מחטים' },
          { id: '9a-18', label: 'שקית קירור', hint: '1 יחידה' },
          { id: '9a-19', label: 'שקיות הקאה', hint: '3 יחידות' },
          { id: '9a-20', label: 'מסכות חמצן מבוגר', hint: '5 יחידות' },
          { id: '9a-21', label: 'מסכות חמצן ילד', hint: '2 יחידות' },
          { id: '9a-22', label: 'משקפי חמצן', hint: '5 יחידות' },
          { id: '9a-23', label: 'מסכות FFP3', hint: '6 יחידות (בשאיפת עשן)' },
          { id: '9a-24', label: 'מגבוני אלכוהול' },
          { id: '9a-25', label: 'ספטול' },
          { id: '9a-26', label: 'סדינים חד״פ', hint: '10 יחידות' },
          { id: '9a-27', label: 'שקיות זבל', hint: '10 יחידות' },
          { id: '9a-28', label: 'אפודים זוהרים לנוער', hint: '3 יחידות' },
          { id: '9a-29', label: 'אפודים זוהרים לחובש', hint: '2 יחידות' },
          { id: '9a-30', label: 'כפפות', hint: 'S, M, L, XL' },
          { id: '9a-31', label: 'פנס' },
          { id: '9a-32', label: 'תגי מיון אר״ן', hint: '15 יחידות' },
          { id: '9a-33', label: 'פח זבל' },
          { id: '9a-34', label: 'שק לחללים' },
          { id: '9a-35', label: 'שק לחלקי גוף' },
          { id: '9a-36', label: 'תיק טפסים', hint: 'בדלת של האמבולנס' },
        ],
      },
      {
        title: 'מתחת לספסל',
        items: [
          { id: '9b-1', label: 'תיקים סגורים (פלומבה)', hint: '2 יחידות' },
          { id: '9b-2', label: 'קסדות מגן', hint: '2 יחידות' },
          { id: '9b-3', label: 'אפודי מגן', hint: '2 יחידות' },
          { id: '9b-4', label: 'בקבוק לשתן' },
          { id: '9b-5', label: 'סיר לילה' },
          { id: '9b-6', label: 'שמיכה' },
          { id: '9b-7', label: 'תיק למיגון נגיפי' },
        ],
      },
    ],
  },
]

export const allItemIds: string[] = sections.flatMap((s) => {
  if (s.items) return s.items.map((i) => i.id)
  if (s.groups) return s.groups.flatMap((g) => g.items.map((i) => i.id))
  return []
})
