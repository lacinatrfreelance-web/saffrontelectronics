import React, { useState, useMemo } from 'react'
import { Eye, TrendingUp, TrendingDown, Calendar, RefreshCw, Activity } from 'lucide-react'
import {
  AreaChart, Area,
  BarChart, Bar,
  XAxis, YAxis,
  CartesianGrid, Tooltip,
  ResponsiveContainer, Cell,
} from 'recharts'
import { usePageViewStats, type DailyView } from '@/hooks/usePageViewStats'

// ─── helpers ──────────────────────────────────────────────────────────────────

function fmt(n: number) {
  return n >= 1000 ? `${(n / 1000).toFixed(1)}k` : String(n)
}
function shortDay(iso: string) {
  return new Date(iso).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short' })
}
function weekLabel(iso: string) {
  const d = new Date(iso)
  return `S${Math.ceil(d.getDate() / 7)} ${d.toLocaleDateString('fr-FR', { month: 'short' })}`
}
function monthLabel(iso: string) {
  return new Date(iso).toLocaleDateString('fr-FR', { month: 'short', year: '2-digit' })
}

function toWeekly(daily: DailyView[]) {
  const map = new Map<string, number>()
  daily.forEach(({ date, count }) => {
    const d = new Date(date)
    const mon = new Date(d)
    mon.setDate(d.getDate() - d.getDay() + 1)
    const key = mon.toISOString().slice(0, 10)
    map.set(key, (map.get(key) ?? 0) + count)
  })
  return Array.from(map.entries())
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([date, count]) => ({ date, count }))
}

function toMonthly(daily: DailyView[]) {
  const map = new Map<string, number>()
  daily.forEach(({ date, count }) => {
    const key = date.slice(0, 7) + '-01'
    map.set(key, (map.get(key) ?? 0) + count)
  })
  return Array.from(map.entries())
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([date, count]) => ({ date, count }))
}

// ─── Custom Tooltip ───────────────────────────────────────────────────────────

const ChartTooltip = ({ active, payload, label, labelFn }: any) => {
  if (!active || !payload?.length) return null
  return (
    <div style={{
      background: 'white',
      border: '1px solid #f1f5f9',
      borderRadius: 14,
      padding: '10px 16px',
      boxShadow: '0 8px 32px rgba(0,0,0,0.10)',
      fontSize: 12,
    }}>
      <p style={{ color: '#94a3b8', marginBottom: 4, fontWeight: 600 }}>{labelFn(label)}</p>
      <p style={{ color: '#0f172a', fontWeight: 800, fontSize: 16, margin: 0 }}>
        {payload[0].value.toLocaleString('fr-FR')}
        <span style={{ fontWeight: 400, color: '#94a3b8', fontSize: 12, marginLeft: 5 }}>vues</span>
      </p>
    </div>
  )
}

// ─── KPI Card ─────────────────────────────────────────────────────────────────

function KpiCard({ icon: Icon, label, value, bg, iconColor, sub, trend }: {
  icon: React.ElementType
  label: string
  value: string | number
  bg: string
  iconColor: string
  sub?: string
  trend?: number | null
}) {
  return (
    <div style={{
      background: bg,
      borderRadius: 20,
      padding: '20px 20px 18px',
      position: 'relative',
      overflow: 'hidden',
    }}>
      {/* decorative circle */}
      <div style={{
        position: 'absolute', top: -20, right: -20,
        width: 80, height: 80, borderRadius: '50%',
        background: 'rgba(255,255,255,0.15)',
      }} />
      <div style={{
        position: 'absolute', top: -40, right: -10,
        width: 80, height: 80, borderRadius: '50%',
        background: 'rgba(255,255,255,0.08)',
      }} />

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
        <div style={{
          width: 38, height: 38, borderRadius: 12,
          background: 'rgba(255,255,255,0.25)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <Icon size={17} color="white" />
        </div>
        {trend !== null && trend !== undefined && (
          <div style={{
            display: 'flex', alignItems: 'center', gap: 3,
            fontSize: 11, fontWeight: 700,
            background: 'rgba(255,255,255,0.25)',
            color: 'white',
            padding: '3px 8px', borderRadius: 20,
          }}>
            {trend >= 0 ? <TrendingUp size={11} /> : <TrendingDown size={11} />}
            {trend >= 0 ? '+' : ''}{trend}%
          </div>
        )}
      </div>

      <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.7)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 4 }}>
        {label}
      </p>
      <p style={{ fontSize: 30, fontWeight: 900, color: 'white', lineHeight: 1, letterSpacing: '-0.04em', margin: 0 }}>
        {typeof value === 'number' ? value.toLocaleString('fr-FR') : value}
      </p>
      {sub && <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.55)', marginTop: 6 }}>{sub}</p>}
    </div>
  )
}

