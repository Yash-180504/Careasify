'use client';

export default function WhatsAppButton() {
  const phoneNumber = '917022099595';
  const message = encodeURIComponent('Hi Careasify! I\'m interested in your car wash services. Can you help me?');
  const whatsappUrl = `https://wa.me/${phoneNumber}?text=${message}`;

  return (
    <a
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="whatsapp-float"
      aria-label="Chat on WhatsApp"
      title="Chat with us on WhatsApp"
    >
      <svg viewBox="0 0 32 32" width="28" height="28" fill="white">
        <path d="M16.004 0h-.008C7.174 0 0 7.176 0 16c0 3.5 1.129 6.742 3.047 9.379L1.054 31.33l6.166-1.965A15.89 15.89 0 0016.004 32C24.826 32 32 24.822 32 16S24.826 0 16.004 0zm9.31 22.598c-.39 1.1-1.932 2.013-3.178 2.28-.852.18-1.963.324-5.706-1.227-4.79-1.984-7.872-6.846-8.112-7.164-.23-.318-1.932-2.574-1.932-4.908s1.222-3.482 1.656-3.96c.434-.478.948-.598 1.264-.598.316 0 .632.004.908.016.292.014.684-.11 1.07.816.39.94 1.326 3.234 1.444 3.47.118.236.196.51.04.826-.158.316-.236.514-.472.79-.236.278-.496.62-.71.832-.236.236-.482.492-.206.966.274.472 1.222 2.016 2.626 3.266 1.806 1.606 3.328 2.104 3.8 2.34.474.236.75.196 1.026-.118.276-.316 1.186-1.382 1.502-1.858.316-.478.632-.396 1.066-.236.434.158 2.726 1.286 3.194 1.52.468.236.78.354.898.55.118.196.118 1.128-.272 2.228z"/>
      </svg>
      <span className="whatsapp-pulse"></span>
    </a>
  );
}
