import React, { useMemo } from 'react';
import { Check, X } from 'lucide-react';

const PasswordRequirements = ({ password }) => {
    const requirements = useMemo(() => [
        { text: 'Pelo menos 8 caracteres', regex: /.{8,}/ },
        { text: 'Uma letra maiúscula', regex: /[A-Z]/ },
        { text: 'Uma letra minúscula', regex: /[a-z]/ },
        { text: 'Um número', regex: /[0-9]/ },
        { text: 'Um caractere especial', regex: /[^a-zA-Z0-9]/ },
    ], []);

    return (
        <ul className="text-xs text-muted-foreground space-y-1 mt-2">
            {requirements.map((req, i) => (
                <li key={i} className="flex items-center">
                    {req.regex.test(password) ? (
                        <Check className="h-4 w-4 mr-2 text-green-500" />
                    ) : (
                        <X className="h-4 w-4 mr-2 text-red-500" />
                    )}
                    {req.text}
                </li>
            ))}
        </ul>
    );
};

export default PasswordRequirements;
