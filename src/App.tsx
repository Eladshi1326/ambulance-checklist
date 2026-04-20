import { useEffect, useMemo, useState } from 'react'
import { sections, allItemIds, type ChecklistItem } from './data'

const STORAGE_KEY = 'ambulance-checklist-v1'

function loadState(): Record<string, boolean> {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return {}
    return JSON.parse(raw)
  } catch {
    return {}
  }
}

function saveState(state: Record<string, boolean>) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
  } catch {
    // ignore
  }
}

export default function App() {
  const [checked, setChecked] = useState<Record<string, boolean>>(() => loadState())
  const [openSections, setOpenSections] = useState<Record<number, boolean>>(() =>
    Object.fromEntries(sections.map((s) => [s.id, true])),
  )

  useEffect(() => {
    saveState(checked)
  }, [checked])

  const totalItems = allItemIds.length
  const checkedCount = useMemo(
    () => allItemIds.filter((id) => checked[id]).length,
    [checked],
  )
  const percentage = totalItems === 0 ? 0 : Math.round((checkedCount / totalItems) * 100)

  const sectionStats = useMemo(() => {
    const map: Record<number, { done: number; total: number }> = {}
    for (const s of sections) {
      const ids = s.items
        ? s.items.map((i) => i.id)
        : s.groups
          ? s.groups.flatMap((g) => g.items.map((i) => i.id))
          : []
      map[s.id] = {
        done: ids.filter((id) => checked[id]).length,
        total: ids.length,
      }
    }
    return map
  }, [checked])

  function toggle(id: string) {
    setChecked((prev) => ({ ...prev, [id]: !prev[id] }))
  }

  function toggleSection(id: number) {
    setOpenSections((prev) => ({ ...prev, [id]: !prev[id] }))
  }

  function resetAll() {
    if (confirm('לאפס את כל הסימונים?')) {
      setChecked({})
    }
  }

  function expandAll(open: boolean) {
    setOpenSections(Object.fromEntries(sections.map((s) => [s.id, open])))
  }

  return (
    <div className="min-h-screen bg-slate-50 pb-24">
      {/* Header */}
      <header className="sticky top-0 z-20 bg-gradient-to-l from-red-700 to-red-600 text-white shadow-lg">
        <div className="mx-auto max-w-3xl px-4 py-4">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/15 text-2xl">
                🚑
              </div>
              <div>
                <h1 className="text-xl font-bold leading-tight sm:text-2xl">בדיקת אמבולנס</h1>
                <p className="text-xs text-red-100 sm:text-sm">
                  {checkedCount} מתוך {totalItems} פריטים נבדקו
                </p>
              </div>
            </div>
            <button
              onClick={resetAll}
              className="rounded-lg bg-white/15 px-3 py-2 text-sm font-medium transition hover:bg-white/25 active:bg-white/30"
            >
              איפוס
            </button>
          </div>

          {/* Progress bar */}
          <div className="mt-3">
            <div className="h-2.5 w-full overflow-hidden rounded-full bg-red-900/40">
              <div
                className="h-full rounded-full bg-white transition-all duration-300"
                style={{ width: `${percentage}%` }}
              />
            </div>
            <div className="mt-1 text-left text-xs font-medium text-red-100">{percentage}%</div>
          </div>
        </div>
      </header>

      {/* Expand/Collapse buttons */}
      <div className="mx-auto flex max-w-3xl items-center justify-end gap-2 px-4 pt-4">
        <button
          onClick={() => expandAll(true)}
          className="rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 shadow-sm transition hover:bg-slate-100"
        >
          פתח הכל
        </button>
        <button
          onClick={() => expandAll(false)}
          className="rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 shadow-sm transition hover:bg-slate-100"
        >
          סגור הכל
        </button>
      </div>

      {/* Sections */}
      <main className="mx-auto max-w-3xl space-y-3 px-4 pt-4">
        {sections.map((section) => {
          const stat = sectionStats[section.id]
          const isComplete = stat.total > 0 && stat.done === stat.total
          const isOpen = openSections[section.id]

          return (
            <section
              key={section.id}
              className={`overflow-hidden rounded-2xl border bg-white shadow-sm transition ${
                isComplete ? 'border-emerald-300' : 'border-slate-200'
              }`}
            >
              <button
                onClick={() => toggleSection(section.id)}
                className="flex w-full items-center justify-between gap-3 p-4 text-right"
              >
                <div className="flex items-center gap-3">
                  <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 text-xl">
                    {section.icon}
                  </span>
                  <div>
                    <h2 className="flex items-center gap-2 text-base font-bold text-slate-900 sm:text-lg">
                      <span className="text-xs text-slate-400">#{section.id}</span>
                      {section.title}
                      {isComplete && <span className="text-emerald-600">✓</span>}
                    </h2>
                    <p className="text-xs text-slate-500">
                      {stat.done} / {stat.total} פריטים
                    </p>
                  </div>
                </div>
                <svg
                  className={`h-5 w-5 shrink-0 text-slate-400 transition-transform ${isOpen ? 'rotate-180' : ''}`}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {isOpen && (
                <div className="border-t border-slate-100 p-3 sm:p-4">
                  {section.items && (
                    <ul className="space-y-1">
                      {section.items.map((item) => (
                        <Row
                          key={item.id}
                          item={item}
                          checked={!!checked[item.id]}
                          onToggle={() => toggle(item.id)}
                        />
                      ))}
                    </ul>
                  )}
                  {section.groups &&
                    section.groups.map((group, gi) => (
                      <div key={gi} className={gi > 0 ? 'mt-4' : ''}>
                        <h3 className="mb-2 text-sm font-semibold text-red-700">{group.title}</h3>
                        <ul className="space-y-1">
                          {group.items.map((item) => (
                            <Row
                              key={item.id}
                              item={item}
                              checked={!!checked[item.id]}
                              onToggle={() => toggle(item.id)}
                            />
                          ))}
                        </ul>
                      </div>
                    ))}
                </div>
              )}
            </section>
          )
        })}
      </main>

      <footer className="mx-auto mt-10 max-w-3xl px-4 text-center text-xs text-slate-400">
        נשמר אוטומטית בדפדפן • ניתן לאפס בלחיצה על "איפוס"
      </footer>
    </div>
  )
}

function Row({
  item,
  checked,
  onToggle,
}: {
  item: ChecklistItem
  checked: boolean
  onToggle: () => void
}) {
  return (
    <li>
      <label
        className={`flex cursor-pointer items-start gap-3 rounded-xl p-2.5 transition active:bg-slate-100 sm:hover:bg-slate-50 ${
          checked ? 'opacity-60' : ''
        }`}
      >
        <input
          type="checkbox"
          className="mt-1 h-5 w-5 shrink-0 cursor-pointer rounded border-slate-300"
          checked={checked}
          onChange={onToggle}
        />
        <div className="flex-1">
          <div
            className={`text-[15px] leading-snug text-slate-900 sm:text-base ${
              checked ? 'line-through decoration-slate-400' : ''
            }`}
          >
            {item.label}
          </div>
          {item.hint && (
            <div className="mt-0.5 text-xs text-slate-500 sm:text-sm">{item.hint}</div>
          )}
        </div>
      </label>
    </li>
  )
}
