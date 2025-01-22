import React, { useState, useEffect } from 'react';
import { Download, Users, UserPlus, Search, RefreshCw } from 'lucide-react';

interface TeamMember {
  rollNumber: number;
  name: string;
}

interface Team {
  id: number;
  members: TeamMember[];
}

function App() {
  const [teams, setTeams] = useState<Team[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTeam, setSelectedTeam] = useState<number | null>(null);

  useEffect(() => {
    generateTeams();
  }, []);

  const generateTeams = () => {
    const rollNumbers = Array.from({ length: 58 }, (_, i) => i + 1);
    
    for (let i = rollNumbers.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [rollNumbers[i], rollNumbers[j]] = [rollNumbers[j], rollNumbers[i]];
    }

    const numberOfTeams = 12;
    const newTeams: Team[] = [];

    let currentIndex = 0;
    for (let i = 0; i < numberOfTeams; i++) {
      const teamSize = i < 6 ? 5 : 4;
      const teamMembers: TeamMember[] = [];

      for (let j = 0; j < teamSize && currentIndex < rollNumbers.length; j++) {
        teamMembers.push({
          rollNumber: rollNumbers[currentIndex],
          name: ''
        });
        currentIndex++;
      }

      newTeams.push({
        id: i + 1,
        members: teamMembers
      });
    }

    setTeams(newTeams);
  };

  const handleNameChange = (teamId: number, rollNumber: number, name: string) => {
    setTeams(prevTeams => 
      prevTeams.map(team => 
        team.id === teamId 
          ? {
              ...team,
              members: team.members.map(member =>
                member.rollNumber === rollNumber
                  ? { ...member, name }
                  : member
              )
            }
          : team
      )
    );
  };

  const downloadTeamDetails = (teamId: number) => {
    const team = teams.find(t => t.id === teamId);
    if (!team) return;

    const content = `Team ${teamId}\n\n${team.members
      .map(member => `Roll Number: ${member.rollNumber}, Name: ${member.name || 'Not assigned'}`)
      .join('\n')}`;

    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `team${teamId}_details.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const filteredTeams = teams.filter(team => 
    team.members.some(member => 
      member.rollNumber.toString().includes(searchTerm) ||
      member.name.toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-4 sm:p-6 md:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8 md:mb-12">
          <h1 className="text-3xl md:text-5xl font-bold text-indigo-900 mb-3 md:mb-4 flex items-center justify-center">
            <Users className="inline-block mr-2 md:mr-3 h-8 w-8 md:h-12 md:w-12" />
            <span className="break-words">Team Management System</span>
          </h1>
          <p className="text-gray-600 text-base md:text-lg px-4">Efficiently manage and organize your teams</p>
        </div>

        <div className="mb-6 md:mb-8 flex flex-col sm:flex-row gap-4 justify-center items-stretch">
          <div className="relative flex-grow max-w-full sm:max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search by roll number or name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 bg-white/80 backdrop-blur-sm"
            />
          </div>
          <button
            onClick={generateTeams}
            className="flex items-center justify-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors duration-200 shadow-md hover:shadow-lg w-full sm:w-auto"
          >
            <RefreshCw className="h-5 w-5" />
            <span>Regenerate Teams</span>
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          {filteredTeams.map(team => (
            <div
              key={team.id}
              className={`bg-white/90 backdrop-blur-sm rounded-xl shadow-xl p-4 md:p-6 transition-all duration-300 transform hover:scale-[1.02] ${
                selectedTeam === team.id ? 'ring-2 ring-indigo-500' : ''
              }`}
              onClick={() => setSelectedTeam(team.id)}
            >
              <div className="flex justify-between items-center mb-4 md:mb-6">
                <h2 className="text-xl md:text-2xl font-bold text-indigo-800 flex items-center gap-2">
                  <span className="bg-indigo-100 text-indigo-600 rounded-full px-3 md:px-4 py-1">
                    Team {team.id}
                  </span>
                </h2>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    downloadTeamDetails(team.id);
                  }}
                  className="text-indigo-600 hover:text-indigo-800 transition-colors p-2 hover:bg-indigo-50 rounded-full"
                  title="Download team details"
                >
                  <Download className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-3 md:space-y-4">
                {team.members.map(member => (
                  <div 
                    key={member.rollNumber} 
                    className="flex items-center gap-3 p-2 md:p-3 rounded-lg hover:bg-indigo-50/50 transition-colors"
                  >
                    <div className="flex-shrink-0 bg-indigo-100 rounded-full p-2">
                      <UserPlus className="w-4 h-4 text-indigo-600" />
                    </div>
                    <div className="flex-grow">
                      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-3">
                        <span className="text-sm font-semibold text-indigo-600 bg-indigo-50 px-2 py-1 rounded-md whitespace-nowrap">
                          #{member.rollNumber}
                        </span>
                        <input
                          type="text"
                          value={member.name}
                          onChange={(e) => handleNameChange(team.id, member.rollNumber, e.target.value)}
                          placeholder="Enter name"
                          className="w-full sm:flex-grow px-3 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all duration-200 bg-white/80"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default App;