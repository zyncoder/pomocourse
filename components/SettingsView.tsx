
import React, { useState } from 'react';
import { Settings } from '../types';

interface SettingsViewProps {
  settings: Settings;
  onUpdateSettings: (newSettings: Partial<Settings>) => void;
  onExport: () => void;
  onImport: (jsonString: string) => void;
}

const SettingsView: React.FC<SettingsViewProps> = ({ settings, onUpdateSettings, onExport, onImport }) => {
  const [currentSettings, setCurrentSettings] = useState<Settings>(settings);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCurrentSettings(prev => ({ ...prev, [name]: parseInt(value, 10) }));
  };
  
  const handleSave = () => {
    onUpdateSettings(currentSettings);
    alert('Settings saved!');
  };

  const handleImportClick = () => {
    document.getElementById('importFile')?.click();
  };
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const text = event.target?.result;
        if (typeof text === 'string') {
          onImport(text);
        }
      };
      reader.readAsText(file);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      <h2 className="text-3xl font-bold">Settings</h2>
      
      <div className="bg-gray-800/50 p-6 rounded-2xl">
        <h3 className="text-xl font-bold mb-4">Pomodoro Timer</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <SettingInput label="Work Duration (min)" name="workMin" value={currentSettings.workMin} onChange={handleInputChange} />
          <SettingInput label="Short Break (min)" name="shortBreakMin" value={currentSettings.shortBreakMin} onChange={handleInputChange} />
          <SettingInput label="Long Break (min)" name="longBreakMin" value={currentSettings.longBreakMin} onChange={handleInputChange} />
          <SettingInput label="Long Break After" name="longBreakAfter" value={currentSettings.longBreakAfter} onChange={handleInputChange} />
        </div>
        <button onClick={handleSave} className="mt-6 bg-red-600 hover:bg-red-500 text-white font-bold py-2 px-4 rounded-lg transition-colors">
          Save Settings
        </button>
      </div>

      <div className="bg-gray-800/50 p-6 rounded-2xl">
        <h3 className="text-xl font-bold mb-4">Data Management</h3>
        <div className="flex space-x-4">
          <button onClick={onExport} className="bg-blue-600 hover:bg-blue-500 text-white font-bold py-2 px-4 rounded-lg transition-colors">
            Export Data
          </button>
          <button onClick={handleImportClick} className="bg-green-600 hover:bg-green-500 text-white font-bold py-2 px-4 rounded-lg transition-colors">
            Import Data
          </button>
          <input type="file" id="importFile" accept=".json" className="hidden" onChange={handleFileChange} />
        </div>
        <p className="text-sm text-gray-400 mt-4">Backup your progress or restore it on another device. Importing will overwrite your current data.</p>
      </div>
    </div>
  );
};

interface SettingInputProps {
    label: string;
    name: keyof Settings;
    value: number;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const SettingInput: React.FC<SettingInputProps> = ({ label, name, value, onChange }) => (
    <div>
        <label htmlFor={name} className="block text-sm font-medium text-gray-300">{label}</label>
        <input
            type="number"
            id={name}
            name={name}
            value={value}
            onChange={onChange}
            className="mt-1 block w-full bg-gray-700 border-gray-600 rounded-md shadow-sm focus:ring-red-500 focus:border-red-500 sm:text-sm p-2"
        />
    </div>
);

export default SettingsView;
