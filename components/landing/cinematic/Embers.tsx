export default function Embers() {
  const embers = [
    { left: "8%", delay: "0s", duration: "12s", size: 4 },
    { left: "18%", delay: "2s", duration: "15s", size: 3 },
    { left: "28%", delay: "4s", duration: "14s", size: 5 },
    { left: "38%", delay: "1s", duration: "16s", size: 4 },
    { left: "48%", delay: "6s", duration: "13s", size: 3 },
    { left: "58%", delay: "3s", duration: "17s", size: 5 },
    { left: "68%", delay: "5s", duration: "15s", size: 4 },
    { left: "78%", delay: "2s", duration: "18s", size: 3 },
    { left: "88%", delay: "7s", duration: "14s", size: 4 },
    { left: "95%", delay: "4s", duration: "16s", size: 5 },
  ];

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      {embers.map((ember, index) => (
        <span
          key={index}
          className="absolute rounded-full bg-orange-400 shadow-[0_0_12px_rgba(251,146,60,.9)] animate-ember"
          style={{
            left: ember.left,
            bottom: "-24px",
            width: `${ember.size}px`,
            height: `${ember.size}px`,
            animationDelay: ember.delay,
            animationDuration: ember.duration,
          }}
        />
      ))}
    </div>
  );
}