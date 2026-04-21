import { useEffect, useMemo, useState } from 'react'
import {
  sections,
  allItems,
  itemById,
  type ChecklistItem,
  type MissingSpec,
} from './data'

const STORAGE_KEY = 'ambulance-checklist-v2'

type Status = 'ok' | 'missing'

// פרטי חוסר לכל פריט — גמיש לפי סוג ה-MissingSpec
type MissingDetails = {
  // לפריטי count: כמה חסר (מתוך required)
  missingCount?: number
  // לפריטי sizes: אילו מידות חסרות (מערך)
  missingSizes?: string[]
  // לפריטי subitems: אילו תתי־פריטים חסרים (מערך של ids)
  missingSubitems?: string[]
  // לפריטי validity: סיבה ('חסר לגמרי' / 'פג תוקף' / 'אריזה פגומה/פתוחה')
  validityReason?: string
  // לפריטי pressure: סיבה ('לחץ נמוך' / 'מיכל ריק' / 'תקלה בווסת')
  pressureReason?: string
  // לפריטים ללא spec — סיבה מהירה (חסר / שבור / פג תוקף / אריזה פתוחה / אחר)
  generalReason?: string
  // הערה חופשית — פתוח רק כשלוחצים "אחר"
  note?: string
  // סומן כהשלמתי אחרי שהוחזר
  done?: boolean
}

type State = {
  status: Record<string, Status>
  details: Record<string, MissingDetails>
}

type View = 'all' | 'missing'

const emptyState: State = { status: {}, details: {} }

function loadState(): State {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return emptyState
    const parsed = JSON.parse(raw)
    if (parsed && typeof parsed === 'object') {
      return {
        status: parsed.status ?? {},
        details: parsed.details ?? {},
      }
    }
  } catch {
    // ignore
  }
  return emptyState
}

function saveState(state: State) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
  } catch {
    // ignore quota errors
  }
}

export default function App() {
  const [state, setState] = useState<State>(() => loadState())
  const [view, setView] = useState<View>('all')

  useEffect(() => {
    saveState(state)
  }, [state])

  const setStatus = (id: string, next: Status | undefined) => {
    setState((prev) => {
      const status = { ...prev.status }
      const details = { ...prev.details }
      if (next === undefined) {
        delete status[id]
        delete details[id]
      } else {
        status[id] = next
        if (next === 'ok') {
          delete details[id]
        } else if (next === 'missing' && !details[id]) {
          details[id] = {}
        }
      }
      return { status, details }
    })
  }

  const setDetails = (id: string, patch: Partial<MissingDetails>) => {
    setState((prev) => ({
      ...prev,
      details: {
        ...prev.details,
        [id]: { ...(prev.details[id] ?? {}), ...patch },
      },
    }))
  }

  const resetAll = () => {
    if (confirm('לאפס את כל הסימונים?')) {
      setState(emptyState)
    }
  }

  const counts = useMemo(() => {
    let ok = 0
    let missing = 0
    let missingOpen = 0
    for (const id of Object.keys(state.status)) {
      if (state.status[id] === 'ok') ok++
      else if (state.status[id] === 'missing') {
        missing++
        if (!state.details[id]?.done) missingOpen++
      }
    }
    return { ok, missing, missingOpen, total: allItems.length }
  }, [state])

  const progress = Math.round(((counts.ok + counts.missing) / counts.total) * 100)

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900" dir="rtl">
      <header className="sticky top-0 z-10 bg-white/95 backdrop-blur border-b border-slate-200">
        <div className="max-w-3xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between gap-3 flex-wrap">
            <div className="flex items-center gap-3">
              <span className="text-3xl">🚑</span>
              <div>
                <h1 className="text-lg md:text-xl font-bold leading-tight">בדיקת אמבולנס</h1>
                <p className="text-xs text-slate-500">
                  {counts.ok + counts.missing}/{counts.total} נבדקו · {counts.ok} תקין · {counts.missingOpen} חסרים פתוחים
                </p>
              </div>
            </div>
            <button
              onClick={resetAll}
              className="text-xs px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 transition"
            >
              איפוס
            </button>
          </div>

          <div className="mt-2 h-1.5 bg-slate-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-emerald-500 transition-all"
              style={{ width: `${progress}%` }}
            />
          </div>

          <div className="mt-3 flex gap-2">
            <button
              onClick={() => setView('all')}
              className={
                'flex-1 px-3 py-2 rounded-lg text-sm font-medium transition ' +
                (view === 'all'
                  ? 'bg-slate-900 text-white'
                  : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-100')
              }
            >
              כל הפריטים
            </button>
            <button
              onClick={() => setView('missing')}
              className={
                'flex-1 px-3 py-2 rounded-lg text-sm font-medium transition flex items-center justify-center gap-2 ' +
                (view === 'missing'
                  ? 'bg-rose-600 text-white'
                  : 'bg-white border border-rose-200 text-rose-700 hover:bg-rose-50')
              }
            >
              <span>חוסרים</span>
              <span
                className={
                  'inline-flex items-center justify-center min-w-[1.5rem] h-6 px-1.5 text-xs font-bold rounded-full ' +
                  (view === 'missing' ? 'bg-white text-rose-600' : 'bg-rose-600 text-white')
                }
              >
                {counts.missingOpen}
              </span>
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 py-4">
        {view === 'all' ? (
          <AllView state={state} setStatus={setStatus} setDetails={setDetails} />
        ) : (
          <MissingView state={state} setStatus={setStatus} setDetails={setDetails} />
        )}
      </main>

      <footer className="max-w-3xl mx-auto px-4 py-6 text-center text-xs text-slate-400">
        הנתונים נשמרים בדפדפן בלבד (localStorage)
      </footer>
    </div>
  )
}

