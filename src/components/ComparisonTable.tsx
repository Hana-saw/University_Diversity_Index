import { useState, useMemo } from 'react';

const LGBTQ_ORDER = { '実施済み': 3, '検討中': 2, '未着手': 1 };

const LGBTQ_BADGE = {
  '実施済み': { bg: 'rgba(22,163,74,0.15)', border: 'rgba(22,163,74,0.4)', text: '#4ade80', dot: '#16a34a' },
  '検討中':   { bg: 'rgba(202,138,4,0.15)',  border: 'rgba(202,138,4,0.4)',  text: '#facc15', dot: '#ca8a04' },
  '未着手':   { bg: 'rgba(220,38,38,0.15)',  border: 'rgba(220,38,38,0.4)',  text: '#f87171', dot: '#dc2626' },
};

function BarCell({ value, max = 100, color = '#e8ff5a' }) {
  return (
    <div className="flex items-center gap-2">
      <div style={{ width: 80, height: 6, background: 'rgba(255,255,255,0.08)', borderRadius: 3, overflow: 'hidden' }}>
        <div style={{ width: `${(value / max) * 100}%`, height: '100%', background: color, borderRadius: 3, transition: 'width 0.6s ease' }} />
      </div>
      <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 13, color: '#e8e8e6', minWidth: 36 }}>
        {value}%
      </span>
    </div>
  );
}

function StarCell({ value }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1,2,3,4,5].map(i => (
        <svg key={i} width="13" height="13" viewBox="0 0 24 24" fill={i <= value ? '#e8ff5a' : 'rgba(255,255,255,0.1)'}>
          <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26"/>
        </svg>
      ))}
    </div>
  );
}

function LGBTQBadge({ value }) {
  const style = LGBTQ_BADGE[value] || LGBTQ_BADGE['未着手'];
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 5,
      padding: '3px 10px', borderRadius: 99,
      background: style.bg, border: `1px solid ${style.border}`,
      color: style.text, fontSize: 12, fontWeight: 500,
    }}>
      <span style={{ width: 6, height: 6, borderRadius: '50%', background: style.dot, display: 'inline-block' }} />
      {value}
    </span>
  );
}

function SortIcon({ active, dir }) {
  return (
    <span style={{ display: 'inline-flex', flexDirection: 'column', gap: 1, marginLeft: 4, verticalAlign: 'middle' }}>
      <svg width="8" height="5" viewBox="0 0 8 5" fill={active && dir === 'asc' ? '#e8ff5a' : 'rgba(255,255,255,0.2)'}>
        <polygon points="4,0 8,5 0,5"/>
      </svg>
      <svg width="8" height="5" viewBox="0 0 8 5" fill={active && dir === 'desc' ? '#e8ff5a' : 'rgba(255,255,255,0.2)'}>
        <polygon points="4,5 8,0 0,0"/>
      </svg>
    </span>
  );
}

