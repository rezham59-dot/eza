import React, { useState } from 'react';
import { 
  Users, 
  Plus, 
  Search, 
  Filter, 
  Download, 
  FileSpreadsheet, 
  FileText, 
  Eye, 
  Edit, 
  Trash2, 
  X,
  UserCheck,
  CheckCircle2,
  Upload
} from 'lucide-react';
import { Student, Gender, StudentStatus, SchoolSettings } from '../types';

interface StudentsViewProps {
  students: Student[];
  school: SchoolSettings;
  onAddStudent: (student: Omit<Student, 'id'>) => void;
  onUpdateStudent: (student: Student) => void;
  onDeleteStudent: (id: string) => void;
  onSelectStudent: (student: Student) => void;
  onExportExcel: (kelasFilter?: string) => void;
  onExportPDF: (kelasFilter?: string) => void;
  onOpenUploadCenter: () => void;
}

export const StudentsView: React.FC<StudentsViewProps> = ({
  students,
  school,
  onAddStudent,
  onUpdateStudent,
  onDeleteStudent,
  onSelectStudent,
  onExportExcel,
  onExportPDF,
  onOpenUploadCenter,
}) => {
  const [selectedKelas, setSelectedKelas] = useState<string>('Semua');
  const [selectedGender, setSelectedGender] = useState<string>('Semua');
  const [searchTerm, setSearchTerm] = useState<string>('');
  
  // Modal State
  const [isFormOpen, setIsFormOpen] = useState<boolean>(false);
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);

  // Form State
  const [formData, setFormData] = useState<{
    nisn: string;
    nis: string;
    nama: string;
    jenisKelamin: Gender;
    kelas: string;
    tempatLahir: string;
    tanggalLahir: string;
    namaOrangTua: string;
    noHpOrangTua: string;
    alamat: string;
    status: StudentStatus;
  }>({
    nisn: '',
    nis: '',
    nama: '',
    jenisKelamin: 'L',
    kelas: '5A',
    tempatLahir: 'Bogor',
    tanggalLahir: '2015-01-01',
    namaOrangTua: '',
    noHpOrangTua: '',
    alamat: '',
    status: 'Aktif',
  });

  // Filter students
  const filteredStudents = students.filter((s) => {
    const matchesKelas = selectedKelas === 'Semua' || s.kelas === selectedKelas;
    const matchesGender = selectedGender === 'Semua' || s.jenisKelamin === selectedGender;
    const matchesSearch = 
      s.nama.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.nisn.includes(searchTerm) ||
      s.nis.includes(searchTerm);
    return matchesKelas && matchesGender && matchesSearch;
  });

  const handleOpenAdd = () => {
    setEditingStudent(null);
    setFormData({
      nisn: `015${Math.floor(1000000 + Math.random() * 9000000)}`,
      nis: `2324${Math.floor(1000 + Math.random() * 9000)}`,
      nama: '',
      jenisKelamin: 'L',
      kelas: selectedKelas !== 'Semua' ? selectedKelas : '5A',
      tempatLahir: 'Bogor',
      tanggalLahir: '2015-01-01',
      namaOrangTua: '',
      noHpOrangTua: '',
      alamat: 'Sukajaya',
      status: 'Aktif',
    });
    setIsFormOpen(true);
  };

  const handleOpenEdit = (student: Student) => {
    setEditingStudent(student);
    setFormData({
      nisn: student.nisn,
      nis: student.nis,
      nama: student.nama,
      jenisKelamin: student.jenisKelamin,
      kelas: student.kelas,
      tempatLahir: student.tempatLahir,
      tanggalLahir: student.tanggalLahir,
      namaOrangTua: student.namaOrangTua,
      noHpOrangTua: student.noHpOrangTua,
      alamat: student.alamat,
      status: student.status,
    });
    setIsFormOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.nama || !formData.nisn) {
      alert('Mohon isi Nama Siswa dan NISN.');
      return;
    }

    if (editingStudent) {
      onUpdateStudent({
        ...editingStudent,
        ...formData,
      });
    } else {
      onAddStudent(formData);
    }
    setIsFormOpen(false);
  };

  return (
    <div className="space-y-6">
      
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-extrabold text-slate-900 tracking-tight flex items-center space-x-2">
            <Users className="w-6 h-6 text-blue-600" />
            <span>Database Induk Siswa</span>
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Total {filteredStudents.length} siswa terdaftar di SDN 1 Sukajaya
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={onOpenUploadCenter}
            className="inline-flex items-center space-x-1.5 px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition border border-slate-200"
          >
            <Upload className="w-4 h-4 text-slate-600" />
            <span>Import Excel</span>
          </button>

          <button
            onClick={() => onExportExcel(selectedKelas !== 'Semua' ? selectedKelas : undefined)}
            className="inline-flex items-center space-x-1.5 px-3.5 py-2 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 text-xs font-bold transition"
          >
            <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
            <span>Ekspor Excel</span>
          </button>

          <button
            onClick={() => onExportPDF(selectedKelas !== 'Semua' ? selectedKelas : undefined)}
            className="inline-flex items-center space-x-1.5 px-3.5 py-2 rounded-xl bg-red-50 hover:bg-red-100 text-red-800 border border-red-200 text-xs font-bold transition"
          >
            <FileText className="w-4 h-4 text-red-600" />
            <span>Cetak PDF</span>
          </button>

          <button
            onClick={handleOpenAdd}
            className="inline-flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition shadow-sm"
          >
            <Plus className="w-4 h-4" />
            <span>Tambah Siswa Baru</span>
          </button>
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-col md:flex-row items-center justify-between gap-4">
        
        {/* Search */}
        <div className="relative w-full md:w-72">
          <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
          <input
            type="text"
            placeholder="Cari nama, NISN, atau NIS..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600"
          />
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          
          {/* Filter Kelas */}
          <div className="flex items-center space-x-2">
            <span className="text-xs font-bold text-slate-500">Kelas:</span>
            <select
              value={selectedKelas}
              onChange={(e) => setSelectedKelas(e.target.value)}
              className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-600"
            >
              <option value="Semua">Semua Kelas (1A - 6A)</option>
              <option value="1A">Kelas 1A</option>
              <option value="2A">Kelas 2A</option>
              <option value="3A">Kelas 3A</option>
              <option value="4A">Kelas 4A</option>
              <option value="5A">Kelas 5A</option>
              <option value="6A">Kelas 6A</option>
            </select>
          </div>

          {/* Filter Gender */}
          <div className="flex items-center space-x-2">
            <span className="text-xs font-bold text-slate-500">Gender:</span>
            <select
              value={selectedGender}
              onChange={(e) => setSelectedGender(e.target.value)}
              className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-600"
            >
              <option value="Semua">Semua L/P</option>
              <option value="L">Laki-Laki (L)</option>
              <option value="P">Perempuan (P)</option>
            </select>
          </div>

        </div>

      </div>

      {/* Student Table */}
      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold uppercase tracking-wider text-[11px]">
                <th className="py-3.5 px-4 text-center w-12">No</th>
                <th className="py-3.5 px-4">NISN / NIS</th>
                <th className="py-3.5 px-4">Nama Lengkap Siswa</th>
                <th className="py-3.5 px-4 text-center">L/P</th>
                <th className="py-3.5 px-4 text-center">Kelas</th>
                <th className="py-3.5 px-4">Orang Tua / Wali</th>
                <th className="py-3.5 px-4">No. HP</th>
                <th className="py-3.5 px-4 text-center">Status</th>
                <th className="py-3.5 px-4 text-center w-28">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {filteredStudents.length === 0 ? (
                <tr>
                  <td colSpan={9} className="py-12 text-center text-slate-400">
                    Tidak ada data siswa ditemukan untuk filter ini.
                  </td>
                </tr>
              ) : (
                filteredStudents.map((student, idx) => (
                  <tr key={student.id} className="hover:bg-slate-50/80 transition">
                    <td className="py-3 px-4 text-center font-medium text-slate-400">{idx + 1}</td>
                    <td className="py-3 px-4 font-mono font-semibold text-slate-800">
                      <div>{student.nisn}</div>
                      <div className="text-[10px] text-slate-400">NIS: {student.nis}</div>
                    </td>
                    <td className="py-3 px-4 font-bold text-slate-900">
                      <button
                        onClick={() => onSelectStudent(student)}
                        className="hover:text-blue-600 text-left transition"
                      >
                        {student.nama}
                      </button>
                    </td>
                    <td className="py-3 px-4 text-center">
                      <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold ${
                        student.jenisKelamin === 'L' ? 'bg-blue-100 text-blue-800' : 'bg-pink-100 text-pink-800'
                      }`}>
                        {student.jenisKelamin}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-center">
                      <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-800 font-bold border border-slate-200">
                        {student.kelas}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-slate-700">{student.namaOrangTua || '-'}</td>
                    <td className="py-3 px-4 font-mono text-slate-600">{student.noHpOrangTua || '-'}</td>
                    <td className="py-3 px-4 text-center">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                        {student.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-center">
                      <div className="flex items-center justify-center space-x-1">
                        <button
                          onClick={() => onSelectStudent(student)}
                          className="p-1.5 rounded-lg text-slate-600 hover:text-blue-600 hover:bg-blue-50 transition"
                          title="Lihat Profil / Kartu Pelajar"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleOpenEdit(student)}
                          className="p-1.5 rounded-lg text-slate-600 hover:text-amber-600 hover:bg-amber-50 transition"
                          title="Edit Siswa"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => {
                            if (confirm(`Hapus data siswa ${student.nama}?`)) {
                              onDeleteStudent(student.id);
                            }
                          }}
                          className="p-1.5 rounded-lg text-slate-600 hover:text-red-600 hover:bg-red-50 transition"
                          title="Hapus Siswa"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add / Edit Student Modal */}
      {isFormOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full border border-slate-200 shadow-2xl overflow-hidden my-8">
            <div className="bg-slate-900 text-white px-6 py-4 flex items-center justify-between">
              <h3 className="text-sm font-bold">
                {editingStudent ? 'Edit Data Siswa' : 'Tambah Siswa Baru'}
              </h3>
              <button
                onClick={() => setIsFormOpen(false)}
                className="p-1 text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">NISN *</label>
                  <input
                    type="text"
                    value={formData.nisn}
                    onChange={(e) => setFormData({ ...formData, nisn: e.target.value })}
                    className="w-full p-2 bg-slate-50 border border-slate-300 rounded-lg text-xs"
                    required
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">NIS Sekolah *</label>
                  <input
                    type="text"
                    value={formData.nis}
                    onChange={(e) => setFormData({ ...formData, nis: e.target.value })}
                    className="w-full p-2 bg-slate-50 border border-slate-300 rounded-lg text-xs"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Nama Lengkap Siswa *</label>
                <input
                  type="text"
                  value={formData.nama}
                  onChange={(e) => setFormData({ ...formData, nama: e.target.value })}
                  placeholder="e.g. Ahmad Fauzi"
                  className="w-full p-2 bg-slate-50 border border-slate-300 rounded-lg text-xs font-semibold"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Jenis Kelamin *</label>
                  <select
                    value={formData.jenisKelamin}
                    onChange={(e) => setFormData({ ...formData, jenisKelamin: e.target.value as Gender })}
                    className="w-full p-2 bg-slate-50 border border-slate-300 rounded-lg text-xs"
                  >
                    <option value="L">Laki-Laki (L)</option>
                    <option value="P">Perempuan (P)</option>
                  </select>
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Kelas / Rombel *</label>
                  <select
                    value={formData.kelas}
                    onChange={(e) => setFormData({ ...formData, kelas: e.target.value })}
                    className="w-full p-2 bg-slate-50 border border-slate-300 rounded-lg text-xs font-bold"
                  >
                    <option value="1A">Kelas 1A</option>
                    <option value="2A">Kelas 2A</option>
                    <option value="3A">Kelas 3A</option>
                    <option value="4A">Kelas 4A</option>
                    <option value="5A">Kelas 5A</option>
                    <option value="6A">Kelas 6A</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Tempat Lahir</label>
                  <input
                    type="text"
                    value={formData.tempatLahir}
                    onChange={(e) => setFormData({ ...formData, tempatLahir: e.target.value })}
                    className="w-full p-2 bg-slate-50 border border-slate-300 rounded-lg text-xs"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Tanggal Lahir</label>
                  <input
                    type="date"
                    value={formData.tanggalLahir}
                    onChange={(e) => setFormData({ ...formData, tanggalLahir: e.target.value })}
                    className="w-full p-2 bg-slate-50 border border-slate-300 rounded-lg text-xs"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Nama Orang Tua / Wali</label>
                  <input
                    type="text"
                    value={formData.namaOrangTua}
                    onChange={(e) => setFormData({ ...formData, namaOrangTua: e.target.value })}
                    className="w-full p-2 bg-slate-50 border border-slate-300 rounded-lg text-xs"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">No HP Orang Tua</label>
                  <input
                    type="text"
                    value={formData.noHpOrangTua}
                    onChange={(e) => setFormData({ ...formData, noHpOrangTua: e.target.value })}
                    className="w-full p-2 bg-slate-50 border border-slate-300 rounded-lg text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Alamat Lengkap</label>
                <textarea
                  rows={2}
                  value={formData.alamat}
                  onChange={(e) => setFormData({ ...formData, alamat: e.target.value })}
                  className="w-full p-2 bg-slate-50 border border-slate-300 rounded-lg text-xs"
                />
              </div>

              <div className="pt-3 border-t border-slate-200 flex items-center justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setIsFormOpen(false)}
                  className="px-4 py-2 bg-slate-200 text-slate-700 rounded-xl font-bold hover:bg-slate-300 transition"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition"
                >
                  Simpan Data Siswa
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
