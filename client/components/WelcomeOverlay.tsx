import { X, Mic, SkipForward, Volume2 } from "lucide-react";

interface WelcomeOverlayProps {
  isOpen: boolean;
  onClose: () => void;
}

export function WelcomeOverlay({ isOpen, onClose }: WelcomeOverlayProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-card border border-border rounded-2xl p-8 max-w-md w-full space-y-6 animate-slide-up">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold">Welcome to Aura</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-muted rounded-lg transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-4">
          <p className="text-muted-foreground">
            You're chatting with an AI persona. Here's how to use Aura:
          </p>

          <div className="space-y-3">
            <div className="flex gap-3">
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
                <Mic className="w-4 h-4 text-primary" />
              </div>
              <div>
                <p className="font-semibold text-sm">Voice & Text</p>
                <p className="text-xs text-muted-foreground">
                  Click the mic to speak or type your response
                </p>
              </div>
            </div>

            <div className="flex gap-3">
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
                <SkipForward className="w-4 h-4 text-primary" />
              </div>
              <div>
                <p className="font-semibold text-sm">Change Personas</p>
                <p className="text-xs text-muted-foreground">
                  Click "Next" to match with a different AI coach
                </p>
              </div>
            </div>

            <div className="flex gap-3">
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
                <Volume2 className="w-4 h-4 text-primary" />
              </div>
              <div>
                <p className="font-semibold text-sm">Listen & Watch</p>
                <p className="text-xs text-muted-foreground">
                  The AI responds with speech and 3D animations
                </p>
              </div>
            </div>
          </div>

          <div className="bg-primary/10 border border-primary/20 rounded-lg p-4 text-sm">
            <p className="text-xs font-semibold text-primary mb-2">Pro Tips:</p>
            <ul className="text-xs text-muted-foreground space-y-1">
              <li>• Your camera shows in the corner (like OmeTV)</li>
              <li>• Confidence score improves with practice</li>
              <li>• Different personas teach different skills</li>
              <li>• Toggle sound on/off anytime</li>
            </ul>
          </div>
        </div>

        <button
          onClick={onClose}
          className="w-full py-3 rounded-lg bg-gradient-to-r from-primary to-secondary text-white font-semibold hover:shadow-lg hover:shadow-primary/30 transition"
        >
          Let's Get Started
        </button>
      </div>
    </div>
  );
}
