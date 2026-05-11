import { Metadata } from "next";
import FadeUp from "@/components/ui/FadeUp";

export const metadata: Metadata = {
  title: "Our Story | Orelli Bombay",
  description: "Rooted in Bombay. Crafted for the world. Discover the heritage and craft behind Orelli Bombay textiles.",
};

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero */}
      <section className="relative w-full h-[60vh] overflow-hidden mt-[72px]">
        <img
          src="https://picsum.photos/seed/abouthero/1920/1080"
          alt="Orelli Bombay Studio"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/40 z-10" />
        <div className="absolute inset-0 z-20 flex items-center justify-center px-6">
          <FadeUp>
            <h1 className="font-cormorant italic text-whiteAlt text-[clamp(36px,5vw,72px)] text-center leading-tight">
              Rooted in Bombay.<br />Crafted for the world.
            </h1>
          </FadeUp>
        </div>
      </section>

      {/* Brand Story */}
      <section className="bg-background py-24 px-6 md:px-12">
        <div className="flex flex-col md:flex-row w-full gap-12 lg:gap-24">
          <div className="w-full md:w-1/2">
            <FadeUp>
              <span className="font-sans uppercase tracking-[0.12em] text-[11px] text-[#888] block mb-6">
                OUR STORY
              </span>
              <h2 className="font-cormorant text-[clamp(32px,4vw,52px)] text-foreground mb-8 leading-tight">
                A legacy of textiles,<br />reimagined for today.
              </h2>
              <div className="font-sans text-[15px] text-[#555] leading-[1.9] space-y-6">
                <p>
                  Orelli Bombay was born from a deep reverence for the textile heritage of India. We set out to create fabrics that honor the meticulous techniques of the past while speaking fluently to the sensibilities of modern interior architecture.
                </p>
                <blockquote className="font-cormorant italic text-[22px] text-accent border-l-2 border-accent pl-[20px] my-8">
                  "True luxury lies in the unseen details—the tension of the warp, the subtle irregularity of the hand-spun weft."
                </blockquote>
                <p>
                  We collaborate directly with master weaving communities across the subcontinent. By pairing their generational expertise with contemporary color palettes and refined natural fibers, we produce textiles that are both inherently grounded and effortlessly sophisticated.
                </p>
                <p>
                  Every yard we create is a testament to slow production. We believe that textiles should not just cover a piece of furniture or frame a window—they should bring soul, depth, and a sense of enduring calm to the spaces you live in.
                </p>
              </div>
            </FadeUp>
          </div>
          <div className="w-full md:w-1/2">
            <FadeUp delay={0.2} className="h-full">
              <img
                src="https://picsum.photos/seed/aboutstory/800/1000"
                alt="Artisan weaving on loom"
                className="w-full h-full object-cover rounded-[4px]"
              />
            </FadeUp>
          </div>
        </div>
      </section>

      {/* Values Strip */}
      <section className="bg-[#1A1A1A] py-24 px-6 md:px-12">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            {
              title: "Craft",
              description: "We embrace the slight imperfections of the human hand. Each textile carries the unique signature of the artisan who wove it, ensuring no two runs are ever identically machine-perfect.",
            },
            {
              title: "Heritage",
              description: "By sustaining traditional looms and techniques, we ensure that ancient knowledge continues to evolve rather than become artifacts. We are a living bridge between eras.",
            },
            {
              title: "Intention",
              description: "We produce in small, considered batches. Our focus is on enduring quality and timeless aesthetics, rejecting the cycle of rapid trends in favor of pieces that age beautifully.",
            },
          ].map((value, index) => (
            <FadeUp key={value.title} delay={index * 0.15}>
              <div className="border border-accent/40 rounded-[4px] p-10 h-full">
                <h3 className="font-cormorant text-[28px] text-accent mb-4">
                  {value.title}
                </h3>
                <p className="font-sans text-[14px] text-whiteAlt/75 leading-[1.8]">
                  {value.description}
                </p>
              </div>
            </FadeUp>
          ))}
        </div>
      </section>
    </div>
  );
}
