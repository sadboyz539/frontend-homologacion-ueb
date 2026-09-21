'use client'

import { FormEvent, useState } from 'react'
import { loginRequest } from '@/lib/api'
import {
  ArrowRight,
  Bell,
  BookOpen,
  CheckCircle2,
  ClipboardCheck,
  FileCheck2,
  GraduationCap,
  LayoutDashboard,
  LogOut,
  Menu,
  Search,
  Settings2,
  ShieldCheck,
  UserRound,
  X,
} from 'lucide-react'

const metrics = [
  { label: 'Solicitudes activas', value: '24', detail: '+8% este mes', icon: ClipboardCheck, tone: 'blue' },
  { label: 'En revisión académica', value: '08', detail: '3 requieren atención', icon: BookOpen, tone: 'red' },
  { label: 'Homologaciones aprobadas', value: '156', detail: '+12 esta semana', icon: CheckCircle2, tone: 'green' },
]

const requests = [
  { name: 'María Fernanda López', career: 'Ingeniería en Sistemas', origin: 'Universidad Central del Ecuador', status: 'Análisis académico', initials: 'ML', color: 'blue' },
  { name: 'Carlos Andrés Vega', career: 'Administración de Empresas', origin: 'Universidad Técnica de Ambato', status: 'Documentos recibidos', initials: 'CV', color: 'red' },
  { name: 'Sofía Paredes', career: 'Derecho', origin: 'Universidad de Cuenca', status: 'Aprobada', initials: 'SP', color: 'purple' },
]

function BrandMark({ compact = false }: { compact?: boolean }) {
  return (
    <div className="brand-mark">
      <div className="brand-shield" aria-hidden="true"><GraduationCap size={20} strokeWidth={2.2} /></div>
      {!compact && <div><strong>UEB</strong><span>Universidad Estatal de Bolívar</span></div>}
    </div>
  )
}

type UserRole = 'estudiante' | 'administrador' | 'coordinador'

const roleLabels: Record<UserRole, string> = {
  estudiante: 'Estudiante',
  administrador: 'Administrador',
  coordinador: 'Coordinador académico',
}