// ---------- All items view ----------

function AllView({
  state,
  setStatus,
  setDetails,
}: {
  state: State
  setStatus: (id: string, next: Status | undefined) => void
  setDetails: (id: string, patch: Partial<MissingDetails>) => void
}) {
  return (
    <div className="space-y-4">
      {sections.map((section) => {
        const sectionItemIds: string[] = section.items
          ? section.items.map((i) => i.id)
          : (section.groups ?? []).flatMap((g) => g.items.map((i) => i.id))
        const hasMissing = sectionItemIds.some(
          (id) => state.status[id] === 'missing' && !state.details[id]?.done
        )
        return (
          <section
            key={section.id}
            className={
              'bg-white rounded-2xl border shadow-sm overflow-hidden ' +
              (hasMissing ? 'border-rose-300' : 'border-slate-200')
            }
          >
            <div
              className={
                'px-4 py-3 border-b flex items-center gap-2 ' +
                (hasMissing
                  ? 'bg-rose-50 border-rose-200'
                  : 'bg-slate-50 border-slate-200')
              }
            >
              <span className="text-xl">{section.icon}</span>
              <h2 className="font-semibold">
                <span className="text-slate-400 ms-1">{section.id}.</span>
                {section.title}
              </h2>
            </div>

            {section.items && (
              <ul className="divide-y divide-slate-100">
                {section.items.map((item) => (
                  <Row
                    key={item.id}
                    item={item}
                    state={state}
                    setStatus={setStatus}
                    setDetails={setDetails}
                  />
                ))}
              </ul>
            )}

            {section.groups?.map((group) => (
              <div key={group.title}>
                <div className="px-4 py-2 bg-slate-50/60 border-b border-slate-100">
                  <h3 className="text-sm font-medium text-slate-700">{group.title}</h3>
                </div>
                <ul className="divide-y divide-slate-100">
                  {group.items.map((item) => (
                    <Row
                      key={item.id}
                      item={item}
                      state={state}
                      setStatus={setStatus}
                      setDetails={setDetails}
                    />
                  ))}
                </ul>
              </div>
            ))}
          </section>
        )
      })}
    </div>
  )
}

// ---------- Missing-only view ----------

function MissingView({
  state,
  setStatus,
  setDetails,
}: {
  state: State
  setStatus: (id: string, next: Status | undefined) => void
  setDetails: (id: string, patch: Partial<MissingDetails>) => void
}) {
  const missingIds = Object.keys(state.status).filter(
    (id) => state.status[id] === 'missing'
  )

  if (missingIds.length === 0) {
    return (
      <div className="bg-white rounded-2xl border border-slate-200 p-8 text-center">
        <div className="text-4xl mb-3">✅</div>
        <div className="font-semibold">אין חוסרים</div>
        <div className="text-sm text-slate-500 mt-1">כל הפריטים שסימנת תקינים</div>
      </div>
    )
  }

  const open = missingIds.filter((id) => !state.details[id]?.done)
  const done = missingIds.filter((id) => state.details[id]?.done)

  return (
    <div className="space-y-4">
      {open.length > 0 && (
        <div className="space-y-3">
          <div className="text-sm font-semibold text-rose-700">
            חוסרים להשלמה ({open.length})
          </div>
          {open.map((id) => (
            <MissingCard
              key={id}
              item={itemById[id]}
              state={state}
              setStatus={setStatus}
              setDetails={setDetails}
            />
          ))}
        </div>
      )}

      {done.length > 0 && (
        <div className="space-y-3">
          <div className="text-sm font-semibold text-emerald-700">
            הושלמו ({done.length})
          </div>
          {done.map((id) => (
            <MissingCard
              key={id}
              item={itemById[id]}
              state={state}
              setStatus={setStatus}
              setDetails={setDetails}
            />
          ))}
        </div>
      )}
    </div>
  )
}

