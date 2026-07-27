import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { Student, GradeRecord, SUBJECTS, SchoolSettings, MonthlyAttendanceRecap, SubjectCode } from '../types';

/**
 * Draw Official School Kop / Header
 */
function drawSchoolHeader(doc: jsPDF, school: SchoolSettings, title: string) {
  const pageWidth = doc.internal.pageSize.getWidth();

  // Top header text
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.text('PEMERINTAH KABUPATEN BOGOR', pageWidth / 2, 14, { align: 'center' });
  doc.text('DINAS PENDIDIKAN', pageWidth / 2, 19, { align: 'center' });

  doc.setFontSize(14);
  doc.text(school.namaSekolah, pageWidth / 2, 25, { align: 'center' });

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.text(`${school.alamat} | Email: ${school.email} | Telp: ${school.telepon}`, pageWidth / 2, 30, { align: 'center' });
  doc.text(`NPSN: ${school.npsn} | Desa ${school.desa}, Kec. ${school.kecamatan}, Kab. ${school.kabupaten}`, pageWidth / 2, 34, { align: 'center' });

  // Double divider lines
  doc.setLineWidth(1);
  doc.line(14, 37, pageWidth - 14, 37);
  doc.setLineWidth(0.3);
  doc.line(14, 38.5, pageWidth - 14, 38.5);

  // Document Title
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.text(title.toUpperCase(), pageWidth / 2, 46, { align: 'center' });
}

/**
 * Draw Official Signature Block
 */
function drawSignatureBlock(doc: jsPDF, school: SchoolSettings, waliKelasNama: string, waliKelasNip: string, startY: number) {
  const pageWidth = doc.internal.pageSize.getWidth();
  const dateStr = `Sukajaya, ${new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}`;

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);

  // Left: Wali Kelas
  doc.text('Mengetahui,', 20, startY);
  doc.text('Wali Kelas', 20, startY + 5);
  doc.text(waliKelasNama, 20, startY + 25);
  doc.setFont('helvetica', 'bold');
  doc.text(`NIP. ${waliKelasNip || '-'}`, 20, startY + 29);

  // Right: Kepala Sekolah
  doc.setFont('helvetica', 'normal');
  doc.text(dateStr, pageWidth - 70, startY);
  doc.text('Kepala Sekolah,', pageWidth - 70, startY + 5);
  doc.text(school.namaKepalaSekolah, pageWidth - 70, startY + 25);
  doc.setFont('helvetica', 'bold');
  doc.text(`NIP. ${school.nipKepalaSekolah}`, pageWidth - 70, startY + 29);
}

/**
 * Helper to determine predicate from score
 */
function getPredicate(score: number): { predikat: string; ket: string } {
  if (score >= 90) return { predikat: 'A', ket: 'Sangat Baik' };
  if (score >= 80) return { predikat: 'B', ket: 'Baik' };
  if (score >= 70) return { predikat: 'C', ket: 'Cukup' };
  return { predikat: 'D', ket: 'Perlu Bimbingan' };
}

/**
 * Generate Printable Individual Student Raport (PDF)
 */
