import React, {useState} from 'react'
import CodeHighlight from '../CodeHighlight'
import SuccessPopup from './SuccessPopup'
import './style.css'
import SectionHeader from '../UI/SectionHeader'

interface FormData {
  name: string
  email: string
  message: string
}

export default function ContactForm() {
  const [codeData, setCodeData] = useState<FormData>({
    name: '',
    email: '',
    message: '',
  })

  const [status, setStatus] = useState<'pending' | 'ok' | 'error' | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [showPopup, setShowPopup] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const {name, value} = e.target
    setCodeData((prevData) => ({
      ...prevData,
      [name]: value,
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setStatus('pending')
    setError(null)
    const formData = new FormData(e.target as HTMLFormElement)
    const body = new URLSearchParams(formData as any).toString()

    await fetch('/__forms.html', {
      method: 'POST',
      headers: {'Content-Type': 'application/x-www-form-urlencoded'},
      body,
    })
      .then((res) => {
        if (!res.ok) {
          setStatus('error')
          setError(`Error: ${res.status} ${res.statusText}`)
        }
        setStatus('ok')
        setShowPopup(true)
        setCodeData({name: '', email: '', message: ''})
      })
      .catch((e) => {
        setStatus('error')
        setError(String(e))
      })
  }

  const truncate = (str: string, maxLength: number) => (str.length > maxLength ? str.slice(0, maxLength) + '...' : str)

  const Code = `
class GetInTouch
  def send_mail
    name = "${truncate(codeData.name, 25)}"
    email = "${truncate(codeData.email, 25)}"
    message = "${truncate(codeData.message, 25)}"

    ContactForm.new(name, email, message).submit!
  end
end
  `

  return (
    <section id="contact" className=" snap-start flex flex-col items-center justify-center my-[12rem]">
      <SectionHeader header="_contact" />
      <div className="grid grid-cols-2 gap-4 py-18 w-full">
        <div className="row-start-1 row-end-2 h-full flex flex-col justify-center">
          <form
            name="contact-form"
            className="flex justify-between flex-col h-full w-full"
            data-netlify="true"
            netlify-honeypot="bot-field"
            data-netlify-recaptcha="true"
            onSubmit={handleSubmit}
          >
            <p className="invisible">
              <label>
                Don’t fill this out if you’re human: <input name="bot-field" />
              </label>
            </p>
            <input type="hidden" name="form-name" value="contact-form" />
            <input
              name="name"
              type="text"
              autoComplete="name"
              placeholder="What is your name?"
              required
              value={codeData.name}
              onChange={handleChange}
            />
            <input
              name="email"
              type="email"
              autoComplete="email"
              placeholder="what-is@your-email.question"
              required
              value={codeData.email}
              onChange={handleChange}
            />
            <textarea
              name="message"
              placeholder="What do you want to talk about?"
              rows={5}
              required
              value={codeData.message}
              onChange={handleChange}
            ></textarea>
            <div data-netlify-recaptcha="true"></div>
            <button
              id="submit-form"
              type="submit"
              className="border border-[#A478E8] hover:text-[#A478E8] font-bold mt-8 p-4"
              disabled={status === 'pending'}
            >
              {status === 'pending' ? 'Submitting...' : 'Send Message'}
            </button>
          </form>
          {status === 'error' && <div className="text-red-500 mt-2">{error}</div>}
        </div>

        <div className="row-span-2 row-end-2 h-full flex flex-col justify-center pt-8">
          <div className="bg-none! flex justify-center items-center text-2xl">
            <CodeHighlight code={Code.trim()} />
          </div>
        </div>
      </div>

      {showPopup && <SuccessPopup onClose={() => setShowPopup(false)} />}
    </section>
  )
}
