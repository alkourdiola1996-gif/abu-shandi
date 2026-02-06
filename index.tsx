
import React, { useState, useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import { 
  User, Lock, Eye, EyeOff, LogOut, Plus, Trash2, BookOpen, 
  Video, FileText, CheckCircle, Users, Menu, X, Upload, 
  ArrowRight, ShieldCheck, ChevronLeft, LayoutDashboard, 
  GraduationCap, ClipboardList, Award, Clock, AlertCircle,
  Database, ShieldAlert, PieChart
} from 'lucide-react';

/** 
 * --- الأنواع وهيكل البيانات ---
 */
type UserRole = 'ADMIN' | 'TEACHER' | 'STUDENT';

interface AppUser {
  id: string;
  name: string;
  username: string;
  password: string;
  role: UserRole;
  approved: boolean;
}

interface CoursePackage {
  id: string;
  teacherId: string;
  teacherName: string;
  title: string;
  courseId: string;
  videoUrl: string;
  pdfUrl: string;
}

interface QuizResult {
  id: string;
  studentId: string;
  courseId: string;
  score: number;
  total: number;
  date: string;
}

/**
 * --- نظام الحماية والأمان (أبو شندي) ---
 */
const usePlatformSecurity = () => {
  useEffect(() => {
    const handleContext = (e: MouseEvent) => e.preventDefault();
    const handleKeys = (e: KeyboardEvent) => {
      // منع F12, Ctrl+U, PrintScreen, Copy, Paste
      if (
        e.keyCode === 123 || 
        e.key === 'PrintScreen' ||
        (e.ctrlKey && ['u', 's', 'p', 'c', 'v'].includes(e.key.toLowerCase()))
      ) {
        e.preventDefault();
      }
    };
    window.addEventListener('contextmenu', handleContext);
    window.addEventListener('keydown', handleKeys);
    // تضبيب الشاشة عند الخروج من التبويب لمنع التصوير
    const handleVisibility = () => {
      document.body.style.filter = document.hidden ? 'blur(25px)' : 'none';
    };
    document.addEventListener('visibilitychange', handleVisibility);

    return () => {
      window.removeEventListener('contextmenu', handleContext);
      window.removeEventListener('keydown', handleKeys);
      document.removeEventListener('visibilitychange', handleVisibility);
    };
  }, []);
};

/**
 * --- المكون الرئيسي للمنصة ---
 */
const App = () => {
  usePlatformSecurity();
  const [user, setUser] = useState<AppUser | null>(null);
  const [view, setView] = useState<'LOGIN' | 'SIGNUP' | 'APP'>('LOGIN');

  // تخزين البيانات (محاكاة قاعدة البيانات)
  const [users, setUsers] = useState<AppUser[]>(() => {
    const saved = localStorage.getItem('platform_users');
    return saved ? JSON.parse(saved) : [
      { id: '1', name: 'المدير العام', username: '20262025', password: '20262025', role: 'ADMIN', approved: true },
      { id: '2', name: 'المدير المساعد', username: '156996', password: '156996', role: 'ADMIN', approved: true }
    ];
  });

  const [courses, setCourses] = useState<CoursePackage[]>(() => {
    const saved = localStorage.getItem('platform_courses');
    return saved ? JSON.parse(saved) : [];
  });

  const [results, setResults] = useState<QuizResult[]>(() => {
    const saved = localStorage.getItem('platform_results');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('platform_users', JSON.stringify(users));
    localStorage.setItem('platform_courses', JSON.stringify(courses));
    localStorage.setItem('platform_results', JSON.stringify(results));
  }, [users, courses, results]);

  const logout = () => { setUser(null); setView('LOGIN'); };

  return (
    <div className="min-h-screen bg-[#f8fafc] font-['Cairo']">
      {view === 'LOGIN' && <LoginPage users={users} onLogin={(u) => { setUser(u); setView('APP'); }} goToSignup={() => setView('SIGNUP')} />}
      {view === 'SIGNUP' && <SignupPage onSignup={(u) => { setUsers([...users, u]); setView('LOGIN'); }} goToLogin={() => setView('LOGIN')} />}
      {view === 'APP' && user && (
        <PlatformShell 
          user={user} 
          logout={logout}
          allUsers={users} setUsers={setUsers}
          allCourses={courses} setCourses={setCourses}
          allResults={results}
        />
      )}
    </div>
  );
};

/**
 * --- واجهة تسجيل الدخول ---
 */
const LoginPage = ({ users, onLogin, goToSignup }: any) => {
  const [form, setForm] = useState({ u: '', p: '' });
  const [show, setShow] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const found = users.find((u: any) => u.username === form.u && u.password === form.p);
    if (found) onLogin(found);
    else alert('عذراً، اسم المستخدم أو كلمة المرور غير صحيحة.');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0f172a] p-4 relative overflow-hidden">
      <div className="absolute -top-24 -right-24 w-96 h-96 bg-blue-600/20 blur-[120px] rounded-full"></div>
      <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-indigo-600/20 blur-[120px] rounded-full"></div>
      
      <div className="bg-white/95 backdrop-blur-xl p-10 rounded-[2.5rem] shadow-2xl w-full max-w-md z-10 border border-white/20">
        <div className="text-center mb-10">
          <div className="w-16 h-16 bg-blue-600 rounded-2xl mx-auto mb-4 flex items-center justify-center shadow-lg shadow-blue-500/40">
            <GraduationCap className="text-white w-8 h-8" />
          </div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">منصة التميز</h1>
          <p className="text-blue-600 font-bold mt-1">بإشراف أبو شندي</p>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="relative">
            <User className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
            <input 
              type="text" required
              className="w-full pr-12 pl-4 py-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-blue-500 font-bold outline-none" 
              placeholder="اسم المستخدم" 
              value={form.u} onChange={e => setForm({...form, u: e.target.value})}
            />
          </div>
          <div className="relative">
            <Lock className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
            <input 
              type={show ? 'text' : 'password'} required
              className="w-full pr-12 pl-12 py-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-blue-500 font-bold outline-none" 
              placeholder="كلمة المرور" 
              value={form.p} onChange={e => setForm({...form, p: e.target.value})}
            />
            <button type="button" onClick={() => setShow(!show)} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
              {show ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          </div>
          <button className="w-full py-5 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl font-black text-lg transition-all shadow-xl shadow-blue-500/25 active:scale-95">دخول للمنصة</button>
        </form>
        <button onClick={goToSignup} className="w-full mt-8 text-slate-500 font-bold hover:text-blue-600 transition-colors">ليس لديك حساب؟ اشترك مجاناً</button>
      </div>
    </div>
  );
};

