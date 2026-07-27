import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { DashboardView } from './components/DashboardView';
import { StudentsView } from './components/StudentsView';
import { GradesView } from './components/GradesView';
import { AttendanceView } from './components/AttendanceView';
import { UploadCenterModal } from './components/UploadCenterModal';
import { StudentDetailModal } from './components/StudentDetailModal';
import { SchoolSettingsModal } from './components/SchoolSettingsModal';

import { Student, GradeRecord, DailyAttendance, SchoolSettings, MonthlyAttendanceRecap } from './types';
import { DEFAULT_SCHOOL_SETTINGS, INITIAL_STUDENTS, INITIAL_GRADES, INITIAL_ATTENDANCE } from './data/initialData';
import { 
  exportStudentsToExcel, 
  exportGradesToExcel, 
  exportAttendanceToExcel, 
  downloadStudentTemplate, 
  downloadGradeTemplate, 
  downloadAttendanceTemplate 
} from './utils/excelUtils';
import { 
  generateStudentRaportPDF, 
  generateClassLegerPDF, 
  generateAttendancePDF, 
  generateStudentListPDF 
} from './utils/pdfUtils';

export default function App() {
  // Navigation & Search State
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [searchTerm, setSearchTerm] = useState<string>('');

  // Modals State
  const [isUploadCenterOpen, setIsUploadCenterOpen] = useState<boolean>(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState<boolean>(false);
  const [selectedStudentForDetail, setSelectedStudentForDetail] = useState<Student | null>(null);

  // Persistent Data State (LocalStorage with initial defaults)
  const [students, setStudents] = useState<Student[]>(() => {
    const saved = localStorage.getItem('sdn1_students');
    return saved ? JSON.parse(saved) : INITIAL_STUDENTS;
  });

  const [grades, setGrades] = useState<GradeRecord[]>(() => {
    const saved = localStorage.getItem('sdn1_grades');
    return saved ? JSON.parse(saved) : INITIAL_GRADES;
  });

  const [attendance, setAttendance] = useState<DailyAttendance[]>(() => {
    const saved = localStorage.getItem('sdn1_attendance');
    return saved ? JSON.parse(saved) : INITIAL_ATTENDANCE;
  });

  const [school, setSchool] = useState<SchoolSettings>(() => {
    const saved = localStorage.getItem('sdn1_school');
    return saved ? JSON.parse(saved) : DEFAULT_SCHOOL_SETTINGS;
  });

  // Sync to LocalStorage
  useEffect(() => {
    localStorage.setItem('sdn1_students', JSON.stringify(students));
  }, [students]);

  useEffect(() => {
    localStorage.setItem('sdn1_grades', JSON.stringify(grades));
  }, [grades]);

  useEffect(() => {
    localStorage.setItem('sdn1_attendance', JSON.stringify(attendance));
  }, [attendance]);

  useEffect(() => {
    localStorage.setItem('sdn1_school', JSON.stringify(school));
  }, [school]);

  // Student Actions
  const handleAddStudent = (newStudentData: Omit<Student, 'id'>) => {
    const newStudent: Student = {
      ...newStudentData,
      id: `STU-${Date.now()}`,
    };
    setStudents((prev) => [newStudent, ...prev]);
  };

  const handleUpdateStudent = (updatedStudent: Student) => {
    setStudents((prev) => prev.map((s) => (s.id === updatedStudent.id ? updatedStudent : s)));
  };

  const handleDeleteStudent = (id: string) => {
    setStudents((prev) => prev.filter((s) => s.id !== id));
  };

  // Grade Actions
  const handleSaveGrade = (gradeRecord: GradeRecord) => {
    setGrades((prev) => {
      const idx = prev.findIndex((g) => g.id === gradeRecord.id || (g.studentId === gradeRecord.studentId && g.semester === gradeRecord.semester && g.tahunAjaran === gradeRecord.tahunAjaran));
      if (idx >= 0) {
        const copy = [...prev];
        copy[idx] = gradeRecord;
        return copy;
      }
      return [...prev, gradeRecord];
    });
  };

  // Attendance Actions
  const handleSaveDailyAttendance = (record: DailyAttendance) => {
    setAttendance((prev) => {
      const idx = prev.findIndex((a) => a.tanggal === record.tanggal && a.kelas === record.kelas);
      if (idx >= 0) {
        const copy = [...prev];
        copy[idx] = record;
        return copy;
      }
      return [...prev, record];
    });
  };

  // Bulk Imports
  const handleImportStudents = (newStudents: Student[]) => {
    setStudents((prev) => [...newStudents, ...prev]);
  };

  const handleImportGrades = (newGrades: GradeRecord[]) => {
    setGrades((prev) => [...newGrades, ...prev]);
  };

  // Export Excel Handlers
  const handleExportStudentsExcel = (kelasFilter?: string) => {
    const targetStudents = kelasFilter ? students.filter((s) => s.kelas === kelasFilter) : students;
    exportStudentsToExcel(targetStudents, kelasFilter);
  };

  const handleExportLegerExcel = (kelas: string, semester: string, tahunAjaran: string) => {
    exportGradesToExcel(grades, students, school, kelas, semester, tahunAjaran);
  };

  const handleExportAttendanceExcel = (recaps: MonthlyAttendanceRecap[], kelas: string, bulan: string) => {
    exportAttendanceToExcel(recaps, kelas, bulan);
  };

  // Export PDF Handlers
  const handleExportStudentsPDF = (kelasFilter?: string) => {
    const targetStudents = kelasFilter ? students.filter((s) => s.kelas === kelasFilter) : students;
    generateStudentListPDF(targetStudents, kelasFilter || 'Semua', school);
  };

  const handleExportLegerPDF = (kelas: string, semester: string, tahunAjaran: string) => {
    generateClassLegerPDF(students, grades, kelas, semester, tahunAjaran, school);
  };

  const handleExportAttendancePDF = (recaps: MonthlyAttendanceRecap[], kelas: string, bulan: string) => {
    generateAttendancePDF(recaps, kelas, bulan, school);
  };

  const handleGenerateStudentRaportPDF = (student: Student, grade?: GradeRecord) => {
    // calculate attendance recap for student
    const studentAttRecords = attendance.filter((a) => a.kelas === student.kelas);
    let hadir = 0;
    let sakit = 0;
    let izin = 0;
    let alpa = 0;

    studentAttRecords.forEach((rec) => {
      const st = rec.records[student.id] || 'H';
      if (st === 'H') hadir++;
      else if (st === 'S') sakit++;
      else if (st === 'I') izin++;
      else if (st === 'A') alpa++;
    });

    generateStudentRaportPDF(
      student,
      grade,
      { hadir: hadir > 0 ? hadir : 20, sakit, izin, alpa },
      school
    );
  };

  return (
    <div className="min-h-screen bg-slate-100 text-slate-800 flex flex-col font-sans antialiased">
      
      {/* App Header */}
      <Header
        school={school}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        onOpenSettings={() => setIsSettingsOpen(true)}
        onOpenUploadCenter={() => setIsUploadCenterOpen(true)}
      />

      {/* Main Layout (Sidebar + Content) */}
      <div className="flex-1 flex flex-col md:flex-row max-w-7xl w-full mx-auto">
        
        {/* Sidebar */}
        <Sidebar
          activeTab={activeTab}
          setActiveTab={(tab) => {
            if (tab === 'upload') {
              setIsUploadCenterOpen(true);
            } else if (tab === 'settings') {
              setIsSettingsOpen(true);
            } else {
              setActiveTab(tab);
            }
          }}
          studentCount={students.length}
        />

        {/* Main Content Area */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 min-w-0">
          
          {activeTab === 'dashboard' && (
            <DashboardView
              students={students}
              grades={grades}
              attendance={attendance}
              school={school}
              setActiveTab={setActiveTab}
              onOpenUploadCenter={() => setIsUploadCenterOpen(true)}
              onExportAllStudentsExcel={() => handleExportStudentsExcel()}
            />
          )}

          {activeTab === 'siswa' && (
            <StudentsView
              students={students}
              school={school}
              onAddStudent={handleAddStudent}
              onUpdateStudent={handleUpdateStudent}
              onDeleteStudent={handleDeleteStudent}
              onSelectStudent={(s) => setSelectedStudentForDetail(s)}
              onExportExcel={handleExportStudentsExcel}
              onExportPDF={handleExportStudentsPDF}
              onOpenUploadCenter={() => setIsUploadCenterOpen(true)}
            />
          )}

          {activeTab === 'nilai' && (
            <GradesView
              students={students}
              grades={grades}
              school={school}
              onSaveGrade={handleSaveGrade}
              onExportLegerExcel={handleExportLegerExcel}
              onExportLegerPDF={handleExportLegerPDF}
              onGenerateStudentRaportPDF={handleGenerateStudentRaportPDF}
              onDownloadTemplate={(k, s, t) => downloadGradeTemplate(students, k, s, t)}
              onOpenUploadCenter={() => setIsUploadCenterOpen(true)}
            />
          )}

          {activeTab === 'absensi' && (
            <AttendanceView
              students={students}
              attendance={attendance}
              school={school}
              onSaveDailyAttendance={handleSaveDailyAttendance}
              onExportAttendancePDF={handleExportAttendancePDF}
              onExportAttendanceExcel={handleExportAttendanceExcel}
              onDownloadTemplate={(k, b) => downloadAttendanceTemplate(students, k, b)}
              onOpenUploadCenter={() => setIsUploadCenterOpen(true)}
            />
          )}

        </main>
      </div>

      {/* Global Modals */}
      {isUploadCenterOpen && (
        <UploadCenterModal
          students={students}
          onImportStudents={handleImportStudents}
          onImportGrades={handleImportGrades}
          onClose={() => setIsUploadCenterOpen(false)}
        />
      )}

      {selectedStudentForDetail && (
        <StudentDetailModal
          student={selectedStudentForDetail}
          school={school}
          onClose={() => setSelectedStudentForDetail(null)}
          onEdit={(s) => {
            setSelectedStudentForDetail(null);
            setActiveTab('siswa');
          }}
        />
      )}

      {isSettingsOpen && (
        <SchoolSettingsModal
          school={school}
          onSaveSettings={(updated) => setSchool(updated)}
          onClose={() => setIsSettingsOpen(false)}
        />
      )}

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 py-4 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <div>
            <strong>{school.namaSekolah}</strong> — Sistem Database Siswa, Laporan Nilai, dan Rekap Absensi Berkala
          </div>
          <div>
            Dinas Pendidikan Kabupaten Bogor • Tahun Ajaran {school.tahunAjaran} ({school.semesterAktif})
          </div>
        </div>
      </footer>

    </div>
  );
}
