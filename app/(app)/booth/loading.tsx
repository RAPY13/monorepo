export default function Loading() {
  return (
    <div className="flex min-h-[80vh] items-center justify-center">

      <div className="text-center">

        {/* Spinner */}

        <div
          className="
            mx-auto
            mb-8
            h-16
            w-16
            animate-spin
            rounded-full
            border-4
            border-zinc-800
            border-t-orange-500
          "
        />

        {/* Title */}

        <h2 className="text-3xl font-black tracking-[0.25em] text-white">
          LOADING BOOTH
        </h2>

        {/* Subtitle */}

        <p className="mt-4 text-zinc-500">
          Preparing recording studio...
        </p>

      </div>

    </div>
  );
}