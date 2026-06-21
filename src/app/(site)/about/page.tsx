import Image from "next/image";
import FadeInSection from "@/components/FadeInSection";

export default function AboutPage() {
  return (
    <div>
      <div className="border-b border-brand-ink/10 bg-white">
        <FadeInSection className="mx-auto max-w-3xl px-4 py-12 text-center">
          <Image
            src="/logo.png"
            alt="Crystal Moon Products logo"
            width={56}
            height={56}
            className="mx-auto mb-3 h-14 w-14 rounded-full object-contain"
          />
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-brand-blue">
            Our Story
          </p>
          <h1 className="font-display text-3xl font-medium text-brand-ink sm:text-4xl">
            Empowering women, supporting farmers, made in Bhutan.
          </h1>
        </FadeInSection>
      </div>

      <FadeInSection className="mx-auto max-w-3xl px-4 py-12">
        <div className="flex flex-col gap-5 leading-relaxed text-brand-ink/80">
          <p>
            Crystal Moon Products (CMP) Women and Youth Group was established in 2015 in
            Jigmeling, Sarpang, to create sustainable employment opportunities for
            disadvantaged women and unemployed youth. The group produces organic,
            value-added food products using locally sourced raw materials from farmers
            across Bhutan.
          </p>
          <p>
            Currently employing seven women, CMP manufactures a range of products including
            pickles, pastes (Ezzays), spices, soups, and fruit powders. By adding value to
            local agricultural produce, the organization supports farmers, promotes local
            products, and contributes to income generation and economic development.
          </p>
          <h2 className="mt-2 font-display text-xl font-medium text-brand-ink">
            Our Commitment
          </h2>
          <p>
            With a growing distribution network across Bhutan, CMP is committed to
            delivering high-quality, affordable products while empowering women and youth
            through entrepreneurship and skill development.
          </p>
        </div>
      </FadeInSection>
    </div>
  );
}
