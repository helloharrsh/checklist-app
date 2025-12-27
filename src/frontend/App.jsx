import React, { useState } from 'react';
import { Stack, Text, Button, Textfield, Inline, Box, xcss } from '@forge/react';
import ChecklistItem from './components/ChecklistItem';

// ... (styles remain the same) ...
// Custom Progress Bar Styles
const progressContainerStyle = xcss({
    backgroundColor: 'color.background.neutral.subtle',
    borderRadius: 'border.radius.100',
    height: '5px',
    width: '100%',
    overflow: 'hidden',
});

const progressBarStyle = (width) => xcss({
    backgroundColor: 'color.background.success.bold',
    height: '100%',
    width: `${width}%`,
    transition: 'width 0.3s ease-in-out',
});

const App = () => {
    const [items, setItems] = useState([
        { id: '1', text: 'Verify staging environment', isChecked: true, priority: 'medium' },
        { id: '2', text: 'Run integration tests', isChecked: false, priority: 'high' },
        { id: '3', text: 'Update release notes', isChecked: false, priority: 'low' },
    ]);
    const [newItemText, setNewItemText] = useState('');

    const handleAddItem = () => {
        if (!newItemText.trim()) return;
        const newItem = {
            id: Date.now().toString(),
            text: newItemText,
            isChecked: false,
            priority: 'medium',
        };
        setItems([...items, newItem]);
        setNewItemText('');
    };

    const handleToggle = (id) => {
        setItems(items.map(item =>
            item.id === id ? { ...item, isChecked: !item.isChecked } : item
        ));
    };

    const handleDelete = (id) => {
        setItems(items.filter(item => item.id !== id));
    };

    // New Handlers for Modern Features
    const handleAssign = (id, user) => {
        setItems(items.map(item =>
            item.id === id ? { ...item, assignee: user } : item
        ));
    };

    const handleDateChange = (id, date) => {
        setItems(items.map(item =>
            item.id === id ? { ...item, dueDate: date } : item
        ));
    };

    const handlePriorityChange = (id, priority) => {
        setItems(items.map(item =>
            item.id === id ? { ...item, priority: priority } : item
        ));
    };

    const handleEdit = (id, newText) => {
        setItems(items.map(item =>
            item.id === id ? { ...item, text: newText } : item
        ));
    };

    const completedCount = items.filter(i => i.isChecked).length;
    const progress = items.length > 0 ? (completedCount / items.length) * 100 : 0;

    return (
        <Stack space="space.200">
            {/* Header */}
            <Inline space="space.between" alignBlock="center">
                <Text>Deployment Checklist</Text>
            </Inline>

            {/* Custom Modern Progress Bar */}
            <Box xcss={progressContainerStyle}>
                <Box xcss={progressBarStyle(progress)} />
            </Box>

            {/* List */}
            <Stack space="space.100">
                {items.map(item => (
                    <ChecklistItem
                        key={item.id}
                        item={item}
                        onToggle={handleToggle}
                        onDelete={handleDelete}
                        onAssign={handleAssign}
                        onDateChange={handleDateChange}
                        onPriorityChange={handlePriorityChange}
                        onEdit={handleEdit}
                    />
                ))}
                {items.length === 0 && (
                    <Box padding="space.200" backgroundColor="color.background.neutral.subtle" borderRadius="border.radius">
                        <Text align="center">No items yet. Add one below!</Text>
                    </Box>
                )}
            </Stack>

            {/* Footer / Add New */}
            <Box width="50%">
                <Inline space="space.100">
                    <Textfield
                        placeholder="Add new item..."
                        value={newItemText}
                        onChange={(e) => setNewItemText(e.target.value)}
                    />
                    <Button appearance="primary" onClick={handleAddItem}>Add Item</Button>
                </Inline>
            </Box>
        </Stack>
    );
};

export default App;