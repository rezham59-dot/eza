import React from 'react';
import { X, GraduationCap, Phone, MapPin, Calendar, User, FileText, Printer, Award } from 'lucide-react';
import { Student, SchoolSettings } from '../types';

interface StudentDetailModalProps {
  student: Student | null;
  school: SchoolSettings;
  onClose: () => void;
  onEdit: (student: Student) => void;
}

export const StudentDetailModal: React.FC<StudentDetailModalProps> = ({
  student,
  school,
  onClose,
  onEdit,
}) => {
  if (!student) return null;

  const handlePrintCard = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-2xl w-full border border-slate-200 shadow-2xl overflow-hidden my-8 animate-in fade-in zoom-in-95 duration-200">
        
        {/* Modal Header */}
        <div className="bg-slate-900 text-white px-6 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <GraduationCap className="w-5 h-5 text-blue-400" />
            <h3 className="text-base font-bold">Profil Lengkap & Kartu Pelajar Siswa</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-6">
          
          {/* Official Printable Student ID Card Preview */}
          <div className="bg-gradient-to-br from-blue-900 via-indigo-900 to-slate-900 text-white rounded-2xl p-5 shadow-lg border border-blue-700 relative overflow-hidden">
            <div className="flex items-start justify-between border-b border-blue-700/60 pb-3">
              <div>
                <p className="text-[10px] uppercase tracking-widest text-blue-300 font-bold">KARTU PELAJAR RESMI</p>
                <h4 className="text-lg font-black tracking-tight">{school.namaSekolah}</h4>
                <p className="text-[10px] text-slate-300">NPSN: {school.npsn} • Kec. {school.kecamatan}</p>
              </div>
              <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center font-bold text-xs border border-white/20">
                SD
              </div>
            </div>

            <div className="mt-4 flex flex-col sm:flex-row items-center sm:items-start gap-4">
              <div className="w-20 h-24 rounded-xl bg-slate-800 border-2 border-white/20 flex items-center justify-center text-slate-400 shrink-0">
                <User className="w-10 h-10" />
              </div>

              <div className="space-y-1 text-center sm:text-left flex-1">
                <div className="text-base font-black text-white">{student.nama}</div>
                <div className="inline-block px-2 py-0.5 rounded-md bg-blue-500/30 text-blue-200 text-xs font-bold border border-blue-400/30">
                  NISN: {student.nisn} | NIS: {student.nis}
                </div>
                <div className="text-xs text-slate-300 pt-1">
                  Kelas: <span className="font-bold text-white">Kelas {student.kelas}</span> | L/P: <span className="font-bold text-white">{student.jenisKelamin === 'L' ? 'Laki-Laki' : 'Perempuan'}</span>
                </div>
                <div className="text-[11px] text-slate-400">
                  TTL: {student.tempatLahir}, {student.tanggalLahir}
                </div>
              </div>
            </div>
          </div>

          {/* Student Detailed Information Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-2">
              <span className="font-bold text-slate-500 uppercase tracking-wider block text-[10px]">Data Utama Siswa</span>
              <div className="space-y-1.5 text-slate-700">
                <div><span className="text-slate-400">Nama Lengkap:</span> <strong className="text-slate-900">{student.nama}</strong></div>
                <div><span className="text-slate-400">NISN:</span> {student.nisn}</div>
                <div><span className="text-slate-400">NIS:</span> {student.nis}</div>
                <div><span className="text-slate-400">Jenis Kelamin:</span> {student.jenisKelamin === 'L' ? 'Laki-Laki' : 'Perempuan'}</div>
                <div><span className="text-slate-400">Status Keaktifan:</span> <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">{student.status}</span></div>
              </div>
            </div>

            <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-2">
              <span className="font-bold text-slate-500 uppercase tracking-wider block text-[10px]">Data Orang Tua & Kontak</span>
              <div className="space-y-1.5 text-slate-700">
                <div><span className="text-slate-400">Orang Tua/Wali:</span> <strong className="text-slate-900">{student.namaOrangTua}</strong></div>
                <div><span className="text-slate-400">No HP Orang Tua:</span> {student.noHpOrangTua || '-'}</div>
                <div><span className="text-slate-400">Alamat Lengkap:</span> {student.alamat}</div>
              </div>
            </div>

          </div>

        </div>

        {/* Modal Footer */}
        <div className="bg-slate-50 px-6 py-4 border-t border-slate-200 flex items-center justify-between">
          <button
            onClick={handlePrintCard}
            className="inline-flex items-center space-x-1.5 px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-900 text-white text-xs font-bold transition"
          >
            <Printer className="w-4 h-4" />
            <span>Cetak Kartu Pelajar</span>
          </button>

          <div className="flex items-center space-x-2">
            <button
              onClick={() => {
                onClose();
                onEdit(student);
              }}
              className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition"
            >
              Edit Data Siswa
            </button>
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-700 text-xs font-bold transition"
            >
              Tutup
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
