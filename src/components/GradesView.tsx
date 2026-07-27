import React, { useState } from 'react';
import { 
  Award, 
  FileSpreadsheet, 
  FileText, 
  Upload, 
  Save, 
  CheckCircle2, 
  HelpCircle,
  Sparkles,
  BookOpen
} from 'lucide-react';
import { Student, GradeRecord, SUBJECTS, SubjectCode, SchoolSettings } from '../types';

interface GradesViewProps {
  students: Student[];
  grades: GradeRecord[];
  school: SchoolSettings;
  onSaveGrade: (grade: GradeRecord) => void;
  onExportLegerExcel: (kelas: string, semester: string, tahunAjaran: string) => void;
  onExportLegerPDF: (kelas: string, semester: string, tahunAjaran: string) => void;
  onGenerateStudentRaportPDF: (student: Student, grade?: GradeRecord) => void;
  onDownloadTemplate: (kelas: string, semester: string, tahunAjaran: string) => void;
  onOpenUploadCenter: () => void;
}

export const GradesView: React.FC<GradesViewProps> = ({
  students,
  grades,
  school,
  onSaveGrade,
  onExportLegerExcel,
  onExportLegerPDF,
  onGenerateStudentRaportPDF,
  onDownloadTemplate,
  onOpenUploadCenter,
}) => {
  const [selectedKelas, setSelectedKelas] = useState<string>('5A');
  const [selectedSemester, setSelectedSemester] = useState<'Ganjil' | 'Genap'>(school.semesterAktif);
  const [selectedTahun, setSelectedTahun] = useState<string>(school.tahunAjaran);
  const [saveNotification, setSaveNotification] = useState<string | null>(null);

  // Filter active students in this class
  const classStudents = students.filter((s) => s.kelas === selectedKelas && s.status === 'Aktif');

  // Get or initialize grade records in state for fast inline editing
  const getGradeForStudent = (studentId: string): GradeRecord => {
    const existing = grades.find(
      (g) => g.studentId === studentId && g.semester === selectedSemester && g.tahunAjaran === selectedTahun
    );

    if (existing) return existing;

    // Default template
    const defaultNilai = SUBJECTS.reduce((acc, sub) => ({ ...acc, [sub.code]: 80 }), {} as Record<SubjectCode, number>);

    return {
      id: `GRD-${selectedKelas}-${studentId}`,
      studentId,
      semester: selectedSemester,
      tahunAjaran: selectedTahun,
      jenisPenilaian: 'Raport',
      nilai: defaultNilai,
      catatanGuru: 'Siswa dapat mengikuti kegiatan pembelajaran dengan sangat baik.',
      updatedAt: new Date().toISOString().split('T')[0],
    };
  };

  const handleScoreChange = (studentId: string, subjectCode: SubjectCode, value: number) => {
    const clampedScore = Math.max(0, Math.min(100, isNaN(value) ? 0 : value));
    const currentGrade = getGradeForStudent(studentId);

    const updated: GradeRecord = {
      ...currentGrade,
      nilai: {
        ...currentGrade.nilai,
        [subjectCode]: clampedScore,
      },
      updatedAt: new Date().toISOString().split('T')[0],
    };

    onSaveGrade(updated);
    showTempNotification('Nilai berhasil diperbarui');
  };

  const handleCatatanChange = (studentId: string, note: string) => {
    const currentGrade = getGradeForStudent(studentId);
    const updated: GradeRecord = {
      ...currentGrade,
      catatanGuru: note,
      updatedAt: new Date().toISOString().split('T')[0],
    };
    onSaveGrade(updated);
  };

  const showTempNotification = (msg: string) => {
    setSaveNotification(msg);
    setTimeout(() => setSaveNotification(null), 2000);
  };

  return (
    <div className="space-y-6">
      
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-extrabold text-slate-900 tracking-tight flex items-center space-x-2">
            <Award className="w-6 h-6 text-amber-600" />
            <span>Laporan Nilai Siswa (Kurikulum Merdeka)</span>
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Input nilai mata pelajaran, catatan wali kelas, dan unduh Leger / Raport PDF & Excel
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => onDownloadTemplate(selectedKelas, selectedSemester, selectedTahun)}
            className="inline-flex items-center space-x-1.5 px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl border border-slate-300 transition"
            title="Unduh Format Excel untuk Diisi"
          >
            <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
            <span>Unduh Template Excel</span>
          </button>

          <button
            onClick={onOpenUploadCenter}
            className="inline-flex items-center space-x-1.5 px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-xs transition"
          >
            <Upload className="w-4 h-4" />
            <span>Upload File Nilai</span>
          </button>

          <button
            onClick={() => onExportLegerExcel(selectedKelas, selectedSemester, selectedTahun)}
            className="inline-flex items-center space-x-1.5 px-3.5 py-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 text-xs font-bold rounded-xl transition"
          >
            <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
            <span>Leger Excel</span>
          </button>

          <button
            onClick={() => onExportLegerPDF(selectedKelas, selectedSemester, selectedTahun)}
            className="inline-flex items-center space-x-1.5 px-3.5 py-2 bg-red-600 hover:bg-red-700 text-white text-xs font-bold rounded-xl shadow-xs transition"
          >
            <FileText className="w-4 h-4" />
            <span>Cetak Leger PDF</span>
          </button>
        </div>
      </div>

      {/* Notification */}
      {saveNotification && (
        <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold px-4 py-2.5 rounded-xl flex items-center space-x-2 animate-in fade-in duration-150">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>{saveNotification}</span>
        </div>
      )}

      {/* Filter Control Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-4">
          
          {/* Rombel Select */}
          <div className="flex items-center space-x-2">
            <span className="text-xs font-bold text-slate-500">Pilih Kelas:</span>
            <select
              value={selectedKelas}
              onChange={(e) => setSelectedKelas(e.target.value)}
              className="px-3.5 py-1.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-black text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-600"
            >
              <option value="1A">Kelas 1A</option>
              <option value="2A">Kelas 2A</option>
              <option value="3A">Kelas 3A</option>
              <option value="4A">Kelas 4A</option>
              <option value="5A">Kelas 5A</option>
              <option value="6A">Kelas 6A</option>
            </select>
          </div>

          {/* Semester Select */}
          <div className="flex items-center space-x-2">
            <span className="text-xs font-bold text-slate-500">Semester:</span>
            <select
              value={selectedSemester}
              onChange={(e) => setSelectedSemester(e.target.value as 'Ganjil' | 'Genap')}
              className="px-3.5 py-1.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-600"
            >
              <option value="Ganjil">Semester Ganjil</option>
              <option value="Genap">Semester Genap</option>
            </select>
          </div>

          {/* Tahun Ajaran */}
          <div className="flex items-center space-x-2">
            <span className="text-xs font-bold text-slate-500">Tahun Ajaran:</span>
            <span className="px-3 py-1 bg-blue-50 text-blue-800 border border-blue-200 font-bold text-xs rounded-xl">
              {selectedTahun}
            </span>
          </div>

        </div>

        <div className="text-xs text-slate-500 font-medium">
          Wali Kelas: <strong className="text-slate-800">{school.waliKelas[selectedKelas]?.nama || 'Belum diatur'}</strong>
        </div>
      </div>

      {/* Interactive Grade Ledger Input Table */}
      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
        <div className="p-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <BookOpen className="w-4 h-4 text-blue-600" />
            <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
              Tabel Input Nilai Mata Pelajaran (Kelas {selectedKelas})
            </h3>
          </div>
          <span className="text-[11px] text-slate-500 italic">
            * Isikan nilai 0 - 100 per mata pelajaran
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-100 border-b border-slate-200 text-slate-700 font-bold uppercase tracking-wider text-[10px]">
                <th className="py-3 px-3 text-center w-10">No</th>
                <th className="py-3 px-3 min-w-[180px]">Nama Siswa</th>
                {SUBJECTS.map((sub) => (
                  <th key={sub.code} className="py-3 px-2 text-center min-w-[65px]" title={sub.nama}>
                    <div>{sub.code}</div>
                    <div className="text-[9px] font-normal text-slate-400">KKM {sub.kkm}</div>
                  </th>
                ))}
                <th className="py-3 px-3 text-center min-w-[60px]">Rata²</th>
                <th className="py-3 px-4 min-w-[200px]">Catatan Wali Kelas</th>
                <th className="py-3 px-3 text-center min-w-[120px]">Cetak Raport</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-800">
              {classStudents.length === 0 ? (
                <tr>
                  <td colSpan={14} className="py-12 text-center text-slate-400">
                    Belum ada siswa terdaftar di Kelas {selectedKelas}.
                  </td>
                </tr>
              ) : (
                classStudents.map((student, idx) => {
                  const gradeRecord = getGradeForStudent(student.id);
                  const nilais = gradeRecord.nilai;

                  let total = 0;
                  let count = 0;
                  SUBJECTS.forEach((sub) => {
                    const score = nilais[sub.code] ?? 0;
                    if (score > 0) {
                      total += score;
                      count++;
                    }
                  });
                  const avg = count > 0 ? (total / count).toFixed(1) : '0';

                  return (
                    <tr key={student.id} className="hover:bg-slate-50 transition">
                      <td className="py-2.5 px-3 text-center text-slate-400 font-medium">{idx + 1}</td>
                      <td className="py-2.5 px-3 font-bold text-slate-900">
                        <div>{student.nama}</div>
                        <div className="text-[10px] text-slate-400 font-mono">NISN: {student.nisn}</div>
                      </td>

                      {/* Subject Scores Input Fields */}
                      {SUBJECTS.map((sub) => {
                        const score = nilais[sub.code] ?? 0;
                        const isUnderKkm = score > 0 && score < sub.kkm;

                        return (
                          <td key={sub.code} className="py-2 px-1 text-center">
                            <input
                              type="number"
                              min={0}
                              max={100}
                              value={score === 0 ? '' : score}
                              onChange={(e) =>
                                handleScoreChange(student.id, sub.code, parseInt(e.target.value, 10))
                              }
                              className={`w-13 text-center py-1 rounded-lg text-xs font-extrabold border transition focus:outline-none focus:ring-2 focus:ring-blue-600 ${
                                isUnderKkm
                                  ? 'bg-amber-50 border-amber-300 text-amber-800'
                                  : 'bg-slate-50 border-slate-200 text-slate-900'
                              }`}
                              placeholder="0"
                            />
                          </td>
                        );
                      })}

                      {/* Rata-Rata */}
                      <td className="py-2.5 px-3 text-center font-black text-blue-700 bg-blue-50/50">
                        {avg}
                      </td>

                      {/* Catatan Wali Kelas */}
                      <td className="py-2.5 px-3">
                        <input
                          type="text"
                          value={gradeRecord.catatanGuru || ''}
                          onChange={(e) => handleCatatanChange(student.id, e.target.value)}
                          placeholder="Catatan perkembangan siswa..."
                          className="w-full px-2.5 py-1 bg-slate-50 border border-slate-200 rounded-lg text-[11px] text-slate-700 focus:outline-none focus:ring-1 focus:ring-blue-600"
                        />
                      </td>

                      {/* Action: Cetak Raport Individual PDF */}
                      <td className="py-2.5 px-3 text-center">
                        <button
                          onClick={() => onGenerateStudentRaportPDF(student, gradeRecord)}
                          className="inline-flex items-center space-x-1 px-2.5 py-1.5 rounded-lg bg-red-600 hover:bg-red-700 text-white font-bold text-[10px] transition shadow-2xs"
                        >
                          <FileText className="w-3.5 h-3.5" />
                          <span>Raport PDF</span>
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
