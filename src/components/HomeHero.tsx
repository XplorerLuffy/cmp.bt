"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.12, delayChildren: 0.1 },
  },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" as const } },
};

export default function HomeHero() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-brand-tint via-white to-white">
      <div
        className="glow-orb -left-24 -top-24 h-72 w-72 bg-brand-blue/40"
        aria-hidden
      />
      <div
        className="glow-orb -right-24 top-1/3 h-80 w-80 bg-brand-blue-light/40"
        style={{ animationDelay: "3s" }}
        aria-hidden
      />

      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="relative mx-auto flex max-w-6xl flex-col items-center gap-6 px-4 py-20 text-center sm:py-28"
      >
        <motion.div variants={item}>
          <Image
            src="/logo.png"
            alt="Crystal Moon Products logo"
            width={88}
            height={88}
            className="h-20 w-20 rounded-full object-contain drop-shadow-lg sm:h-24 sm:w-24"
            priority
          />
        </motion.div>

        <motion.p
          variants={item}
          className="text-xs font-semibold uppercase tracking-[0.3em] text-brand-blue"
        >
          Handmade in Bhutan
        </motion.p>

        <motion.h1
          variants={item}
          className="max-w-2xl font-display text-4xl font-medium leading-tight text-brand-ink sm:text-6xl"
        >
          Achaar, crafted under
          <br />
          a crystal moon.
        </motion.h1>

        <motion.p variants={item} className="max-w-xl text-brand-ink/65 sm:text-lg">
          Small-batch Bhutanese pickles made with traditional family recipes, fresh local
          chilies, and a whole lot of patience.
        </motion.p>

        <motion.div variants={item} className="mt-2 flex flex-col gap-3 sm:flex-row">
          <Link
            href="/products"
            className="rounded-full bg-brand-blue px-7 py-3 font-display font-semibold text-white shadow-lg shadow-brand-blue/30 transition hover:-translate-y-0.5 hover:bg-brand-blue-dark hover:shadow-xl"
          >
            Shop Our Pickles
          </Link>
          <Link
            href="/about"
            className="rounded-full border border-brand-ink/15 px-7 py-3 font-medium text-brand-ink transition hover:-translate-y-0.5 hover:border-brand-blue hover:text-brand-blue"
          >
            Our Story
          </Link>
        </motion.div>
      </motion.div>
    </section>
  );
}
