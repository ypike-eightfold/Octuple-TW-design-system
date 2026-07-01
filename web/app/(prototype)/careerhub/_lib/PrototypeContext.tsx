'use client'

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'

/* Persist persona + data state across navigations / reloads. The prototype
   triggers full-page nav for the Team dropdown subitems (Next.js <Link>
   would also reset client state), so localStorage gives us continuity. */
const STORAGE_KEY = 'careerhub-prototype:v1'
interface PersistedState {
  persona?: PersonaId
  dataState?: DataState
}
function loadPersisted(): PersistedState {
  if (typeof window === 'undefined') return {}
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    return raw ? (JSON.parse(raw) as PersistedState) : {}
  } catch {
    return {}
  }
}
function savePersisted(s: PersistedState) {
  if (typeof window === 'undefined') return
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(s))
  } catch {
    /* swallow — quota / privacy mode */
  }
}
import type { ActionItem, DataState, PersonaId, ReviewDraft } from './types'
import { MOCK_DATA, AI_SUGGESTED_ACTION_ITEMS } from './mock-data'

interface PrototypeContextValue {
  /** True once we've read persisted state on the client. Guards effects
      that should wait for the real persona (avoids redirect flashes). */
  hydrated: boolean
  persona: PersonaId
  setPersona: (p: PersonaId) => void
  dataState: DataState
  setDataState: (s: DataState) => void

  /* Dashboard — agenda items appended via input. */
  agendaItems: string[]
  addAgendaItem: (label: string) => void

  /* Meeting canvas — checked action items and AI-generated additions. */
  checkedActionItems: Set<string>
  toggleActionItem: (id: string) => void
  generatedActionItems: ActionItem[]
  generateActionItems: () => void
  isGeneratingActionItems: boolean
  isPullingPRs: boolean
  pullRecentPRs: () => void
  pulledPRsHighlighted: boolean

  /* Performance hub — current review draft (responds to tone toggle). */
  currentReviewDraft: ReviewDraft
  timeframe: 'q1' | 'mid-year' | 'annual'
  setTimeframe: (t: 'q1' | 'mid-year' | 'annual') => void
  isRegenerating: boolean
  regenerate: () => void
  isAltTone: boolean
  toggleTone: () => void

  /* Performance hub — peer feedback request confirmation. */
  feedbackSentTo: Set<string>
  sendFeedbackRequest: (peerId: string) => void
}

const PrototypeContext = createContext<PrototypeContextValue | null>(null)

