import { Link } from "react-router-dom";
import { ArrowRight, Sparkles, Zap, Users, Trophy, Brain } from "lucide-react";

export default function Index() {
  const personas = [
    {
      name: "Mei-Ling",
      role: "Tech Expert",
      style: "Sharp & Professional",
      specialty: "Technical interviews & Logic puzzles",
      image: "bg-gradient-to-br from-blue-400 to-blue-600",
    },
    {
      name: "Zara",
      role: "Social Coach",
      style: "Edgy & Trendy",
      specialty: "Social confidence & Vibe checks",
      image: "bg-gradient-to-br from-pink-400 to-purple-600",
    },
    {
      name: "Elena",
      role: "Speaking Coach",
      style: "Elegant & Calm",
      specialty: "Public speaking & Anxiety reduction",
      image: "bg-gradient-to-br from-emerald-400 to-teal-600",
    },
    {
      name: "Sia",
      role: "Conversation Partner",
      style: "Bubbly & Warm",
      specialty: "Language learning & Casual banter",
      image: "bg-gradient-to-br from-amber-400 to-orange-600",
    },
  ];

  const features = [
    {
      icon: Brain,
      title: "Adaptive Intelligence",
      description: "AI adjusts difficulty and tone based on your confidence level",
    },
    {
      icon: Sparkles,
      title: "Real-time Feedback",
      description: "Get instant confidence scores and personalized improvement tips",
    },
    {
      icon: Zap,
      title: "Lightning Fast",
      description: "Sub-second response times for natural conversation flow",
    },
    {
      icon: Users,
      title: "Multiple Personalities",
      description: "Match with different AI personas for varied learning styles",
    },
    {
      icon: Trophy,
      title: "Gamified Learning",
      description: "Earn badges, streaks, and unlock premium features",
    },
    {
      icon: Sparkles,
      title: "Safe Space",
      description: "100% toxicity-free environment with AI content filtering",
    },
  ];

  return (
    <div className="min-h-screen bg-background overflow-hidden">
      {/* Navigation */}
      <nav className="sticky top-0 z-40 bg-background/80 backdrop-blur-md border-b border-border">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg gradient-primary flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold text-lg">Aura</span>
          </div>
          <div className="hidden md:flex items-center gap-8">
            <a href="#features" className="text-sm hover:text-primary transition">
              Features
            </a>
            <a href="#personas" className="text-sm hover:text-primary transition">
              Personas
            </a>
            <Link to="/stats" className="text-sm hover:text-primary transition">
              My Progress
            </Link>
          </div>
          <Link
            to="/chat"
            className="px-6 py-2 rounded-lg bg-gradient-to-r from-primary to-secondary text-white font-semibold hover:shadow-lg hover:shadow-primary/20 transition"
          >
            Start Now
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative px-6 py-20 md:py-32 max-w-7xl mx-auto">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-0 right-0 w-96 h-96 bg-primary/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-secondary/10 rounded-full blur-3xl"></div>
        </div>

        <div className="relative z-10 grid md:grid-cols-2 gap-12 items-center">
          <div className="space-y-6 animate-slide-up">
            <h1 className="text-5xl md:text-6xl font-bold leading-tight">
              Your AI Social
              <br />
              <span className="gradient-text">Confidence Gym</span>
            </h1>
            <p className="text-lg text-muted-foreground max-w-lg">
              Interview prep, social skills, and conversational mastery with
              hyper-realistic AI personas. Practice with Mei-Ling, Zara, Elena,
              and more—anytime, anywhere.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                to="/chat"
                className="px-8 py-3 rounded-lg bg-gradient-to-r from-primary to-secondary text-white font-semibold hover:shadow-lg hover:shadow-primary/30 transition flex items-center justify-center gap-2"
              >
                Start Free Practice <ArrowRight className="w-4 h-4" />
              </Link>
              <button className="px-8 py-3 rounded-lg border border-primary/30 text-primary font-semibold hover:bg-primary/5 transition">
                Watch Demo
              </button>
            </div>
            <div className="flex gap-8 pt-4">
              <div>
                <p className="font-bold text-2xl">50K+</p>
                <p className="text-sm text-muted-foreground">Users trained</p>
              </div>
              <div>
                <p className="font-bold text-2xl">4.9★</p>
                <p className="text-sm text-muted-foreground">User rating</p>
              </div>
              <div>
                <p className="font-bold text-2xl">24/7</p>
                <p className="text-sm text-muted-foreground">Always available</p>
              </div>
            </div>
          </div>

          {/* Hero Visual */}
          <div className="relative h-96 md:h-full min-h-96">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-secondary/20 to-accent/20 rounded-2xl blur-xl"></div>
            <div className="absolute inset-0 bg-gradient-to-br from-primary via-transparent to-secondary rounded-2xl opacity-30"></div>
            <div className="relative h-full flex items-center justify-center">
              <div className="w-64 h-64 rounded-2xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white shadow-2xl">
                <div className="text-center">
                  <Sparkles className="w-16 h-16 mx-auto mb-4" />
                  <p className="font-bold text-lg">Aura</p>
                  <p className="text-sm opacity-80">Your AI Coach</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Personas Section */}
      <section id="personas" className="px-6 py-20 max-w-7xl mx-auto">
        <div className="text-center mb-16 space-y-4">
          <h2 className="text-4xl md:text-5xl font-bold">Meet Your Coaches</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Each AI persona brings a unique teaching style. Swap between them to
            diversify your learning experience.
          </p>
        </div>

        <div className="grid md:grid-cols-4 gap-6">
          {personas.map((persona, i) => (
            <div
              key={i}
              className="group relative animate-slide-up"
              style={{ animationDelay: `${i * 100}ms` }}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-2xl blur-xl group-hover:blur-2xl transition duration-300"></div>
              <div className="relative bg-card border border-border rounded-2xl p-6 h-full hover:border-primary/50 transition">
                <div className={`w-20 h-20 rounded-xl ${persona.image} mb-4`}></div>
                <h3 className="text-2xl font-bold">{persona.name}</h3>
                <p className="text-primary font-semibold text-sm mb-2">
                  {persona.role}
                </p>
                <p className="text-sm text-muted-foreground mb-4">
                  {persona.style}
                </p>
                <p className="text-sm font-medium">{persona.specialty}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="px-6 py-20 max-w-7xl mx-auto">
        <div className="text-center mb-16 space-y-4">
          <h2 className="text-4xl md:text-5xl font-bold">Powerful Features</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Everything you need to master interviews, social skills, and public
            speaking.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {features.map((feature, i) => {
            const Icon = feature.icon;
            return (
              <div
                key={i}
                className="group relative animate-slide-up"
                style={{ animationDelay: `${i * 100}ms` }}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-secondary/10 rounded-xl blur-lg group-hover:blur-xl transition duration-300"></div>
                <div className="relative bg-card border border-border rounded-xl p-6 h-full hover:border-primary/50 transition">
                  <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-primary to-secondary flex items-center justify-center mb-4">
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="font-bold text-lg mb-2">{feature.title}</h3>
                  <p className="text-muted-foreground text-sm">
                    {feature.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* CTA Section */}
      <section className="px-6 py-20 max-w-7xl mx-auto">
        <div className="relative rounded-2xl overflow-hidden">
          <div className="absolute inset-0 smooth-gradient opacity-20"></div>
          <div className="relative bg-card border border-border rounded-2xl p-12 md:p-16 text-center">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Ready to Boost Your Confidence?
            </h2>
            <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
              Start practicing now for free. No credit card required. Join
              thousands learning and growing every day.
            </p>
            <Link
              to="/chat"
              className="inline-block px-10 py-4 rounded-lg bg-gradient-to-r from-primary to-secondary text-white font-bold text-lg hover:shadow-lg hover:shadow-primary/30 transition"
            >
              Launch Your First Session
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border px-6 py-12 max-w-7xl mx-auto">
        <div className="grid md:grid-cols-4 gap-8 mb-12">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg gradient-primary flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <span className="font-bold">Aura</span>
            </div>
            <p className="text-sm text-muted-foreground">
              Your AI Social Confidence Gym
            </p>
          </div>
          <div>
            <p className="font-semibold mb-4">Product</p>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <a href="#" className="hover:text-primary transition">
                  Features
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-primary transition">
                  Pricing
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-primary transition">
                  Enterprise
                </a>
              </li>
            </ul>
          </div>
          <div>
            <p className="font-semibold mb-4">Company</p>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <a href="#" className="hover:text-primary transition">
                  About
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-primary transition">
                  Blog
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-primary transition">
                  Careers
                </a>
              </li>
            </ul>
          </div>
          <div>
            <p className="font-semibold mb-4">Legal</p>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <a href="#" className="hover:text-primary transition">
                  Privacy
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-primary transition">
                  Terms
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-primary transition">
                  Contact
                </a>
              </li>
            </ul>
          </div>
        </div>
        <div className="border-t border-border pt-8 text-center text-sm text-muted-foreground">
          <p>&copy; 2024 Aura. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
