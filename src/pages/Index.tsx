
import React, { useState, useEffect } from 'react';
import { Lock, Plus, Search, Eye, EyeOff, Copy, Shield, Key, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from '@/hooks/use-toast';
import PasswordEntry from '@/components/PasswordEntry';
import PasswordGenerator from '@/components/PasswordGenerator';
import AddPasswordModal from '@/components/AddPasswordModal';

interface StoredPassword {
  id: string;
  title: string;
  username: string;
  password: string;
  website: string;
  category: string;
  createdAt: string;
}

const Index = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [masterPassword, setMasterPassword] = useState('');
  const [showMasterPassword, setShowMasterPassword] = useState(false);
  const [passwords, setPasswords] = useState<StoredPassword[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showGenerator, setShowGenerator] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem('passwordManager_authenticated');
    if (stored === 'true') {
      setIsAuthenticated(true);
      loadPasswords();
    }
  }, []);

  const handleLogin = () => {
    if (masterPassword.length < 8) {
      toast({
        title: "Invalid Master Password",
        description: "Master password must be at least 8 characters long.",
        variant: "destructive"
      });
      return;
    }

    // In a real app, this would verify against a hashed master password
    localStorage.setItem('passwordManager_authenticated', 'true');
    localStorage.setItem('passwordManager_masterKey', btoa(masterPassword));
    setIsAuthenticated(true);
    loadPasswords();
    toast({
      title: "Welcome back!",
      description: "Successfully logged into your password vault.",
    });
  };

  const handleLogout = () => {
    localStorage.removeItem('passwordManager_authenticated');
    setIsAuthenticated(false);
    setMasterPassword('');
    setPasswords([]);
    toast({
      title: "Logged out",
      description: "Your vault has been secured.",
    });
  };

  const loadPasswords = () => {
    const stored = localStorage.getItem('passwordManager_passwords');
    if (stored) {
      setPasswords(JSON.parse(stored));
    }
  };

  const savePasswords = (newPasswords: StoredPassword[]) => {
    localStorage.setItem('passwordManager_passwords', JSON.stringify(newPasswords));
    setPasswords(newPasswords);
  };

  const addPassword = (passwordData: Omit<StoredPassword, 'id' | 'createdAt'>) => {
    const newPassword: StoredPassword = {
      ...passwordData,
      id: Date.now().toString(),
      createdAt: new Date().toISOString()
    };
    const updatedPasswords = [...passwords, newPassword];
    savePasswords(updatedPasswords);
    toast({
      title: "Password saved",
      description: "Your password has been securely stored.",
    });
  };

  const deletePassword = (id: string) => {
    const updatedPasswords = passwords.filter(p => p.id !== id);
    savePasswords(updatedPasswords);
    toast({
      title: "Password deleted",
      description: "The password has been removed from your vault.",
    });
  };

  const filteredPasswords = passwords.filter(password =>
    password.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    password.website.toLowerCase().includes(searchTerm.toLowerCase()) ||
    password.username.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4">
        <Card className="w-full max-w-md bg-slate-800/50 border-slate-700 backdrop-blur-xl">
          <CardHeader className="text-center space-y-6">
            <div className="mx-auto w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center">
              <Shield className="w-8 h-8 text-white" />
            </div>
            <div>
              <CardTitle className="text-2xl font-bold text-white mb-2">Secure Vault</CardTitle>
              <p className="text-slate-400">Enter your master password to unlock your vault</p>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-300">Master Password</label>
              <div className="relative">
                <Input
                  type={showMasterPassword ? "text" : "password"}
                  value={masterPassword}
                  onChange={(e) => setMasterPassword(e.target.value)}
                  placeholder="Enter your master password"
                  className="bg-slate-700/50 border-slate-600 text-white placeholder-slate-400 pr-10"
                  onKeyPress={(e) => e.key === 'Enter' && handleLogin()}
                />
                <Button
                  variant="ghost"
                  size="sm"
                  className="absolute right-2 top-1/2 -translate-y-1/2 h-6 w-6 p-0 text-slate-400 hover:text-white"
                  onClick={() => setShowMasterPassword(!showMasterPassword)}
                >
                  {showMasterPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </Button>
              </div>
            </div>
            <Button 
              onClick={handleLogin} 
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium"
            >
              <Lock className="w-4 h-4 mr-2" />
              Unlock Vault
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <div className="container mx-auto px-4 py-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
              <Shield className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">Password Vault</h1>
              <p className="text-slate-400 text-sm">{passwords.length} passwords stored securely</p>
            </div>
          </div>
          <Button
            onClick={handleLogout}
            variant="outline"
            className="border-slate-600 text-slate-300 hover:bg-slate-700"
          >
            <LogOut className="w-4 h-4 mr-2" />
            Logout
          </Button>
        </div>

        {/* Action Bar */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <Input
              placeholder="Search passwords..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-slate-800/50 border-slate-700 text-white placeholder-slate-400"
            />
          </div>
          <div className="flex gap-2">
            <Button
              onClick={() => setShowGenerator(!showGenerator)}
              variant="outline"
              className="border-slate-600 text-slate-300 hover:bg-slate-700"
            >
              <Key className="w-4 h-4 mr-2" />
              Generator
            </Button>
            <Button
              onClick={() => setShowAddModal(true)}
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Password
            </Button>
          </div>
        </div>

        {/* Password Generator */}
        {showGenerator && (
          <div className="mb-6">
            <PasswordGenerator />
          </div>
        )}

        {/* Password List */}
        <div className="grid gap-4">
          {filteredPasswords.length === 0 ? (
            <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-xl">
              <CardContent className="text-center py-12">
                <Shield className="w-16 h-16 text-slate-600 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-white mb-2">No passwords found</h3>
                <p className="text-slate-400 mb-6">
                  {searchTerm ? "No passwords match your search." : "Start building your secure password vault."}
                </p>
                {!searchTerm && (
                  <Button
                    onClick={() => setShowAddModal(true)}
                    className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Add Your First Password
                  </Button>
                )}
              </CardContent>
            </Card>
          ) : (
            filteredPasswords.map((password) => (
              <PasswordEntry
                key={password.id}
                password={password}
                onDelete={deletePassword}
              />
            ))
          )}
        </div>
      </div>

      {/* Add Password Modal */}
      <AddPasswordModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onAdd={addPassword}
      />
    </div>
  );
};

export default Index;