function MissingCard({
  item,
  state,
  setStatus,
  setDetails,
}: {
  item: ChecklistItem | undefined
  state: State
  setStatus: (id: string, next: Status | undefined) => void
  setDetails: (id: string, patch: Partial<MissingDetails>) => void
}) {
  if (!item) return null
  const details = state.details[item.id] ?? {}
  const done = !!details.done

  return (
    <div
      className={
        'bg-white rounded-2xl border shadow-sm overflow-hidden ' +
        (done ? 'border-emerald-200' : 'border-rose-200')
      }
    >
      <div className="px-4 py-3 flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <div className={'font-semibold ' + (done ? 'line-through text-slate-400' : '')}>
            {item.label}
          </div>
          {item.hint && (
            <div className="text-xs text-slate-500 mt-0.5">{item.hint}</div>
          )}
        </div>
        <button
          onClick={() => setDetails(item.id, { done: !done })}
          className={
            'shrink-0 text-xs px-3 py-1.5 rounded-lg font-medium transition ' +
            (done
              ? 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              : 'bg-emerald-600 text-white hover:bg-emerald-700')
          }
        >
          {done ? 'בטל' : 'השלמתי'}
        </button>
      </div>

      {!done && (
        <div className="px-4 pb-4 pt-1 border-t border-slate-100">
          <MissingDetailsEditor
            item={item}
            details={details}
            onChange={(patch) => setDetails(item.id, patch)}
          />
          <button
            onClick={() => setStatus(item.id, undefined)}
            className="mt-3 text-xs text-slate-500 hover:text-slate-700 underline"
          >
            בטל סימון חסר
          </button>
        </div>
      )}
    </div>
  )
}

// ---------- Row (all view) ----------

function Row({
  item,
  state,
  setStatus,
  setDetails,
}: {
  item: ChecklistItem
  state: State
  setStatus: (id: string, next: Status | undefined) => void
  setDetails: (id: string, patch: Partial<MissingDetails>) => void
}) {
  const status = state.status[item.id]
  const details = state.details[item.id] ?? {}
  const isMissing = status === 'missing'
  const isOk = status === 'ok'

  return (
    <li
      className={
        'px-4 py-3 ' +
        (isMissing && !details.done
          ? 'bg-rose-50/40'
          : isOk
          ? 'bg-emerald-50/40'
          : '')
      }
    >
      <div className="flex items-start gap-3">
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={() => setStatus(item.id, isOk ? undefined : 'ok')}
            aria-label="תקין"
            className={
              'w-9 h-9 rounded-lg border-2 flex items-center justify-center text-lg transition ' +
              (isOk
                ? 'bg-emerald-600 border-emerald-600 text-white'
                : 'bg-white border-slate-300 text-slate-400 hover:border-emerald-400')
            }
          >
            ✓
          </button>
          <button
            onClick={() => setStatus(item.id, isMissing ? undefined : 'missing')}
            aria-label="חסר"
            className={
              'w-9 h-9 rounded-lg border-2 flex items-center justify-center text-lg transition ' +
              (isMissing
                ? 'bg-rose-600 border-rose-600 text-white'
                : 'bg-white border-slate-300 text-slate-400 hover:border-rose-400')
            }
          >
            ✕
          </button>
        </div>

        <div className="flex-1 min-w-0">
          <div className={'font-medium ' + (isOk ? 'text-slate-500' : 'text-slate-900')}>
            {item.label}
          </div>
          {item.hint && (
            <div className="text-xs text-slate-500 mt-0.5">{item.hint}</div>
          )}

          {isMissing && !details.done && (
            <div className="mt-2">
              <MissingDetailsEditor
                item={item}
                details={details}
                onChange={(patch) => setDetails(item.id, patch)}
              />
            </div>
          )}
        </div>
      </div>
    </li>
  )
}

// ---------- Missing details editor ----------

