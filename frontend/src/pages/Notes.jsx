import React, { useState, useEffect } from 'react';
import { noteService } from '../services/api';
import { useToast } from '../components/Toast';
import NoteModal from '../components/NoteModal';
import { 
  FiPlus, 
  FiSearch, 
  FiEdit3, 
  FiTrash2, 
  FiFileText, 
  FiClock, 
  FiLoader 
} from 'react-icons/fi';

const Notes = () => {
  const { showToast } = useToast();
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingNote, setEditingNote] = useState(null);

  // Search state
  const [searchQuery, setSearchQuery] = useState('');

  const fetchNotes = async () => {
    try {
      setLoading(true);
      const res = await noteService.getAll();
      if (res.success) {
        setNotes(res.data);
      }
    } catch (err) {
      console.error(err);
      showToast('Failed to load notes.', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotes();
  }, []);

  const handleOpenAddModal = () => {
    setEditingNote(null);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (note) => {
    setEditingNote(note);
    setIsModalOpen(true);
  };

  const handleSaveNote = async (noteData) => {
    try {
      if (editingNote) {
        // Update note
        const res = await noteService.update(editingNote.id, noteData);
        if (res.success) {
          showToast('Note updated successfully!', 'success');
          setIsModalOpen(false);
          fetchNotes();
        }
      } else {
        // Create note
        const res = await noteService.create(noteData);
        if (res.success) {
          showToast('Note created successfully!', 'success');
          setIsModalOpen(false);
          fetchNotes();
        }
      }
    } catch (err) {
      console.error(err);
      showToast('Failed to save note. Ensure title is provided.', 'error');
    }
  };

  const handleDeleteNote = async (noteId) => {
    if (!window.confirm('Are you sure you want to delete this note?')) return;
    try {
      const res = await noteService.delete(noteId);
      if (res.success) {
        showToast('Note deleted successfully.', 'success');
        fetchNotes();
      }
    } catch (err) {
      console.error(err);
      showToast('Failed to delete note.', 'error');
    }
  };

  // Format date helper
  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    try {
      const d = new Date(dateStr);
      return d.toLocaleDateString(undefined, { 
        month: 'short', 
        day: 'numeric', 
        year: 'numeric' 
      });
    } catch (e) {
      return dateStr;
    }
  };

  // Filter Notes
  const filteredNotes = notes.filter(note => 
    note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (note.content && note.content.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="flex-1 p-6 md:p-10 space-y-8 max-w-7xl mx-auto w-full flex flex-col overflow-hidden">
      
      {/* Header Panel */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 shrink-0">
        <div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight">Notes & Ideas</h1>
          <p className="text-gray-400 text-sm mt-1">Jot down meeting summaries, study notes, or hackathon brainstorms.</p>
        </div>
        <button
          onClick={handleOpenAddModal}
          className="btn-primary px-5 py-3 rounded-xl font-semibold flex items-center justify-center gap-2 self-start sm:self-auto shadow-lg shadow-brand-500/20"
        >
          <FiPlus className="h-5 w-5" />
          Create Note
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="glass-card p-4 flex items-center gap-4 shrink-0 bg-white/[0.02] border-white/10">
        
        {/* Search Input */}
        <div className="relative w-full max-w-md">
          <FiSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500 h-4.5 w-4.5" />
          <input
            type="text"
            placeholder="Search notes..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-brand-500 transition-colors"
          />
        </div>

      </div>

      {/* Notes Grid Container */}
      <div className="flex-1 overflow-y-auto min-h-[250px] pr-1">
        {loading ? (
          <div className="h-full flex items-center justify-center py-20">
            <FiLoader className="h-10 w-10 animate-spin text-brand-500" />
          </div>
        ) : filteredNotes.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredNotes.map((note) => (
              <div 
                key={note.id} 
                className="glass-card p-6 border border-white/10 shadow-lg hover:border-white/15 bg-white/[0.01] flex flex-col justify-between h-72 transition-all duration-200 group"
              >
                {/* Note Content */}
                <div className="space-y-3 overflow-hidden">
                  <h3 className="font-extrabold text-lg text-white tracking-wide truncate group-hover:text-brand-300 transition-colors">
                    {note.title}
                  </h3>
                  {note.content ? (
                    <p className="text-sm text-gray-400 leading-relaxed overflow-hidden break-words line-clamp-6">
                      {note.content}
                    </p>
                  ) : (
                    <p className="text-xs italic text-gray-600">No content provided.</p>
                  )}
                </div>

                {/* Footer Metadata and Actions */}
                <div className="flex items-center justify-between mt-5 pt-4 border-t border-white/5 shrink-0">
                  <div className="flex items-center gap-1.5 text-xs text-gray-500 font-medium">
                    <FiClock className="h-3.5 w-3.5" />
                    <span>{formatDate(note.created_at)}</span>
                  </div>
                  
                  {/* Action buttons */}
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleOpenEditModal(note)}
                      className="p-2 text-gray-400 hover:text-white hover:bg-white/5 rounded-xl border border-white/5 hover:border-white/10 transition-all focus:outline-none"
                      title="Edit Note"
                    >
                      <FiEdit3 className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteNote(note.id)}
                      className="p-2 text-gray-400 hover:text-rose-400 hover:bg-rose-950/20 rounded-xl border border-white/5 hover:border-rose-500/20 transition-all focus:outline-none"
                      title="Delete Note"
                    >
                      <FiTrash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>

              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center text-center p-12 border-2 border-dashed border-white/5 rounded-3xl h-64">
            <FiFileText className="h-12 w-12 text-gray-600 mb-4 animate-pulse" />
            <h3 className="text-lg font-bold text-white mb-1">No notes found</h3>
            <p className="text-sm text-gray-500 max-w-sm leading-relaxed">
              Jot down a reminder or draft note by clicking the button above or use AI capture.
            </p>
          </div>
        )}
      </div>

      {/* Note Modal (Add/Edit) */}
      <NoteModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveNote}
        note={editingNote}
      />

    </div>
  );
};

export default Notes;
