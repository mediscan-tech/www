export default function Footer() {
  return (
    <div className="flex flex-col items-center border-t-2 border-bg-light bg-bg-light/40 pt-8">
      <div className="flex w-[85vw] justify-between">
        <div id="contact">
          <h1 className="pt-4 text-xl font-medium text-text-light">Contact</h1>
          <p className="mt-2 text-sm">support@mediscan.care</p>
          <p className="mt-1 text-sm">(123)-456-7890</p>
        </div>
        <div className="flex flex-col">
          <h1 className="pt-4 text-xl font-medium text-text-light">
            Large Language Models
          </h1>
          <a href="/ai-models" className="mt-2 text-sm">
            General Diagnosis Chatbot
          </a>
          <a href="/ai-models" className="mt-1 text-sm">
            First-Aid Advice
          </a>
          <a href="/ai-models" className="mt-1 text-sm">
            Health Risk Prediction
          </a>
        </div>
        <div className="flex flex-col">
          <h1 className="pt-4 text-xl font-medium text-text-light">
            Machine Learning Models
          </h1>
          <a href="/ai-models" className="mt-2 text-sm">
            Nail Conditions & Diseases
          </a>
          <a href="/ai-models" className="mt-1 text-sm">
            Mouth Conditions & Diseases
          </a>
          <a href="/ai-models" className="mt-1 text-sm">
            Skin Conditions & Diseases
          </a>
        </div>
        <div className="flex flex-col">
          <h1 className="pt-4 text-xl font-medium text-text-light">
            More From Mediscan
          </h1>
          <a href="/wait-times" className="mt-2 text-sm">
            Accurate Nearby Hospital Wait Times
          </a>
          <a href="/telemedicine" className="mt-1 text-sm">
            Video Conference w/ Doctors
          </a>
        </div>
      </div>
      <div className="my-8 h-0.5 w-[90vw] bg-bg-light"></div>
      <div className="relative flex h-[13vw] w-screen items-center justify-center overflow-clip opacity-70">
        <div className="absolute bottom-0 left-0 right-0 top-0 z-10 h-full w-full bg-gradient-to-b from-transparent to-bg"></div>
        <p className="translate-x-[0.5vw] translate-y-[0.75vw] font-mont text-[16vw] font-extrabold text-primary">
          MEDISCAN
        </p>
      </div>
      <div className="z-40 flex h-24 w-screen items-center justify-center bg-bg">
        <div className="flex h-12 w-[85vw]"></div>
      </div>
    </div>
  );
}
