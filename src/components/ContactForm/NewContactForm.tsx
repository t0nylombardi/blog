import React, {useState} from 'react'
import CodeHighlight from '../CodeHighlight'
import SuccessPopup from './SuccessPopup'
import './style.css'

interface FormData {
  name: string
  email: string
  message: string
}

export default function ContactForm() {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    message: '',
  })

  const [showPopup, setShowPopup] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const {name, value} = e.target
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }))
  }

  const truncate = (str: string, maxLength: number) => (str.length > maxLength ? str.slice(0, maxLength) + '...' : str)

  const Code = `
class GetInTouch
  def send_mail
    name = "${truncate(formData.name, 25)}"
    email = "${truncate(formData.email, 25)}"
    message = "${truncate(formData.message, 25)}"

    ContactForm.new(name, email, message).submit!
  end
end
  `

  return (
    <section id="contact" className="min-h-[80vh] flex items-center relative">
      <div className="columns-2 gap-8 w-full justify-center">
        <div className="h-full">
          <form
            id="contact-form"
            name="contact-form"
            className="flex justify-center flex-col w-full"
            data-netlify="true"
            action="/success"
          >
            <input type="hidden" name="contact-form" value="contact-form" />
            <input
              id="name"
              name="name"
              type="text"
              placeholder="What is your name?"
              className="w-full py-2 px-4 border-[#A478E8] border bg-[#24273A] rounded-sm mt-2"
              required
              value={formData.name}
              onChange={handleChange}
            />
            <input
              id="email"
              name="email"
              type="email"
              placeholder="what-is@your-email.question"
              className="w-full py-2 px-4 bg-[#24273A] border-[#A478E8] border rounded-sm mt-2"
              required
              value={formData.email}
              onChange={handleChange}
            />
            <textarea
              id="message"
              name="message"
              placeholder="What do you want to talk about?"
              className="w-full py-2 px-4 mt-2 bg-[#24273A] border-[#A478E8] border rounded-sm"
              rows={5}
              required
              value={formData.message}
              onChange={handleChange}
            ></textarea>
            <div data-netlify-recaptcha="true"></div>
            <button
              id="submit-form"
              type="submit"
              className="border border-[#A478E8] hover:text-[#A478E8] font-bold mt-8 p-4"
            >
              <p id="sender">Send Message</p>
            </button>
          </form>
        </div>

        <div className="h-full">
          <div className="flex justify-center items-center text-2xl">
            <CodeHighlight code={Code.trim()} />
          </div>
        </div>
      </div>

      {showPopup && <SuccessPopup onClose={() => setShowPopup(false)} />}
    </section>
  )
}
