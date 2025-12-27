import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Terms & Conditions | Nameless Esports',
    description: 'Terms and Conditions for using the Nameless Esports website.',
};

export default function TermsPage() {
    return (
        <main className="min-h-screen pt-32 pb-20 px-4">
            <div className="max-w-4xl mx-auto space-y-8">
                <h1 className="text-4xl md:text-5xl font-black font-[family-name:var(--font-heading)] uppercase mb-8">
                    Terms & <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-pink-500">Conditions</span>
                </h1>

                <section className="space-y-4 text-gray-300 leading-relaxed">
                    <p>Last Updated: {new Date().toLocaleDateString()}</p>
                    <p>
                        Welcome to Nameless Esports. These Terms and Conditions ("Terms") govern your use of the website [namelessesports.com] (the "Site") operated by Nameless Esports ("us", "we", or "our").
                        By accessing or using the Site, you agree to be bound by these Terms. If you disagree with any part of the terms, then you may not access the Site.
                    </p>
                </section>

                <section className="space-y-4">
                    <h2 className="text-2xl font-bold text-white">1. Use of the Site</h2>
                    <p className="text-gray-300 leading-relaxed">
                        You agree to use the Site only for lawful purposes and in accordance with these Terms. You agree not to use the Site:
                    </p>
                    <ul className="list-disc pl-6 space-y-2 text-gray-300">
                        <li>In any way that violates any applicable federal, state, local, or international law or regulation.</li>
                        <li>To transmit, or procure the sending of, any advertising or promotional material, including any "junk mail", "chain letter," "spam," or any other similar solicitation.</li>
                        <li>To impersonate or attempt to impersonate Nameless Esports, a Nameless Esports employee, another user, or any other person or entity.</li>
                    </ul>
                </section>

                <section className="space-y-4">
                    <h2 className="text-2xl font-bold text-white">2. Intellectual Property</h2>
                    <p className="text-gray-300 leading-relaxed">
                        The Site and its original content, features, and functionality are and will remain the exclusive property of Nameless Esports and its licensors. The Site is protected by copyright, trademark, and other laws of both the United States and foreign countries. Our trademarks and trade dress may not be used in connection with any product or service without the prior written consent of Nameless Esports.
                    </p>
                </section>

                <section className="space-y-4">
                    <h2 className="text-2xl font-bold text-white">3. Links To Other Web Sites</h2>
                    <p className="text-gray-300 leading-relaxed">
                        Our Service may contain links to third-party web sites or services that are not owned or controlled by Nameless Esports. Nameless Esports has no control over, and assumes no responsibility for, the content, privacy policies, or practices of any third-party web sites or services. You further acknowledge and agree that Nameless Esports shall not be responsible or liable, directly or indirectly, for any damage or loss caused or alleged to be caused by or in connection with use of or reliance on any such content, goods or services available on or through any such web sites or services.
                    </p>
                </section>

                <section className="space-y-4">
                    <h2 className="text-2xl font-bold text-white">4. Termination</h2>
                    <p className="text-gray-300 leading-relaxed">
                        We may terminate or suspend access to our Site immediately, without prior notice or liability, for any reason whatsoever, including without limitation if you breach the Terms.
                    </p>
                </section>

                <section className="space-y-4">
                    <h2 className="text-2xl font-bold text-white">5. Changes</h2>
                    <p className="text-gray-300 leading-relaxed">
                        We reserve the right, at our sole discretion, to modify or replace these Terms at any time. What constitutes a material change will be determined at our sole discretion. By continuing to access or use our Service after those revisions become effective, you agree to be bound by the revised terms.
                    </p>
                </section>

                <section className="space-y-4">
                    <h2 className="text-2xl font-bold text-white">6. Contact Us</h2>
                    <p className="text-gray-300 leading-relaxed">
                        If you have any questions about these Terms, please contact us at:
                        <br />
                        <a href="mailto:contact@namelessesports.com" className="text-pink-500 hover:text-pink-400 font-bold">contact@namelessesports.com</a>
                    </p>
                </section>
            </div>
        </main>
    );
}
