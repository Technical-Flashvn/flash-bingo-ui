'use client';

export default function LoaderCustom() {
  return (
    <div className="w-[100px] h-[100px] flex flex-col items-center justify-center gap-2">
      <div className="flex items-center justify-center gap-2">
        {/* Green dot */}
        <span className="w-5 h-5 rounded-full animate-bounce duration-[1s] bg-green-500" />
        {/* Blue dot */}
        <span className="w-5 h-5 rounded-full animate-bounce duration-[1s] delay-150 bg-blue-500" />
        {/* Yellow dot */}
        <span className="w-5 h-5 rounded-full animate-bounce duration-[1s] delay-300 bg-yellow-400" />
        {/* Red dot */}
        <span className="w-5 h-5 rounded-full animate-bounce duration-[1s] delay-450 bg-red-500" />
      </div>
      <p className="text-sm text-muted-foreground mt-2">Please wait...</p>
    </div>
  );
}