function LoginView({ onLogin }: { onLogin: (user: { name?: string; role?: string }) => void }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError('')
    setLoading(true)
    try {
      const data = await loginRequest(email, password)
      const token = data.token || data.access_token
      if (!token) throw new Error('El backend no devolvió un token de sesión.')
      sessionStorage.setItem('ueb_token', token)
      onLogin(data.user || {})
    } catch (loginError) {
      setError(loginError instanceof Error ? loginError.message : 'No se pudo iniciar sesión.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="login-shell">
      <div className="login-visual">
        <div className="login-visual-image" />
        <div className="image-tint" />
        <div className="visual-copy">
          <div className="eyebrow"><span /> SISTEMA ACADÉMICO INTEGRAL</div>
          <h1>Tu trayectoria<br /><em>también cuenta.</em></h1>
          <p>Gestiona la homologación de tus estudios con transparencia, agilidad y el respaldo de la Universidad Estatal de Bolívar.</p>
          <div className="visual-footer"><span className="flag-dot blue-dot" /><span className="flag-dot white-dot" /><span className="flag-dot red-dot" /> Guaranda · Ecuador</div>
        </div>
        <div className="mountain-badge"><ShieldCheck size={16} /> Plataforma segura UEB</div>
      </div>
      <section className="login-panel">
        <div className="login-top"><BrandMark /><button className="help-button" aria-label="Ayuda">?</button></div>
        <div className="login-content">
          <div className="mascot-wrap"><img src="/images/foxi-login.png" alt="Foxi, el zorro mascota de la Universidad Estatal de Bolívar" /></div>
          <p className="section-kicker">PORTAL DE HOMOLOGACIÓN</p>
          <h2>Bienvenido de nuevo</h2>
          <p className="login-subtitle">Ingresa tus credenciales para continuar con tu solicitud.</p>
          <form onSubmit={handleSubmit}>
            <label>Correo institucional<input type="email" placeholder="nombre@ueb.edu.ec" value={email} onChange={(event) => setEmail(event.target.value)} autoComplete="username" required /></label>
            <label>Contraseña<div className="password-field"><input type="password" placeholder="••••••••" value={password} onChange={(event) => setPassword(event.target.value)} autoComplete="current-password" required /><span>Mostrar</span></div></label>
            <div className="form-row"><label className="remember"><input type="checkbox" defaultChecked /> <span>Recordarme</span></label><a href="#forgot">¿Olvidaste tu contraseña?</a></div>
            {error && <p className="form-error" role="alert">{error}</p>}<button className="primary-button" type="submit" disabled={loading}>{loading ? 'Validando...' : 'Ingresar al sistema'} {!loading && <ArrowRight size={17} />}</button>
          </form>
          <div className="login-note"><ShieldCheck size={15} /> Tus datos están protegidos por la infraestructura institucional.</div>
        </div>
        <footer className="login-footer"><span>© 2024 UEB</span><span>Soporte técnico</span><span>Política de privacidad</span></footer>
      </section>
    </main>
  )
}

function DashboardView({ onLogout, role }: { onLogout: () => void; role: UserRole }) {
  const [menuOpen, setMenuOpen] = useState(false)
  const roleCopy = { estudiante: { greeting: 'Mateo', title: 'Mi proceso de homologación', subtitle: 'Consulta tus avances, documentos y equivalencias académicas.' }, administrador: { greeting: 'Andrea', title: 'Control administrativo', subtitle: 'Supervisa usuarios, permisos y el flujo completo de homologaciones.' }, coordinador: { greeting: 'Carla', title: 'Panel de homologación', subtitle: 'Revisa el estado de los trámites y mantén el proceso académico en movimiento.' } }[role]
  return (
    <main className="dashboard-shell">
      <aside className={menuOpen ? 'sidebar open' : 'sidebar'}>
        <div className="sidebar-brand"><BrandMark /><button className="mobile-close" onClick={() => setMenuOpen(false)} aria-label="Cerrar menú"><X size={20} /></button></div>
        <div className="workspace-label">ESPACIO DE TRABAJO</div>
        <nav>
          <a className="nav-item active" href="#dashboard"><LayoutDashboard size={18} /> Panel principal</a>
          <a className="nav-item" href="#requests"><ClipboardCheck size={18} /> Solicitudes <b>24</b></a>
          <a className="nav-item" href="#analysis"><BookOpen size={18} /> Análisis académico</a>
          <a className="nav-item" href="#documents"><FileCheck2 size={18} /> Documentos</a>
          <a className="nav-item" href="#catalog"><GraduationCap size={18} /> Catálogo académico</a>
        </nav>
        <div className="sidebar-bottom"><a className="nav-item" href="#settings"><Settings2 size={18} /> Configuración</a><button className="nav-item logout" onClick={onLogout}><LogOut size={18} /> Cerrar sesión</button><div className="profile"><div className="avatar">CR</div><div><strong>{role === 'estudiante' ? 'Mateo Guaranda' : role === 'administrador' ? 'Andrea Salazar' : 'Carla Ríos'}</strong><span>{roleLabels[role]}</span></div><span className="online-dot" /></div></div>
      </aside>
      {menuOpen && <button className="sidebar-backdrop" onClick={() => setMenuOpen(false)} aria-label="Cerrar menú" />}
      <section className="dashboard-main">
        <header className="dashboard-header"><div className="header-title"><button className="menu-button" onClick={() => setMenuOpen(true)} aria-label="Abrir menú"><Menu size={21} /></button><div><p>Martes, 18 de junio de 2024</p><h1>Buenos días, {roleCopy.greeting} <span>✦</span></h1></div></div><div className="header-actions"><button className="icon-button" aria-label="Buscar"><Search size={19} /></button><button className="icon-button notification" aria-label="Notificaciones"><Bell size={19} /><i /></button><div className="header-avatar">CR</div></div></header>
        <div className="dashboard-content">
          <div className="welcome-banner"><div><span className="section-kicker light">GESTIÓN ACADÉMICA</span><h2>{roleCopy.title}</h2><p>{roleCopy.subtitle}</p></div><div className="banner-decoration"><div className="ring ring-one" /><div className="ring ring-two" /><GraduationCap size={42} /></div><button>Ver guía rápida <ArrowRight size={16} /></button></div>
          <div className="metric-grid">{metrics.map(({ label, value, detail, icon: Icon, tone }) => <article className="metric-card" key={label}><div className={`metric-icon ${tone}`}><Icon size={19} /></div><div><p>{label}</p><strong>{value}</strong><span className={tone === 'red' ? 'negative' : ''}>{detail}</span></div><div className="sparkline" aria-hidden="true"><span /><span /><span /><span /><span /></div></article>)}</div>
          <div className="section-heading"><div><p className="section-kicker">SEGUIMIENTO</p><h2>Solicitudes recientes</h2></div><button className="outline-button">Ver todas <ArrowRight size={15} /></button></div>
          <div className="requests-card"><div className="table-header"><span>Solicitante</span><span>Carrera de destino</span><span>Institución de origen</span><span>Estado</span><span /></div>{requests.map((request) => <div className="request-row" key={request.name}><div className="request-person"><div className={`person-avatar ${request.color}`}>{request.initials}</div><strong>{request.name}</strong></div><span>{request.career}</span><span className="origin">{request.origin}</span><span className={`status ${request.status === 'Aprobada' ? 'approved' : request.status === 'Documentos recibidos' ? 'received' : ''}`}><i />{request.status}</span><button className="row-arrow" aria-label={`Abrir solicitud de ${request.name}`}><ArrowRight size={17} /></button></div>)}</div>
        </div>
        <footer className="dashboard-footer"><span><span className="footer-logo">UEB</span> Sistema de Homologación Académica</span><span>Versión 1.0.0 · Ayuda y soporte</span></footer>
      </section>
    </main>
  )
}

function normalizeRole(role?: string): UserRole {
  const value = (role || '').toLowerCase()
  if (value.includes('estudiante')) return 'estudiante'
  if (value.includes('admin')) return 'administrador'
  return 'coordinador'
}

export default function Page() {
  const [loggedIn, setLoggedIn] = useState(false)
  const [role, setRole] = useState<UserRole>('coordinador')
  function handleLogout() {
    sessionStorage.removeItem('ueb_token')
    setLoggedIn(false)
  }
  return loggedIn ? <DashboardView role={role} onLogout={handleLogout} /> : <LoginView onLogin={(user) => { setRole(normalizeRole(typeof user.role === 'string' ? user.role : user.role?.name)); setLoggedIn(true) }} />
}
