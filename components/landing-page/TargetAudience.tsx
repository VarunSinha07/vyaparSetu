"use client";

import {
  Factory,
  Building2,
  Stethoscope,
  GraduationCap,
  HeartHandshake,
  Cpu,
  Truck,
  CheckCircle2,
  LucideIcon,
} from "lucide-react";
import { useState } from "react";

interface Industry {
  id: string;
  label: string;
  icon: LucideIcon;
  title: string;
  description: string;
  benefits: string[];
}

export function TargetAudience() {
  const [activeTab, setActiveTab] = useState<string>("manufacturing");

  const industries: Industry[] = [
    {
      id: "manufacturing",
      label: "Manufacturing",
      icon: Factory,
      title: "Streamline Production Procurement",
      description:
        "Manage raw material intake, track inventory levels in real-time, and automate purchase orders for recurring supplies.",
      benefits: [
        "JIT Inventory Management",
        "Automated PO Generation",
        "Quality Control Workflows",
      ],
    },
    {
      id: "construction",
      label: "Construction",
      icon: Building2,
      title: "Built for Complex Sites",
      description:
        "Handle multi-site procurement, track material deliveries to specific project locations, and manage contractor payments.",
      benefits: [
        "Multi-Site Delivery Tracking",
        "Project-Based Budgeting",
        "Contractor Payment Schedules",
      ],
    },
    {
      id: "healthcare",
      label: "Healthcare",
      icon: Stethoscope,
      title: "Critical Supply Chain Management",
      description:
        "Ensure critical medical supplies are always in stock with expiry tracking and automated reordering for consumables.",
      benefits: [
        "Expiry Date Tracking",
        "Batch Number Management",
        "Regulatory Compliance Logs",
      ],
    },
    {
      id: "education",
      label: "Education",
      icon: GraduationCap,
      title: "Campus-Wide Resource Planning",
      description:
        "Centralize procurement for multiple departments, labs, and facilities while maintaining strict budget controls.",
      benefits: [
        "Departmental Budget Caps",
        "Bulk Textbook/Equipment Orders",
        "Grant Fund Tracking",
      ],
    },
    {
      id: "ngo",
      label: "NGOs",
      icon: HeartHandshake,
      title: "Transparent Fund Utilization",
      description:
        "Maintain absolute transparency in fund usage with detailed audit trails and donor-ready expense reports.",
      benefits: [
        "Donor-Ready Reporting",
        "Grant Compliance Checks",
        "Audit-Proof Documentation",
      ],
    },
    {
      id: "it",
      label: "IT Services",
      icon: Cpu,
      title: "Tech Asset Lifecycle Management",
      description:
        "Track software licenses, hardware assignments, and renewal cycles for your distributed workforce.",
      benefits: [
        "License Renewal Alerts",
        "Asset Assignment Tracking",
        "SaaS Subscription Management",
      ],
    },
    {
      id: "logistics",
      label: "Logistics",
      icon: Truck,
      title: "Fleet & Fuel Management",
      description:
        "Manage fuel expenses, vehicle maintenance parts, and operational costs across your entire fleet.",
      benefits: [
        "Fuel Expense Tracking",
        "Maintenance Parts Inventory",
        "Vendor Contract Management",
      ],
    },
  ];

  const activeIndustry =
    industries.find((i) => i.id === activeTab) || industries[0];

  return (
    <section className="py-24 bg-gray-50/50 border-t border-emerald-100 relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-[10%] left-[5%] w-96 h-96 bg-emerald-100/40 rounded-full blur-[100px]" />
        <div className="absolute bottom-[10%] right-[5%] w-96 h-96 bg-blue-100/40 rounded-full blur-[100px]" />
      </div>

      <div className="container mx-auto px-6 md:px-12 lg:px-24 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-6">
            Trusted by Modern Indian Businesses
          </h2>
          <p className="text-xl text-gray-600">
            From factories to tech parks, VyaparFlow adapts to your unique
            operational needs.
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
          {/* Left Column: Navigation Tabs */}
          <div className="w-full lg:w-1/3 flex flex-row lg:flex-col gap-2 overflow-x-auto pb-4 lg:pb-0 scrollbar-hide">
            {industries.map((industry) => (
              <button
                key={industry.id}
                onClick={() => setActiveTab(industry.id)}
                className={`flex items-center gap-4 p-4 rounded-xl text-left transition-all duration-300 min-w-[200px] lg:min-w-0 border ${
                  activeTab === industry.id
                    ? "bg-white border-emerald-200 shadow-md translate-x-2"
                    : "bg-transparent border-transparent hover:bg-white/50 hover:border-gray-200 text-gray-600 hover:text-gray-900"
                }`}
              >
                <div
                  className={`p-2.5 rounded-lg transition-colors ${
                    activeTab === industry.id
                      ? "bg-emerald-100 text-emerald-700"
                      : "bg-gray-100 text-gray-500 group-hover:bg-gray-200"
                  }`}
                >
                  <industry.icon className="w-5 h-5" />
                </div>
                <span
                  className={`font-semibold ${
                    activeTab === industry.id
                      ? "text-emerald-900"
                      : "text-gray-600"
                  }`}
                >
                  {industry.label}
                </span>
                {activeTab === industry.id && (
                  <div className="hidden lg:block ml-auto w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                )}
              </button>
            ))}
          </div>

          {/* Right Column: Content Card */}
          <div className="w-full lg:w-2/3">
            <div className="relative h-full bg-white rounded-3xl border border-emerald-100 shadow-xl overflow-hidden p-8 md:p-12 transition-all duration-500">
              {/* Decorative Gradient inside card */}
              <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-emerald-50 to-transparent rounded-bl-[150px] -mr-10 -mt-10" />

              <div
                key={activeIndustry.id}
                className="animate-in fade-in slide-in-from-right-4 duration-500 fill-mode-forwards"
              >
                <div className="flex items-start justify-between mb-8 relative z-10">
                  <div className="p-4 bg-emerald-100 rounded-2xl inline-block">
                    <activeIndustry.icon className="w-10 h-10 text-emerald-700" />
                  </div>
                  <div className="text-9xl font-bold text-gray-50 opacity-20 absolute -top-8 -right-4 pointer-events-none select-none">
                    {activeIndustry.id.slice(0, 2).toUpperCase()}
                  </div>
                </div>

                <h3 className="text-3xl font-bold text-gray-900 mb-4 relative z-10">
                  {activeIndustry.title}
                </h3>

                <p className="text-xl text-gray-600 mb-10 leading-relaxed relative z-10">
                  {activeIndustry.description}
                </p>

                <div className="grid md:grid-cols-2 gap-4 relative z-10">
                  {activeIndustry.benefits.map((benefit, i) => (
                    <div
                      key={i}
                      className="flex items-center gap-3 p-3 rounded-lg bg-gray-50 border border-gray-100 group hover:border-emerald-200 transition-colors"
                    >
                      <CheckCircle2 className="w-5 h-5 text-emerald-500 flex-shrink-0" />
                      <span className="font-medium text-gray-700 group-hover:text-emerald-800 transition-colors">
                        {benefit}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
