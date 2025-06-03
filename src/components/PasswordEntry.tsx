
import React, { useState } from 'react';
import { Eye, EyeOff, Copy, Trash2, Globe, User, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { toast } from '@/hooks/use-toast';

interface StoredPassword {
  id: string;
  title: string;
  username: string;
  password: string;
  website: string;
  category: string;
  createdAt: string;
}

interface PasswordEntryProps {
  password: StoredPassword;
  onDelete: (id: string) => void;
}

const PasswordEntry: React.FC<PasswordEntryProps> = ({ password, onDelete }) => {
  const [showPassword, setShowPassword] = useState(false);

  const copyToClipboard = async (text: string, type: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast({
        title: "Copied!",
        description: `${type} copied to clipboard.`,
      });
    } catch (err) {
      toast({
        title: "Copy failed",
        description: "Could not copy to clipboard.",
        variant: "destructive"
      });
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getCategoryColor = (category: string) => {
    const colors = {
      'Social': 'bg-blue-500/20 text-blue-300 border-blue-500/30',
      'Work': 'bg-green-500/20 text-green-300 border-green-500/30',
      'Banking': 'bg-red-500/20 text-red-300 border-red-500/30',
      'Shopping': 'bg-purple-500/20 text-purple-300 border-purple-500/30',
      'Entertainment': 'bg-pink-500/20 text-pink-300 border-pink-500/30',
      'Other': 'bg-gray-500/20 text-gray-300 border-gray-500/30'
    };
    return colors[category as keyof typeof colors] || colors.Other;
  };

  return (
    <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-xl hover:bg-slate-800/70 transition-all duration-200">
      <CardContent className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <h3 className="text-lg font-semibold text-white">{password.title}</h3>
              <Badge className={`text-xs ${getCategoryColor(password.category)}`}>
                {password.category}
              </Badge>
            </div>
            <div className="flex items-center gap-2 text-slate-400 text-sm mb-1">
              <Globe className="w-4 h-4" />
              <span>{password.website}</span>
            </div>
            <div className="flex items-center gap-2 text-slate-400 text-sm">
              <Calendar className="w-4 h-4" />
              <span>Added {formatDate(password.createdAt)}</span>
            </div>
          </div>
          <Button
            onClick={() => onDelete(password.id)}
            variant="ghost"
            size="sm"
            className="text-slate-400 hover:text-red-400 hover:bg-red-500/10"
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>

        <div className="space-y-3">
          {/* Username */}
          <div className="flex items-center justify-between bg-slate-700/30 rounded-lg p-3">
            <div className="flex items-center gap-3 flex-1">
              <User className="w-4 h-4 text-slate-400" />
              <div>
                <p className="text-xs text-slate-400 mb-1">Username</p>
                <p className="text-white font-mono">{password.username}</p>
              </div>
            </div>
            <Button
              onClick={() => copyToClipboard(password.username, 'Username')}
              variant="ghost"
              size="sm"
              className="text-slate-400 hover:text-white"
            >
              <Copy className="w-4 h-4" />
            </Button>
          </div>

          {/* Password */}
          <div className="flex items-center justify-between bg-slate-700/30 rounded-lg p-3">
            <div className="flex items-center gap-3 flex-1">
              <Eye className="w-4 h-4 text-slate-400" />
              <div>
                <p className="text-xs text-slate-400 mb-1">Password</p>
                <p className="text-white font-mono">
                  {showPassword ? password.password : '••••••••••••'}
                </p>
              </div>
            </div>
            <div className="flex gap-1">
              <Button
                onClick={() => setShowPassword(!showPassword)}
                variant="ghost"
                size="sm"
                className="text-slate-400 hover:text-white"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </Button>
              <Button
                onClick={() => copyToClipboard(password.password, 'Password')}
                variant="ghost"
                size="sm"
                className="text-slate-400 hover:text-white"
              >
                <Copy className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default PasswordEntry;
