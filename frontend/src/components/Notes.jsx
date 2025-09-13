import { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import axios from 'axios'
import NoteForm from './NoteForm'
import PlanToggl from './PlanToggl'
import Layout from './Layout'

export default function Notes() {
  const [notes, setNotes] = useState([])
  const [showForm, setShowForm] = useState(false)
  const [editingNote, setEditingNote] = useState(null)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { user } = useAuth()

  useEffect(() => {
    fetchNotes()
  }, [])

  const fetchNotes = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/notes', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      })
      setNotes(response.data)
    } catch (error) {
      setError('Failed to fetch notes')
    }
  }

  const createNote = async (noteData) => {
    try {
      const response = await axios.post('http://localhost:5000/api/notes', noteData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      })
      setNotes([response.data, ...notes])
      setShowForm(false)
      setError('')
    } catch (error) {
      if (error.response?.status === 403) {
        setError(error.response.data.message)
      } else {
        setError('Failed to create note')
      }
    }
  }

  const updateNote = async (id, noteData) => {
    try {
      const response = await axios.put(`http://localhost:5000/api/notes/${id}`, noteData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      })
      setNotes(notes.map(note => note._id === id ? response.data : note))
      setEditingNote(null)
      setError('')
    } catch (error) {
      setError('Failed to update note')
    }
  }

  const deleteNote = async (id) => {

    
    try {
      await axios.delete(`http://localhost:5000/api/notes/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      })
      setNotes(notes.filter(note => note._id !== id))
      setError('')
    } catch (error) {
      setError('Failed to delete note')
    }
  }

  return (
    <Layout>
      <div className="px-4 py-6 sm:px-0">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Notes Dashboard</h1>
          <p className="mt-2 text-gray-600">
            Welcome back, {user.email}. You're currently on the {user.tenant.plan} plan.
          </p>
        </div>

        <PlanToggl />

        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
            {error}
          </div>
        )}

        <div className="mb-6 bg-white rounded-lg shadow p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-gray-800">Your Notes</h2>
            <button
              onClick={() => setShowForm(true)}
              disabled={user.tenant.plan === 'free' && notes.length >= 3}
              className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              {user.tenant.plan === 'free' && notes.length >= 3 
                ? 'Free Plan Limit Reached' 
                : 'Create New Note'}
            </button>
          </div>

          {(showForm || editingNote) && (
            <div className="mb-6">
              <NoteForm
                note={editingNote}
                onSubmit={editingNote ? updateNote : createNote}
                onCancel={() => {
                  setShowForm(false)
                  setEditingNote(null)
                }}
              />
            </div>
          )}

          {notes.length === 0 ? (
            <div className="text-center py-12">
              <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <h3 className="mt-2 text-sm font-medium text-gray-900">No notes</h3>
              <p className="mt-1 text-sm text-gray-500">
                Get started by creating a new note.
              </p>
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {notes.map(note => (
                <div key={note._id} className="bg-white border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                  <div className="p-4">
                    <h3 className="text-lg font-medium text-gray-900 mb-2">{note.title}</h3>
                    <p className="text-gray-600 whitespace-pre-wrap mb-4">{note.content}</p>
                    <div className="flex justify-between items-center text-sm text-gray-500">
                      <span>{new Date(note.createdAt).toLocaleDateString()}</span>
                      <div className="flex space-x-2">
                        <button
                          onClick={() => setEditingNote(note)}
                          className="text-indigo-600 hover:text-indigo-800 transition-colors"
                          title="Edit note"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                        </button>
                        <button
                          onClick={() => deleteNote(note._id)}
                          className="text-red-600 hover:text-red-800 transition-colors"
                          title="Delete note"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </Layout>
  )
}