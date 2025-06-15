import { useState } from 'react';
import MailItem from './MailItem';
import ToolbarItem from './ToolbarItem';
import Iridescence from '../../Pages/Iridescence';
import StylePanel from './StylePanel';

const MainMenu = ({ darkMode, mails, setMails, defaultLabels, customLabels }) => {
    const themeColors = darkMode
        ? {
            background: '#333558',
            text: 'text-light',
            card: 'bg-secondary text-light',
            border: 'border-secondary',
            timestamp: 'text-light'
        }
        : {
            background: '#cce6e6',
            text: 'text-dark',
            card: 'bg-white text-dark',
            border: 'border-light',
            timestamp: 'text-muted'
        };

    const [selectedMailIds, setSelectedMailIds] = useState([]);

    const combinedLabels = [...defaultLabels, ...customLabels.map(label => label.name)];

    const toggleSelectAll = () => {
        if (selectedMailIds.length === mails.length) {
            setSelectedMailIds([]);
        } else {
            setSelectedMailIds(mails.map(m => m.id));
        }
    };

    const toggleMailSelection = (id) => {
        setSelectedMailIds(prev =>
            prev.includes(id) ? prev.filter(mid => mid !== id) : [...prev, id]
        );
    };

    const handleAssignLabel = async (labelName) => {
        const updatedIds = new Set(selectedMailIds);

        const updatedMailList = await Promise.all(
            mails.map(async (mail) => {
                if (!updatedIds.has(mail.id)) return mail;

                try {
                    const response = await fetch(`http://localhost:8080/api/mails/${mail.id}`, {
                        method: 'PATCH',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({ label: [labelName] }),
                    });

                    if (response.status === 204) {
                        return { ...mail, label: [labelName] }; // ✅ locally reflect new label
                    } else {
                        console.error(`Failed to update label for mail ${mail.id}`);
                        return mail;
                    }
                } catch (err) {
                    console.error('Label update error:', err);
                    return mail;
                }
            })
        );

        setMails(updatedMailList);
        setSelectedMailIds([]);
    };

    const trimmedMails = mails.map(mail => ({
        ...mail,
        body: mail.body.length > 50 ? mail.body.slice(0, 50) + '...' : mail.body
    }));

    return (
        <StylePanel>
            <Iridescence
                style={{
                    position: 'absolute',
                    zIndex: 0,
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    pointerEvents: 'none'
                }}
                color={darkMode ? [0.2, 0.6, 0.75] : [0.75, 0.75, 0.75]}
                speed={0.5}
                amplitude={0.05}
            />

            <div
                style={{
                    position: 'relative',
                    zIndex: 1,
                    padding: '0.8rem',
                    borderRadius: 'inherit',
                    height: '100%',
                }}
            >
                <ToolbarItem
                    darkMode={darkMode}
                    selectedCount={selectedMailIds.length}
                    allSelected={selectedMailIds.length === mails.length}
                    onToggleSelectAll={toggleSelectAll}
                    labels={combinedLabels}
                    onAssignLabel={handleAssignLabel}
                    visibleMailCount={mails.length}
                />

                            {trimmedMails.map(mail => (
                    <div key={mail.id} onClick={() => onSelectMail(mail.id)} style={{ cursor: 'pointer' }}>
                        <MailItem
                        mail={mail}
                        darkMode={darkMode}
                        timestampClass={themeColors.timestamp}
                        isSelected={selectedMailIds.includes(mail.id)}
                        onToggleSelected={() => toggleMailSelection(mail.id)}
                        />
                    </div>
                    ))}

            </div>
        </StylePanel>
    );
};

export default MainMenu;
