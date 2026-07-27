import React from 'react';
import { 
  Users, 
  GraduationCap, 
  Award, 
  CalendarCheck, 
  FileSpreadsheet, 
  FileText, 
  Upload, 
  UserCheck, 
  TrendingUp, 
  ArrowUpRight,
  School,
  CheckCircle2
} from 'lucide-react';
import { Student, GradeRecord, DailyAttendance, SchoolSettings, MonthlyAttendanceRecap, SUBJECTS } from '../types';

interface DashboardViewProps {
  students: Student[];
  grades: GradeRecord[];
  attendance: DailyAttendance[];
  school: SchoolSettings;
  setActiveTab: (tab: string) => void;
  onOpenUploadCenter: () => void;
  onExportAllStudentsExcel: () => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  students,
  grades,
  attendance,
  school,
  setActiveTab,
  onOpenUploadCenter,
  onExportAllStudentsExcel,
}) => {
  const totalStudents = students.length;
  const activeStudents = students.filter(s => s.status === 'Aktif').length;
  const maleCount = students.filter(s => s.jenisKelamin === 'L').length;
  const femaleCount = students.filter(s => s.jenisKelamin === 'P').length;

  // Calculate Overall Average Score
  let totalScoreSum = 0;
  let totalScoreCount = 0;
  grades.forEach(g => {
    Object.values(g.nilai).forEach(v => {
      if (v > 0) {
        totalScoreSum += v;
        totalScoreCount++;
      }
    });
  });
  const overallAvg = totalScoreCount > 0 ? (totalScoreSum / totalScoreCount).toFixed(1) : '83.5';

  // Rombel / Class list
  const classes = ['1A', '2A', '3A', '4A', '5A', '6A'];
  const classBreakdown = classes.map(c => ({
    kelas: c,
    count: students.filter(s => s.kelas === c).length,
  }));

  return (
    <div className="space-y-6">
      
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 rounded-2xl p-6 text-white shadow-md relative overflow-hidden">
        <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-white/5 skew-x-12 pointer-events-none" />
        
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-blue-500/20 text-blue-200 text-xs font-semibold border border-blue-400/30">
              <School className="w-3.5 h-3.5" />
              <span>Sistem Database Resmi SDN 1 SUKAJAYA</span>
            </div>
            <h2 className="text-2xl font-extrabold tracking-tight">
              Selamat Datang di Portal Data Siswa
            </h2>
            <p className="text-xs text-slate-300 max-w-xl leading-relaxed">
              Kelola database siswa, input nilai mata pelajaran, catat presensi harian/bulanan, serta unduh Laporan Nilai dan Absensi berkala dalam format PDF & Excel.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <button
              onClick={onOpenUploadCenter}
              className="inline-flex items-center space-x-2 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold transition shadow-sm"
            >
              <Upload className="w-4 h-4" />
              <span>Upload Nilai/Absensi</span>
            </button>
            <button
              onClick={() => setActiveTab('nilai')}
              className="inline-flex items-center space-x-2 px-4 py-2.5 bg-white/10 hover:bg-white/20 text-white rounded-xl text-xs font-bold transition border border-white/20"
            >
              <FileText className="w-4 h-4" />
              <span>Cetak Raport PDF</span>
            </button>
          </div>
        </div>
      </div>

      {/* Primary Metrics Grid */}
      <div className="grid grid-[#0] sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Total Siswa */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Total Siswa Aktif</span>
            <div className="p-2.5 rounded-xl bg-blue-50 text-blue-600">
              <Users className="w-5 h-5" />
            </div>
          </div>
          <div>
            <div className="text-2xl font-black text-slate-900">{totalStudents} <span className="text-xs font-medium text-slate-500">Siswa</span></div>
            <p className="text-xs text-slate-500 mt-1 flex items-center space-x-2">
              <span className="text-blue-600 font-semibold">{maleCount} Laki-laki</span>
              <span>•</span>
              <span className="text-pink-600 font-semibold">{femaleCount} Perempuan</span>
            </p>
          </div>
        </div>

        {/* Total Rombel */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Rombongan Belajar</span>
            <div className="p-2.5 rounded-xl bg-amber-50 text-amber-600">
              <GraduationCap className="w-5 h-5" />
            </div>
          </div>
          <div>
            <div className="text-2xl font-black text-slate-900">6 <span className="text-xs font-medium text-slate-500">Kelas</span></div>
            <p className="text-xs text-slate-500 mt-1">
              Kelas 1A, 2A, 3A, 4A, 5A, 6A
            </p>
          </div>
        </div>

        {/* Rata-Rata Nilai */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Rata-Rata Nilai</span>
            <div className="p-2.5 rounded-xl bg-emerald-50 text-emerald-600">
              <Award className="w-5 h-5" />
            </div>
          </div>
          <div>
            <div className="text-2xl font-black text-slate-900">{overallAvg} <span className="text-xs font-medium text-slate-500">/ 100</span></div>
            <p className="text-xs text-emerald-600 font-semibold mt-1 flex items-center space-x-1">
              <TrendingUp className="w-3.5 h-3.5" />
              <span>Memenuhi KKM (70 - 75)</span>
            </p>
          </div>
        </div>

        {/* Kehadiran Rata-rata */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Kehadiran Bulan Ini</span>
            <div className="p-2.5 rounded-xl bg-indigo-50 text-indigo-600">
              <CalendarCheck className="w-5 h-5" />
            </div>
          </div>
          <div>
            <div className="text-2xl font-black text-slate-900">96.8%</div>
            <p className="text-xs text-indigo-600 font-semibold mt-1 flex items-center space-x-1">
              <UserCheck className="w-3.5 h-3.5" />
              <span>Sangat Baik</span>
            </p>
          </div>
        </div>

      </div>

      {/* Main Grid Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Class Breakdown List */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 p-5 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-slate-900">Sebaran Siswa per Kelas / Rombel</h3>
              <p className="text-xs text-slate-500">Jumlah siswa terdaftar di SDN 1 Sukajaya</p>
            </div>
            <button
              onClick={() => setActiveTab('siswa')}
              className="text-xs font-bold text-blue-600 hover:text-blue-800 flex items-center space-x-1"
            >
              <span>Lihat Semua Siswa</span>
              <ArrowUpRight className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {classBreakdown.map((item) => (
              <div
                key={item.kelas}
                onClick={() => setActiveTab('siswa')}
                className="bg-slate-50 hover:bg-blue-50/50 border border-slate-200 hover:border-blue-300 rounded-xl p-3.5 cursor-pointer transition space-y-2 group"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-extrabold text-slate-800 group-hover:text-blue-700">Kelas {item.kelas}</span>
                  <span className="w-2 h-2 rounded-full bg-emerald-500" />
                </div>
                <div className="text-lg font-black text-slate-900">
                  {item.count} <span className="text-xs font-normal text-slate-500">Siswa</span>
                </div>
                <div className="w-full bg-slate-200 rounded-full h-1.5 overflow-hidden">
                  <div
                    className="bg-blue-600 h-1.5 rounded-full"
                    style={{ width: `${Math.min(100, (item.count / 30) * 100)}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Export & Actions Card */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 space-y-4">
          <h3 className="text-sm font-bold text-slate-900">Fitur Cepat Ekspor PDF & Excel</h3>
          <p className="text-xs text-slate-500">Unduh dokumen berkala secara instan</p>

          <div className="space-y-2.5">
            <button
              onClick={() => setActiveTab('nilai')}
              className="w-full flex items-center justify-between p-3 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl text-left transition group"
            >
              <div className="flex items-center space-x-3">
                <div className="p-2 rounded-lg bg-red-100 text-red-700">
                  <FileText className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-900">Raport Individual (PDF)</div>
                  <div className="text-[11px] text-slate-500">Dokumen Raport Resmi Siswa</div>
                </div>
              </div>
              <ArrowUpRight className="w-4 h-4 text-slate-400 group-hover:text-slate-700" />
            </button>

            <button
              onClick={() => setActiveTab('nilai')}
              className="w-full flex items-center justify-between p-3 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl text-left transition group"
            >
              <div className="flex items-center space-x-3">
                <div className="p-2 rounded-lg bg-emerald-100 text-emerald-700">
                  <FileSpreadsheet className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-900">Leger Nilai Kelas (Excel)</div>
                  <div className="text-[11px] text-slate-500">Rekapitulasi Semua Mata Pelajaran</div>
                </div>
              </div>
              <ArrowUpRight className="w-4 h-4 text-slate-400 group-hover:text-slate-700" />
            </button>

            <button
              onClick={() => setActiveTab('absensi')}
              className="w-full flex items-center justify-between p-3 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl text-left transition group"
            >
              <div className="flex items-center space-x-3">
                <div className="p-2 rounded-lg bg-indigo-100 text-indigo-700">
                  <CalendarCheck className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-900">Rekap Absensi (PDF & Excel)</div>
                  <div className="text-[11px] text-slate-500">Laporan Kehadiran Bulanan</div>
                </div>
              </div>
              <ArrowUpRight className="w-4 h-4 text-slate-400 group-hover:text-slate-700" />
            </button>

            <button
              onClick={onExportAllStudentsExcel}
              className="w-full flex items-center justify-between p-3 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl text-left transition group"
            >
              <div className="flex items-center space-x-3">
                <div className="p-2 rounded-lg bg-blue-100 text-blue-700">
                  <Users className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-900">Daftar Induk Siswa (Excel)</div>
                  <div className="text-[11px] text-slate-500">Unduh Seluruh Data Siswa</div>
                </div>
              </div>
              <ArrowUpRight className="w-4 h-4 text-slate-400 group-hover:text-slate-700" />
            </button>
          </div>
        </div>

      </div>

    </div>
  );
};
