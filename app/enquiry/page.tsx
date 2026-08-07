import { Metadata } from "next";
import FadeUp from "@/components/ui/FadeUp";
import EnquiryForm from "@/components/enquiry/EnquiryForm";

export const metadata: Metadata = {
  title: "Enquiry | Orelli Bombay",
  description:
    "Start a bespoke project with Orelli Bombay. Share your requirements, reference photos and colour palette, and our studio will get back to you.",
  alternates: {
    canonical: "https://orelli.co.in/enquiry",
  },
  openGraph: {
    title: "Enquiry | Orelli Bombay",
    description:
      "Start a bespoke project with Orelli Bombay. Share your requirements and our studio will get back to you.",
    url: "https://orelli.co.in/enquiry",
    type: "website",
  },
};

export default function EnquiryPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <section className="pt-32 pb-8 px-6 md:px-12 flex justify-center">
        <FadeUp>
          <div className="max-w-[720px] w-full mx-auto text-center">
            <h1 className="font-cormorant text-[clamp(36px,5vw,64px)] text-foreground leading-none">
              Enquiry
            </h1>
            <p className="font-sans text-[16px] md:text-[17px] text-[#555] leading-[1.9] mt-6 max-w-[620px] mx-auto">
              Tell us about your space and what you have in mind. Share reference
              photos or a colour palette if you have them — it helps our studio
              respond with something considered rather than generic.
            </p>
          </div>
        </FadeUp>
      </section>

      {/* Form */}
      <section className="pb-24 px-6 md:px-12 flex justify-center">
        <FadeUp delay={0.1}>
          <div className="max-w-[720px] w-full mx-auto">
            <EnquiryForm />
          </div>
        </FadeUp>
      </section>
    </div>
  );
}
