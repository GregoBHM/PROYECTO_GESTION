/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // ── Fondos Premium (Espacio Oscuro) ──────────────────────────────
        night: {
          950: '#060811',
          900: '#0c1120',
          800: '#111827',
          700: '#1a2235',
          600: '#202d45',
        },
        // ── Acento Principal: Violeta-Índigo (NO el azul Bootstrap) ──────
        violet: {
          950: '#2e1065',
          900: '#4c1d95',
          800: '#5b21b6',
          700: '#6d28d9',
          600: '#7c3aed',
          500: '#8b5cf6',
          400: '#a78bfa',
          300: '#c4b5fd',
          200: '#ddd6fe',
        },
        // ── Acento Secundario: Cyan Eléctrico ────────────────────────────
        electric: {
          600: '#0891b2',
          500: '#06b6d4',
          400: '#22d3ee',
          300: '#67e8f9',
        },
        // ── Estados del Ticket (colores semánticos específicos) ──────────
        ticket: {
          pending:    '#f59e0b',   // Ámbar
          analysis:   '#3b82f6',   // Azul cobalto
          ccb:        '#8b5cf6',   // Violeta
          fasttrack:  '#22d3ee',   // Cyan eléctrico
          dev:        '#6366f1',   // Indigo
          qa:         '#a78bfa',   // Violeta claro
          uat:        '#10b981',   // Esmeralda
          closed:     '#059669',   // Esmeralda oscuro
          rejected:   '#ef4444',   // Rojo carmesí
          archived:   '#6b7280',   // Gris pizarra
        },
        // ── Prioridades ───────────────────────────────────────────────────
        priority: {
          low:      '#34d399',   // Verde menta
          medium:   '#fbbf24',   // Ámbar
          high:     '#f97316',   // Naranja
          critical: '#ef4444',   // Rojo
        },
      },
      backgroundImage: {
        // Gradiente de fondo global (aurora espacial oscura)
        'aurora':       'linear-gradient(135deg, #060811 0%, #0c1120 50%, #0d1117 100%)',
        'aurora-card':  'linear-gradient(135deg, rgba(139,92,246,0.08) 0%, rgba(6,182,212,0.05) 100%)',
        'glow-violet':  'radial-gradient(circle at center, rgba(139,92,246,0.15) 0%, transparent 70%)',
        'glow-electric':'radial-gradient(circle at center, rgba(34,211,238,0.10) 0%, transparent 70%)',
      },
      fontFamily: {
        'sans': ['Inter', 'system-ui', 'sans-serif'],
        'mono': ['JetBrains Mono', 'Fira Code', 'monospace'],
      },
      backdropBlur: {
        'glass': '16px',
        'glass-sm': '8px',
      },
      boxShadow: {
        'glass':         '0 8px 32px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.05)',
        'glass-hover':   '0 12px 48px rgba(139,92,246,0.25), inset 0 1px 0 rgba(255,255,255,0.08)',
        'glow-violet':   '0 0 30px rgba(139,92,246,0.3)',
        'glow-electric': '0 0 30px rgba(34,211,238,0.2)',
        'ticket-card':   '0 4px 24px rgba(0,0,0,0.5)',
      },
      animation: {
        'fade-in':       'fadeIn 0.3s ease-out',
        'slide-up':      'slideUp 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
        'pulse-glow':    'pulseGlow 3s ease-in-out infinite',
        'shimmer':       'shimmer 2s linear infinite',
      },
      keyframes: {
        fadeIn:    { from: { opacity: '0' },                    to: { opacity: '1' } },
        slideUp:   { from: { opacity: '0', transform: 'translateY(20px)' }, to: { opacity: '1', transform: 'translateY(0)' } },
        pulseGlow: {
          '0%, 100%': { boxShadow: '0 0 20px rgba(139,92,246,0.2)' },
          '50%':      { boxShadow: '0 0 40px rgba(139,92,246,0.5)' },
        },
        shimmer: {
          from: { backgroundPosition: '-200% 0' },
          to:   { backgroundPosition: '200% 0' },
        },
      },
      borderColor: {
        'glass': 'rgba(255,255,255,0.08)',
        'glass-active': 'rgba(139,92,246,0.5)',
      },
    },
  },
  plugins: [],
}
