"use client";

type ProfileTimeCardsProps = {
  initialLastLogin?: string | null;
  initialUpdatedAt?: string | null;
  initialWarning?: string;
};

const companyMotto = 'Penetrate the Sky, Accelerate Your Business';

const mottoCards = [
  {
    title: 'Sky Reach',
    description: 'Operasi kargo udara yang siap membawa bisnis bergerak lebih jauh.',
    accent: 'from-blue-600 to-cyan-500',
    icon: (
      <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
        <path d="M2.5 16.5 21 3l-5.5 18-4-7-7-1.5Z" strokeLinecap="round" strokeLinejoin="round" />
        <path d="m11.5 14 4-4" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    title: 'Bolt Speed',
    description: 'Ritme kerja cepat dengan standar layanan yang tetap presisi.',
    accent: 'from-amber-400 to-orange-500',
    icon: (
      <svg className="h-6 w-6" viewBox="0 0 24 24" fill="currentColor">
        <path d="M13.2 2.5 4 13.2h6.4l-.9 8.3L20 9.4h-6.2l-.6-6.9Z" />
      </svg>
    ),
  },
  {
    title: 'Cargo Lift',
    description: 'Dukungan pengiriman modern untuk pertumbuhan yang lebih gesit.',
    accent: 'from-indigo-600 to-blue-500',
    icon: (
      <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
        <path d="M4 8.5 12 4l8 4.5v7L12 20l-8-4.5v-7Z" strokeLinejoin="round" />
        <path d="m4.5 9 7.5 4.2L19.5 9M12 13.2V20" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
];

function MottoCard({ card, compact = false }: { card: (typeof mottoCards)[number]; compact?: boolean }) {
  return (
    <div
      className={`relative overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm ${
        compact ? 'p-5' : 'p-6'
      }`}
    >
      <div className={`absolute inset-x-0 top-0 h-1 bg-gradient-to-r ${card.accent}`} />
      <div className="flex items-start gap-4">
        <div className={`flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br ${card.accent} text-white shadow-lg shadow-blue-100`}>
          {card.icon}
        </div>
        <div>
          <p className="text-sm font-bold uppercase tracking-wide text-blue-700">{card.title}</p>
          <p className="mt-2 text-lg font-bold leading-snug text-[#0d1a4a]">{companyMotto}</p>
          <p className="mt-2 text-sm leading-6 text-gray-500">{card.description}</p>
        </div>
      </div>
    </div>
  );
}

export function ProfileLoginDurationCard(props: ProfileTimeCardsProps) {
  void props;
  return <MottoCard card={mottoCards[0]} compact />;
}

export default function ProfileTimeCards(props: ProfileTimeCardsProps) {
  void props;

  return (
    <>
      <MottoCard card={mottoCards[1]} />
      <MottoCard card={mottoCards[2]} />
    </>
  );
}
