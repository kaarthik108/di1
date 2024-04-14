export const runtime = "edge";

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-[#2b2b27] text-white/80 px-6 py-24 md:px-12 lg:px-24">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl md:text-5xl font-bold mb-12 text-center text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-purple-500">
          Discover <span className="text-white/80">Di1</span>
        </h1>

        <div className="bg-[#393937] rounded-lg p-8 mb-12 shadow-lg relative">
          <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-t-lg animate-pulse"></div>
          <p className="text-base md:text-md mb-4">
            <span className="font-bold text-blue-400">Di1 </span>
            an <span className="text-purple-400">AI-powered</span> T2SQL Chatbot
            for Cloudflare D1.{`It's`} like having a{" "}
            <span className="italic">conversation</span> with your database!
          </p>
          <p className="text-base md:text-md">
            {`I've`} made Di1{" "}
            <a
              href="https://github.com/kaarthik108/di1"
              className="font-bold text-green-400"
            >
              open-source
            </a>
            , so feel free to tinker with it and make it even better.
          </p>
        </div>

        <div className="grid md:grid-cols-1 sm:grid-cols-2 gap-8">
          <div className="bg-[#393937] rounded-lg p-8 shadow-lg">
            <h2 className="text-lg md:text-xl font-bold mb-4 text-blue-400">
              The Y Combinator Dataset
            </h2>
            <p className="text-base mb-4">
              Imagine having access to a{" "}
              <span className="text-yellow-400">treasure trove</span> of startup
              data. {`That's`} exactly what the{" "}
              <span className="font-bold">Y Combinator dataset</span> offers.
              {`It's`} like a <span className="italic">secret playbook</span>{" "}
              for entrepreneurs and investors alike.
            </p>
            <p className="text-base mb-4">
              This dataset is a snapshot of the Y Combinator directory as of{" "}
              <span className="font-bold text-green-400">July 13th, 2023</span>.
              It contains detailed information about the companies that have
              been part of Y {`Combinator's`} accelerator program.
            </p>
            <p className="text-base mb-4">
              From company names and descriptions to industry tags, locations,
              founding years, and team sizes, this dataset provides a{" "}
              <span className="text-purple-400">comprehensive look</span> at the
              startups that have been shaped by Y {`Combinator's`} expertise.
            </p>
            <p className="text-base">
              Y Combinator has an impressive track record, with over{" "}
              <span className="font-bold text-blue-400">4,000 companies</span>{" "}
              under its wing, collectively valued at a staggering{" "}
              <span className="font-bold text-yellow-400">$600 billion</span>.
              {`That's`} a lot of zeros and a testament to the impact of this
              accelerator program.
            </p>
          </div>

          <div className="bg-[#393937] rounded-lg p-8 shadow-lg transform">
            <h2 className="text-lg md:text-xl font-bold mb-4 text-purple-400">
              About Me
            </h2>
            <p className="text-base mb-4">
              Hi there! {`I'm`}{" "}
              <a
                className="font-bold text-blue-400 hover:text-blue-500 transition duration-300"
                href="https://www.k01.dev/"
                target="_blank"
                rel="noopener noreferrer"
              >
                Kaarthik
              </a>
              , the mastermind behind Di1. I have a knack for building{" "}
              <span className="italic">innovative projects</span> that push the
              boundaries of {`what's`} possible.
            </p>
            <p className="text-base mb-4">
              When {`I'm`} not immersed in code, you can find me sharing my
              thoughts and discoveries on{" "}
              <a
                href="https://twitter.com/kaarthikcodes"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-400 hover:text-blue-500 font-bold transition duration-300"
              >
                X
              </a>{" "}
              and showcasing my projects on{" "}
              <a
                href="https://github.com/kaarthik108"
                target="_blank"
                rel="noopener noreferrer"
                className="text-purple-400 hover:text-purple-500 font-bold transition duration-300"
              >
                GitHub
              </a>
              /
              <a
                href="https://www.linkedin.com/in/kaarthik-andavar-b32a27143/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-400 hover:text-blue-500 font-bold transition duration-300"
              >
                Linkedin
              </a>
              . Feel free to connect with me and explore the{" "}
              <span className="text-yellow-400">
                exciting world of technology
              </span>{" "}
              together!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
