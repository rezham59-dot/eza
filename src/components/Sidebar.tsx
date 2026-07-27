import React from 'react';
import { 
  LayoutDashboard, 
  Users, 
  Award, 
  CalendarCheck, 
  UploadCloud, 
  Settings,
  ChevronRight,
  School
} from 'lucide-react';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  studentCount: number;
}

export const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab, studentCount }) => {
  const menuItems = [
    {
      id: 'dashboard',
      label: 'Ikhtisar Utama',
      icon: LayoutDashboard,
      badge: null,
      desc: 'Ringkasan Statistik',
    },
    {
      id: 'siswa',
      label: 'Database Siswa',
      icon: Users,
      badge: `${studentCount} Siswa`,
      desc: 'Kelola Induk Siswa',
    },
    {
      id: 'nilai',
      label: 'Laporan Nilai',
      icon: Award,
      badge: 'Raport PDF/Excel',
      desc: 'Input & Cetak Raport',
    },
    {
      id: 'absensi',
      label: 'Absensi Berkala',
      icon: CalendarCheck,
      badge: 'Harian & Rekap',
      desc: 'Rekap Presensi',
    },
    {
      id: 'upload',
      label: 'Pusat Upload & Import',
      icon: UploadCloud,
      badge: 'Excel Template',
      desc: 'Upload File Berkas',
    },
    {
      id: 'settings',
      label: 'Pengaturan Sekolah',
      icon: Settings,
      badge: null,
      desc: 'Kop & Wali Kelas',
    },
  ];

  return (
    <aside className="w-full md:w-64 bg-white border-r border-slate-200 shrink-0 p-4 space-y-6">
      
      {/* School Badge Info */}
      <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 flex items-center space-x-3">
        <div className="w-9 h-9 rounded-lg bg-blue-100 text-blue-800 flex items-center justify-center font-bold text-sm">
          SD
        </div>
        <div className="truncate">
          <p className="text-xs font-bold text-slate-800 truncate">SDN 1 SUKAJAYA</p>
          <p className="text-[11px] text-slate-500 truncate">Sistem Database Resmi</p>
        </div>
      </div>

      {/* Nav Menu */}
      <nav className="space-y-1.5">
        <div className="px-3 pb-1 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
          Menu Utama
        </div>

        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;

          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-left font-medium text-xs transition-all duration-150 ${
                isActive
                  ? 'bg-blue-600 text-white shadow-sm ring-1 ring-blue-700 font-semibold'
                  : 'text-slate-700 hover:bg-slate-100 hover:text-slate-900'
              }`}
            >
              <div className="flex items-center space-x-3 truncate">
                <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-white' : 'text-slate-500'}`} />
                <div className="truncate">
                  <span className="block leading-tight truncate">{item.label}</span>
                  <span className={`block text-[10px] mt-0.5 ${isActive ? 'text-blue-100' : 'text-slate-400'}`}>
                    {item.desc}
                  </span>
                </div>
              </div>

              {item.badge && (
                <span
                  className={`text-[10px] px-2 py-0.5 rounded-full font-semibold shrink-0 ml-1 ${
                    isActive
                      ? 'bg-blue-500 text-white border border-blue-400'
                      : 'bg-slate-100 text-slate-600 border border-slate-200'
                  }`}
                >
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Quick Help Box */}
      <div className="pt-4 border-t border-slate-200">
        <div className="bg-gradient-to-br from-indigo-50 to-blue-50 border border-indigo-100 rounded-xl p-3.5 space-y-2 text-xs">
          <div className="flex items-center space-x-1.5 text-indigo-900 font-bold">
            <School className="w-4 h-4 text-indigo-600" />
            <span>Info Format Berkas</span>
          </div>
          <p className="text-[11px] text-indigo-800 leading-relaxed">
            Mendukung cetak Laporan Nilai (Raport & Leger) & Rekap Absensi dalam format <b>PDF</b> dan <b>Excel (.xlsx)</b>.
          </p>
        </div>
      </div>

    </aside>
  );
};