export function PrototypeProvider({ children }: { children: ReactNode }) {
  const [persona, setPersonaState] = useState<PersonaId>('alex')
  const [dataState, setDataStateInternal] = useState<DataState>('populated')
  const [hydrated, setHydrated] = useState(false)

  /* Read persisted values on mount (client-only). */
  useEffect(() => {
    const p = loadPersisted()
    if (p.persona) setPersonaState(p.persona)
    if (p.dataState) setDataStateInternal(p.dataState)
    setHydrated(true)
  }, [])

  const setPersona = useCallback((p: PersonaId) => {
    setPersonaState(p)
    savePersisted({ ...loadPersisted(), persona: p })
  }, [])

  const setDataState = useCallback((s: DataState) => {
    setDataStateInternal(s)
    savePersisted({ ...loadPersisted(), dataState: s })
  }, [])

  /* Gallery comment bridge — opt into the generic prototype↔gallery state
     protocol (web/components/comments/proto-state.ts). Announce
     {persona, dataState} to the gallery host so a comment captures the
     flow it was left in, and restore that flow when the host asks. Also
     replies to a state request (the host's readiness ping after a jump).
     No-op when not embedded (window.parent === window). */
  useEffect(() => {
    if (!hydrated) return
    const announce = () =>
      window.parent?.postMessage(
        { type: 'proto-state', state: { persona, dataState } },
        '*',
      )
    announce()
    function onMessage(e: MessageEvent) {
      const d = e?.data
      if (!d || typeof d !== 'object') return
      if (d.type === 'proto-state-request') announce()
      if (d.type === 'proto-state-restore' && d.state && typeof d.state === 'object') {
        if (d.state.persona) setPersona(d.state.persona as PersonaId)
        if (d.state.dataState) setDataState(d.state.dataState as DataState)
      }
    }
    window.addEventListener('message', onMessage)
    return () => window.removeEventListener('message', onMessage)
  }, [hydrated, persona, dataState, setPersona, setDataState])

  const [agendaItems, setAgendaItems] = useState<string[]>([])
  const [checkedActionItems, setCheckedActionItems] = useState<Set<string>>(new Set())
  const [generatedActionItems, setGeneratedActionItems] = useState<ActionItem[]>([])
  const [isGeneratingActionItems, setIsGeneratingActionItems] = useState(false)
  const [isPullingPRs, setIsPullingPRs] = useState(false)
  const [pulledPRsHighlighted, setPulledPRsHighlighted] = useState(false)
  const [timeframe, setTimeframe] = useState<'q1' | 'mid-year' | 'annual'>('mid-year')
  const [isRegenerating, setIsRegenerating] = useState(false)
  const [isAltTone, setIsAltTone] = useState(false)
  const [feedbackSentTo, setFeedbackSentTo] = useState<Set<string>>(new Set())

  const addAgendaItem = useCallback((label: string) => {
    const trimmed = label.trim()
    if (!trimmed) return
    setAgendaItems((prev) => [...prev, trimmed])
  }, [])

  const toggleActionItem = useCallback((id: string) => {
    setCheckedActionItems((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }, [])

  const generateActionItems = useCallback(() => {
    setIsGeneratingActionItems(true)
    window.setTimeout(() => {
      setGeneratedActionItems(
        AI_SUGGESTED_ACTION_ITEMS.map((s, i) => ({
          id: `ai-${Date.now()}-${i}`,
          label: s.label,
          owner: s.owner,
          carriedOver: false,
        }))
      )
      setIsGeneratingActionItems(false)
    }, 1100)
  }, [])

  const pullRecentPRs = useCallback(() => {
    setIsPullingPRs(true)
    setPulledPRsHighlighted(false)
    window.setTimeout(() => {
      setIsPullingPRs(false)
      setPulledPRsHighlighted(true)
      // Clear the highlight after a moment so reviewers see the feedback.
      window.setTimeout(() => setPulledPRsHighlighted(false), 2500)
    }, 900)
  }, [])

  const regenerate = useCallback(() => {
    setIsRegenerating(true)
    window.setTimeout(() => setIsRegenerating(false), 1100)
  }, [])

  const toggleTone = useCallback(() => setIsAltTone((v) => !v), [])

  const sendFeedbackRequest = useCallback((peerId: string) => {
    setFeedbackSentTo((prev) => {
      const next = new Set(prev)
      next.add(peerId)
      return next
    })
  }, [])

  const currentReviewDraft = useMemo<ReviewDraft>(() => {
    const source = isAltTone ? MOCK_DATA.aiReviewDraftAltTone : MOCK_DATA.aiReviewDraft
    return { ...source[persona], timeframe }
  }, [persona, isAltTone, timeframe])

  const value = useMemo<PrototypeContextValue>(
    () => ({
      hydrated,
      persona,
      setPersona,
      dataState,
      setDataState,
      agendaItems,
      addAgendaItem,
      checkedActionItems,
      toggleActionItem,
      generatedActionItems,
      generateActionItems,
      isGeneratingActionItems,
      isPullingPRs,
      pullRecentPRs,
      pulledPRsHighlighted,
      currentReviewDraft,
      timeframe,
      setTimeframe,
      isRegenerating,
      regenerate,
      isAltTone,
      toggleTone,
      feedbackSentTo,
      sendFeedbackRequest,
    }),
    [
      hydrated,
      persona,
      dataState,
      agendaItems,
      addAgendaItem,
      checkedActionItems,
      toggleActionItem,
      generatedActionItems,
      generateActionItems,
      isGeneratingActionItems,
      isPullingPRs,
      pullRecentPRs,
      pulledPRsHighlighted,
      currentReviewDraft,
      timeframe,
      isRegenerating,
      regenerate,
      isAltTone,
      toggleTone,
      feedbackSentTo,
      sendFeedbackRequest,
    ]
  )

  return <PrototypeContext.Provider value={value}>{children}</PrototypeContext.Provider>
}

export function usePrototype(): PrototypeContextValue {
  const ctx = useContext(PrototypeContext)
  if (!ctx) throw new Error('usePrototype must be used inside <PrototypeProvider>')
  return ctx
}
