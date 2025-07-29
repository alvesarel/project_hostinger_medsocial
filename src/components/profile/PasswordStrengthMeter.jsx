import React from 'react';

const PasswordStrengthMeter = ({ password }) => {
  const getStrength = (pass) => {
    let score = 0;
    if (!pass) return score;
    if (pass.length >= 8) score++;
    if (pass.match(/[a-z]/)) score++;
    if (pass.match(/[A-Z]/)) score++;
    if (pass.match(/[0-9]/)) score++;
    if (pass.match(/[^a-zA-Z0-9]/)) score++;
    return score;
  };

  const strength = getStrength(password);
  const strengthLabels = ['Muito Fraca', 'Fraca', 'Razoável', 'Boa', 'Forte'];
  const strengthColors = ['bg-red-500', 'bg-orange-500', 'bg-yellow-500', 'bg-blue-500', 'bg-green-500'];

  return (
    <div className="w-full mt-2">
      <div className="h-2 w-full bg-gray-200 rounded-full overflow-hidden">
        <div
          className={`h-full transition-all duration-300 ${strengthColors[strength - 1] || ''}`}
          style={{ width: `${(strength / 5) * 100}%` }}
        ></div>
      </div>
      <p className={`text-xs mt-1 ${strength > 2 ? 'text-green-600' : 'text-red-600'}`}>
        Força: {strengthLabels[strength - 1] || 'N/A'}
      </p>
    </div>
  );
};

export default PasswordStrengthMeter;
