import * as XLSX from 'xlsx';
import { Student, GradeRecord, SUBJECTS, SchoolSettings, MonthlyAttendanceRecap, SubjectCode } from '../types';

/**
 * Download standard Excel Template for Students
 */
export function downloadStudentTemplate() {
  const data = [
    {
      'NISN*': '0151234999',
      'NIS*': '23240199',
      'Nama Lengkap*': 'Ahmad Fauzan',
      'Jenis Kelamin (L/P)*': 'L',
      'Kelas*': '5A',
      'Tempat Lahir': 'Bogor',
      'Tanggal Lahir (YYYY-MM-DD)': '2015-05-15',
      'Nama Orang Tua / Wali': 'Rahmat Hidayat',
      'No HP Orang Tua': '081234567890',
      'Alamat Lengkap': 'Jl. Sukajaya No. 10',
      'Status (Aktif/Lulus/Pindah)': 'Aktif',
    },
  ];

  const worksheet = XLSX.utils.json_to_sheet(data);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Template Siswa');
  
  // Set column widths
  worksheet['!cols'] = [
    { wch: 15 }, { wch: 12 }, { wch: 25 }, { wch: 18 }, { wch: 10 },
    { wch: 15 }, { wch: 22 }, { wch: 25 }, { wch: 18 }, { wch: 30 }, { wch: 20 },
  ];

  XLSX.writeFile(workbook, 'Template_Import_Siswa_SDN1Sukajaya.xlsx');
}

/**
 * Export Students List to Excel
 */
export function exportStudentsToExcel(students: Student[], filterKelas?: string) {
  const data = students.map((s, idx) => ({
    'No': idx + 1,
    'NISN': s.nisn,
    'NIS': s.nis,
    'Nama Lengkap': s.nama,
    'L/P': s.jenisKelamin,
    'Kelas': s.kelas,
    'Tempat Lahir': s.tempatLahir,
    'Tanggal Lahir': s.tanggalLahir,
    'Nama Orang Tua/Wali': s.namaOrangTua,
    'No HP Orang Tua': s.noHpOrangTua,
    'Alamat': s.alamat,
    'Status': s.status,
  }));

  const worksheet = XLSX.utils.json_to_sheet(data);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Data Siswa');

  const title = `Data_Siswa_SDN1_Sukajaya${filterKelas ? '_' + filterKelas : ''}.xlsx`;
  XLSX.writeFile(workbook, title);
}

/**
 * Download Grade Input Excel Template
 */
export function downloadGradeTemplate(students: Student[], kelas: string, semester: string, tahunAjaran: string) {
  const filtered = students.filter(s => s.kelas === kelas && s.status === 'Aktif');

  const rows = filtered.length > 0 ? filtered.map((s, idx) => {
    const row: Record<string, any> = {
      'No': idx + 1,
      'ID Siswa (Jangan Diubah)': s.id,
      'NISN': s.nisn,
      'Nama Siswa': s.nama,
      'Kelas': s.kelas,
    };
    SUBJECTS.forEach(sub => {
      row[`${sub.nama} (${sub.code})`] = 80;
    });
    row['Catatan Wali Kelas'] = 'Sangat baik, tingkatkan semangat belajar.';
    return row;
  }) : [
    {
      'No': 1,
      'ID Siswa (Jangan Diubah)': 'STU-001',
      'NISN': '0151234501',
      'Nama Siswa': 'Contoh Siswa',
      'Kelas': kelas || '5A',
      ...SUBJECTS.reduce((acc, sub) => ({ ...acc, [`${sub.nama} (${sub.code})`]: 80 }), {}),
      'Catatan Wali Kelas': 'Contoh catatan guru',
    }
  ];

  const worksheet = XLSX.utils.json_to_sheet(rows);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, `Nilai ${kelas}`);

  XLSX.writeFile(workbook, `Template_Nilai_Kelas_${kelas}_${semester}_${tahunAjaran.replace('/', '-')}.xlsx`);
}

/**
 * Export Grades / Leger Nilai to Excel
 */
