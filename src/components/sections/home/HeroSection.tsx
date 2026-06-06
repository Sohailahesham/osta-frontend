"use client";

import Image from "next/image";
import heroImage from "@/assets/images/hero-bg.png";

export default function HeroSection() {
  return (
    <section className="">
        <h1>مرحبا بك ف اوسطي</h1>
        <div className="w-full max-w-md">
          <Image
            src={heroImage}
            alt="Hero"
            width={500}
            height={500}
            className="w-full h-auto object-contain"
          />
        </div>
    </section>
  );
}