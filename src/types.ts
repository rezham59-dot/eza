export type Gender = 'L' | 'P';

export type StudentStatus = 'Aktif' | 'Lulus' | 'Pindah' | 'Non-Aktif';

export interface Student {
  id: string;
  nisn: string;
  nis: string;
  nama: string;
  jenisKelamin: Gender;
  kelas: string; // e.g. "1A", "2A", "3A", "4A", "5A", "6A"
  tempatLahir: string;
  tanggalLahir: string; // YYYY-MM-DD
  namaOrangTua: string;
  noHpOrangTua: string;
  alamat: string;
  status: StudentStatus;
  fotoUrl?: string;
}

export type SubjectCode = 
  | 'PAI' 
  | 'PANCASILA' 
  | 'BIND' 
  | 'MTK' 
  | 'IPAS' 
  | 'PJOK' 
  | 'SENI' 
  | 'SUNDA' 
  | 'INGGRIS';

export interface SubjectInfo {
  code: SubjectCode;
  nama: string;
  kkm: number;
}

export const SUBJECTS: SubjectInfo[] = [
  { code: 'PAI', nama: 'Pendidikan Agama & Budi Pekerti', kkm: 75 },
  { code: 'PANCASILA', nama: 'Pendidikan Pancasila', kkm: 75 },
  { code: 'BIND', nama: 'Bahasa Indonesia', kkm: 75 },
  { code: 'MTK', nama: 'Matematika', kkm: 70 },
  { code: 'IPAS', nama: 'IPAS (IPA & IPS)', kkm: 70 },
  { code: 'PJOK', nama: 'PJOK', kkm: 75 },
  { code: 'SENI', nama: 'Seni Budaya & Prakarya', kkm: 75 },
  { code: 'SUNDA', nama: 'Bahasa Sunda (Muatan Lokal)', kkm: 70 },
  { code: 'INGGRIS', nama: 'Bahasa Inggris', kkm: 70 },
];

export interface GradeRecord {
  id: string;
  studentId: string;
  semester: 'Ganjil' | 'Genap';
  tahunAjaran: string; // e.g. "2025/2026"
  jenisPenilaian: 'STS' | 'SAS' | 'Formatif' | 'Raport'; // STS = Sumatif Tengah Semester, SAS = Sumatif Akhir Semester
  nilai: Record<SubjectCode, number>;
  catatanGuru?: string;
  updatedAt: string;
}

export type AttendanceStatus = 'H' | 'S' | 'I' | 'A'; // Hadir, Sakit, Izin, Alpa

export interface DailyAttendance {
  id: string;
  tanggal: string; // YYYY-MM-DD
  kelas: string;
  records: Record<string, AttendanceStatus>; // studentId -> status
}

export interface MonthlyAttendanceRecap {
  studentId: string;
  studentName: string;
  nisn: string;
  kelas: string;
  bulan: string; // e.g. "2026-07"
  hadir: number;
  sakit: number;
  izin: number;
  alpa: number;
  totalHariEfektif: number;
  persentase: number;
}

export interface SchoolSettings {
  namaSekolah: string;
  npsn: string;
  alamat: string;
  desa: string;
  kecamatan: string;
  kabupaten: string;
  provinsi: string;
  kodePos: string;
  email: string;
  telepon: string;
  namaKepalaSekolah: string;
  nipKepalaSekolah: string;
  tahunAjaran: string;
  semesterAktif: 'Ganjil' | 'Genap';
  waliKelas: Record<string, { nama: string; nip: string }>; // kelas -> wali
}

export interface ImportPreviewItem {
  type: 'siswa' | 'nilai' | 'absensi';
  status: 'valid' | 'invalid';
  message: string;
  data: any;
}
