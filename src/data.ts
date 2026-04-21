// נתוני הצ'קליסט לבדיקת אמבולנס
// הנתונים נלקחו בדיוק מהרשימה של המשתמש, מאורגנים לפי קטגוריות ותתי־קטגוריות
// כל פריט מקבל id ייחודי כדי לשמור את מצב הסימון ב-localStorage
//
// שדה missing מגדיר איזה מידע מוצג כשמסמנים פריט כחסר:
//  - count: כמה יחידות חסרות מתוך X
//  - sizes: אילו מידות חסרות
//  - subitems: אילו תתי־פריטים חסרים
//  - validity: חסר / פג תוקף / אריזה פגומה
//  - pressure: לחץ נמוך / מיכל ריק
//  - אם לא מוגדר → 'simple' (סתם חסר בלי פרטים)

export type MissingSpec =
  | { kind: 'count'; required: number }
  | { kind: 'sizes'; sizes: string[] }
  | { kind: 'subitems'; items: { id: string; label: string; count?: number }[] }
  | { kind: 'validity' }
  | { kind: 'pressure' }

export type ChecklistItem = {
  id: string
  label: string
  hint?: string
  missing?: MissingSpec
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
      { id: '1-2', label: 'רצועות לקיבוע', hint: '3–6 יחידות', missing: { kind: 'count', required: 6 } },
      { id: '1-3', label: 'צווארונים למבוגר', hint: '2 יחידות', missing: { kind: 'count', required: 2 } },
      { id: '1-4', label: 'צווארון לילד', hint: '1 יחידה', missing: { kind: 'count', required: 1 } },
      { id: '1-5', label: 'כריות הד וויס עם רצועות בפנים' },
      { id: '1-6', label: 'לוח גב אלומיניום' },
    ],
  },
  {
    id: 2,
    title: 'חמצן גדול',
    icon: '🫁',
    items: [
      { id: '2-1', label: 'בדיקת לחץ במיכל', hint: 'PSI או BAR', missing: { kind: 'pressure' } },
    ],
  },
  {
    id: 3,
    title: 'חמצן קטן + חמצן רזרבי',
    icon: '💨',
    items: [
      { id: '3-1', label: 'בדיקת לחץ במיכלים', hint: 'PSI או BAR', missing: { kind: 'pressure' } },
      { id: '3-2', label: 'מסכות חמצן מבוגר', hint: '2 יחידות', missing: { kind: 'count', required: 2 } },
      { id: '3-3', label: 'מסכת חמצן ילד', hint: '1 יחידה', missing: { kind: 'count', required: 1 } },
      { id: '3-4', label: 'משקפי חמצן מבוגר', hint: '1 יחידה', missing: { kind: 'count', required: 1 } },
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
          {
            id: '5b-1',
            label: 'תיק סוכר',
            hint: '10 סטיקים, 10 דוקרנים, 10 פלסטרים/פדי גזה, גלוקומטר עם סוללה, 2 גלוקוג׳ל בתוקף, 5–10 כדורי אספירין בתוקף',
            missing: {
              kind: 'subitems',
              items: [
                { id: 'stiks', label: 'סטיקים', count: 10 },
                { id: 'dokranim', label: 'דוקרנים', count: 10 },
                { id: 'plasters', label: 'פלסטרים/פדי גזה', count: 10 },
                { id: 'glucometer', label: 'גלוקומטר' },
                { id: 'battery', label: 'סוללה לגלוקומטר' },
                { id: 'glucogel', label: 'גלוקוג׳ל', count: 2 },
                { id: 'aspirin', label: 'כדורי אספירין', count: 10 },
                { id: 'expired', label: 'פג תוקף (גלוקוג׳ל/אספירין)' },
              ],
            },
          },
          { id: '5b-2', label: 'ערכת עירוי', hint: 'בתוקף', missing: { kind: 'validity' } },
          { id: '5b-3', label: 'ת.א', hint: '2 יחידות', missing: { kind: 'count', required: 2 } },
          { id: '5b-4', label: 'תחבושת המוסטטית' },
          { id: '5b-5', label: 'CAT', hint: '1 יחידה', missing: { kind: 'count', required: 1 } },
          { id: '5b-6', label: 'ת.ב', hint: '1 יחידה', missing: { kind: 'count', required: 1 } },
          { id: '5b-7', label: 'משולשי בד', hint: '2 יחידות', missing: { kind: 'count', required: 2 } },
          { id: '5b-8', label: 'חסם עורקים', hint: '1 יחידה', missing: { kind: 'count', required: 1 } },
          { id: '5b-9', label: 'שקיות הקאה', hint: '2 יחידות', missing: { kind: 'count', required: 2 } },
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
          { id: '5c-5', label: 'קטטרים כחולים', hint: '2 יחידות, מידה 8', missing: { kind: 'count', required: 2 } },
          { id: '5c-6', label: 'קטטרים אדומים', hint: '2 יחידות, מידה 18', missing: { kind: 'count', required: 2 } },
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
      { id: '6-6', label: 'מנתבי אוויר שחורים', hint: '2 יחידות', missing: { kind: 'count', required: 2 } },
      { id: '6-7', label: 'מנתבי אוויר תכלת', hint: '2 יחידות (0+00)', missing: { kind: 'count', required: 2 } },
      { id: '6-8', label: 'שמיכת עטיפה ליילוד' },
      { id: '6-9', label: 'קטטר ירוק', hint: '1 יחידה, מידה 6', missing: { kind: 'count', required: 1 } },
      { id: '6-10', label: 'קטטר כחול', hint: '1 יחידה, מידה 8', missing: { kind: 'count', required: 1 } },
    ],
  },
  {
    id: 7,
    title: 'ערכת לידה',
    icon: '🤱',
    items: [
      { id: '7-1', label: 'תוקף', missing: { kind: 'validity' } },
      { id: '7-2', label: 'שלמות האריזה', missing: { kind: 'validity' } },
    ],
  },
  {
    id: 8,
    title: 'תיק חבישה',
    icon: '🩹',
    items: [
      { id: '8-1', label: 'פדי גזה', hint: '10 יחידות', missing: { kind: 'count', required: 10 } },
      { id: '8-2', label: 'פלסטרים', hint: '10 יחידות', missing: { kind: 'count', required: 10 } },
      { id: '8-3', label: 'תחבושות אישיות', hint: '5 יחידות', missing: { kind: 'count', required: 5 } },
      { id: '8-4', label: 'משולשי בד', hint: '5 יחידות', missing: { kind: 'count', required: 5 } },
      { id: '8-5', label: 'חסם עורקים', hint: '2 יחידות', missing: { kind: 'count', required: 2 } },
      { id: '8-6', label: 'תחבושות בינוניות', hint: '2 יחידות', missing: { kind: 'count', required: 2 } },
      { id: '8-7', label: 'סד לקיבוע', hint: '1 יחידה', missing: { kind: 'count', required: 1 } },
      { id: '8-8', label: 'מלע״כ' },
      { id: '8-9', label: 'סביעור', hint: 'בתוקף', missing: { kind: 'validity' } },
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
          { id: '9a-1', label: 'משולשי בד', hint: '5 יחידות', missing: { kind: 'count', required: 5 } },
          { id: '9a-2', label: 'תחבושות אישיות', hint: '2 יחידות', missing: { kind: 'count', required: 2 } },
          { id: '9a-3', label: 'תחבושת בינונית', hint: '1 יחידה', missing: { kind: 'count', required: 1 } },
          { id: '9a-4', label: 'שמיכת הצלה', hint: '1 יחידה', missing: { kind: 'count', required: 1 } },
          { id: '9a-5', label: 'חסם עורקים', hint: '1 יחידה', missing: { kind: 'count', required: 1 } },
          { id: '9a-6', label: 'אשרמן', hint: '1 יחידה', missing: { kind: 'count', required: 1 } },
          { id: '9a-7', label: 'Airway 2, 3, 4' },
          { id: '9a-8', label: 'סכין גילוח' },
          { id: '9a-9', label: 'פדי גזה', hint: '10 יחידות', missing: { kind: 'count', required: 10 } },
          { id: '9a-10', label: 'סביעור', hint: 'בתוקף', missing: { kind: 'validity' } },
          { id: '9a-11', label: 'מיקרופור', hint: '1 יחידה', missing: { kind: 'count', required: 1 } },
          { id: '9a-12', label: 'אמבו תקין + שקית העשרה + מסכת 5,2 + מסנן ויראלי + צינור חמצן' },
          { id: '9a-13', label: 'מרסס לכלור + טבליות כלור', hint: 'לא לפתוח' },
          { id: '9a-14', label: 'ערכת עירוי', missing: { kind: 'validity' } },
          { id: '9a-15', label: 'בקבוקי מים', hint: '2 יחידות × 500 מ״ל', missing: { kind: 'count', required: 2 } },
          { id: '9a-16', label: 'כוסות', hint: '10+-', missing: { kind: 'count', required: 10 } },
          { id: '9a-17', label: 'פח מחטים' },
          { id: '9a-18', label: 'שקית קירור', hint: '1 יחידה', missing: { kind: 'count', required: 1 } },
          { id: '9a-19', label: 'שקיות הקאה', hint: '3 יחידות', missing: { kind: 'count', required: 3 } },
          { id: '9a-20', label: 'מסכות חמצן מבוגר', hint: '5 יחידות', missing: { kind: 'count', required: 5 } },
          { id: '9a-21', label: 'מסכת חמצן ילד', hint: '2 יחידות', missing: { kind: 'count', required: 2 } },
          { id: '9a-22', label: 'משקפי חמצן', hint: '2 יחידות', missing: { kind: 'count', required: 2 } },
          { id: '9a-23', label: 'סדין חד־פעמי לאלונקה', hint: '2 יחידות', missing: { kind: 'count', required: 2 } },
          { id: '9a-24', label: 'שמיכות', hint: '2 יחידות', missing: { kind: 'count', required: 2 } },
          { id: '9a-25', label: 'כרית', hint: '1 יחידה', missing: { kind: 'count', required: 1 } },
          { id: '9a-26', label: 'ציפות חד־פעמיות', hint: '2 יחידות', missing: { kind: 'count', required: 2 } },
          { id: '9a-27', label: 'רולים נייר', hint: '2 יחידות', missing: { kind: 'count', required: 2 } },
          { id: '9a-28', label: 'שקיות אשפה', hint: '5 יחידות', missing: { kind: 'count', required: 5 } },
          { id: '9a-29', label: 'אלכוג׳ל + סבון נוזלי' },
          { id: '9a-30', label: 'כפפות', hint: 'S/M/L/XL', missing: { kind: 'sizes', sizes: ['S', 'M', 'L', 'XL'] } },
        ],
      },
      {
        title: 'מתחת לספסל',
        items: [
          { id: '9b-1', label: 'אלונקת סקופ' },
          { id: '9b-2', label: 'אלונקת סלסלה / כסא פינוי' },
          { id: '9b-3', label: 'מזרון ואקום' },
          { id: '9b-4', label: 'מטפה כיבוי אש', missing: { kind: 'validity' } },
          { id: '9b-5', label: 'גלאי CO' },
        ],
      },
    ],
  },
]

// כל הפריטים בקובץ יחיד (לנוחות חיפוש במצב חוסרים)
export const allItems: ChecklistItem[] = sections.flatMap((s) => {
  if (s.items) return s.items
  if (s.groups) return s.groups.flatMap((g) => g.items)
  return []
})

export const allItemIds: string[] = allItems.map((i) => i.id)

export const itemById: Record<string, ChecklistItem> = Object.fromEntries(
  allItems.map((i) => [i.id, i])
)
