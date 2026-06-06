export default function AppTable({ columns, data, emptyMsg = 'No data found.' }) {
  return (
    <div style={{ overflowX: 'auto', borderRadius: 12, border: '1px solid #e0c9a6' }}>
      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 14, fontFamily: 'Poppins,sans-serif' }}>
        <thead>
          <tr style={{ background: '#8b4513' }}>
            {columns.map(c => (
              <th key={c.key} style={{ color: '#fff', padding: '12px 16px', textAlign: 'left', whiteSpace: 'nowrap', fontWeight: 600 }}>{c.label}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.length === 0
            ? <tr><td colSpan={columns.length} style={{ textAlign: 'center', padding: 32, color: '#888' }}>{emptyMsg}</td></tr>
            : data.map((row, i) => (
              <tr key={i} style={{ background: i % 2 === 0 ? '#fff' : '#fdf6ee', borderBottom: '1px solid #e0c9a6' }}>
                {columns.map(c => (
                  <td key={c.key} style={{ padding: '11px 16px', color: '#6b3a2a', verticalAlign: 'middle' }}>
                    {c.render ? c.render(row[c.key], row) : row[c.key]}
                  </td>
                ))}
              </tr>
            ))
          }
        </tbody>
      </table>
    </div>
  )
}
