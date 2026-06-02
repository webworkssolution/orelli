import FadeUp from "@/components/ui/FadeUp";
import Link from "next/link";

export const metadata = {
  title: "Privacy Policy | Orelli Bombay",
  description: "Privacy Policy for Orelli Bombay.",
};

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-background pt-32 pb-24 px-6 md:px-12">
      <div className="max-w-3xl mx-auto">
        <FadeUp>
          <div className="font-sans text-[12px] text-[#888] mb-6">
            <Link href="/" className="hover:text-foreground transition-colors">
              Home
            </Link>
            <span className="mx-2">/</span>
            <span className="text-foreground">Privacy Policy</span>
          </div>
          
          <h1 className="font-cormorant text-[clamp(36px,5vw,56px)] text-foreground mb-8">
            Privacy Policy
          </h1>
          
          <div className="font-sans text-[15px] text-[#555] leading-[1.8] space-y-8">
            <p>
              Last updated: {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
            </p>

            <section>
              <h2 className="font-cormorant text-2xl text-foreground mb-4">1. Introduction</h2>
              <p>
                Welcome to Orelli Bombay. We respect your privacy and are committed to protecting your personal data. This privacy policy will inform you as to how we look after your personal data when you visit our website and tell you about your privacy rights.
              </p>
            </section>

            <section>
              <h2 className="font-cormorant text-2xl text-foreground mb-4">2. The Data We Collect</h2>
              <p className="mb-2">We may collect, use, store and transfer different kinds of personal data about you which we have grouped together as follows:</p>
              <ul className="list-disc pl-5 space-y-1 text-[#666]">
                <li><strong>Identity Data</strong> includes first name, last name, username or similar identifier.</li>
                <li><strong>Contact Data</strong> includes billing address, delivery address, email address and telephone numbers.</li>
                <li><strong>Technical Data</strong> includes internet protocol (IP) address, browser type and version, time zone setting and location, browser plug-in types and versions, operating system and platform, and other technology on the devices you use to access this website.</li>
                <li><strong>Usage Data</strong> includes information about how you use our website, products and services.</li>
              </ul>
            </section>

            <section>
              <h2 className="font-cormorant text-2xl text-foreground mb-4">3. How We Use Your Data</h2>
              <p>
                We will only use your personal data when the law allows us to. Most commonly, we will use your personal data in the following circumstances:
              </p>
              <ul className="list-disc pl-5 mt-2 space-y-1 text-[#666]">
                <li>Where we need to perform the contract we are about to enter into or have entered into with you (e.g., fulfilling an order or responding to an enquiry).</li>
                <li>Where it is necessary for our legitimate interests (or those of a third party) and your interests and fundamental rights do not override those interests.</li>
                <li>Where we need to comply with a legal obligation.</li>
              </ul>
            </section>

            <section>
              <h2 className="font-cormorant text-2xl text-foreground mb-4">4. Data Security</h2>
              <p>
                We have put in place appropriate security measures to prevent your personal data from being accidentally lost, used or accessed in an unauthorised way, altered or disclosed. In addition, we limit access to your personal data to those employees, agents, contractors and other third parties who have a business need to know.
              </p>
            </section>

            <section>
              <h2 className="font-cormorant text-2xl text-foreground mb-4">5. Contact Us</h2>
              <p>
                If you have any questions about this privacy policy or our privacy practices, please contact us at:
              </p>
              <p className="mt-4 font-medium text-foreground">Orelli Bombay</p>
              <p>1st Floor, Rudra Paradise, Guru Narayan Rd,</p>
              <p>Madhuvan Society, Sen Nagar, Santacruz East,</p>
              <p>Mumbai, Maharashtra 400055</p>
              <p className="mt-2">Email: <a href="mailto:orellibombay@orelli.co.in" className="text-accent hover:underline">orellibombay@orelli.co.in</a></p>
            </section>
          </div>
        </FadeUp>
      </div>
    </div>
  );
}
