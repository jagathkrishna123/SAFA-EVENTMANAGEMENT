export default function Home2() {
  return (
    <div className="relative h-screen w-full flex items-center justify-center bg-gray-950 overflow-hidden">

      {/* V-Shaped Light Left Beam */}
      <div className="absolute top-0 left-[35%] w-[300px] h-[600px] 
                      bg-purple-500/20 blur-3xl rotate-45 origin-top rounded-full">
      </div>

      {/* V-Shaped Light Right Beam */}
      <div className="absolute top-0 right-[35%] w-[300px] h-[600px] 
                      bg-purple-500/20 blur-3xl -rotate-45 origin-top rounded-full">
      </div>

      {/* Title */}
      <h1 className="text-5xl md:text-6xl font-extrabold text-white text-center drop-shadow-2xl">
        Welcome to My Homepage
      </h1>
    </div>
  );
}