function MissingDetailsEditor({
  item,
  details,
  onChange,
}: {
  item: ChecklistItem
  details: MissingDetails
  onChange: (patch: Partial<MissingDetails>) => void
}) {
  const spec: MissingSpec | undefined = item.missing

  if (!spec) {
    const opts = ['חסר', 'שבור/תקול', 'פג תוקף', 'אריזה פתוחה']
    const isOther = details.generalReason === 'אחר'
    return (
      <div>
        <div className="text-xs text-slate-600 mb-1.5">סיבה:</div>
        <div className="flex flex-wrap gap-1.5">
          {opts.map((opt) => (
            <Chip
              key={opt}
              active={details.generalReason === opt}
              onClick={() =>
                onChange({
                  generalReason: details.generalReason === opt ? undefined : opt,
                  note: undefined,
                })
              }
            >
              {opt}
            </Chip>
          ))}
          <Chip
            active={isOther}
            onClick={() =>
              onChange({
                generalReason: isOther ? undefined : 'אחר',
                note: isOther ? undefined : details.note,
              })
            }
          >
            אחר…
          </Chip>
        </div>
        {isOther && (
          <input
            type="text"
            value={details.note ?? ''}
            onChange={(e) => onChange({ note: e.target.value })}
            placeholder="פרט/י"
            autoFocus
            className="mt-2 w-full text-sm px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:border-rose-400"
          />
        )}
      </div>
    )
  }

  if (spec.kind === 'count') {
    const missingCount = details.missingCount ?? 1
    const setCount = (n: number) => {
      const clamped = Math.max(0, Math.min(spec.required, n))
      onChange({ missingCount: clamped })
    }
    return (
      <div className="flex items-center gap-2 flex-wrap">
        <span className="text-xs text-slate-600">חסר:</span>
        <div className="flex items-center gap-2 bg-slate-100 rounded-lg">
          <button
            onClick={() => setCount(missingCount - 1)}
            className="w-8 h-8 rounded-lg hover:bg-slate-200 text-lg"
            aria-label="פחות"
          >
            −
          </button>
          <span className="min-w-[2rem] text-center font-bold">{missingCount}</span>
          <button
            onClick={() => setCount(missingCount + 1)}
            className="w-8 h-8 rounded-lg hover:bg-slate-200 text-lg"
            aria-label="יותר"
          >
            +
          </button>
        </div>
        <span className="text-xs text-slate-500">מתוך {spec.required}</span>
        <button
          onClick={() => setCount(spec.required)}
          className="text-xs px-2 py-1 rounded-md bg-rose-100 text-rose-700 hover:bg-rose-200"
        >
          חסר הכל
        </button>
      </div>
    )
  }

  if (spec.kind === 'sizes') {
    const sel = details.missingSizes ?? []
    const toggle = (size: string) => {
      const next = sel.includes(size) ? sel.filter((s) => s !== size) : [...sel, size]
      onChange({ missingSizes: next })
    }
    return (
      <div>
        <div className="text-xs text-slate-600 mb-1.5">מידות חסרות:</div>
        <div className="flex flex-wrap gap-1.5">
          {spec.sizes.map((size) => (
            <Chip key={size} active={sel.includes(size)} onClick={() => toggle(size)}>
              {size}
            </Chip>
          ))}
        </div>
      </div>
    )
  }

  if (spec.kind === 'subitems') {
    const sel = details.missingSubitems ?? []
    const toggle = (id: string) => {
      const next = sel.includes(id) ? sel.filter((s) => s !== id) : [...sel, id]
      onChange({ missingSubitems: next })
    }
    return (
      <div>
        <div className="text-xs text-slate-600 mb-1.5">מה חסר בתוך:</div>
        <div className="flex flex-wrap gap-1.5">
          {spec.items.map((sub) => (
            <Chip key={sub.id} active={sel.includes(sub.id)} onClick={() => toggle(sub.id)}>
              {sub.label}
              {sub.count ? <span className="ms-1 text-[10px] opacity-70">×{sub.count}</span> : null}
            </Chip>
          ))}
        </div>
      </div>
    )
  }

  if (spec.kind === 'validity') {
    const opts = ['חסר לגמרי', 'פג תוקף', 'אריזה פגומה/פתוחה']
    return (
      <div>
        <div className="text-xs text-slate-600 mb-1.5">סיבה:</div>
        <div className="flex flex-wrap gap-1.5">
          {opts.map((opt) => (
            <Chip
              key={opt}
              active={details.validityReason === opt}
              onClick={() =>
                onChange({ validityReason: details.validityReason === opt ? undefined : opt })
              }
            >
              {opt}
            </Chip>
          ))}
        </div>
      </div>
    )
  }

  if (spec.kind === 'pressure') {
    const opts = ['לחץ נמוך', 'מיכל ריק', 'תקלה בווסת']
    return (
      <div>
        <div className="text-xs text-slate-600 mb-1.5">מצב המיכל:</div>
        <div className="flex flex-wrap gap-1.5">
          {opts.map((opt) => (
            <Chip
              key={opt}
              active={details.pressureReason === opt}
              onClick={() =>
                onChange({ pressureReason: details.pressureReason === opt ? undefined : opt })
              }
            >
              {opt}
            </Chip>
          ))}
        </div>
      </div>
    )
  }

  return null
}

function Chip({
  active,
  onClick,
  children,
}: {
  active: boolean
  onClick: () => void
  children: React.ReactNode
}) {
  return (
    <button
      onClick={onClick}
      className={
        'text-xs px-3 py-1.5 rounded-full border transition ' +
        (active
          ? 'bg-rose-600 border-rose-600 text-white'
          : 'bg-white border-slate-300 text-slate-700 hover:border-rose-400')
      }
    >
      {children}
    </button>
  )
}
