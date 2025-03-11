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
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M21 7 H3 V3 H21 Z" />
          <path d="M21 11 H3 V7 H21 Z" />
          <path d="M21 15 H3 V11 H21 Z" />
          <path d="M21 19 H3 V15 H21 Z" />
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
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
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
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
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
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M9 17H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
          <path d="M19 17h-8V3h8a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2z"></path>
        </svg>
      ),
    },
  ];

  return (
    <div className="max-w-4xl mx-auto">
      <section className="py-12">
        <h1 className="text-3xl font-bold mb-6 text-center">
          Warehouse Management System
        </h1>
        <p className="text-lg text-center text-gray-600 dark:text-gray-400 mb-12">
          A marketplace platform for buyers and sellers to connect and transact
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {sections.map((section) => (
            <Link
              key={section.title}
              href={section.link}
              className="block p-6 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 hover:border-blue-500 dark:hover:border-blue-500 transition-colors"
            >
              <div className="flex items-center mb-4">
                <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg mr-4">
                  {section.icon}
                </div>
                <h2 className="text-xl font-semibold">{section.title}</h2>
              </div>
              <p className="text-gray-600 dark:text-gray-400">
                {section.description}
              </p>
            </Link>
          ))}
        </div>
      </section>

      <section className="py-12">
        <h2 className="text-2xl font-semibold mb-6">System Overview</h2>
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
          <p className="mb-4">
            The Warehouse Management System is a full-featured platform that
            enables:
          </p>
          <ul className="list-disc pl-5 space-y-2 mb-4">
            <li>Sellers to list and manage their products</li>
            <li>Buyers to browse products and place orders</li>
            <li>Tracking order status from placement to delivery</li>
            <li>Managing inventory levels and stock status</li>
          </ul>
          <p className="mb-6">
            Explore the different sections to see all available features and
            functionality.
          </p>

          <div className="flex justify-center">
            <Link
              href="/api-test"
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 mr-2"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2z"
                />
              </svg>
              Test API Connection
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