/**
 * --- واجهة إنشاء حساب جديد ---
 */
const SignupPage = ({ onSignup, goToLogin }: any) => {
  const [form, setForm] = useState({ n: '', u: '', p: '', r: 'STUDENT' as UserRole });
  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    onSignup({ 
      id: Date.now().toString(), 
      name: form.n, 
      username: form.u, 
      password: form.p, 
      role: form.r, 
      approved: form.r === 'STUDENT' 
    });
  };
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
      <div className="bg-white p-10 rounded-[3rem] shadow-xl w-full max-w-lg border border-slate-100">
        <h2 className="text-3xl font-black text-slate-900 text-center mb-8">عضوية جديدة</h2>
        <form onSubmit={submit} className="space-y-5">
          <input required className="w-full p-4 bg-slate-50 rounded-2xl border-none font-bold outline-none focus:ring-2 focus:ring-blue-500" placeholder="الاسم الكامل" value={form.n} onChange={e=>setForm({...form, n: e.target.value})} />
          <input required className="w-full p-4 bg-slate-50 rounded-2xl border-none font-bold outline-none focus:ring-2 focus:ring-blue-500" placeholder="اسم المستخدم / الهاتف" value={form.u} onChange={e=>setForm({...form, u: e.target.value})} />
          <input type="password" required className="w-full p-4 bg-slate-50 rounded-2xl border-none font-bold outline-none focus:ring-2 focus:ring-blue-500" placeholder="كلمة المرور" value={form.p} onChange={e=>setForm({...form, p: e.target.value})} />
          <div className="grid grid-cols-2 gap-4 py-2">
            <button type="button" onClick={() => setForm({...form, r: 'STUDENT'})} className={`p-4 rounded-2xl border-2 font-black transition-all ${form.r === 'STUDENT' ? 'border-blue-600 bg-blue-50 text-blue-600' : 'border-slate-100 text-slate-400'}`}>طالب علم</button>
            <button type="button" onClick={() => setForm({...form, r: 'TEACHER'})} className={`p-4 rounded-2xl border-2 font-black transition-all ${form.r === 'TEACHER' ? 'border-blue-600 bg-blue-50 text-blue-600' : 'border-slate-100 text-slate-400'}`}>أستاذ مادة</button>
          </div>
          <button className="w-full py-5 bg-blue-600 text-white rounded-2xl font-black text-xl shadow-lg shadow-blue-500/20">تأكيد البيانات</button>
        </form>
        <button onClick={goToLogin} className="w-full mt-6 text-slate-400 font-bold">العودة لتسجيل الدخول</button>
      </div>
    </div>
  );
};

