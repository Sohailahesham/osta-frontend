"use client";

import Image from "next/image";
import heroImage from "@/assets/images/hero-bg.png";

export default function HeroSection() {
  return (
    <section className="">
        <div className="">
          <Image
            src={heroImage}
            alt="Hero"
            width={500}
            height={500}
            className=""
          />
        </div>
    </section>
  );
}