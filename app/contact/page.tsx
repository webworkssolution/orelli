import { Metadata } from "next";
import FadeUp from "@/components/ui/FadeUp";
import CareersSection from "@/components/contact/CareersSection";

export const metadata: Metadata = {
  title: "Contact Us | Orelli Bombay",
  description: "Contact us for inquiries, custom orders, or studio visits. Explore careers at Orelli Bombay.",
};

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <section className="pt-32 pb-8 px-6 md:px-12">
        <FadeUp>
          <h1 className="font-cormorant text-[clamp(36px,5vw,64px)] text-foreground leading-none">
            Contact Us
          </h1>
        </FadeUp>
      </section>

      {/* Main Content */}
      <section className="pb-16 px-6 md:px-12">
        <div className="flex flex-col md:flex-row w-full gap-16 md:gap-0">
          
          {/* Left: Studio Info */}
          <div className="w-full md:w-1/2 md:pr-16 order-1">
            <FadeUp delay={0.1} className="h-full">
              <h2 className="font-cormorant text-[28px] text-foreground mb-4">
                Orelli Bombay
              </h2>
              <div className="font-sans text-[16px] text-[#555] leading-[1.9] mb-6">
                <p>1st Floor, Rudra Paradise</p>
                <p>Guru Narayan Rd, Madhuvan Society</p>
                <p>Sen Nagar, Santacruz East</p>
                <p>Mumbai, Maharashtra 400055</p>
              </div>
              
              <a href="mailto:orellibombay@orelli.co.in" className="font-sans text-[16px] text-accent hover:underline decoration-accent/50 underline-offset-4 mb-6 block w-fit">
                orellibombay@orelli.co.in
              </a>

              <div className="font-sans text-[16px] text-[#555] mb-8">
                <p>Monday – Friday: 10am – 6pm</p>
                <p>Saturday: By appointment only</p>
              </div>

              <div className="w-full h-[250px] bg-border rounded-[4px] overflow-hidden">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img 
                  src="/new-hero-2.jpeg" 
                  alt="Studio Map Location" 
                  className="w-full h-full object-cover grayscale opacity-80"
                />
              </div>
            </FadeUp>
          </div>

          {/* Right: Careers Section */}
          <div className="w-full md:w-1/2 md:pl-16 order-2 mt-12 md:mt-0 md:border-l md:border-border/60">
            <CareersSection />
          </div>

        </div>
      </section>
    </div>
  );
}