export function exportGradesToExcel(
  grades: GradeRecord[],
  students: Student[],
  school: SchoolSettings,
  filterKelas: string,
  semester: string,
  tahunAjaran: string
) {
  const filteredStudents = students.filter(s => s.kelas === filterKelas && s.status === 'Aktif');

  const rows = filteredStudents.map((student, idx) => {
    const gradeRec = grades.find(g => g.studentId === student.id && g.semester === semester && g.tahunAjaran === tahunAjaran);
    const nilais = gradeRec?.nilai || {};
    
    let total = 0;
    let count = 0;

    const row: Record<string, any> = {
      'No': idx + 1,
      'NISN': student.nisn,
      'NIS': student.nis,
      'Nama Siswa': student.nama,
      'L/P': student.jenisKelamin,
      'Kelas': student.kelas,
    };

    SUBJECTS.forEach(sub => {
      const val = nilais[sub.code] ?? 0;
      row[sub.nama] = val;
      if (val > 0) {
        total += val;
        count++;
      }
    });

    const avg = count > 0 ? Number((total / count).toFixed(2)) : 0;
    row['Total Nilai'] = total;
    row['Rata-Rata'] = avg;
    row['Catatan Guru'] = gradeRec?.catatanGuru || '-';

    return row;
  });

  const worksheet = XLSX.utils.json_to_sheet(rows);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, `Leger Kelas ${filterKelas}`);

  XLSX.writeFile(workbook, `Leger_Nilai_Kelas_${filterKelas}_${semester}_${tahunAjaran.replace('/', '-')}.xlsx`);
}

/**
 * Download Attendance Excel Template
 */
export function downloadAttendanceTemplate(students: Student[], kelas: string, bulanLabel: string) {
  const filtered = students.filter(s => s.kelas === kelas && s.status === 'Aktif');

  const rows = filtered.map((s, idx) => ({
    'No': idx + 1,
    'ID Siswa (Jangan Diubah)': s.id,
    'NISN': s.nisn,
    'Nama Siswa': s.nama,
    'Kelas': s.kelas,
    'Jumlah Hadir (H)': 20,
    'Jumlah Sakit (S)': 1,
    'Jumlah Izin (I)': 0,
    'Jumlah Alpa (A)': 0,
  }));

  const worksheet = XLSX.utils.json_to_sheet(rows);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, `Absensi ${kelas}`);

  XLSX.writeFile(workbook, `Template_Absensi_Kelas_${kelas}_${bulanLabel}.xlsx`);
}

/**
 * Export Attendance Recap to Excel
 */
export function exportAttendanceToExcel(
  recaps: MonthlyAttendanceRecap[],
  kelas: string,
  bulan: string
) {
  const rows = recaps.map((r, idx) => ({
    'No': idx + 1,
    'NISN': r.nisn,
    'Nama Siswa': r.studentName,
    'Kelas': r.kelas,
    'Bulan': r.bulan,
    'Hari Efektif': r.totalHariEfektif,
    'Hadir (H)': r.hadir,
    'Sakit (S)': r.sakit,
    'Izin (I)': r.izin,
    'Alpa (A)': r.alpa,
    'Persentase Kehadiran (%)': `${r.persentase}%`,
  }));

  const worksheet = XLSX.utils.json_to_sheet(rows);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, `Absensi ${kelas}`);

  XLSX.writeFile(workbook, `Rekap_Absensi_Kelas_${kelas}_${bulan}.xlsx`);
}

/**
 * Parse uploaded Excel or CSV file
 */
export async function parseExcelFile(file: File): Promise<any[]> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target?.result as ArrayBuffer);
        const workbook = XLSX.read(data, { type: 'array' });
        const firstSheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[firstSheetName];
        const json = XLSX.utils.sheet_to_json(worksheet, { defval: '' });
        resolve(json);
      } catch (err) {
        reject(err);
      }
    };
    reader.onerror = (error) => reject(error);
    reader.readAsArrayBuffer(file);
  });
}
