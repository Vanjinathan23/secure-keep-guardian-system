
import React, { useState } from 'react';
import { RefreshCw, Copy, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { Checkbox } from '@/components/ui/checkbox';
import { toast } from '@/hooks/use-toast';

const PasswordGenerator: React.FC = () => {
  const [password, setPassword] = useState('');
  const [length, setLength] = useState([16]);
  const [includeUppercase, setIncludeUppercase] = useState(true);
  const [includeLowercase, setIncludeLowercase] = useState(true);
  const [includeNumbers, setIncludeNumbers] = useState(true);
  const [includeSymbols, setIncludeSymbols] = useState(true);
  const [showSettings, setShowSettings] = useState(false);

  const generatePassword = () => {
    let charset = '';
    if (includeUppercase) charset += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    if (includeLowercase) charset += 'abcdefghijklmnopqrstuvwxyz';
    if (includeNumbers) charset += '0123456789';
    if (includeSymbols) charset += '!@#$%^&*()_+-=[]{}|;:,.<>?';

    if (charset === '') {
      toast({
        title: "Error",
        description: "Please select at least one character type.",
        variant: "destructive"
      });
      return;
    }

    let result = '';
    for (let i = 0; i < length[0]; i++) {
      result += charset.charAt(Math.floor(Math.random() * charset.length));
    }
    setPassword(result);
  };

  const copyPassword = async () => {
    if (!password) {
      toast({
        title: "No password",
        description: "Generate a password first.",
        variant: "destructive"
      });
      return;
    }

    try {
      await navigator.clipboard.writeText(password);
      toast({
        title: "Copied!",
        description: "Password copied to clipboard.",
      });
    } catch (err) {
      toast({
        title: "Copy failed",
        description: "Could not copy password to clipboard.",
        variant: "destructive"
      });
    }
  };

  React.useEffect(() => {
    generatePassword();
  }, [length, includeUppercase, includeLowercase, includeNumbers, includeSymbols]);

  const getPasswordStrength = () => {
    let score = 0;
    if (password.length >= 12) score += 25;
    if (password.length >= 16) score += 25;
    if (/[a-z]/.test(password)) score += 12;
    if (/[A-Z]/.test(password)) score += 12;
    if (/[0-9]/.test(password)) score += 13;
    if (/[^A-Za-z0-9]/.test(password)) score += 13;

    if (score < 30) return { label: 'Weak', color: 'bg-red-500', width: '25%' };
    if (score < 60) return { label: 'Fair', color: 'bg-yellow-500', width: '50%' };
    if (score < 90) return { label: 'Good', color: 'bg-blue-500', width: '75%' };
    return { label: 'Strong', color: 'bg-green-500', width: '100%' };
  };

  const strength = getPasswordStrength();

  return (
    <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-xl">
      <CardHeader>
        <CardTitle className="text-white flex items-center justify-between">
          <span>Password Generator</span>
          <Button
            onClick={() => setShowSettings(!showSettings)}
            variant="ghost"
            size="sm"
            className="text-slate-400 hover:text-white"
          >
            <Settings className="w-4 h-4" />
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Generated Password */}
        <div className="space-y-3">
          <div className="flex items-center justify-between bg-slate-700/30 rounded-lg p-4">
            <div className="flex-1 mr-3">
              <p className="text-white font-mono text-lg break-all">
                {password || 'Click generate to create a password'}
              </p>
            </div>
            <div className="flex gap-2">
              <Button
                onClick={generatePassword}
                variant="ghost"
                size="sm"
                className="text-slate-400 hover:text-white"
              >
                <RefreshCw className="w-4 h-4" />
              </Button>
              <Button
                onClick={copyPassword}
                variant="ghost"
                size="sm"
                className="text-slate-400 hover:text-white"
              >
                <Copy className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Password Strength */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-slate-400">Strength</span>
              <span className={`font-medium ${
                strength.label === 'Strong' ? 'text-green-400' :
                strength.label === 'Good' ? 'text-blue-400' :
                strength.label === 'Fair' ? 'text-yellow-400' : 'text-red-400'
              }`}>
                {strength.label}
              </span>
            </div>
            <div className="w-full bg-slate-700 rounded-full h-2">
              <div
                className={`h-2 rounded-full transition-all duration-300 ${strength.color}`}
                style={{ width: strength.width }}
              />
            </div>
          </div>
        </div>

        {/* Settings */}
        {showSettings && (
          <div className="space-y-4 pt-4 border-t border-slate-700">
            {/* Length Slider */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-slate-300">Length</label>
                <span className="text-white font-mono">{length[0]}</span>
              </div>
              <Slider
                value={length}
                onValueChange={setLength}
                max={50}
                min={4}
                step={1}
                className="w-full"
              />
            </div>

            {/* Character Type Options */}
            <div className="space-y-3">
              <label className="text-sm font-medium text-slate-300">Include</label>
              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="uppercase"
                    checked={includeUppercase}
                    onCheckedChange={setIncludeUppercase}
                  />
                  <label htmlFor="uppercase" className="text-slate-300 text-sm">
                    Uppercase letters (A-Z)
                  </label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="lowercase"
                    checked={includeLowercase}
                    onCheckedChange={setIncludeLowercase}
                  />
                  <label htmlFor="lowercase" className="text-slate-300 text-sm">
                    Lowercase letters (a-z)
                  </label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="numbers"
                    checked={includeNumbers}
                    onCheckedChange={setIncludeNumbers}
                  />
                  <label htmlFor="numbers" className="text-slate-300 text-sm">
                    Numbers (0-9)
                  </label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="symbols"
                    checked={includeSymbols}
                    onCheckedChange={setIncludeSymbols}
                  />
                  <label htmlFor="symbols" className="text-slate-300 text-sm">
                    Symbols (!@#$%^&*)
                  </label>
                </div>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default PasswordGenerator;
