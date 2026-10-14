/** Submits text fields, including Netlify's form identifier and honeypot. */
export async function submitContactForm(formData: FormData): Promise<void> {
  const body = new URLSearchParams()

  formData.forEach((value, key) => {
    if (typeof value === 'string') {
      body.append(key, value)
    }
  })

  const response = await fetch('/__forms.html', {
    method: 'POST',
    headers: {'Content-Type': 'application/x-www-form-urlencoded'},
    body: body.toString(),
  })

  if (!response.ok) {
    throw new Error(`Error: ${response.status} ${response.statusText}`)
  }
}
