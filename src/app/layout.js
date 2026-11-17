
import "./globals.css";

export const metadata = {
  title: "PostPilot AI | Social Media Content Studio",
  description: "Generate, manage and schedule social media content with AI.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
