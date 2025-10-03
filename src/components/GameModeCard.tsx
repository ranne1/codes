import { Card, CardContent } from "./ui/card";
import { LucideIcon } from "lucide-react";

interface GameModeCardProps {
  title: string;
  description: string;
  icon: LucideIcon;
  color: string;
  onClick?: () => void;
}

export function GameModeCard({ title, description, icon: Icon, color, onClick }: GameModeCardProps) {
  return (
    <Card 
      className="cursor-pointer transition-all duration-200 hover:shadow-lg hover:-translate-y-1 active:scale-95"
      onClick={onClick}
    >
      <CardContent className="p-6">
        <div className="flex items-center space-x-4">
          <div className={`p-3 rounded-lg ${color}`}>
            <Icon className="w-6 h-6 text-white" />
          </div>
          <div className="flex-1">
            <h3 className="font-medium mb-1">{title}</h3>
            <p className="text-muted-foreground text-sm">{description}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}