export default function Footer() {
  return (
    <footer>
      <div className="max-w-6xl px-4 mx-auto sm:px-6">

        {/* Bottom area */}
        <div className="py-4 border-t border-gray-200 md:flex md:items-center md:justify-between md:py-8">

          {/* Social as */}
          <ul className="flex mb-4 md:order-1 md:ml-4 md:mb-0">
            <li className="ml-4">
              <a href="https://github.com/mediscan-tech" className="flex items-center justify-center text-gray-600 transition duration-150 ease-in-out bg-white rounded-full shadow hover:text-gray-900 hover:bg-white-100" aria-label="Github">
                <svg className="w-8 h-8 fill-current" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
                  <path d="M16 8.2c-4.4 0-8 3.6-8 8 0 3.5 2.3 6.5 5.5 7.6.4.1.5-.2.5-.4V22c-2.2.5-2.7-1-2.7-1-.4-.9-.9-1.2-.9-1.2-.7-.5.1-.5.1-.5.8.1 1.2.8 1.2.8.7 1.3 1.9.9 2.3.7.1-.5.3-.9.5-1.1-1.8-.2-3.6-.9-3.6-4 0-.9.3-1.6.8-2.1-.1-.2-.4-1 .1-2.1 0 0 .7-.2 2.2.8.6-.2 1.3-.3 2-.3s1.4.1 2 .3c1.5-1 2.2-.8 2.2-.8.4 1.1.2 1.9.1 2.1.5.6.8 1.3.8 2.1 0 3.1-1.9 3.7-3.7 3.9.3.4.6.9.6 1.6v2.2c0 .2.1.5.6.4 3.2-1.1 5.5-4.1 5.5-7.6-.1-4.4-3.7-8-8.1-8z" />
                </svg>
              </a>
            </li>
          </ul>

          {/* Copyrights note */}
          <div className="mr-4 text-sm text-gray-600">&copy; Built with 💖 by <u><a href="https://github.com/navincodesalot/">navincodesalot</a></u> and <u><a href="https://github.com/Richp16">richp16</a></u><br/>Initial Template by <u><a href="https://cruip.com/simple/">cruip.com</a></u></div>
        </div>
      </div>
    </footer>
  )
}