/**
 * --- نظام التحكم والواجهات بناءً على الرتبة ---
 */
const PlatformShell = ({ user, logout, allUsers, setUsers, allCourses, setCourses, allResults }: any) => {
  
  // 1. فحص حالة الأستاذ (قيد الانتظار)
  if (user.role === 'TEACHER' && !user.approved) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#0f172a] p-10 text-center text-white">
        <div className="w-24 h-24 bg-amber-500/10 rounded-full flex items-center justify-center mb-6 animate-pulse border border-amber-500/20">
          <Clock className="w-12 h-12 text-amber-500" />
        </div>
        <h1 className="text-4xl font-black mb-4">أهلاً بك يا أستاذ {user.name}</h1>
        <p className="text-slate-400 max-w-md text-lg leading-relaxed mb-10">طلب انضمامك قيد المراجعة حالياً من قبل الإدارة. سيتم تفعيل أدوات النشر الخاصة بك قريباً.</p>
        <button onClick={logout} className="px-10 py-4 bg-red-500/10 text-red-500 rounded-2xl font-black hover:bg-red-500 hover:text-white transition-all">خروج مؤقت</button>
      </div>
    );
  }

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar الموحد */}
      <aside className="w-72 bg-[#0f172a] text-white p-8 flex flex-col shrink-0">
        <div className="mb-12 text-center">
          <div className="w-20 h-20 bg-blue-600 rounded-3xl mx-auto mb-4 flex items-center justify-center shadow-xl shadow-blue-500/40">
            <GraduationCap className="w-10 h-10" />
          </div>
          <h3 className="font-black text-xl truncate">{user.name}</h3>
          <span className="text-[10px] font-black uppercase tracking-widest text-blue-400 bg-white/5 px-3 py-1 rounded-full mt-2 inline-block border border-white/10">
            {user.role === 'ADMIN' ? 'المدير العام' : user.role === 'TEACHER' ? 'أستاذ معتمد' : 'طالب المنصة'}
          </span>
        </div>
        
        <nav className="flex-grow space-y-2">
           <SidebarItem icon={<LayoutDashboard />} label="الرئيسية" active />
           {user.role === 'ADMIN' && <SidebarItem icon={<Users />} label="الأعضاء" />}
           {user.role === 'TEACHER' && <SidebarItem icon={<Plus />} label="نشر درس" />}
           {user.role === 'STUDENT' && <SidebarItem icon={<Award />} label="إنجازاتي" />}
        </nav>

        <button onClick={logout} className="mt-auto flex items-center justify-center gap-3 p-5 bg-red-500/10 text-red-500 rounded-2xl font-black hover:bg-red-500 hover:text-white transition-all">
          <LogOut className="w-5 h-5" /> تسجيل خروج
        </button>
      </aside>

      {/* المحتوى المتغير بناءً على الرتبة */}
      <main className="flex-grow overflow-y-auto bg-[#f8fafc] p-10 relative">
        <div className="max-w-6xl mx-auto">
          {user.role === 'ADMIN' && <AdminPanel users={allUsers} setUsers={setUsers} courses={allCourses} setCourses={setCourses} />}
          {user.role === 'TEACHER' && <TeacherPanel user={user} courses={allCourses} setCourses={setCourses} />}
          {user.role === 'STUDENT' && <StudentPanel user={user} courses={allCourses} results={allResults} />}
        </div>
      </main>
    </div>
  );
};

const SidebarItem = ({ icon, label, active }: any) => (
  <button className={`w-full flex items-center gap-4 p-4 rounded-2xl font-black text-sm transition-all ${active ? 'bg-blue-600 text-white shadow-xl shadow-blue-600/20' : 'text-slate-400 hover:bg-white/5 hover:text-white'}`}>
    {icon} <span>{label}</span>
  </button>
);

