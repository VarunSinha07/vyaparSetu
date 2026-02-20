import {
  ShieldCheck,
  Lock,
  Server,
  FileKey,
  CheckCircle2,
  LucideIcon,
} from "lucide-react";

export function Security() {
  const features = [
    {
      title: "Bank-Grade Encryption",
      description:
        "All data securely encrypted at rest and in transit using AES-256 protocols.",
      icon: Lock,
    },
    {
      title: "Role-Based Access",
      description:
        "Granular permission controls ensure employees only see what they need to.",
      icon: FileKey,
    },
    {
      title: "Isolated Data Environments",
      description:
        "Your company's data lives in a logically isolated silo, preventing any cross-tenant leaks.",
      icon: Server,
    },
  ];

  return (
    <section className="py-24 bg-white relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_top_left,_var(--tw-gradient-stops))] from-emerald-50/50 via-gray-50 to-white -z-10" />

      <div className="container mx-auto px-6 md:px-12 lg:px-24">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Visual Side (Left) */}
          <div className="relative h-[500px] w-full flex items-center justify-center order-2 lg:order-1">
            <div className="absolute inset-0 bg-gradient-to-tr from-emerald-100/30 to-blue-50/30 rounded-full blur-[100px] animate-pulse" />

            {/* Central Shield Graphic */}
            <div className="relative z-10 w-64 h-64 md:w-80 md:h-80 bg-gradient-to-b from-white to-emerald-50 rounded-[3rem] border border-white shadow-[0_20px_50px_-12px_rgba(16,185,129,0.2)] flex items-center justify-center relative overflow-hidden">
              <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20" />
              <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-emerald-100/50" />

              <ShieldCheck className="w-32 h-32 text-emerald-600 drop-shadow-2xl relative z-10 animate-bounce-slow" />

              {/* Floating Elements around shield */}
              <div className="absolute top-8 right-8 animate-ping opacity-20">
                <div className="w-2 h-2 bg-emerald-500 rounded-full" />
              </div>
            </div>

            {/* Floating Orbiting Cards */}
            <SecurityBadge
              icon={Lock}
              text="256-bit SSL"
              className="absolute top-[10%] left-[15%] md:left-[5%] animate-float-slow"
              delay="0s"
            />
            <SecurityBadge
              icon={Server}
              text="99.9% Uptime"
              className="absolute bottom-[20%] right-[10%] md:right-[0%] animate-float-slower"
              delay="1s"
            />
            <SecurityBadge
              icon={CheckCircle2}
              text="SOC2 Compliant"
              className="absolute top-[60%] left-[0%] md:-left-4 animate-float-fast"
              delay="2s"
            />
          </div>

          {/* Content Side (Right) */}
          <div className="order-1 lg:order-2">
            

            <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-6 leading-tight">
              Your data is as safe as{" "}
              <span className="text-emerald-600">money in a vault.</span>
            </h2>

            <p className="text-xl text-gray-500 mb-12 leading-relaxed">
              We don&apos;t take shortcuts with security. VyaparFlow is built on
              a foundation of banking-grade encryption and strict compliance
              protocols.
            </p>

            <div className="space-y-8">
              {features.map((feature, i) => (
                <div key={i} className="flex gap-4 group">
                  <div className="mt-1">
                    <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center group-hover:scale-110 group-hover:bg-emerald-600 group-hover:text-white transition-all duration-300">
                      <feature.icon className="w-6 h-6" />
                    </div>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-emerald-700 transition-colors">
                      {feature.title}
                    </h3>
                    <p className="text-gray-600 leading-relaxed">
                      {feature.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function SecurityBadge({
  icon: Icon,
  text,
  className,
  delay,
}: {
  icon: LucideIcon;
  text: string;
  className?: string;
  delay?: string;
}) {
  return (
    <div
      className={`flex items-center gap-2 bg-white px-4 py-3 rounded-xl shadow-lg border border-gray-100 z-20 ${className}`}
      style={{ animationDelay: delay }}
    >
      <div className="p-1.5 bg-emerald-100 rounded-full">
        <Icon className="w-4 h-4 text-emerald-600" />
      </div>
      <span className="font-bold text-gray-800 text-sm">{text}</span>
    </div>
  );
}
