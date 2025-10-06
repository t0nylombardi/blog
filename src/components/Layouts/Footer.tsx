const today = new Date()

const Footer = () => {
  return (
    <footer className="text-ctp-text bg-pink py-[2rem] m-[2rem]">
      <div className="w-full flex flex-col justify-center items-center">
        &copy; {today.getFullYear()} Anthony Lombardi. All rights reserved.
      </div>
    </footer>
  )
}

export default Footer
