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
          Group number: 
        </p>
      </section>
    </div>
  );
}
