import { Card, CardContent } from "./ui/card";

interface ChordNameCardProps {
  chordName: string;
  isSelected: boolean;
  isMatched?: boolean;
  onClick: () => void;
}

export function ChordNameCard({ chordName, isSelected, isMatched = false, onClick }: ChordNameCardProps) {
  const getCardStyle = () => {
    if (isMatched) return 'ring-2 ring-green-500 bg-green-50';
    if (isSelected) return 'ring-2 ring-blue-500 bg-blue-50';
    return '';
  };

  return (
    <Card 
      className={`cursor-pointer transition-all duration-200 hover:shadow-md h-[140px] ${getCardStyle()}`}
      onClick={onClick}
    >
      <CardContent className="p-3 flex items-center justify-center h-full">
        <span className="text-lg font-medium text-center">{chordName}</span>
      </CardContent>
    </Card>
  );
}