import { motion } from "framer-motion";

type Props = {
  value: number;
};

export default function CircularProgress({ value }: Props) {
  const radius = 100;
  const stroke = 10;
  const normalizedRadius = radius - stroke; // ✅ fixed
  const circumference = normalizedRadius * 2 * Math.PI;

  const finalOffset =
    circumference * (1 - value / 100); // ✅ cleaner

  return (
    <svg height={200} width={200}>
      
      <g transform="rotate(-90 100 100)">
        {/* Background */}
        <circle
          stroke="#1e293b"
          fill="transparent"
          strokeWidth={stroke}
          r={normalizedRadius}
          cx={100}
          cy={100}
        />

        {/* Progress */}
        <motion.circle
          stroke="#6366f1"
          fill="transparent"
          strokeWidth={stroke}
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: finalOffset }}
          transition={{ duration: 1.2, ease: "easeInOut" }}
          strokeLinecap="round"
          r={normalizedRadius}
          cx={100}
          cy={100}
        />
      </g>

      {/* Text */}
      <text
        x="50%"
        y="50%"
        dominantBaseline="middle"
        textAnchor="middle"
        fill="white"
        className="font-bold text-4xl"
      >
        {value}
      </text>
    </svg>
  );
}