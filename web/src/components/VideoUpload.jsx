import React, { useState } from 'react'
import { useAuth } from '@clerk/clerk-react'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:3000'

export default function VideoUpload({ onUploadSuccess }) {
  const [file, setFile] = useState(null)
  const [uploading, setUploading] = useState(false)
  const [progress, setProgress] = useState(0)
  const { getToken } = useAuth()

  const handleFileChange = (e) => {
    setFile(e.target.files[0])
  }

  const handleUpload = async () => {
    if (!file) return

    setUploading(true)
    setProgress(0)

    try {
      const token = await getToken()
      
      // 1. Get upload URL from our backend
      const response = await fetch(`${API_BASE_URL}/api/uploads`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (!response.ok) throw new Error('Failed to get upload URL')
      
      const { uploadUrl, uploadId } = await response.json()

      // 2. Upload file directly to Mux
      const uploadResponse = await new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest()
        xhr.open('PUT', uploadUrl)
        xhr.upload.onprogress = (e) => {
          if (e.lengthComputable) {
            setProgress(Math.round((e.loaded / e.total) * 100))
          }
        }
        xhr.onload = () => resolve(xhr)
        xhr.onerror = () => reject(new Error('Upload failed'))
        xhr.send(file)
      })

      if (uploadResponse.status !== 200) throw new Error('Upload to Mux failed')

      if (onUploadSuccess) {
        onUploadSuccess(uploadId)
      }
      
      alert('Upload successful!')
    } catch (err) {
      console.error(err)
      alert('Upload failed: ' + err.message)
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className="border p-4 rounded bg-white shadow-sm">
      <h2 className="text-lg font-bold mb-2">Upload Video Review</h2>
      <input 
        type="file" 
        accept="video/*" 
        onChange={handleFileChange} 
        className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
      />
      {file && (
        <button 
          onClick={handleUpload} 
          disabled={uploading}
          className="mt-4 bg-green-500 text-white px-4 py-2 rounded disabled:opacity-50"
        >
          {uploading ? `Uploading (${progress}%)` : 'Start Upload'}
        </button>
      )}
    </div>
  )
}