export function generateStudentRaportPDF(
  student: Student,
  grade: GradeRecord | undefined,
  attendanceRecap: { hadir: number; sakit: number; izin: number; alpa: number } | undefined,
  school: SchoolSettings
) {
  const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
  const pageWidth = doc.internal.pageSize.getWidth();

  drawSchoolHeader(doc, school, 'LAPORAN HASIL BELAJAR (RAPORT SISWA)');

  // Student Information Box
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);

  const leftX = 14;
  const rightX = pageWidth / 2 + 10;
  let currentY = 54;

  doc.text(`Nama Siswa   : ${student.nama}`, leftX, currentY);
  doc.text(`NISN / NIS   : ${student.nisn} / ${student.nis}`, leftX, currentY + 5);
  doc.text(`Kelas / Rombel: Kelas ${student.kelas}`, leftX, currentY + 10);

  doc.text(`Fase / Kurikulum : Kurikulum Merdeka`, rightX, currentY);
  doc.text(`Semester / Tahun : ${grade?.semester || school.semesterAktif} / ${grade?.tahunAjaran || school.tahunAjaran}`, rightX, currentY + 5);
  doc.text(`Status Siswa     : ${student.status}`, rightX, currentY + 10);

  currentY += 16;

  // Grade Table
  const nilais = grade?.nilai || {};
  let totalScore = 0;
  let count = 0;

  const tableBody = SUBJECTS.map((sub, idx) => {
    const score = nilais[sub.code] ?? 0;
    if (score > 0) {
      totalScore += score;
      count++;
    }
    const { predikat, ket } = getPredicate(score);
    return [
      idx + 1,
      sub.nama,
      sub.kkm,
      score > 0 ? score : '-',
      score > 0 ? predikat : '-',
      score > 0 ? `Capaian Kompetensi: ${ket}` : 'Belum diisi',
    ];
  });

  const avgScore = count > 0 ? (totalScore / count).toFixed(1) : '-';

  autoTable(doc, {
    startY: currentY,
    head: [['No', 'Mata Pelajaran', 'KKM', 'Nilai', 'Predikat', 'Capaian Kompetensi']],
    body: tableBody,
    theme: 'grid',
    headStyles: { fillColor: [30, 64, 175], textColor: 255, fontSize: 8, fontStyle: 'bold', halign: 'center' },
    bodyStyles: { fontSize: 8, cellPadding: 2 },
    columnStyles: {
      0: { halign: 'center', cellWidth: 10 },
      1: { cellWidth: 55 },
      2: { halign: 'center', cellWidth: 14 },
      3: { halign: 'center', cellWidth: 16, fontStyle: 'bold' },
      4: { halign: 'center', cellWidth: 18 },
      5: { cellWidth: 'auto' },
    },
    margin: { left: 14, right: 14 },
  });

  let nextY = (doc as any).lastAutoTable.finalY + 6;

  // Total & Average Box
  doc.setFillColor(243, 244, 246);
  doc.rect(14, nextY, pageWidth - 28, 10, 'F');
  doc.setDrawColor(209, 213, 219);
  doc.rect(14, nextY, pageWidth - 28, 10, 'S');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.text(`Total Nilai: ${totalScore}`, 20, nextY + 6);
  doc.text(`Rata-Rata Nilai: ${avgScore}`, 80, nextY + 6);
  doc.text(`Jumlah Mata Pelajaran: ${count} dari ${SUBJECTS.length}`, 140, nextY + 6);

  nextY += 14;

  // Catatan Guru Box
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.text('Catatan Wali Kelas:', 14, nextY);
  
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  const noteText = grade?.catatanGuru || 'Siswa menunjukkan motivasi belajar yang baik dan sikap terpuji. Tingkatkan terus keaktifan di kelas.';
  
  doc.setDrawColor(209, 213, 219);
  doc.setFillColor(255, 255, 255);
  doc.rect(14, nextY + 2, pageWidth - 28, 12, 'S');
  doc.text(noteText, 18, nextY + 8, { maxWidth: pageWidth - 36 });

  nextY += 18;

  // Attendance Box Table
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.text('Ketidakhadiran (Semester):', 14, nextY);

  const attHadir = attendanceRecap?.hadir ?? 20;
  const attSakit = attendanceRecap?.sakit ?? 0;
  const attIzin = attendanceRecap?.izin ?? 0;
  const attAlpa = attendanceRecap?.alpa ?? 0;

  autoTable(doc, {
    startY: nextY + 2,
    head: [['Sakit (S)', 'Izin (I)', 'Tanpa Keterangan (A)', 'Hadir (H)']],
    body: [[`${attSakit} Hari`, `${attIzin} Hari`, `${attAlpa} Hari`, `${attHadir} Hari`]],
    theme: 'grid',
    headStyles: { fillColor: [71, 85, 105], textColor: 255, fontSize: 8, halign: 'center' },
    bodyStyles: { fontSize: 8, halign: 'center', cellPadding: 2 },
    margin: { left: 14, right: 14 },
  });

  nextY = (doc as any).lastAutoTable.finalY + 10;

  // Signature Block
  const wali = school.waliKelas[student.kelas] || { nama: 'Wali Kelas', nip: '-' };
  drawSignatureBlock(doc, school, wali.nama, wali.nip, nextY);

  doc.save(`Raport_${student.nama.replace(/\s+/g, '_')}_Kelas_${student.kelas}.pdf`);
}

/**
 * Generate Class Grade Ledger (Leger Nilai Kelas) PDF
 */
