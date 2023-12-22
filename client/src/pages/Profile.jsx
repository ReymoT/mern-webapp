import React, { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import { useRef } from 'react'
import { getDownloadURL, getStorage, ref, uploadBytes, uploadBytesResumable } from 'firebase/storage'
import { app } from '../firebase.js'

export default function Profile() {
  const { currentUser } = useSelector((state) => state.user)
  const fileRef = useRef(null)
  const [file, setFile] = useState(undefined)
  const [filePercentage, setFilePercentage] = useState(0)
  const [fileError, setFileError] = useState(null)
  const [formData, setFormData] = useState({})

  //firebase storage
  // allow read;
  // allow write: if
  // request.resource.size < 2 * 1024 * 1024 &&
  // request.resource.contentType.matches('image/.*')

  useEffect(() => {
    if (file) {
      handleFileUpload(file)
    }
  }, [file])

  const handleFileUpload = (file) => {
    const storage = getStorage(app)
    const fileName = new Date().getTime() + file.name //guarantee a unique file name
    const storageRef = ref(storage, fileName)
    const uploadTask = uploadBytesResumable(storageRef, file)

    uploadTask.on('state_changed',
      (snapshot) => {
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100
        setFilePercentage(Math.round(progress))
      },
      (error) => {
        setFileError(error)
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then(
          (downloadURL) => {
            setFormData({...formData, avatar: downloadURL})
          }
        )
      }
    )
  }
  return (
    <div className='p-3 max-w-lg mx-auto'>
      <h1 className='text-3xl font-semibold text-center my-7'>Profile</h1>
      <form className='flex flex-col gap-4'>
        <input onChange={(event) => setFile(event.target.files[0])} type='file' ref={fileRef} hidden accept='image/*'/>
        <img
        onClick={() => fileRef.current.click()}
        src={formData.avatar || currentUser.avatar}
        alt='profile'
        className='rounded-full h-24 w-24 object-cover
        cursor-pointer self-center mt-2'/>

        <p className='text-sm flex justify-center'>
          {fileError ? (
          <span className='text-red-700'>Error with Uploading Image (image must be less than 2MB!)</span>
          ) : filePercentage > 0 && filePercentage < 100 ? (
            <span className='text-teal-700'>{`Uploading ${filePercentage}%`}</span>
            ) : filePercentage === 100 ? (
            <span className='text-green-700'>Image Successfully Uploaded</span>
            ) : (
            ""
            )
        }
        </p>
        <input type='text' placeholder='Username' className='border p-3 rounded-lg' id='username' />
        <input type='email' placeholder='Email' className='border p-3 rounded-lg' id='email' />
        <input type='text' placeholder='Password' className='border p-3 rounded-lg' id='password' />
        <button className='bg-teal-700 text-white rounded-lg p-3 uppercase
        hover:opacity-95 disabled:opacity-80'>Update</button>

      </form>
      <div className='flex justify-between mt-5'>
        <span className='text-red-700 cursor-pointer'>Delete Account</span>
        <span className='text-red-700 cursor-pointer'>Sign Out</span>
      </div>
    </div>
  )
}
