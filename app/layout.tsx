import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Utsav AI — Premier Indian Celebration & Event Planner',
  description: 'GenAI-powered celebration assistant for Indian weddings, birthdays, anniversaries, and community festivals. Personalized plans, INR budget estimation, timeline management, and vendor organization.',
  keywords: ['Indian Wedding Planner', 'Event Management AI', 'Utsav AI', 'Celebration Planner', 'Vedic Wedding Schedule', 'Budget Estimator INR'],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className="bg-ivory-50 text-indigo-950 min-h-screen selection:bg-festive-goldLight selection:text-indigo-900">
        {children}
      </body>
    </html>
  );
}

