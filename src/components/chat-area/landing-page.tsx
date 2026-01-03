export const LandingPage = () => {
  // const topAgents = [
  //   "Cline",
  //   "Roo Code",
  //   "Kilo Code",
  //   "opencode",
  //   "Lleverage AI",
  //   "Terac | AI Interview Platform",
  //   "Friends & Fables",
  //   "Adstart",
  //   "Lexibird",
  // ];

  return (
    <div className="flex flex-col pt-8 px-6 md:px-20 pb-20 gap-12 max-w-[var(--gei.t-page-width)] mx-auto">
      <div className="w-full">
        <div className="w-full">
          <h2 className="text-2xl font-semibold mb-4">Top Agents</h2>
          <p className="text-muted-foreground mb-6">
            Most popular opted-in XMTP agents this week.
          </p>
          {/* Suggestions commented out for later use */}
          {/* <ol className="list-decimal list-inside space-y-2">
            {topAgents.map((agent, index) => (
              <li key={index} className="text-foreground">
                {agent}
              </li>
            ))}
          </ol> */}
        </div>
      </div>
    </div>
  );
};
