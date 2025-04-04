import Link from "next/link";

export default function Home() {
  const sections = [
    {
      title: "Products",
      description: "Browse and manage product inventory",
      link: "/products",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <rect x="3" y="3" width="18" height="18" rx="2" />
          <path d="M3 9h18" />
          <path d="M9 21V9" />
        </svg>
      ),
    },
    {
      title: "Sellers",
      description: "View and manage seller profiles",
      link: "/sellers",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
          <circle cx="12" cy="7" r="4"></circle>
        </svg>
      ),
    },
    {
      title: "Buyers",
      description: "View and manage buyer accounts",
      link: "/buyers",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
          <circle cx="9" cy="7" r="4"></circle>
          <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
          <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
        </svg>
      ),
    },
    {
      title: "Orders",
      description: "Track and manage orders",
      link: "/orders",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <rect x="2" y="3" width="20" height="14" rx="2" />
          <line x1="8" y1="21" x2="16" y2="21" />
          <line x1="12" y1="17" x2="12" y2="21" />
        </svg>
      ),
    },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-gray-900">
      {/* Hero section with centered title */}
      <section className="mt-[-4vh] h-[85vh] flex flex-col items-center justify-center px-4">
        <h1 className="text-4xl md:text-5xl font-normal text-center mb-6 text-gray-900 dark:text-gray-100">
          Warehouse Management System
        </h1>
        <div className="w-16 h-1 bg-gray-900 dark:bg-gray-100 mb-8"></div>
        <p className="text-lg text-gray-600 dark:text-gray-300 max-w-md mx-auto mb-16 text-center font-light">
          A platform for inventory management
        </p>

        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {sections.map((section) => (
              <Link
                key={section.title}
                href={section.link}
                className="block h-full"
              >
                <div className="h-full flex flex-col p-6 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:border-gray-900 dark:hover:border-gray-300 transition-colors">
                  <div className="text-gray-900 dark:text-gray-100 mb-6">
                    {section.icon}
                  </div>
                  <h3 className="text-lg font-normal mb-2 text-gray-900 dark:text-gray-100">
                    {section.title}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 font-light">
                    {section.description}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <section className="py-12 px-4 border-t border-gray-200 dark:border-gray-700 text-center">
        <p className="text-sm text-gray-500 dark:text-gray-400 font-light">
          Group number: 16
        </p>
      </section>
      <div className="flex flex-wrap justify-center gap-4">
        {[
          { name: "Kyan", url: "https://www.linkedin.com/in/kyan-nassouti/" },
          { name: "Eren", url: "https://www.linkedin.com/in/eren-solak-b520011b3/" },
          { name: "Oguzhan", url: "https://www.linkedin.com/in/oguzhancakir2000/" },
          { name: "Boran", url: "https://www.linkedin.com/in/boran-dal/" },
          { name: "William", url: "https://www.linkedin.com/in/williu10/" },
          { name: "Jad", url: "https://www.linkedin.com/in/jadhaidar-/" },
          { name: "Michael", url: "https://www.linkedin.com/in/michael-abouzeid-774-774774774-695a82194/" },
        ].map((member) => (
          <a
            key={member.name}
            href={member.url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center space-x-1 text-sm text-blue-600 hover:underline"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              fill="currentColor"
              viewBox="0 0 24 24"
              className="text-blue-600"
            >
              <path d="M4.98 3.5C4.98 4.88 3.88 6 2.5 6S0 4.88 0 3.5 1.12 1 2.5 1 4.98 2.12 4.98 3.5zM.5 8h4V24h-4V8zm7.5 0h3.8v2.2h.1c.53-1 1.83-2.2 3.8-2.2 4.06 0 4.81 2.67 4.81 6.14V24h-4v-8.1c0-1.93-.03-4.41-2.69-4.41-2.7 0-3.11 2.1-3.11 4.27V24h-4V8z" />
            </svg>
            <span>{member.name}</span>
          </a>
        ))}
      </div>
    </div>
  );
}
