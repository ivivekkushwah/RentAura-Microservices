import ContactForm from "./ContactForm";
import { Card, CardContent } from "@/components/ui/card";
import EmailButton from "./EmailButton";

export default function ContactPage() {
  return (
    <div className="p-6 max-w-4xl mx-auto space-y-12">
      <h1 className="text-4xl font-bold text-center">Contact Us</h1>
      <p className="text-center text-gray-600">
        Have questions or feedback? Reach out to us, and we’ll get back to you as soon as possible.
      </p>

      <div className="grid md:grid-cols-2 gap-8">
        {/* Contact Form (CSR inside SSR) */}
        <Card className="p-6 hover:shadow-xl transition-shadow duration-300">
          <CardContent>
            <ContactForm /> {/* ✅ Client Component */}
          </CardContent>
        </Card>

        {/* Static Contact Info */}
        <Card className="p-6 hover:shadow-xl transition-shadow duration-300 space-y-4">
          <CardContent className="space-y-6">
            <h2 className="text-2xl font-semibold">Get in Touch</h2>
            <div>
              <p className="font-medium">Email:</p>
              <p className="text-gray-600">support@rentaura.com</p>
            </div>
            <div>
              <p className="font-medium">Phone:</p>
              <p className="text-gray-600">+91 98765 43210</p>
            </div>
            <div>
              <p className="font-medium">Address:</p>
              <p className="text-gray-600">123 Rental Street, Vidisha, India</p>
            </div>
            <EmailButton /> {/* ✅ Client Component */}
          </CardContent>
        </Card>
      </div>

      {/* Static Map - suppress hydration warning */}
      <div
        className="w-full h-64 rounded-lg overflow-hidden shadow-lg"
        suppressHydrationWarning
      >
        <iframe
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d7367.671738352647!2d77.3942!3d23.2599!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x397c427e6a9fdbd9%3A0x7b2c3fbe9af7f889!2sBhopal%2C%20Madhya%20Pradesh!5e0!3m2!1sen!2sin!4v1692100000000!5m2!1sen!2sin"
          width="100%"
          height="100%"
          className="border-0"
          allowFullScreen
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        ></iframe>
      </div>
    </div>
  );
}
