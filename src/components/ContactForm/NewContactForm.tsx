import React, {useState} from 'react'
import CodeHighlight from '../CodeHighlight'
import './style.css'

export default function NewContactForm() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  })

  const truncate = (str, maxLength) => (str.length > maxLength ? str.slice(0, maxLength) + '...' : str)

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

  const handleChange = (e) => {
    const {name, value} = e.target
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }))
  }

  return (
    <section id="contact" className="min-h-[80vh] flex items-center">
      <div className="columns-2 gap-8 w-full justify-center">
        <div className="h-full">
          <form
            id="contact-form"
            className="flex justify-center flex-col w-full "
            action="/form_success"
            method="POST"
            data-netlify="true"
          >
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
            <button
              id="submit-form"
              type="submit"
              className="border border-[#A478E8] hover:text-[#A478E8] font-bold mt-8 p-4"
            >
              <div id="loader" className="flex items-center hidden">
                <svg
                  className="mr-3 h-5 w-5 animate-spin text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Loading ...
              </div>
              <p id="sender">Send Message</p>
            </button>
          </form>
        </div>
        <div className="h-full">
          {/* Code Preview */}
          <div className="flex justify-center items-center text-2xl">
            <CodeHighlight code={Code.trim()} />
          </div>
        </div>
      </div>
    </section>
  )
}
