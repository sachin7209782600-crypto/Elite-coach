import { Link } from "react-router-dom";
import {
  Home,
  Sparkles,
  TrendingUp,
  Award,
  Flame,
  Clock,
  Target,
  BarChart3,
} from "lucide-react";

export default function Stats() {
  const stats = {
    totalSessions: 24,
    totalMinutes: 480,
    currentStreak: 7,
    bestScore: 92,
    averageConfidence: 78,
  };

  const achievements = [
    {
      id: 1,
      title: "First Steps",
      description: "Completed your first session",
      icon: "🚀",
      unlocked: true,
    },
    {
      id: 2,
      title: "Week Warrior",
      description: "Maintain a 7-day streak",
      icon: "⚡",
      unlocked: true,
    },
    {
      id: 3,
      title: "Tech Master",
      description: "Score 90+ with Mei-Ling 5 times",
      icon: "💻",
      unlocked: false,
    },
    {
      id: 4,
      title: "Social Butterfly",
      description: "Score 90+ with Zara 5 times",
      icon: "🦋",
      unlocked: false,
    },
    {
      id: 5,
      title: "Speaking Star",
      description: "Score 90+ with Elena 5 times",
      icon: "⭐",
      unlocked: false,
    },
    {
      id: 6,
      title: "Confidence King",
      description: "Achieve 95+ average confidence",
      icon: "👑",
      unlocked: false,
    },
  ];

  const recentSessions = [
    {
      id: 1,
      persona: "Mei-Ling",
      date: "Today",
      duration: 15,
      score: 85,
    },
    {
      id: 2,
      persona: "Zara",
      date: "Yesterday",
      duration: 20,
      score: 88,
    },
    {
      id: 3,
      persona: "Elena",
      date: "2 days ago",
      duration: 25,
      score: 82,
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="sticky top-0 z-40 bg-background/80 backdrop-blur-md border-b border-border">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 hover:opacity-70 transition">
            <Sparkles className="w-5 h-5 text-primary" />
            <span className="font-bold">Aura</span>
          </Link>
          <div className="flex items-center gap-4">
            <Link
              to="/chat"
              className="text-sm hover:text-primary transition"
            >
              Practice
            </Link>
            <button className="px-6 py-2 rounded-lg bg-gradient-to-r from-primary to-secondary text-white font-semibold hover:shadow-lg hover:shadow-primary/20 transition">
              Settings
            </button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-2">Your Journey</h1>
          <p className="text-lg text-muted-foreground">
            Track your progress and celebrate your wins
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid md:grid-cols-5 gap-6 mb-12">
          <div className="bg-card border border-border rounded-xl p-6 space-y-2 hover:border-primary/50 transition">
            <div className="flex items-center justify-between">
              <p className="text-muted-foreground text-sm">Total Sessions</p>
              <Clock className="w-5 h-5 text-primary" />
            </div>
            <p className="text-3xl font-bold">{stats.totalSessions}</p>
            <p className="text-xs text-muted-foreground">Great consistency!</p>
          </div>

          <div className="bg-card border border-border rounded-xl p-6 space-y-2 hover:border-primary/50 transition">
            <div className="flex items-center justify-between">
              <p className="text-muted-foreground text-sm">Total Minutes</p>
              <BarChart3 className="w-5 h-5 text-secondary" />
            </div>
            <p className="text-3xl font-bold">
              {(stats.totalMinutes / 60).toFixed(1)}h
            </p>
            <p className="text-xs text-muted-foreground">Keep building!</p>
          </div>

          <div className="bg-card border border-border rounded-xl p-6 space-y-2 hover:border-primary/50 transition">
            <div className="flex items-center justify-between">
              <p className="text-muted-foreground text-sm">Current Streak</p>
              <Flame className="w-5 h-5 text-orange-500" />
            </div>
            <p className="text-3xl font-bold">{stats.currentStreak} days</p>
            <p className="text-xs text-muted-foreground">On fire! 🔥</p>
          </div>

          <div className="bg-card border border-border rounded-xl p-6 space-y-2 hover:border-primary/50 transition">
            <div className="flex items-center justify-between">
              <p className="text-muted-foreground text-sm">Best Score</p>
              <Target className="w-5 h-5 text-green-500" />
            </div>
            <p className="text-3xl font-bold">{stats.bestScore}%</p>
            <p className="text-xs text-muted-foreground">Excellent work!</p>
          </div>

          <div className="bg-card border border-border rounded-xl p-6 space-y-2 hover:border-primary/50 transition">
            <div className="flex items-center justify-between">
              <p className="text-muted-foreground text-sm">Avg Confidence</p>
              <TrendingUp className="w-5 h-5 text-blue-500" />
            </div>
            <p className="text-3xl font-bold">{stats.averageConfidence}%</p>
            <p className="text-xs text-muted-foreground">Growing steadily</p>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-12">
          {/* Achievements */}
          <div className="space-y-6">
            <h2 className="text-2xl font-bold flex items-center gap-2">
              <Award className="w-6 h-6 text-primary" />
              Achievements
            </h2>
            <div className="grid grid-cols-2 gap-4">
              {achievements.map((achievement) => (
                <div
                  key={achievement.id}
                  className={`rounded-xl p-4 text-center transition ${
                    achievement.unlocked
                      ? "bg-gradient-to-br from-primary/20 to-secondary/20 border border-primary/30"
                      : "bg-card border border-border opacity-50"
                  }`}
                >
                  <div className="text-3xl mb-2">{achievement.icon}</div>
                  <p className="font-semibold text-sm">{achievement.title}</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {achievement.description}
                  </p>
                  {!achievement.unlocked && (
                    <p className="text-xs mt-2 text-muted-foreground">
                      Locked
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Recent Sessions */}
          <div className="space-y-6">
            <h2 className="text-2xl font-bold flex items-center gap-2">
              <BarChart3 className="w-6 h-6 text-secondary" />
              Recent Sessions
            </h2>
            <div className="space-y-3">
              {recentSessions.map((session) => (
                <div
                  key={session.id}
                  className="bg-card border border-border rounded-xl p-4 flex items-center justify-between hover:border-primary/50 transition"
                >
                  <div className="flex-1">
                    <p className="font-semibold">{session.persona}</p>
                    <p className="text-xs text-muted-foreground">{session.date}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-primary">{session.score}%</p>
                    <p className="text-xs text-muted-foreground">
                      {session.duration} min
                    </p>
                  </div>
                </div>
              ))}
            </div>
            <Link
              to="/chat"
              className="inline-block px-6 py-2 rounded-lg bg-gradient-to-r from-primary to-secondary text-white font-semibold hover:shadow-lg hover:shadow-primary/30 transition w-full text-center"
            >
              Start New Session
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
