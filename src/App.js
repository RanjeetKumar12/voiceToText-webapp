import React, { useState, useEffect } from 'react'
import './App.css'

const SpeechRecognition =
  window.SpeechRecognition || window.webkitSpeechRecognition 
  const mic = new SpeechRecognition()
  mic.continuous = true
  mic.interimResults = false
  mic.lang = 'en-US'
  const keys = Object.keys(localStorage);
  let data = keys.map(key => localStorage.getItem(key))
  let index =  (keys.length - 1) < 0 ? 0 : keys.length + 1

function App() {
  const [isListening, setIsListening] = useState(false)
  const [note, setNote] = useState(null)
  const [savedNotes, setSavedNotes] = useState([])

  useEffect(() => {
    handleListen()
  }, [isListening])

  useEffect(() => {
    setSavedNotes([...data, note])
  }, [])


  const handleListen = () => {
    if (isListening) {
      mic.start()
      mic.onend = () => {
        mic.start()
      }
    } else {
      mic.stop()
      mic.onend = () => {
        console.log('Stopped Mic on Click')
      }
    }
    mic.onstart = () => {
      console.log('Mics on')
    }

    mic.onresult = event => {
      console.log(Array.from(event.results))
      const transcript = Array.from(event.results)
        .map(result => result[0])
        .map(result => result.transcript )
        .join('')
      setNote(transcript)
      mic.onerror = event => {
        console.log(event.error)
      }
    }
  }

  const handleSaveNote = () => {
    localStorage.setItem( index++ , [note])
    setSavedNotes([...savedNotes, note])
    setNote('')
  }

  return (
    <>
      <h1>Voice Notes</h1>
      <div className="container">
        <div className="box">
          <h2>New Note</h2>
          {isListening ? <span>🎙️</span> : <span>🛑🎙️</span>}
          <button onClick={handleSaveNote} disabled={!note}>
            Save Note
          </button>
          <button onClick={() => setIsListening(prevState => !prevState)}>
            Start/Stop
          </button>
          <p>{note}</p>
        </div>
        <div className="box">
          <h2>Notes</h2>
          {savedNotes.map(n => (
            <p key={n}>{n}</p>
          ))}
        </div>
      </div>
    </>
  )
}

export default App