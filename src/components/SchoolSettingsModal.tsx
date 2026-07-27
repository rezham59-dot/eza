import React, { useState } from 'react';
import { X, Settings, School, Save, CheckCircle2 } from 'lucide-react';
import { SchoolSettings } from '../types';

interface SchoolSettingsModalProps {
  school: SchoolSettings;
  onSaveSettings: (settings: SchoolSettings) => void;
  onClose: () => void;
}

export const SchoolSettingsModal: React.FC<SchoolSettingsModalProps> = ({
  school,
  onSaveSettings,
  onClose,
}) => {
  const [formData, setFormData] = useState<SchoolSettings>({ ...school });
  const [savedNotify, setSavedNotify] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveSettings(formData);
    setSavedNotify(true);
    setTimeout(() => {
      setSavedNotify(false);
      onClose();
    }, 1000);
  };

  const handleWaliChange = (kelas: string, field: 'nama' | 'nip', value: string) => {
    setFormData({
      ...formData,
      waliKelas: {
        ...formData.waliKelas,
        [kelas]: {
          ...formData.waliKelas[kelas],
          [field]: value,
        },
      },
    });
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-2xl w-full border border-slate-200 shadow-2xl overflow-hidden my-8">
        
        {/* Header */}
        <div className="bg-slate-900 text-white px-6 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Settings className="w-5 h-5 text-blue-400" />
            <h3 className="text-base font-bold">Pengaturan Identitas Sekolah & Wali Kelas</h3>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg text-slate-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6 text-xs max-h-[80vh] overflow-y-auto">
          
          {savedNotify && (
            <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold p-3 rounded-xl flex items-center space-x-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Pengaturan sekolah berhasil disimpan!</span>
            </div>
          )}

          {/* Section 1: Identitas Sekolah */}
          <div className="space-y-3">
            <h4 className="font-extrabold text-slate-800 uppercase tracking-wider text-[11px] border-b border-slate-200 pb-1">
              Identitas Sekolah
            </h4>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Nama Sekolah</label>
                <input
                  type="text"
                  value={formData.namaSekolah}
                  onChange={(e) => setFormData({ ...formData, namaSekolah: e.target.value })}
                  className="w-full p-2 bg-slate-50 border border-slate-300 rounded-lg text-xs font-bold"
                  required
                />
              </div>
              <div>
                <label className="font-bold text-slate-700 block mb-1">NPSN</label>
                <input
                  type="text"
                  value={formData.npsn}
                  onChange={(e) => setFormData({ ...formData, npsn: e.target.value })}
                  className="w-full p-2 bg-slate-50 border border-slate-300 rounded-lg text-xs"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Nama Kepala Sekolah</label>
                <input
                  type="text"
                  value={formData.namaKepalaSekolah}
                  onChange={(e) => setFormData({ ...formData, namaKepalaSekolah: e.target.value })}
                  className="w-full p-2 bg-slate-50 border border-slate-300 rounded-lg text-xs font-semibold"
                  required
                />
              </div>
              <div>
                <label className="font-bold text-slate-700 block mb-1">NIP Kepala Sekolah</label>
                <input
                  type="text"
                  value={formData.nipKepalaSekolah}
                  onChange={(e) => setFormData({ ...formData, nipKepalaSekolah: e.target.value })}
                  className="w-full p-2 bg-slate-50 border border-slate-300 rounded-lg text-xs"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Tahun Ajaran Aktif</label>
                <input
                  type="text"
                  value={formData.tahunAjaran}
                  onChange={(e) => setFormData({ ...formData, tahunAjaran: e.target.value })}
                  className="w-full p-2 bg-slate-50 border border-slate-300 rounded-lg text-xs font-bold"
                />
              </div>
              <div>
                <label className="font-bold text-slate-700 block mb-1">Semester Aktif</label>
                <select
                  value={formData.semesterAktif}
                  onChange={(e) => setFormData({ ...formData, semesterAktif: e.target.value as 'Ganjil' | 'Genap' })}
                  className="w-full p-2 bg-slate-50 border border-slate-300 rounded-lg text-xs font-bold"
                >
                  <option value="Ganjil">Ganjil</option>
                  <option value="Genap">Genap</option>
                </select>
              </div>
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1">Alamat Lengkap Sekolah</label>
              <input
                type="text"
                value={formData.alamat}
                onChange={(e) => setFormData({ ...formData, alamat: e.target.value })}
                className="w-full p-2 bg-slate-50 border border-slate-300 rounded-lg text-xs"
              />
            </div>
          </div>

          {/* Section 2: Data Wali Kelas per Rombel */}
          <div className="space-y-3 pt-2">
            <h4 className="font-extrabold text-slate-800 uppercase tracking-wider text-[11px] border-b border-slate-200 pb-1">
              Daftar Wali Kelas per Rombongan Belajar
            </h4>

            {['1A', '2A', '3A', '4A', '5A', '6A'].map((kelas) => {
              const wali = formData.waliKelas[kelas] || { nama: '', nip: '' };

              return (
                <div key={kelas} className="p-3 bg-slate-50 border border-slate-200 rounded-xl grid grid-cols-12 gap-2 items-center">
                  <div className="col-span-2 font-black text-slate-800">Kelas {kelas}</div>
                  <div className="col-span-6">
                    <input
                      type="text"
                      placeholder="Nama Wali Kelas..."
                      value={wali.nama}
                      onChange={(e) => handleWaliChange(kelas, 'nama', e.target.value)}
                      className="w-full p-1.5 bg-white border border-slate-300 rounded-md text-xs font-semibold"
                    />
                  </div>
                  <div className="col-span-4">
                    <input
                      type="text"
                      placeholder="NIP Wali Kelas..."
                      value={wali.nip}
                      onChange={(e) => handleWaliChange(kelas, 'nip', e.target.value)}
                      className="w-full p-1.5 bg-white border border-slate-300 rounded-md text-xs"
                    />
                  </div>
                </div>
              );
            })}
          </div>

          <div className="pt-4 border-t border-slate-200 flex items-center justify-end space-x-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-slate-200 text-slate-700 font-bold rounded-xl hover:bg-slate-300 transition"
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition"
            >
              Simpan Pengaturan
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
