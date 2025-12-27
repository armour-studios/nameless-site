import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Privacy Policy | Nameless Esports',
    description: 'Privacy Policy and data collection practices for Nameless Esports.',
};

export default function PrivacyPage() {
    return (
        <main className="min-h-screen pt-32 pb-20 px-4">
            <div className="max-w-4xl mx-auto space-y-8">
                <h1 className="text-4xl md:text-5xl font-black font-[family-name:var(--font-heading)] uppercase mb-8">
                    Privacy <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-pink-500">Policy</span>
                </h1>

                <section className="space-y-4 text-gray-300 leading-relaxed">
                    <p>Last Updated: {new Date().toLocaleDateString()}</p>
                    <p>
                        At Nameless Esports ("we," "our," or "us"), we are committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website [namelessesports.com] (the "Site"). Please read this privacy policy carefully. If you do not agree with the terms of this privacy policy, please do not access the site.
                    </p>
                </section>

                <section className="space-y-4">
                    <h2 className="text-2xl font-bold text-white">1. Collection of Your Information</h2>
                    <p className="text-gray-300 leading-relaxed">
                        We may collect information about you in a variety of ways. The information we may collect on the Site includes:
                    </p>
                    <ul className="list-disc pl-6 space-y-2 text-gray-300">
                        <li><strong>Personal Data:</strong> Personally identifiable information, such as your name, shipping address, email address, and telephone number, and demographic information, such as your age, gender, hometown, and interests, that you voluntarily give to us when you register with the Site or when you choose to participate in various activities related to the Site.</li>
                        <li><strong>Derivative Data:</strong> Information our servers automatically collect when you access the Site, such as your IP address, your browser type, your operating system, your access times, and the pages you have viewed directly before and after accessing the Site.</li>
                    </ul>
                </section>

                <section className="space-y-4">
                    <h2 className="text-2xl font-bold text-white">2. Use of Your Information</h2>
                    <p className="text-gray-300 leading-relaxed">
                        Having accurate information about you permits us to provide you with a smooth, efficient, and customized experience. We may use information collected about you via the Site to:
                    </p>
                    <ul className="list-disc pl-6 space-y-2 text-gray-300">
                        <li>Administer sweepstakes, promotions, and contests.</li>
                        <li>Compile anonymous statistical data and analysis for use internally or with third parties.</li>
                        <li>Create and manage your account.</li>
                        <li>Email you regarding your account or order.</li>
                        <li>Enable user-to-user communications.</li>
                        <li>Fulfill and manage purchases, orders, payments, and other transactions related to the Site.</li>
                    </ul>
                </section>

                <section className="space-y-4">
                    <h2 className="text-2xl font-bold text-white">3. Disclosure of Your Information</h2>
                    <p className="text-gray-300 leading-relaxed">
                        We may share information we have collected about you in certain situations. Your information may be disclosed as follows:
                    </p>
                    <ul className="list-disc pl-6 space-y-2 text-gray-300">
                        <li><strong>By Law or to Protect Rights:</strong> If we believe the release of information about you is necessary to respond to legal process, to investigate or remedy potential violations of our policies, or to protect the rights, property, and safety of others, we may share your information as permitted or required by any applicable law, rule, or regulation.</li>
                    </ul>
                </section>

                <section className="space-y-4">
                    <h2 className="text-2xl font-bold text-white">4. Contact Us</h2>
                    <p className="text-gray-300 leading-relaxed">
                        If you have questions or comments about this Privacy Policy, please contact us at:
                        <br />
                        <a href="mailto:contact@namelessesports.com" className="text-pink-500 hover:text-pink-400 font-bold">contact@namelessesports.com</a>
                    </p>
                </section>
            </div>
        </main>
    );
}
