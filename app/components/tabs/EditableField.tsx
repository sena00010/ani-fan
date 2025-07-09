import React, { useState } from 'react';
import { Edit, Save, X } from 'lucide-react';

interface EditableFieldProps {
    field: string;
    value: string;
    type?: string;
    multiline?: boolean;
    editingField: string | null;
    setEditingField: (field: string | null) => void;
    handleSave: (field: string, value: string) => void;
}

const EditableField: React.FC<EditableFieldProps> = ({
                                                         field,
                                                         value,
                                                         type = "text",
                                                         multiline = false,
                                                         editingField,
                                                         setEditingField,
                                                         handleSave
                                                     }) => {
    const [tempValue, setTempValue] = useState(value);

    if (editingField === field) {
        return (
            <div className="flex items-center gap-2">
                {multiline ? (
                    <textarea
                        value={tempValue}
                        onChange={(e) => setTempValue(e.target.value)}
                        className="flex-1 p-2 border border-gray-300 rounded-lg resize-none"
                        rows={3}
                        autoFocus
                    />
                ) : (
                    <input
                        type={type}
                        value={tempValue}
                        onChange={(e) => setTempValue(e.target.value)}
                        className="flex-1 p-2 border border-gray-300 rounded-lg"
                        autoFocus
                    />
                )}
                <button
                    onClick={() => handleSave(field, tempValue)}
                    className="p-2 text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors"
                >
                    <Save className="w-4 h-4" />
                </button>
                <button
                    onClick={() => setEditingField(null)}
                    className="p-2 text-gray-500 hover:bg-gray-50 rounded-lg transition-colors"
                >
                    <X className="w-4 h-4" />
                </button>
            </div>
        );
    }

    return (
        <div className="flex items-center justify-between group">
            <span className={multiline ? "whitespace-pre-wrap" : ""}>{value}</span>
            <button
                onClick={() => setEditingField(field)}
                className="opacity-0 group-hover:opacity-100 p-1 text-gray-400 hover:text-gray-600 transition-all"
            >
                <Edit className="w-4 h-4" />
            </button>
        </div>
    );
};

export default EditableField;