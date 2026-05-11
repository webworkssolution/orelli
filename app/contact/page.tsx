import { Metadata } from "next";
import FadeUp from "@/components/ui/FadeUp";
import ContactForm from "@/components/contact/ContactForm";

export const metadata: Metadata = {
  title: "Contact Us | Orelli Bombay",
  description: "Let's work together. Reach out for project inquiries, custom orders, or studio visits.",
};

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <section className="pt-40 pb-8 px-6 md:px-12">
        <FadeUp>
          <h1 className="font-cormorant text-[clamp(36px,5vw,64px)] text-foreground leading-none">
            Let's Work Together
          </h1>
        </FadeUp>
      </section>

      {/* Main Content */}
      <section className="pb-32 px-6 md:px-12">
        <div className="flex flex-col md:flex-row w-full gap-16 md:gap-0">
          
          {/* Left: Enquiry Form */}
          <div className="w-full md:w-1/2">
            <FadeUp delay={0.1}>
              <ContactForm />
            </FadeUp>
          </div>

          {/* Right: Studio Info */}
          <div className="w-full md:w-1/2 md:pl-16">
            <FadeUp delay={0.2} className="h-full">
              <span className="font-sans uppercase tracking-[0.12em] text-[11px] text-[#888] block mb-4">
                STUDIO
              </span>
              <h2 className="font-cormorant text-[26px] text-foreground mb-4">
                Orelli Bombay
              </h2>
              <div className="font-sans text-[14px] text-[#555] leading-[1.9] mb-6">
                <p>14 Mahalaxmi Estate</p>
                <p>Moses Road, Worli</p>
                <p>Mumbai, 400018</p>
                <p>India</p>
              </div>
              
              <a href="mailto:hello@orellibombay.com" className="font-sans text-[14px] text-accent hover:underline decoration-accent/50 underline-offset-4 mb-6 block w-fit">
                hello@orellibombay.com
              </a>

              <div className="font-sans text-[14px] text-[#555] mb-8">
                <p>Monday – Friday: 10am – 6pm</p>
                <p>Saturday: By appointment only</p>
              </div>

              <div className="w-full h-[200px] bg-border rounded-[4px] overflow-hidden">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img 
                  src="https://picsum.photos/seed/map/800/400" 
                  alt="Studio Map Location" 
                  className="w-full h-full object-cover grayscale opacity-80"
                />
              </div>
            </FadeUp>
          </div>

        </div>
      </section>
    </div>
  );
}
