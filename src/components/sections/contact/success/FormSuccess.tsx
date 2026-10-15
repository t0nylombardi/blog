import './form-success.css'

const FormSuccess = () => {
  return (
    <div className="flex flex-col items-center justify-center mx-auto max-w-2xl px-6 text-center">
      <h1 className="mb-6">Message Successfully Executed.</h1>

      <p className="mb-4">
        Against all odds, you've successfully navigated three input fields and executed a contact form without a single
        syntax error.
      </p>

      <p className="mb-4">Your message has been dispatched into the digital void and should reach my inbox shortly.</p>

      <p>I'll get back to you as soon as I can. Until then, may your builds be green and your bugs be shallow.</p>
    </div>
  )
}

export default FormSuccess
