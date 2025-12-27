import React, { useState } from 'react';
import { Checkbox, Text, Button, Inline, Stack, UserPicker, DatePicker, Box, xcss, Lozenge, Textfield } from '@forge/react';

// Style for strikethrough logic
const completedStyle = xcss({
    opacity: 0.5,
    textDecoration: 'line-through'
});

const priorityOptions = [
    { label: 'Low', value: 'low' },
    { label: 'Medium', value: 'medium' },
    { label: 'High', value: 'high' },
];

const getPriorityColor = (priority) => {
    switch (priority) {
        case 'high': return 'removed'; // Red
        case 'medium': return 'moved'; // Yellow-ish
        case 'low': return 'success'; // Green
        default: return 'default';
    }
};

const ChecklistItem = ({ item, onToggle, onDelete, onAssign, onDateChange, onPriorityChange, onEdit }) => {
    // Track which field is currently being edited: 'priority', 'assignee', 'date', or null
    const [editingField, setEditingField] = useState(null);
    const [isEditingText, setIsEditingText] = useState(false);
    const [editedText, setEditedText] = useState(item.text);

    const handlePrioritySelect = (value) => {
        onPriorityChange(item.id, value);
        setEditingField(null); // Close selection
    };

    const handleAssignSelect = (user) => {
        onAssign(item.id, user);
        setEditingField(null);
    };

    const handleDateSelect = (date) => {
        onDateChange(item.id, date);
        setEditingField(null);
    };

    const handleTextEdit = () => {
        if (editedText.trim()) {
            onEdit(item.id, editedText);
            setIsEditingText(false);
        }
    };

    const handleTextEditCancel = () => {
        setEditedText(item.text);
        setIsEditingText(false);
    };

    return (
        <Box padding="space.100" backgroundColor="elevation.surface" borderRadius="border.radius.100">
            <Inline space="space.100" alignBlock="center">
                {/* Checkbox */}
                <Checkbox
                    isChecked={item.isChecked}
                    onChange={() => onToggle(item.id)}
                    label=""
                />

                {/* Main Content */}
                <Stack grow="fill">
                    {isEditingText ? (
                        <Inline space="space.050">
                            <Textfield
                                value={editedText}
                                onChange={(e) => setEditedText(e.target.value)}
                                autoFocus
                            />
                            <Button appearance="primary" onClick={handleTextEdit}>✓</Button>
                            <Button appearance="subtle" onClick={handleTextEditCancel}>✕</Button>
                        </Inline>
                    ) : (
                        <Box xcss={item.isChecked ? completedStyle : undefined}>
                            <Text>{item.text}</Text>
                        </Box>
                    )}
                </Stack>

                {/* Edit Button */}
                {!isEditingText && (
                    <Button appearance="subtle" onClick={() => setIsEditingText(true)}>
                        ✎
                    </Button>
                )}

                {/* --- Priority Section --- */}
                {/* Dynamically expand width to fit options when editing */}
                <Box width={editingField === 'priority' ? 'auto' : '100px'}>
                    {editingField === 'priority' ? (
                        <Inline space="space.050">
                            {priorityOptions.map((option) => (
                                <Button
                                    key={option.value}
                                    appearance="subtle"
                                    onClick={() => handlePrioritySelect(option.value)}
                                >
                                    <Lozenge appearance={getPriorityColor(option.value)}>
                                        {option.label}
                                    </Lozenge>
                                </Button>
                            ))}
                        </Inline>
                    ) : (
                        <Button appearance="subtle" onClick={() => setEditingField('priority')}>
                            <Lozenge appearance={getPriorityColor(item.priority)}>
                                {item.priority ? item.priority.charAt(0).toUpperCase() + item.priority.slice(1) : 'Priority'}
                            </Lozenge>
                        </Button>
                    )}
                </Box>

                {/* --- Assignee Section --- */}
                <Box width="150px">
                    {editingField === 'assignee' ? (
                        <UserPicker
                            defaultValue={item.assignee}
                            onChange={handleAssignSelect}
                            autoFocus
                        />
                    ) : (
                        <Button appearance="subtle" onClick={() => setEditingField('assignee')}>
                            <Lozenge appearance="default">
                                {item.assignee ? (item.assignee.displayName || 'User') : 'Unassigned'}
                            </Lozenge>
                        </Button>
                    )}
                </Box>

                {/* --- Date Section --- */}
                <Box width="130px">
                    {editingField === 'date' ? (
                        <DatePicker
                            defaultValue={item.dueDate}
                            onChange={handleDateSelect}
                            autoFocus
                        />
                    ) : (
                        <Button appearance="subtle" onClick={() => setEditingField('date')}>
                            <Lozenge appearance={item.dueDate ? 'default' : 'new'}>
                                {item.dueDate || 'No Date'}
                            </Lozenge>
                        </Button>
                    )}
                </Box>

                {/* Delete Action */}
                <Button appearance="subtle" onClick={() => onDelete(item.id)}>
                    ✕
                </Button>
            </Inline>
        </Box>
    );
};

export default ChecklistItem;