/**
 * --- لوحة تحكم المدير ---
 */
const AdminPanel = ({ users, setUsers, courses, setCourses }: any) => {
  const approve = (id: string) => setUsers(users.map((u:any) => u.id === id ? {...u, approved: true} : u));
  const remove = (id: string) => confirm('حذف نهائي؟') && setUsers(users.filter((u:any) => u.id !== id));

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-4xl font-black text-slate-900">إدارة المنصة</h1>
        <div className="flex gap-4">
          <StatBox label="إجمالي الطلاب" val={users.filter((u:any)=>u.role==='STUDENT').length} color="blue" />
          <StatBox label="إجمالي الأساتذة" val={users.filter((u:any)=>u.role==='TEACHER').length} color="emerald" />
        </div>
      </div>

      <div className="bg-white rounded-[2.5rem] shadow-sm border border-slate-100 p-8">
        <h2 className="text-2xl font-black mb-8 flex items-center gap-3 text-slate-800"><Users /> إدارة الحسابات والطلبات</h2>
        <div className="space-y-4">
          {users.filter((u:any)=>u.role!=='ADMIN').map((u:any) => (
            <div key={u.id} className="flex items-center justify-between p-6 bg-slate-50 rounded-3xl border border-transparent hover:border-slate-200 transition-all group">
              <div className="flex items-center gap-5">
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center font-black text-xl shadow-inner ${u.role === 'TEACHER' ? 'bg-indigo-100 text-indigo-600' : 'bg-blue-100 text-blue-600'}`}>
                  {u.name.charAt(0)}
                </div>
                <div>
                  <h4 className="font-black text-slate-900 text-lg">{u.name}</h4>
                  <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">{u.username} • {u.role === 'TEACHER' ? 'أستاذ' : 'طالب'}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                {u.role === 'TEACHER' && !u.approved && (
                  <button onClick={()=>approve(u.id)} className="px-6 py-2 bg-emerald-600 text-white rounded-xl font-black hover:scale-105 transition-all shadow-lg shadow-emerald-500/20">تفعيل الحساب</button>
                )}
                <button onClick={()=>remove(u.id)} className="p-3 text-slate-300 hover:text-red-500 transition-colors"><Trash2 /></button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

/**
 * --- لوحة تحكم الأستاذ ---
 */
const TeacherPanel = ({ user, courses, setCourses }: any) => {
  const [form, setForm] = useState({ t: '', v: '', p: '' });
  const publish = (e: React.FormEvent) => {
    e.preventDefault();
    const cid = Math.floor(1000 + Math.random() * 9000).toString();
    setCourses([...courses, { id: Date.now().toString(), teacherId: user.id, teacherName: user.name, title: form.t, courseId: cid, videoUrl: form.v, pdfUrl: form.p }]);
    alert(`تم النشر بنجاح! كود المادة: ${cid}`);
    setForm({ t: '', v: '', p: '' });
  };

  return (
    <div className="space-y-12">
      <h1 className="text-4xl font-black text-slate-900">استوديو الأستاذ {user.name}</h1>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        <div className="bg-white p-10 rounded-[3rem] shadow-sm border border-slate-100">
          <h3 className="text-2xl font-black mb-8 flex items-center gap-3 text-blue-600"><Plus /> نشر حزمة تعليمية جديدة</h3>
          <form onSubmit={publish} className="space-y-6">
            <input required className="w-full p-5 bg-slate-50 rounded-2xl border-none outline-none focus:ring-2 focus:ring-blue-500 font-bold" placeholder="اسم المادة (مثال: فيزياء التميز)" value={form.t} onChange={e=>setForm({...form, t: e.target.value})} />
            <input className="w-full p-5 bg-slate-50 rounded-2xl border-none outline-none focus:ring-2 focus:ring-blue-500 font-bold" placeholder="رابط فيديو الشرح" value={form.v} onChange={e=>setForm({...form, v: e.target.value})} />
            <input className="w-full p-5 bg-slate-50 rounded-2xl border-none outline-none focus:ring-2 focus:ring-blue-500 font-bold" placeholder="رابط الملزمة (PDF)" value={form.p} onChange={e=>setForm({...form, p: e.target.value})} />
            <button className="w-full py-5 bg-blue-600 text-white rounded-2xl font-black text-xl shadow-xl shadow-blue-500/20">نشر المحتوى الآن</button>
          </form>
        </div>
        <div className="space-y-6">
          <h3 className="text-2xl font-black flex items-center gap-3 text-slate-700"><BookOpen /> المواد المنشورة</h3>
          {courses.filter((c:any)=>c.teacherId === user.id).map((c:any) => (
            <div key={c.id} className="p-6 bg-white rounded-3xl shadow-sm border border-slate-100 flex items-center justify-between group">
              <div>
                <h4 className="font-black text-lg group-hover:text-blue-600 transition-colors">{c.title}</h4>
                <p className="text-blue-600 font-black font-mono tracking-widest text-sm">كود الدخول: {c.courseId}</p>
              </div>
              <button onClick={()=>setCourses(courses.filter((cc:any)=>cc.id!==c.id))} className="text-slate-300 hover:text-red-500 transition-colors"><Trash2 /></button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

/**
 * --- قاعة الدراسة (الطالب) ---
 */
const StudentPanel = ({ user, courses }: any) => {
  const [cid, setCid] = useState('');
  const [active, setActive] = useState<CoursePackage | null>(null);

  const join = (e: React.FormEvent) => {
    e.preventDefault();
    const found = courses.find((c:any) => c.courseId === cid);
    if (found) { setActive(found); setCid(''); }
    else alert('عذراً، الكود غير صحيح أو المادة غير موجودة.');
  };

  if (active) {
    return (
      <div className="space-y-8 pb-20">
        <button onClick={()=>setActive(null)} className="flex items-center gap-2 text-blue-600 font-black text-lg hover:-translate-x-2 transition-transform"><ChevronLeft /> العودة للقاعة</button>
        <div className="bg-white p-10 rounded-[3rem] shadow-xl border border-slate-100 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-3 h-full bg-blue-600"></div>
          <h1 className="text-5xl font-black mb-10 leading-tight">{active.title} <span className="text-slate-300 block text-lg font-bold mt-2">بإشراف: {active.teacherName}</span></h1>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
            <div className="aspect-video bg-black rounded-[2.5rem] overflow-hidden border-8 border-slate-900 shadow-2xl">
              {active.videoUrl ? <iframe className="w-full h-full" src={active.videoUrl.replace('watch?v=', 'embed/')} frameBorder="0" allowFullScreen></iframe> : <div className="h-full flex items-center justify-center text-slate-600 font-black text-2xl">المحتوى المرئي غير متوفر</div>}
            </div>
            <div className="bg-slate-50 p-10 rounded-[2.5rem] border-2 border-dashed border-slate-200 flex flex-col items-center justify-center text-center">
              <ShieldAlert className="w-20 h-20 text-red-100 mb-6" />
              <h4 className="text-2xl font-black text-slate-700 mb-4">بيئة دراسة محمية</h4>
              <p className="text-slate-400 font-bold leading-relaxed">المحتوى التعليمي ملك للأستاذ {active.teacherName}. يمنع منعاً باتاً النسخ أو تصوير الشاشة. النظام يراقب كافة العمليات المسجلة.</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto py-24">
      <div className="text-center mb-16">
        <h1 className="text-5xl font-black text-slate-900 mb-6 tracking-tight">أهلاً بك في قاعة الدراسة</h1>
        <p className="text-slate-500 font-bold text-xl">أدخل كود المادة المكون من 4 أرقام لبدء رحلتك نحو التميز</p>
      </div>
      <form onSubmit={join} className="flex gap-4 p-5 bg-white rounded-[3rem] shadow-2xl shadow-blue-500/10 border border-slate-100">
        <input 
          className="flex-grow p-6 text-center text-5xl font-black tracking-[0.5em] outline-none text-blue-600 placeholder:text-slate-100" 
          maxLength={4} placeholder="0000" value={cid} onChange={e=>setCid(e.target.value)} 
        />
        <button className="px-12 bg-blue-600 text-white rounded-[2rem] font-black text-2xl hover:bg-blue-700 transition-all shadow-xl shadow-blue-600/30">دخول</button>
      </form>
    </div>
  );
};

const StatBox = ({ label, val, color }: any) => (
  <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 text-center min-w-[120px]">
    <p className="text-[10px] font-black text-slate-400 mb-1 uppercase">{label}</p>
    <p className={`text-3xl font-black text-${color}-600`}>{val}</p>
  </div>
);

const root = createRoot(document.getElementById('root')!);
root.render(<App />);
