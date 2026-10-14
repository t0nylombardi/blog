'use client'

import React, {useState} from 'react'
import dynamic from 'next/dynamic'
import CodeInput from './CodeInput'
import {submitContactForm} from './submitContactForm'

const SuccessPopup = dynamic(() => import('./SuccessPopup'))

interface ContactFormData {
  name: string
  email: string
  message: string
}

type FormStatus = 'pending' | 'ok' | 'error' | null

const INITIAL_FORM_DATA: ContactFormData = {
  name: '',
  email: '',
  message: '',
}

export default function ContactForm() {
  const [codeData, setCodeData] = useState<ContactFormData>({
    ...INITIAL_FORM_DATA,
  })

  const [status, setStatus] = useState<FormStatus>(null)
  const [error, setError] = useState<string | null>(null)
  const [showPopup, setShowPopup] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const {name, value} = e.currentTarget

    setCodeData((previous) => ({
      ...previous,
      [name]: value,
    }))
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    if (status === 'pending') return

    setStatus('pending')
    setError(null)

    try {
      await submitContactForm(new FormData(e.currentTarget))

      setStatus('ok')
      setShowPopup(true)
      setCodeData({...INITIAL_FORM_DATA})
    } catch (err) {
      setStatus('error')

      setError(err instanceof Error ? err.message : 'An unexpected error occurred.')
    }
  }

  return (
    <section
      id="contact"
      className="fullscreen-section snap-none flex flex-col items-center justify-center sm:w-full my-[12rem]"
    >
      <div className="w-full max-w-5xl mx-auto py-12 px-4">
        <form
          name="contact-form"
          data-netlify="true"
          netlify-honeypot="bot-field"
          onSubmit={handleSubmit}
          className="w-full"
        >
          <input type="hidden" name="form-name" value="contact-form" />

          <p className="hidden" aria-hidden="true">
            <label>
              Don't fill this out:
              <input name="bot-field" tabIndex={-1} autoComplete="off" />
            </label>
          </p>

          <div className="w-full overflow-x-auto  p-6 md:p-10">
            <div className="font-mono text-sm md:text-xl leading-8 text-ctp-text">
              <div>
                <span className="text-ctp-mauve-500">class</span>
                {' GetInTouch'}
              </div>

              <div className="pl-4">
                <span className="text-ctp-mauve-500">def</span>
                {' send_mail'}
              </div>

              <div className="pl-8 flex items-baseline">
                <label htmlFor="contact-name" className="shrink-0">
                  name = <span className="text-ctp-green-500">"</span>
                </label>

                <CodeInput
                  id="contact-name"
                  name="name"
                  type="text"
                  autoComplete="name"
                  placeholder="What is your name?"
                  value={codeData.name}
                  onChange={handleChange}
                />

                <span className="text-ctp-green-500">"</span>
              </div>

              <div className="pl-8 flex items-baseline">
                <label htmlFor="contact-name" className="shrink-0">
                  email = <span className="text-ctp-green-500">"</span>
                </label>

                <CodeInput
                  id="contact-email"
                  name="email"
                  type="text"
                  autoComplete="email"
                  placeholder="what-is@your-email.question"
                  value={codeData.email}
                  onChange={handleChange}
                />

                <span className="text-ctp-green-500">"</span>
              </div>

              {/* Message */}
              <div className="pl-8">
                <label htmlFor="contact-message">
                  message =<span className="text-ctp-green-500">{'"'}</span>{' '}
                </label>

                <textarea
                  id="contact-message"
                  name="message"
                  placeholder="What do you want to talk about?"
                  aria-label="Your message"
                  required
                  rows={2}
                  value={codeData.message}
                  onChange={handleChange}
                  className="
                    block
                    w-full
                    bg-transparent
                    border-none
                    outline-none
                    focus:ring-0
                    resize-y
                    p-0
                    text-ctp-green-500
                    placeholder:text-ctp-green-500/40
                    font-mono
                    caret-white
                  "
                />

                <span className="text-ctp-green-500">{'"'}</span>
              </div>

              <div className="pl-8 mt-6">
                <span className="text-ctp-text">ContactForm.new(name, email, message).submit!</span>
              </div>

              <div className="pl-4">
                <span className="text-ctp-mauve-500">end</span>
              </div>

              <div>
                <span className="text-ctp-mauve-500">end</span>
              </div>
            </div>
          </div>

          <div className="w-full flex flex-row justify-center items-center">
            <button
              id="submit-form"
              type="submit"
              disabled={status === 'pending'}
              className="
                btnAzureGradiant
                font-bold
                mt-8
                p-4
                w-full
                font-mono
                disabled:opacity-50
                disabled:cursor-not-allowed
              "
            >
              {status === 'pending' ? '> Executing...' : '> Run the code'}
            </button>
          </div>

          {status === 'error' && (
            <div
              role="alert"
              className="mt-4 rounded-lg bg-red-500/10 border border-red-500/30 p-4 font-mono text-red-400"
            >
              <span className="text-red-500">RuntimeError:</span> {error}
            </div>
          )}
        </form>
      </div>

      {showPopup && <SuccessPopup onClose={() => setShowPopup(false)} />}
    </section>
  )
}
