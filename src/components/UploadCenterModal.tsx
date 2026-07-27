import React, { useState } from 'react';
import { 
  X, 
  Upload, 
  FileSpreadsheet, 
  CheckCircle2, 
  AlertCircle, 
  Download, 
  ArrowRight,
  Sparkles
} from 'lucide-react';
import { parseExcelFile, downloadStudentTemplate } from '../utils/excelUtils';
import { Student, GradeRecord, DailyAttendance, SubjectCode, SUBJECTS } from '../types';

interface UploadCenterModalProps {
  students: Student[];
  onImportStudents: (newStudents: Student[]) => void;
  onImportGrades: (newGrades: GradeRecord[]) => void;
  onClose: () => void;
}

export const UploadCenterModal: React.FC<UploadCenterModalProps> = ({
  students,
  onImportStudents,
  onImportGrades,
  onClose,
}) => {
  const [importType, setImportType] = useState<'siswa' | 'nilai' | 'absensi'>('siswa');
  const [file, setFile] = useState<File | null>(null);
  const [parsedRows, setParsedRows] = useState<any[]>([]);
  const [isParsing, setIsParsing] = useState<boolean>(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (!selected) return;
    setFile(selected);
    setIsParsing(true);
    setStatusMessage(null);

    try {
      const json = await parseExcelFile(selected);
      setParsedRows(json);
      setStatusMessage(`Berhasil membaca ${json.length} baris dari file Excel.`);
    } catch (err) {
      console.error(err);
      setStatusMessage('Gagal membaca file Excel. Pastikan format file sesuai.');
    } finally {
      setIsParsing(false);
    }
  };

  const handleProcessImport = () => {
    if (parsedRows.length === 0) return;

    if (importType === 'siswa') {
      const newStudents: Student[] = parsedRows.map((row, idx) => ({
        id: `STU-IMP-${Date.now()}-${idx}`,
        nisn: String(row['NISN*'] || row['NISN'] || `015${Math.floor(1000000 + Math.random() * 9000000)}`),
        nis: String(row['NIS*'] || row['NIS'] || `2324${Math.floor(1000 + Math.random() * 9000)}`),
        nama: String(row['Nama Lengkap*'] || row['Nama Lengkap'] || row['Nama Siswa'] || 'Siswa Import'),
        jenisKelamin: (row['Jenis Kelamin (L/P)*'] || row['Jenis Kelamin'] || row['L/P'] || 'L').toUpperCase().includes('P') ? 'P' : 'L',
        kelas: String(row['Kelas*'] || row['Kelas'] || '5A'),
        tempatLahir: String(row['Tempat Lahir'] || 'Bogor'),
        tanggalLahir: String(row['Tanggal Lahir (YYYY-MM-DD)'] || row['Tanggal Lahir'] || '2015-01-01'),
        namaOrangTua: String(row['Nama Orang Tua / Wali'] || row['Nama Orang Tua'] || '-'),
        noHpOrangTua: String(row['No HP Orang Tua'] || '-'),
        alamat: String(row['Alamat Lengkap'] || row['Alamat'] || 'Sukajaya'),
        status: 'Aktif',
      }));

      onImportStudents(newStudents);
      alert(`Berhasil mengimpor ${newStudents.length} data siswa baru!`);
      onClose();
    } else if (importType === 'nilai') {
      const newGrades: GradeRecord[] = parsedRows.map((row, idx) => {
        const studentId = row['ID Siswa (Jangan Diubah)'] || students.find(s => s.nisn === String(row['NISN']))?.id || `STU-00${(idx % 10) + 1}`;

        const nilais = SUBJECTS.reduce((acc, sub) => {
          const key = Object.keys(row).find(k => k.includes(sub.code) || k.toLowerCase().includes(sub.nama.toLowerCase()));
          const score = key ? parseInt(row[key], 10) : 80;
          return { ...acc, [sub.code]: isNaN(score) ? 80 : Math.min(100, Math.max(0, score)) };
        }, {} as Record<SubjectCode, number>);

        return {
          id: `GRD-IMP-${Date.now()}-${idx}`,
          studentId,
          semester: 'Genap',
          tahunAjaran: '2025/2026',
          jenisPenilaian: 'Raport',
          nilai: nilais,
          catatanGuru: row['Catatan Wali Kelas'] || 'Catatan terimpor otomatis.',
          updatedAt: new Date().toISOString().split('T')[0],
        };
      });

      onImportGrades(newGrades);
      alert(`Berhasil mengimpor ${newGrades.length} data laporan nilai!`);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-2xl w-full border border-slate-200 shadow-2xl overflow-hidden my-8">
        
        {/* Header */}
        <div className="bg-slate-900 text-white px-6 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Upload className="w-5 h-5 text-emerald-400" />
            <h3 className="text-base font-bold">Pusat Upload & Import Excel / CSV</h3>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg text-slate-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-6 text-xs">
          
          {/* Choice Tabs */}
          <div className="space-y-2">
            <label className="font-bold text-slate-700 block">Pilih Jenis Data yang Akan Diupload:</label>
            <div className="grid grid-cols-3 gap-2">
              <button
                onClick={() => { setImportType('siswa'); setParsedRows([]); setFile(null); }}
                className={`p-3 rounded-xl border text-center font-bold transition ${
                  importType === 'siswa' ? 'bg-blue-50 border-blue-600 text-blue-900' : 'bg-slate-50 border-slate-200 text-slate-600'
                }`}
              >
                1. Data Siswa
              </button>
              <button
                onClick={() => { setImportType('nilai'); setParsedRows([]); setFile(null); }}
                className={`p-3 rounded-xl border text-center font-bold transition ${
                  importType === 'nilai' ? 'bg-amber-50 border-amber-600 text-amber-900' : 'bg-slate-50 border-slate-200 text-slate-600'
                }`}
              >
                2. Laporan Nilai
              </button>
              <button
                onClick={() => { setImportType('absensi'); setParsedRows([]); setFile(null); }}
                className={`p-3 rounded-xl border text-center font-bold transition ${
                  importType === 'absensi' ? 'bg-emerald-50 border-emerald-600 text-emerald-900' : 'bg-slate-50 border-slate-200 text-slate-600'
                }`}
              >
                3. Absensi
              </button>
            </div>
          </div>

          {/* Download Template Box */}
          <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 flex items-center justify-between">
            <div>
              <strong className="text-slate-800 block">Belum punya format file Excel?</strong>
              <span className="text-[11px] text-slate-500">Unduh berkas sampel resmi untuk diisi lalu upload ulang.</span>
            </div>
            <button
              onClick={downloadStudentTemplate}
              className="inline-flex items-center space-x-1 px-3 py-1.5 bg-slate-800 hover:bg-slate-900 text-white font-bold rounded-lg transition"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Unduh Template</span>
            </button>
          </div>

          {/* Dropzone */}
          <div className="border-2 border-dashed border-slate-300 rounded-2xl p-6 text-center hover:bg-slate-50 transition cursor-pointer relative">
            <input
              type="file"
              accept=".xlsx, .xls, .csv"
              onChange={handleFileChange}
              className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
            />
            <FileSpreadsheet className="w-10 h-10 text-emerald-600 mx-auto mb-2" />
            <p className="font-bold text-slate-800">
              {file ? file.name : 'Klik atau Tarik File Excel (.xlsx / .csv) ke Sini'}
            </p>
            <p className="text-[11px] text-slate-400 mt-1">Ukuran berkas maksimal 10MB</p>
          </div>

          {/* Preview Parsed Data */}
          {statusMessage && (
            <div className="bg-blue-50 border border-blue-200 p-3 rounded-xl text-blue-900 font-bold flex items-center space-x-2">
              <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0" />
              <span>{statusMessage}</span>
            </div>
          )}

          {parsedRows.length > 0 && (
            <div className="space-y-2">
              <span className="font-bold text-slate-700 block">Pratinjau {parsedRows.length} Baris Data:</span>
              <div className="max-h-36 overflow-y-auto border border-slate-200 rounded-xl">
                <table className="w-full text-[10px] text-left">
                  <thead className="bg-slate-100 font-bold sticky top-0">
                    <tr>
                      {Object.keys(parsedRows[0] || {}).slice(0, 5).map((col) => (
                        <th key={col} className="p-2 border-b border-slate-200">{col}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {parsedRows.slice(0, 5).map((row, i) => (
                      <tr key={i} className="border-b border-slate-100">
                        {Object.values(row).slice(0, 5).map((val: any, j) => (
                          <td key={j} className="p-2 text-slate-700 truncate max-w-[100px]">{String(val)}</td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

        </div>

        {/* Footer */}
        <div className="bg-slate-50 px-6 py-4 border-t border-slate-200 flex items-center justify-end space-x-2">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-200 text-slate-700 font-bold rounded-xl hover:bg-slate-300 text-xs transition"
          >
            Batal
          </button>
          <button
            onClick={handleProcessImport}
            disabled={parsedRows.length === 0}
            className={`px-5 py-2 font-bold text-white rounded-xl text-xs transition ${
              parsedRows.length > 0 ? 'bg-emerald-600 hover:bg-emerald-700' : 'bg-slate-400 cursor-not-allowed'
            }`}
          >
            Proses Import ke Database
          </button>
        </div>

      </div>
    </div>
  );
};
