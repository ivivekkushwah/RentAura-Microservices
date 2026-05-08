// components/FeatureCard.tsx
"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { motion } from "framer-motion";

interface FeatureCardProps {
  title: string;
  desc: string;
  icon: React.ReactNode;
}

export const FeatureCard: React.FC<FeatureCardProps> = ({ title, desc, icon }) => {
  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      className="cursor-pointer"
      transition={{ type: "spring", stiffness: 300 }}
    >
      <Card className="bg-white/80 dark:bg-gray-800/70 backdrop-blur-md rounded-3xl p-6 shadow-lg hover:shadow-2xl transition-all">
        <CardHeader className="flex flex-col items-center gap-4">
          <div className="text-primary text-4xl">{icon}</div>
          <CardTitle className="text-center dark:text-white">{title}</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-center text-gray-700 dark:text-gray-300">{desc}</p>
        </CardContent>
      </Card>
    </motion.div>
  );
};
