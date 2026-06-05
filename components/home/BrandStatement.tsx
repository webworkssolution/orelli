import FadeUp from "@/components/ui/FadeUp";

export default function BrandStatement() {
  return (
    <section className="bg-background py-16 px-6 md:px-12 flex justify-center">
      <FadeUp className="max-w-[860px] text-center w-full">
        <h2 className="font-cormorant italic text-foreground text-[clamp(28px,4vw,52px)] leading-tight">
          &quot;Where Indian craft meets contemporary living.&quot;
        </h2>
        <div className="w-[160px] h-[1.5px] bg-accent mx-auto mt-8" />
      </FadeUp>
    </section>
  );
}