export function generateClassLegerPDF(
  students: Student[],
  grades: GradeRecord[],
  kelas: string,
  semester: string,
  tahunAjaran: string,
  school: SchoolSettings
) {
  const doc = new jsPDF({ orientation: 'landscape', unit: 'mm', format: 'a4' });
  const pageWidth = doc.internal.pageSize.getWidth();

  drawSchoolHeader(doc, school, `LEGER NILAI SISWA - KELAS ${kelas}`);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.text(`Semester: ${semester} | Tahun Ajaran: ${tahunAjaran} | Total Siswa: ${students.length}`, 14, 52);

  const filteredStudents = students.filter(s => s.kelas === kelas && s.status === 'Aktif');

  const headers = ['No', 'NISN', 'Nama Siswa', 'L/P', ...SUBJECTS.map(s => s.code), 'Total', 'Rata-Rata'];

  const tableBody = filteredStudents.map((student, idx) => {
    const gradeRec = grades.find(g => g.studentId === student.id && g.semester === semester && g.tahunAjaran === tahunAjaran);
    const nilais = gradeRec?.nilai || {};
    
    let total = 0;
    let count = 0;

    const subjectScores = SUBJECTS.map(sub => {
      const val = nilais[sub.code] ?? 0;
      if (val > 0) {
        total += val;
        count++;
      }
      return val > 0 ? val : '-';
    });

    const avg = count > 0 ? (total / count).toFixed(1) : '-';

    return [
      idx + 1,
      student.nisn,
      student.nama,
      student.jenisKelamin,
      ...subjectScores,
      total > 0 ? total : '-',
      avg,
    ];
  });

  autoTable(doc, {
    startY: 56,
    head: [headers],
    body: tableBody,
    theme: 'grid',
    headStyles: { fillColor: [30, 58, 138], textColor: 255, fontSize: 7, halign: 'center' },
    bodyStyles: { fontSize: 7, cellPadding: 1.5 },
    columnStyles: {
      0: { halign: 'center', cellWidth: 8 },
      1: { halign: 'center', cellWidth: 22 },
      2: { cellWidth: 45, fontStyle: 'bold' },
      3: { halign: 'center', cellWidth: 8 },
      ...SUBJECTS.reduce((acc, _, idx) => ({ ...acc, [4 + idx]: { halign: 'center', cellWidth: 16 } }), {}),
      [4 + SUBJECTS.length]: { halign: 'center', fontStyle: 'bold', cellWidth: 16 },
      [5 + SUBJECTS.length]: { halign: 'center', fontStyle: 'bold', cellWidth: 18 },
    },
    margin: { left: 14, right: 14 },
  });

  const nextY = (doc as any).lastAutoTable.finalY + 10;
  const wali = school.waliKelas[kelas] || { nama: 'Wali Kelas', nip: '-' };
  drawSignatureBlock(doc, school, wali.nama, wali.nip, Math.min(nextY, 150));

  doc.save(`Leger_Nilai_Kelas_${kelas}_${semester}_${tahunAjaran.replace('/', '-')}.pdf`);
}

/**
 * Generate Periodic Attendance Report (Rekap Absensi Periodik) PDF
 */