// ─── Period Selector ──────────────────────────────────────────────────────────

type Period = 'day' | 'week' | 'month'
const PERIODS: { key: Period; label: string; icon: string }[] = [
  { key: 'day',   label: 'Jour',    icon: '◦' },
  { key: 'week',  label: 'Semaine', icon: '◦◦' },
  { key: 'month', label: 'Mois',    icon: '◦◦◦' },
]

// ─── Main ─────────────────────────────────────────────────────────────────────

interface HomeViewStatsProps {
  days?: 7 | 14 | 30 | 90
}

export const HomeViewStats: React.FC<HomeViewStatsProps> = ({ days = 90 }) => {
  const [period, setPeriod] = useState<Period>('day')
  const { stats, loading, error, refetch } = usePageViewStats('home', days)

  const trend = useMemo(() => {
    if (!stats?.daily || stats.daily.length < 14) return null
    const half = Math.floor(stats.daily.length / 2)
    const prev = stats.daily.slice(0, half).reduce((s, d) => s + d.count, 0)
    const curr = stats.daily.slice(half).reduce((s, d) => s + d.count, 0)
    if (prev === 0) return null
    return Math.round(((curr - prev) / prev) * 100)
  }, [stats])

  const chartData = useMemo(() => {
    if (!stats?.daily) return []
    if (period === 'day')   return stats.daily
    if (period === 'week')  return toWeekly(stats.daily)
    return toMonthly(stats.daily)
  }, [stats, period])

  const labelFn = period === 'day' ? shortDay : period === 'week' ? weekLabel : monthLabel
  const maxCount = Math.max(...chartData.map(d => d.count), 1)

  // ── Shimmer loading
  if (loading) {
    return (
      <div style={{ background: 'white', borderRadius: 24, padding: 28, border: '1px solid #f1f5f9' }}>
        <style>{`@keyframes shimmer{0%{background-position:200% 0}100%{background-position:-200% 0}}`}</style>
        {[1].map(i => (
          <div key={i}>
            <div style={{ height: 22, width: 200, borderRadius: 8, marginBottom: 20, background: 'linear-gradient(90deg,#f1f5f9 25%,#e2e8f0 50%,#f1f5f9 75%)', backgroundSize: '200% 100%', animation: 'shimmer 1.4s infinite' }} />
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 12, marginBottom: 20 }}>
              {[0,1,2].map(j => <div key={j} style={{ height: 110, borderRadius: 20, background: 'linear-gradient(90deg,#f1f5f9 25%,#e2e8f0 50%,#f1f5f9 75%)', backgroundSize: '200% 100%', animation: `shimmer 1.4s ${j*0.15}s infinite` }} />)}
            </div>
            <div style={{ height: 220, borderRadius: 16, background: 'linear-gradient(90deg,#f1f5f9 25%,#e2e8f0 50%,#f1f5f9 75%)', backgroundSize: '200% 100%', animation: 'shimmer 1.4s infinite' }} />
          </div>
        ))}
      </div>
    )
  }

  // ── Error state
  if (error) {
    return (
      <div style={{
        background: '#fff5f5', borderRadius: 24, padding: '20px 24px',
        border: '1.5px solid #fecdd3',
        display: 'flex', alignItems: 'center', gap: 12, color: '#f43f5e', fontSize: 13,
      }}>
        <Activity size={18} />
        <span style={{ flex: 1 }}>Impossible de charger les statistiques de vues.</span>
        <button onClick={refetch} style={{
          fontSize: 12, fontWeight: 700, color: '#f97316',
          background: 'none', border: 'none', cursor: 'pointer', textDecoration: 'underline',
        }}>Réessayer</button>
      </div>
    )
  }

  if (!stats) return null

  return (
    <div style={{
      background: 'white',
      borderRadius: 24,
      border: '1px solid #f1f5f9',
      boxShadow: '0 4px 32px rgba(0,0,0,0.05)',
      overflow: 'hidden',
    }}>

      {/* ── Top gradient band ── */}
      <div style={{
        background: 'linear-gradient(135deg, #fff7ed 0%, #ffedd5 50%, #fef3c7 100%)',
        padding: '24px 28px 20px',
        borderBottom: '1px solid #fed7aa',
      }}>
        {/* Header row */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{
              width: 44, height: 44, borderRadius: 14,
              background: 'linear-gradient(135deg, #f97316 0%, #ea580c 100%)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: '0 6px 18px rgba(249,115,22,0.35)',
            }}>
              <Eye size={20} color="white" />
            </div>
            <div>
              <h3 style={{ fontSize: 16, fontWeight: 800, color: '#1c1917', margin: 0, letterSpacing: '-0.025em' }}>
                Vues · Page d'accueil
              </h3>
              <p style={{ fontSize: 12, color: '#a8a29e', margin: '2px 0 0', fontWeight: 500 }}>
                Analyse des {days} derniers jours
              </p>
            </div>
          </div>
          <button onClick={refetch} title="Actualiser" style={{
            width: 36, height: 36, borderRadius: 10,
            background: 'white', border: '1px solid #fed7aa',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            cursor: 'pointer', color: '#f97316',
            boxShadow: '0 1px 6px rgba(249,115,22,0.1)',
          }}>
            <RefreshCw size={14} />
          </button>
        </div>

        {/* KPI Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 }}>
          <KpiCard
            icon={Eye}
            label="Total all time"
            value={stats.total}
            bg="linear-gradient(135deg, #f97316 0%, #ea580c 100%)"
            iconColor="#f97316"
          />
          <KpiCard
            icon={Calendar}
            label="Aujourd'hui"
            value={stats.today}
            bg="linear-gradient(135deg, #0ea5e9 0%, #0284c7 100%)"
            iconColor="#0ea5e9"
            sub="visites enregistrées"
          />
          <KpiCard
            icon={TrendingUp}
            label="Tendance"
            value={trend !== null ? `${trend > 0 ? '+' : ''}${trend}%` : '—'}
            bg={trend !== null && trend >= 0
              ? 'linear-gradient(135deg, #10b981 0%, #059669 100%)'
              : 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)'}
            iconColor="#10b981"
            sub="vs période précédente"
            trend={trend}
          />
        </div>
      </div>

      {/* ── Chart Section ── */}
      <div style={{ padding: '24px 28px 28px' }}>

        {/* Period tabs */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
          <p style={{ fontSize: 13, fontWeight: 700, color: '#374151', margin: 0 }}>
            Évolution des vues
          </p>
          <div style={{
            display: 'flex', gap: 3,
            background: '#f8fafc', padding: 4, borderRadius: 12,
            border: '1px solid #f1f5f9',
          }}>
            {PERIODS.map(({ key, label }) => (
              <button key={key} onClick={() => setPeriod(key)} style={{
                padding: '6px 14px', borderRadius: 8, border: 'none', cursor: 'pointer',
                fontSize: 12, fontWeight: 700, transition: 'all 0.2s',
                background: period === key ? '#f97316' : 'transparent',
                color: period === key ? 'white' : '#94a3b8',
                boxShadow: period === key ? '0 2px 10px rgba(249,115,22,0.35)' : 'none',
              }}>
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* Charts */}
        <div style={{
          background: '#fafafa', borderRadius: 16,
          padding: '16px 8px 8px',
          border: '1px solid #f8fafc',
        }}>
          {/* DAY — Area chart */}
          {period === 'day' && (
            <ResponsiveContainer width="100%" height={210}>
              <AreaChart data={chartData} margin={{ top: 4, right: 16, left: -12, bottom: 0 }}>
                <defs>
                  <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%"   stopColor="#f97316" stopOpacity={0.2} />
                    <stop offset="100%" stopColor="#f97316" stopOpacity={0.01} />
                  </linearGradient>
                </defs>
                <CartesianGrid stroke="#f1f5f9" strokeDasharray="0" vertical={false} />
                <XAxis
                  dataKey="date" tickFormatter={shortDay}
                  tick={{ fill: '#d1d5db', fontSize: 10, fontWeight: 600 }}
                  axisLine={false} tickLine={false}
                  interval={Math.max(0, Math.floor(chartData.length / 7) - 1)}
                />
                <YAxis
                  tick={{ fill: '#d1d5db', fontSize: 10 }}
                  axisLine={false} tickLine={false}
                  tickFormatter={fmt} allowDecimals={false}
                />
                <Tooltip content={<ChartTooltip labelFn={shortDay} />} />
                <Area
                  type="monotone" dataKey="count"
                  stroke="#f97316" strokeWidth={2.5}
                  fill="url(#areaGrad)" dot={false}
                  activeDot={{ r: 5, fill: '#f97316', stroke: 'white', strokeWidth: 2.5 }}
                />
              </AreaChart>
            </ResponsiveContainer>
          )}

          {/* WEEK — Bar chart with intensity shading */}
          {period === 'week' && (
            <ResponsiveContainer width="100%" height={210}>
              <BarChart data={chartData} margin={{ top: 4, right: 16, left: -12, bottom: 0 }} barSize={32}>
                <CartesianGrid stroke="#f1f5f9" vertical={false} />
                <XAxis
                  dataKey="date" tickFormatter={weekLabel}
                  tick={{ fill: '#d1d5db', fontSize: 10, fontWeight: 600 }}
                  axisLine={false} tickLine={false}
                />
                <YAxis
                  tick={{ fill: '#d1d5db', fontSize: 10 }}
                  axisLine={false} tickLine={false}
                  tickFormatter={fmt} allowDecimals={false}
                />
                <Tooltip content={<ChartTooltip labelFn={weekLabel} />} />
                <Bar dataKey="count" radius={[8, 8, 3, 3]}>
                  {chartData.map((entry, i) => {
                    const ratio = maxCount > 0 ? entry.count / maxCount : 0
                    return (
                      <Cell key={i}
                        fill={i === chartData.length - 1
                          ? '#f97316'
                          : `rgba(249,115,22,${0.2 + ratio * 0.55})`}
                      />
                    )
                  })}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          )}

          {/* MONTH — Bar chart with gradient highlight on current */}
          {period === 'month' && (
            <ResponsiveContainer width="100%" height={210}>
              <BarChart data={chartData} margin={{ top: 4, right: 16, left: -12, bottom: 0 }} barSize={44}>
                <defs>
                  <linearGradient id="curMonthGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%"   stopColor="#f97316" />
                    <stop offset="100%" stopColor="#fdba74" />
                  </linearGradient>
                </defs>
                <CartesianGrid stroke="#f1f5f9" vertical={false} />
                <XAxis
                  dataKey="date" tickFormatter={monthLabel}
                  tick={{ fill: '#d1d5db', fontSize: 10, fontWeight: 600 }}
                  axisLine={false} tickLine={false}
                />
                <YAxis
                  tick={{ fill: '#d1d5db', fontSize: 10 }}
                  axisLine={false} tickLine={false}
                  tickFormatter={fmt} allowDecimals={false}
                />
                <Tooltip content={<ChartTooltip labelFn={monthLabel} />} />
                <Bar dataKey="count" radius={[10, 10, 3, 3]}>
                  {chartData.map((entry, i) => (
                    <Cell key={i}
                      fill={i === chartData.length - 1
                        ? 'url(#curMonthGrad)'
                        : 'rgba(249,115,22,0.22)'}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>

        {/* ── Mini sparkline footer — last 7 entries ── */}
        <div style={{ marginTop: 18, display: 'flex', gap: 6, alignItems: 'flex-end' }}>
          <span style={{ fontSize: 10, color: '#d1d5db', fontWeight: 600, marginRight: 4, whiteSpace: 'nowrap' }}>
            7 derniers
          </span>
          {chartData.slice(-7).map((d, i) => {
            const h = maxCount > 0 ? Math.max(6, (d.count / maxCount) * 44) : 6
            const isLast = i === Math.min(6, chartData.length - 1)
            return (
              <div key={i} title={`${labelFn(d.date)}: ${d.count} vues`}
                style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
                <div style={{ height: 44, display: 'flex', alignItems: 'flex-end', width: '100%' }}>
                  <div style={{
                    width: '100%', height: h,
                    background: isLast ? '#f97316' : `rgba(249,115,22,${0.2 + (d.count / maxCount) * 0.5})`,
                    borderRadius: '3px 3px 2px 2px',
                    transition: 'height 0.5s cubic-bezier(0.34,1.56,0.64,1)',
                  }} />
                </div>
                <span style={{ fontSize: 9, color: '#d1d5db', whiteSpace: 'nowrap', overflow: 'hidden', maxWidth: '100%', textAlign: 'center' }}>
                  {labelFn(d.date).replace(' ', '\u00A0')}
                </span>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

export default HomeViewStats