export default function ComparisonTable({ universities }) {
  const [sortKey, setSortKey] = useState('gender_ratio_female_prof');
  const [sortDir, setSortDir] = useState('desc');
  const [regionFilter, setRegionFilter] = useState('all');
  const [lgbtqFilter, setLgbtqFilter] = useState('all');
  const [search, setSearch] = useState('');

  const regions = useMemo(() => ['all', ...new Set(universities.map(u => u.region))], [universities]);

  const handleSort = (key) => {
    if (sortKey === key) setSortDir(d => d === 'asc' ? 'desc' : 'asc');
    else { setSortKey(key); setSortDir('desc'); }
  };

  const filtered = useMemo(() => {
    let list = [...universities];
    if (regionFilter !== 'all') list = list.filter(u => u.region === regionFilter);
    if (lgbtqFilter !== 'all') list = list.filter(u => u.lgbtq_policy === lgbtqFilter);
    if (search) list = list.filter(u => u.name.includes(search) || u.prefecture.includes(search));

    list.sort((a, b) => {
      let va = a[sortKey], vb = b[sortKey];
      if (sortKey === 'lgbtq_policy') { va = LGBTQ_ORDER[va] || 0; vb = LGBTQ_ORDER[vb] || 0; }
      if (typeof va === 'string') { va = va.localeCompare(vb, 'ja'); vb = 0; return sortDir === 'asc' ? va : -va; }
      return sortDir === 'asc' ? va - vb : vb - va;
    });
    return list;
  }, [universities, sortKey, sortDir, regionFilter, lgbtqFilter, search]);

  const cols = [
    { key: 'name', label: '大学名', sortable: true },
    { key: 'region', label: '地域', sortable: true },
    { key: 'gender_ratio_female_prof', label: '女性教授比率', sortable: true },
    { key: 'lgbtq_policy', label: 'LGBTQ+施策', sortable: true },
    { key: 'barrier_free_score', label: 'バリアフリー', sortable: true },
    { key: 'last_updated', label: '更新日', sortable: true },
  ];

  return (
    <div>
      {/* Filters */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, marginBottom: 20 }}>
        <input
          type="text"
          placeholder="大学名・都道府県で検索..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          style={{
            flex: '1 1 200px', padding: '8px 14px', borderRadius: 8,
            background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.12)',
            color: '#e8e8e6', fontSize: 14, outline: 'none',
            fontFamily: 'Noto Sans JP, sans-serif',
          }}
        />
        <select
          value={regionFilter}
          onChange={e => setRegionFilter(e.target.value)}
          style={{
            padding: '8px 14px', borderRadius: 8,
            background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.12)',
            color: '#e8e8e6', fontSize: 14, outline: 'none', cursor: 'pointer',
          }}
        >
          <option value="all">全地域</option>
          {regions.filter(r => r !== 'all').map(r => <option key={r} value={r}>{r}</option>)}
        </select>
        <select
          value={lgbtqFilter}
          onChange={e => setLgbtqFilter(e.target.value)}
          style={{
            padding: '8px 14px', borderRadius: 8,
            background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.12)',
            color: '#e8e8e6', fontSize: 14, outline: 'none', cursor: 'pointer',
          }}
        >
          <option value="all">LGBTQ+施策：全て</option>
          <option value="実施済み">実施済み</option>
          <option value="検討中">検討中</option>
          <option value="未着手">未着手</option>
        </select>
        <span style={{ display: 'flex', alignItems: 'center', fontSize: 13, color: 'rgba(255,255,255,0.3)', fontFamily: 'JetBrains Mono, monospace' }}>
          {filtered.length}件
        </span>
      </div>

      {/* Table */}
      <div style={{ overflowX: 'auto', borderRadius: 12, border: '1px solid rgba(255,255,255,0.08)' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.08)', background: 'rgba(255,255,255,0.03)' }}>
              {cols.map(col => (
                <th
                  key={col.key}
                  onClick={col.sortable ? () => handleSort(col.key) : undefined}
                  style={{
                    padding: '12px 16px', textAlign: 'left',
                    fontSize: 12, fontWeight: 600, letterSpacing: '0.06em',
                    color: sortKey === col.key ? '#e8ff5a' : 'rgba(255,255,255,0.4)',
                    cursor: col.sortable ? 'pointer' : 'default',
                    userSelect: 'none', whiteSpace: 'nowrap',
                    fontFamily: 'JetBrains Mono, monospace', textTransform: 'uppercase',
                    transition: 'color 0.2s',
                  }}
                >
                  {col.label}
                  {col.sortable && <SortIcon active={sortKey === col.key} dir={sortDir} />}
                </th>
              ))}
              <th style={{ padding: '12px 16px', width: 40 }} />
            </tr>
          </thead>
          <tbody>
            {filtered.map((u, i) => (
              <tr
                key={u.slug}
                style={{
                  borderBottom: i < filtered.length - 1 ? '1px solid rgba(255,255,255,0.06)' : 'none',
                  transition: 'background 0.15s',
                  cursor: 'pointer',
                }}
                onMouseEnter={e => e.currentTarget.style.background = 'rgba(232,255,90,0.04)'}
                onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                onClick={() => window.location.href = `/universities/${u.slug}`}
              >
                <td style={{ padding: '14px 16px' }}>
                  <div style={{ fontWeight: 500, color: '#f5f5f4', fontSize: 15 }}>{u.name}</div>
                  {u.name_en && <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.3)', marginTop: 1, fontFamily: 'DM Sans, sans-serif' }}>{u.name_en}</div>}
                </td>
                <td style={{ padding: '14px 16px' }}>
                  <span style={{ fontSize: 13, color: 'rgba(255,255,255,0.5)', background: 'rgba(255,255,255,0.07)', padding: '3px 8px', borderRadius: 4 }}>
                    {u.prefecture}
                  </span>
                </td>
                <td style={{ padding: '14px 16px' }}>
                  <BarCell value={u.gender_ratio_female_prof} />
                </td>
                <td style={{ padding: '14px 16px' }}>
                  <LGBTQBadge value={u.lgbtq_policy} />
                </td>
                <td style={{ padding: '14px 16px' }}>
                  <StarCell value={u.barrier_free_score} />
                </td>
                <td style={{ padding: '14px 16px', fontFamily: 'JetBrains Mono, monospace', fontSize: 12, color: 'rgba(255,255,255,0.3)' }}>
                  {u.last_updated}
                </td>
                <td style={{ padding: '14px 16px' }}>
                  <a
                    href={`/universities/${u.slug}`}
                    onClick={e => e.stopPropagation()}
                    style={{ color: 'rgba(255,255,255,0.3)', textDecoration: 'none', fontSize: 18, lineHeight: 1 }}
                    title="詳細を見る"
                  >
                    →
                  </a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {filtered.length === 0 && (
          <div style={{ textAlign: 'center', padding: '48px', color: 'rgba(255,255,255,0.3)', fontSize: 14 }}>
            条件に一致する大学が見つかりませんでした
          </div>
        )}
      </div>
    </div>
  );
}
