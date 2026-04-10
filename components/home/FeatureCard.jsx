/* ── single feature card ── */
const FeatureCard = ({ feature }) => (
  <div style={{ flexShrink: 0, width: 280 }}>
    <div className="group relative h-full bg-white rounded-2xl p-6 border border-gray-100/80 hover:border-transparent hover:shadow-xl hover:shadow-black/[0.05] transition-all duration-500 overflow-hidden">
      {/* background shadow icon - left side */}
      <div className="absolute -left-10 -bottom-4 pointer-events-none transform rotate-12 transition-transform duration-500 group-hover:scale-110 group-hover:rotate-6 z-0">
        <feature.icon className="w-36 h-36 text-gray-100/80" />
      </div>

      {/* hover top glow */}
      <div
        className={`absolute -top-12 -right-12 w-32 h-32 rounded-full bg-gradient-to-bl ${feature.gradient} opacity-0 group-hover:opacity-10 blur-2xl transition-opacity duration-500`}
      />

      <div className="relative z-10">
        {/* icon */}
        <div
          className={`w-12 h-12 rounded-xl bg-gradient-to-bl ${feature.gradient} flex items-center justify-center mb-4 group-hover:scale-110 group-hover:rotate-3 transition-all duration-300 shadow-lg`}
        >
          <feature.icon size={20} className="text-white" />
        </div>

        {/* text */}
        <h3 className="text-base font-bold text-gray-900 mb-2">
          {feature.title}
        </h3>
        <p className="text-gray-500 text-sm leading-relaxed">
          {feature.description}
        </p>
      </div>
    </div>
  </div>
);

export default FeatureCard;