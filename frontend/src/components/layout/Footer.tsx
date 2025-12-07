// src/components/layout/Footer.tsx
export default function Footer() {
  return (
    <footer className="bg-emerald-50 border-t border-emerald-100 mt-16">
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="text-center text-gray-700">
          <p className="text-lg font-semibold text-emerald-700 mb-2">
            EcoFinds
          </p>
          <p className="text-sm">
            Sustainable marketplace for pre-loved eco products
          </p>
          <p className="text-xs text-gray-500 mt-4">
            © 2025 EcoFinds. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}