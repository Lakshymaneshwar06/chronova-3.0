import React, { useState } from 'react';
import {
  X,
  UploadCloud,
  FileText,
  CheckCircle2,
  AlertCircle,
  Plus
} from 'lucide-react';
import { StudyResource, Department, ResourceType } from '../../types';

interface UploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUploadSuccess: (newResource: StudyResource) => void;
}

export const UploadModal: React.FC<UploadModalProps> = ({
  isOpen,
  onClose,
  onUploadSuccess
}) => {
  if (!isOpen) return null;

  const [formData, setFormData] = useState({
    title: '',
    courseCode: '',
    courseName: '',
    department: 'cs' as Department,
    semester: 3,
    type: 'pdf' as ResourceType,
    description: '',
    authorName: '',
    authorRole: 'Faculty Administrator',
    tagInput: ''
  });

  const [fileName, setFileName] = useState<string | null>(null);
  const [fileSize, setFileSize] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleFileDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0];
      setFileName(file.name);
      setFileSize(`${(file.size / (1024 * 1024)).toFixed(1)} MB`);
      if (!formData.title) {
        setFormData((prev) => ({
          ...prev,
          title: file.name.replace(/\.[^/.]+$/, '')
        }));
      }
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      setFileName(file.name);
      setFileSize(`${(file.size / (1024 * 1024)).toFixed(1)} MB`);
      if (!formData.title) {
        setFormData((prev) => ({
          ...prev,
          title: file.name.replace(/\.[^/.]+$/, '')
        }));
      }
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim() || !formData.courseCode.trim()) return;

    setIsSubmitting(true);
    setTimeout(() => {
      const tags = formData.tagInput
        ? formData.tagInput.split(',').map((t) => t.trim()).filter(Boolean)
        : ['Notes', 'ExamPrep'];

      const newResource: StudyResource = {
        id: `res-${Date.now()}`,
        title: formData.title,
        courseCode: formData.courseCode.toUpperCase(),
        courseName: formData.courseName || 'Academic Course Resource',
        department: formData.department,
        semester: Number(formData.semester),
        type: formData.type,
        description:
          formData.description ||
          'Community-contributed course notes and study material with verified key concepts.',
        author: {
          name: formData.authorName || 'Peer Scholar',
          role: formData.authorRole,
          avatar:
            'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80'
        },
        fileSize: fileSize || '5.4 MB',
        rating: 5.0,
        ratingCount: 1,
        downloadCount: 0,
        likesCount: 1,
        tags,
        lastUpdated: 'Just now',
        featured: false,
        contentPreview: {
          summary: 'Newly uploaded community resource.',
          keyPoints: [
            'Comprehensive review points provided by author',
            'Aligned with active semester syllabus guidelines'
          ]
        }
      };

      onUploadSuccess(newResource);
      setIsSubmitting(false);
      onClose();
    }, 500);
  };

  return (
    <div
      id="upload-modal-overlay"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/20 backdrop-blur-xs overflow-y-auto"
      onClick={onClose}
    >
      <div
        id="upload-modal-container"
        className="relative w-full max-w-2xl rounded-3xl bg-white border border-slate-200 shadow-2xl overflow-hidden my-6 text-slate-800 animate-in fade-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-6 border-b border-slate-200 bg-slate-50/80 flex items-center justify-between">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-pastel-sky text-sky-900 text-[10px] font-bold uppercase tracking-wider mb-1">
              <span>Category Restricted: Study Materials Only</span>
            </div>
            <h2 className="text-xl font-bold text-slate-900 font-heading">
              Contribute Study Material
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Only academic study notes, PYQs, and syllabus guides are accepted here.
            </p>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-white hover:bg-slate-100 text-slate-500 hover:text-slate-800 border border-slate-200 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[70vh] overflow-y-auto text-xs">
          {/* Drag and Drop Zone */}
          <div>
            <label className="block font-semibold text-slate-700 mb-1.5">
              Upload Document / File *
            </label>
            <div
              onDragOver={(e) => {
                e.preventDefault();
                setIsDragging(true);
              }}
              onDragLeave={() => setIsDragging(false)}
              onDrop={handleFileDrop}
              className={`relative border-2 border-dashed rounded-2xl p-6 text-center transition-all cursor-pointer ${
                isDragging
                  ? 'border-indigo-500 bg-indigo-50'
                  : 'border-slate-200 hover:border-slate-300 bg-slate-50/60'
              }`}
            >
              <input
                type="file"
                id="file-upload-input"
                onChange={handleFileSelect}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
              <div className="flex flex-col items-center">
                <div className="p-3 rounded-2xl bg-indigo-100 text-indigo-700 mb-2">
                  <UploadCloud className="w-8 h-8" />
                </div>
                {fileName ? (
                  <div className="flex items-center gap-2 text-indigo-700 font-semibold text-sm">
                    <FileText className="w-4 h-4" />
                    <span>{fileName}</span>
                    <span className="text-xs font-mono text-slate-400">
                      ({fileSize})
                    </span>
                  </div>
                ) : (
                  <>
                    <p className="text-sm font-semibold text-slate-800">
                      Drag & Drop your notes, PDF, or cheat sheet
                    </p>
                    <p className="text-xs text-slate-500 mt-1">
                      Supports PDF, PPTX, DOCX, ZIP up to 50MB
                    </p>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Title */}
          <div>
            <label className="block font-semibold text-slate-700 mb-1.5">
              Material Title *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Distributed Consensus & Raft Complete Notes"
              value={formData.title}
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:border-indigo-500 font-medium"
            />
          </div>

          {/* Department, Semester & Type */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 mb-1.5">
                Department
              </label>
              <select
                value={formData.department}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    department: e.target.value as Department
                  })
                }
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:border-indigo-500 font-medium"
              >
                <option value="cs">Computer Science</option>
                <option value="ai">AI & Data Science</option>
                <option value="cloud">Cloud & Systems</option>
                <option value="cyber">Cyber Security</option>
                <option value="ece">Electrical & ECE</option>
                <option value="math">Applied Math</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1.5">
                Semester
              </label>
              <select
                value={formData.semester}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    semester: Number(e.target.value)
                  })
                }
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:border-indigo-500 font-medium"
              >
                {[1, 2, 3, 4, 5, 6, 7, 8].map((s) => (
                  <option key={s} value={s}>
                    Semester {s}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1.5">
                Resource Type
              </label>
              <select
                value={formData.type}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    type: e.target.value as ResourceType
                  })
                }
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:border-indigo-500 font-medium"
              >
                <option value="notes">Lecture Notes</option>
                <option value="pdf">Textbook / PDF</option>
                <option value="cheatsheet">Cheat Sheet</option>
                <option value="pyq">Solved PYQ</option>
                <option value="code">Lab Code</option>
                <option value="video">Video Playlist</option>
              </select>
            </div>
          </div>

          {/* Course Code & Course Name */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 mb-1.5">
                Course Code *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. CS-301 or MTH-205"
                value={formData.courseCode}
                onChange={(e) =>
                  setFormData({ ...formData, courseCode: e.target.value })
                }
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:border-indigo-500 font-medium"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1.5">
                Course Name
              </label>
              <input
                type="text"
                placeholder="e.g. Operating Systems"
                value={formData.courseName}
                onChange={(e) =>
                  setFormData({ ...formData, courseName: e.target.value })
                }
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:border-indigo-500 font-medium"
              />
            </div>
          </div>

          {/* Author info & Tags */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 mb-1.5">
                Your Name / Alias
              </label>
              <input
                type="text"
                placeholder="e.g. Maya Lin"
                value={formData.authorName}
                onChange={(e) =>
                  setFormData({ ...formData, authorName: e.target.value })
                }
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:border-indigo-500 font-medium"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1.5">
                Tags (comma separated)
              </label>
              <input
                type="text"
                placeholder="e.g. Concurrency, Paging, Deadlocks"
                value={formData.tagInput}
                onChange={(e) =>
                  setFormData({ ...formData, tagInput: e.target.value })
                }
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:border-indigo-500 font-medium"
              />
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block font-semibold text-slate-700 mb-1.5">
              Summary / Notes Outline
            </label>
            <textarea
              rows={3}
              placeholder="Brief description of chapters, key formulas, or solved problems included..."
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:border-indigo-500 resize-none font-medium"
            />
          </div>

          {/* Submit Button */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3 px-4 rounded-xl text-xs sm:text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-700 transition-all flex items-center justify-center gap-2 shadow-md cursor-pointer disabled:opacity-50 font-heading"
            >
              {isSubmitting ? (
                <span>Publishing to Campus Hub...</span>
              ) : (
                <>
                  <Plus className="w-4 h-4" />
                  <span>Publish Study Material</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
