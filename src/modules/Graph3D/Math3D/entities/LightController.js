const LightController = ({ lightPower, onChange }) => {
  const percentage = (lightPower / 50000) * 100;
  return (
    <div style={{
      margin: '10px 0',
      padding: 5,
      backgroundColor: '#f5f5f5',
      borderRadius: 6,
      width: 220,
      fontSize: 12
    }}>
      <label style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <span style={{ minWidth: 80 }}>Источник света:</span>
        <input
          type="range"
          min="0"
          max="50000"
          step="1"
          value={lightPower}
          onChange={e => onChange(Number(e.target.value))}
          style={{
            flexGrow: 1,
            height: 8,
            cursor: 'pointer',
            borderRadius: 4,
            background: `linear-gradient(90deg, #00ff15 ${percentage}%, #ddd ${percentage}%)`,
            appearance: 'none',
            WebkitAppearance: 'none',
            MozAppearance: 'none',
            outline: 'none',
          }}
        />
        <span style={{
          minWidth: 50,
          marginLeft: 6,
          fontFamily: 'monospace',
          fontSize: 12,
          textAlign: 'right'
        }}>
          {lightPower.toLocaleString()}
        </span>

      </label>

      <style>{`
        input[type="range"]::-webkit-slider-thumb {
          -webkit-appearance: none;
          appearance: none;
          width: 18px;
          height: 18px;
          background: #00ff15;
          border-radius: 50%;
          cursor: pointer;
          border: 2px solid #008f0a;
          margin-top: -5px; /* Центрирование бегунка по высоте */
          transition: background-color 0.3s ease;
        }
        input[type="range"]:hover::-webkit-slider-thumb {
          background: #00cc12;
        }
        input[type="range"]::-moz-range-thumb {
          width: 18px;
          height: 18px;
          background: #00ff15;
          border-radius: 50%;
          cursor: pointer;
          border: 2px solid #008f0a;
          transition: background-color 0.3s ease;
        }
        input[type="range"]:hover::-moz-range-thumb {
          background: #00cc12;
        }
        input[type="range"]::-webkit-slider-runnable-track {
          height: 8px;
          border-radius: 4px;
          background: transparent;
        }
        input[type="range"]::-moz-range-track {
          height: 8px;
          border-radius: 4px;
          background: transparent;
        }
      `}</style>
    </div>
  );
};

export default LightController;
