import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { PhoneCall, Send, Sparkles, ShieldCheck } from 'lucide-react';

export default function AboutUs() {
  const { t } = useLanguage();

  const [contactSubmitted, setContactSubmitted] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });

  const handleContactSubmit = (e) => {
    e.preventDefault();
    setContactSubmitted(true);
  };

  const founder = {
    name: 'Shagun Chaudhary',
    role: 'Founder // Product Direction & Safety Design',
    quote: 'We built Lumina so every woman can navigate her city with clarity, confidence, and support.',
    imageSrc: '/shagun-chaudhary.jpeg'
  };

  return (
    <div className="space-y-16 py-6 pb-16">
      
      {/* ---------------- 1. EDITORIAL ABOUT HERO (Inspired by Reference Image) ---------------- */}
      <section className="bg-cream-100/80 dark:bg-editorial-darkcard border border-editorial-border dark:border-editorial-darkborder rounded-3xl p-8 sm:p-12 shadow-editorial relative overflow-hidden">
        
        <div className="max-w-3xl space-y-6">
          <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-lumina-red/10 dark:bg-lumina-red/20 border border-lumina-red/20 text-lumina-red dark:text-lumina-rose text-xs font-semibold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Our Mission & Vision</span>
          </div>

          <h1 className="font-serif text-5xl sm:text-6xl font-bold text-stone-900 dark:text-cream-50 leading-[1.08]">
            Reimagining Urban Safety Through Design & Data
          </h1>

          <p className="font-serif italic text-lg text-stone-700 dark:text-cream-200">
            "Every woman deserves to walk, travel, and thrive in any city at any hour without fear or hesitation."
          </p>

          <p className="text-sm text-stone-600 dark:text-stone-300 leading-relaxed max-w-2xl font-sans">
            Lumina was conceived at the intersection of spatial artificial intelligence, editorial web design, and community civic action. We empower women with actionable intelligence — converting dark alleys into illuminated safe corridors and giving voice to verified grassroots reports.
          </p>
        </div>

      </section>

      {/* ---------------- 2. CREATED FOR SAFETY & EMPOWERMENT ---------------- */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        
        <div className="lg:col-span-6 space-y-6">
          <span className="text-xs font-bold text-lumina-red dark:text-lumina-rose uppercase tracking-widest">
            Editorial Philosophy
          </span>
          <h2 className="font-serif text-4xl font-bold text-stone-900 dark:text-cream-50 leading-tight">
            Created for Fearless Explorers —
          </h2>

          <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-300 leading-relaxed">
            Traditional safety platforms often trigger anxiety with alarming warning screens. Lumina flips the narrative: we provide elegant, highly readable editorial maps that celebrate urban mobility while equipping you with verified, actionable safety routes.
          </p>

          <div className="grid grid-cols-2 gap-4 pt-4">
            <div className="p-4 rounded-2xl bg-white dark:bg-stone-900 border border-editorial-border dark:border-editorial-darkborder space-y-1">
              <h4 className="font-serif text-2xl font-bold text-lumina-red">100% Verified</h4>
              <p className="text-[11px] text-stone-500">Dual rate-limited and anti-spam filtered community reporting.</p>
            </div>
            <div className="p-4 rounded-2xl bg-white dark:bg-stone-900 border border-editorial-border dark:border-editorial-darkborder space-y-1">
              <h4 className="font-serif text-2xl font-bold text-lumina-red">Real-Time GIS</h4>
              <p className="text-[11px] text-stone-500">Dynamic street lighting & PCR patrol overlay maps.</p>
            </div>
          </div>
        </div>

        <div className="lg:col-span-6">
          <div className="rounded-3xl overflow-hidden border border-editorial-border dark:border-editorial-darkborder shadow-editorial relative">
            <img
              src="/about-us-hero.png"
              alt="Women Empowerment"
              className="w-full h-[400px] object-cover"
            />
            <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-stone-950 via-stone-950/60 to-transparent p-6 text-white space-y-1">
              <h4 className="font-serif text-xl font-bold">Empowering Urban Freedom</h4>
              <p className="text-xs text-stone-300">Designing safer cities for tomorrow’s leaders.</p>
            </div>
          </div>
        </div>

      </section>

      {/* ---------------- 3. MEET THE FOUNDERS / TEAM ---------------- */}
      <section className="space-y-8">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <span className="text-xs font-bold text-lumina-red dark:text-lumina-rose uppercase tracking-widest">Founders & Leadership</span>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-stone-900 dark:text-cream-50">
            Meet the Visionary Behind Lumina
          </h2>
        </div>

        <div className="max-w-3xl mx-auto">
          <div className="bg-white dark:bg-editorial-darkcard border border-editorial-border dark:border-editorial-darkborder rounded-3xl p-6 sm:p-8 shadow-editorial flex flex-col sm:flex-row items-center gap-6">
            <div className="w-32 h-32 rounded-3xl overflow-hidden border-2 border-lumina-red bg-gradient-to-br from-stone-100 via-cream-50 to-rose-100 dark:from-stone-900 dark:via-stone-800 dark:to-stone-700 flex items-center justify-center shrink-0">
              {founder.imageSrc ? (
                <img
                  src={founder.imageSrc}
                  alt={founder.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="text-center space-y-1">
                  <div className="w-20 h-20 rounded-full bg-white/80 dark:bg-black/30 border border-white/60 dark:border-white/10 flex items-center justify-center mx-auto shadow-sm">
                    <span className="font-serif text-3xl font-bold text-lumina-red">SC</span>
                  </div>
                  <p className="text-[10px] uppercase tracking-[0.3em] text-stone-500 dark:text-stone-300">Portrait to add</p>
                </div>
              )}
            </div>
            <div className="space-y-3 text-center sm:text-left">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-lumina-red/10 dark:bg-lumina-red/20 text-lumina-red dark:text-lumina-rose text-[11px] font-bold uppercase tracking-wider">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>{founder.role}</span>
              </div>
              <h3 className="font-serif text-3xl font-bold text-stone-900 dark:text-white">{founder.name}</h3>
              <p className="text-sm text-stone-600 dark:text-stone-300 leading-relaxed italic max-w-xl">
                "{founder.quote}"
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ---------------- 4. CONTACT US & EMERGENCY HOTLINES ---------------- */}
      <section className="bg-white dark:bg-editorial-darkcard border border-editorial-border dark:border-editorial-darkborder rounded-3xl p-8 sm:p-12 shadow-editorial grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Contact Form */}
        <div className="lg:col-span-7 space-y-6">
          <div>
            <span className="text-xs font-bold text-lumina-red dark:text-lumina-rose uppercase tracking-widest">Get In Touch</span>
            <h3 className="font-serif text-3xl font-bold text-stone-900 dark:text-cream-50">
              Inquiries, Support & Partnerships
            </h3>
            <p className="text-xs text-stone-500 mt-1">Have feedback or want to integrate Lumina data into your civic initiative?</p>
          </div>

          {contactSubmitted ? (
            <div className="p-6 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-300 text-emerald-800 dark:text-emerald-300 text-xs space-y-2">
              <h4 className="font-serif text-lg font-bold">Thank You! Message Received</h4>
              <p>Our team will get back to you within 24 hours.</p>
            </div>
          ) : (
            <form onSubmit={handleContactSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-stone-700 dark:text-cream-200 mb-1">Your Name</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Jane Doe"
                    className="w-full px-4 py-2 text-xs rounded-xl bg-cream-50 dark:bg-stone-900 border border-stone-300 dark:border-stone-700 text-stone-900 dark:text-white outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-stone-700 dark:text-cream-200 mb-1">Email Address</label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="jane@example.com"
                    className="w-full px-4 py-2 text-xs rounded-xl bg-cream-50 dark:bg-stone-900 border border-stone-300 dark:border-stone-700 text-stone-900 dark:text-white outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 dark:text-cream-200 mb-1">Message</label>
                <textarea
                  required
                  rows={4}
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  placeholder="Share your thoughts, suggestions or partnership ideas..."
                  className="w-full px-4 py-2 text-xs rounded-xl bg-cream-50 dark:bg-stone-900 border border-stone-300 dark:border-stone-700 text-stone-900 dark:text-white outline-none resize-none"
                />
              </div>

              <button
                type="submit"
                className="px-6 py-2.5 rounded-xl bg-lumina-red hover:bg-lumina-crimson text-white font-bold text-xs tracking-wider transition-all shadow-glow-red flex items-center space-x-2"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Send Message</span>
              </button>
            </form>
          )}
        </div>

        {/* Emergency Info Sidebar */}
        <div className="lg:col-span-5 bg-cream-100/60 dark:bg-stone-900 p-6 rounded-2xl border border-editorial-border dark:border-editorial-darkborder space-y-6">
          <div className="space-y-2">
            <h4 className="font-serif text-xl font-bold text-stone-900 dark:text-cream-50 flex items-center gap-2">
              <PhoneCall className="w-5 h-5 text-lumina-red" />
              Emergency Support Hub
            </h4>
            <p className="text-xs text-stone-500">Immediate 24/7 assistance hotlines across India.</p>
          </div>

          <div className="space-y-3 text-xs">
            <div className="p-3 rounded-xl bg-white dark:bg-editorial-darkcard border border-stone-200 dark:border-stone-800 flex justify-between items-center font-semibold">
              <span>Women Helpline:</span>
              <span className="font-mono text-lumina-red text-sm font-bold">1091</span>
            </div>
            <div className="p-3 rounded-xl bg-white dark:bg-editorial-darkcard border border-stone-200 dark:border-stone-800 flex justify-between items-center font-semibold">
              <span>National Police Emergency:</span>
              <span className="font-mono text-lumina-red text-sm font-bold">112</span>
            </div>
            <div className="p-3 rounded-xl bg-white dark:bg-editorial-darkcard border border-stone-200 dark:border-stone-800 flex justify-between items-center font-semibold">
              <span>Cyber Harassment Cell:</span>
              <span className="font-mono text-lumina-red text-sm font-bold">1930</span>
            </div>
          </div>
        </div>

      </section>

    </div>
  );
}