export function generateAttendancePDF(
  recaps: MonthlyAttendanceRecap[],
  kelas: string,
  bulan: string,
  school: SchoolSettings
) {
  const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
  const pageWidth = doc.internal.pageSize.getWidth();

  drawSchoolHeader(doc, school, `LAPORAN REKAPITULASI ABSENSI SISWA`);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9.5);
  doc.text(`Kelas / Rombel : Kelas ${kelas}`, 14, 52);
  doc.text(`Periode Bulan   : ${bulan}`, 14, 57);
  doc.text(`Jumlah Siswa   : ${recaps.length} Orang`, pageWidth - 70, 52);

  const tableBody = recaps.map((r, idx) => [
    idx + 1,
    r.nisn,
    r.studentName,
    r.kelas,
    `${r.hadir} Hari`,
    `${r.sakit} Hari`,
    `${r.izin} Hari`,
    `${r.alpa} Hari`,
    `${r.persentase}%`,
  ]);

  autoTable(doc, {
    startY: 62,
    head: [['No', 'NISN', 'Nama Siswa', 'Kelas', 'Hadir (H)', 'Sakit (S)', 'Izin (I)', 'Alpa (A)', 'Persentase']],
    body: tableBody,
    theme: 'grid',
    headStyles: { fillColor: [15, 118, 110], textColor: 255, fontSize: 8, halign: 'center' },
    bodyStyles: { fontSize: 8, cellPadding: 2 },
    columnStyles: {
      0: { halign: 'center', cellWidth: 10 },
      1: { halign: 'center', cellWidth: 25 },
      2: { cellWidth: 50, fontStyle: 'bold' },
      3: { halign: 'center', cellWidth: 15 },
      4: { halign: 'center', cellWidth: 18 },
      5: { halign: 'center', cellWidth: 18 },
      6: { halign: 'center', cellWidth: 18 },
      7: { halign: 'center', cellWidth: 18 },
      8: { halign: 'center', cellWidth: 22, fontStyle: 'bold' },
    },
    margin: { left: 14, right: 14 },
  });

  // Calculate Class Averages
  const totalHadir = recaps.reduce((acc, r) => acc + r.hadir, 0);
  const totalSakit = recaps.reduce((acc, r) => acc + r.sakit, 0);
  const totalIzin = recaps.reduce((acc, r) => acc + r.izin, 0);
  const totalAlpa = recaps.reduce((acc, r) => acc + r.alpa, 0);
  const avgPercent = recaps.length > 0 ? (recaps.reduce((acc, r) => acc + r.persentase, 0) / recaps.length).toFixed(1) : '0';

  let nextY = (doc as any).lastAutoTable.finalY + 6;

  doc.setFillColor(240, 253, 250);
  doc.rect(14, nextY, pageWidth - 28, 12, 'F');
  doc.setDrawColor(153, 246, 228);
  doc.rect(14, nextY, pageWidth - 28, 12, 'S');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.text(`Total Kehadiran Kelas: Hadir (${totalHadir}) | Sakit (${totalSakit}) | Izin (${totalIzin}) | Alpa (${totalAlpa})`, 20, nextY + 5);
  doc.text(`Rata-Rata Persentase Kehadiran Kelas: ${avgPercent}%`, 20, nextY + 9.5);

  nextY += 18;
  const wali = school.waliKelas[kelas] || { nama: 'Wali Kelas', nip: '-' };
  drawSignatureBlock(doc, school, wali.nama, wali.nip, nextY);

  doc.save(`Laporan_Absensi_Kelas_${kelas}_${bulan}.pdf`);
}

/**
 * Generate Student Directory PDF
 */
export function generateStudentListPDF(students: Student[], filterKelas: string, school: SchoolSettings) {
  const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });

  drawSchoolHeader(doc, school, `DAFTAR INDUK SISWA SDN 1 SUKAJAYA`);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.text(`Kelas / Rombel: ${filterKelas || 'Semua Kelas'} | Total Siswa: ${students.length} Orang`, 14, 52);

  const tableBody = students.map((s, idx) => [
    idx + 1,
    s.nisn,
    s.nis,
    s.nama,
    s.jenisKelamin,
    s.kelas,
    `${s.tempatLahir}, ${s.tanggalLahir}`,
    s.namaOrangTua,
    s.status,
  ]);

  autoTable(doc, {
    startY: 56,
    head: [['No', 'NISN', 'NIS', 'Nama Siswa', 'L/P', 'Kelas', 'TTL', 'Orang Tua', 'Status']],
    body: tableBody,
    theme: 'grid',
    headStyles: { fillColor: [31, 41, 55], textColor: 255, fontSize: 8, halign: 'center' },
    bodyStyles: { fontSize: 7.5, cellPadding: 2 },
    columnStyles: {
      0: { halign: 'center', cellWidth: 8 },
      1: { halign: 'center', cellWidth: 20 },
      2: { halign: 'center', cellWidth: 18 },
      3: { cellWidth: 38, fontStyle: 'bold' },
      4: { halign: 'center', cellWidth: 10 },
      5: { halign: 'center', cellWidth: 12 },
      6: { cellWidth: 32 },
      7: { cellWidth: 28 },
      8: { halign: 'center', cellWidth: 16 },
    },
    margin: { left: 14, right: 14 },
  });

  const nextY = (doc as any).lastAutoTable.finalY + 10;
  const wali = school.waliKelas[filterKelas] || { nama: 'Petugas Administrasi', nip: '-' };
  drawSignatureBlock(doc, school, wali.nama, wali.nip, Math.min(nextY, 220));

  doc.save(`Daftar_Siswa_SDN1Sukajaya_${filterKelas || 'Semua'}.pdf`);
}
