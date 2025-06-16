import { useState } from 'react';
import MailItem from './MailItem';
import ToolbarItem from './ToolbarItem';
import Iridescence from '../../Pages/Iridescence';
import StylePanel from './StylePanel';

const MainMenu = ({ darkMode, mails, setMails, defaultLabels, customLabels, onEditDraft }) => {
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

    const handleDeleteMails = async () => {
        const idsToDelete = [...selectedMailIds];

        try {
            await Promise.all(idsToDelete.map(id =>
                fetch(`http://localhost:8080/api/mails/${id}`, {
                    method: 'DELETE',
                })
            ));

            setMails(prev => prev.filter(mail => !idsToDelete.includes(mail.id)));
            setSelectedMailIds([]);
        } catch (err) {
            console.error("Failed to delete mails:", err);
            alert("An error occurred while deleting mails.");
        }
    };

    const toggleMailSelection = (id) => {
        setSelectedMailIds(prev =>
            prev.includes(id) ? prev.filter(mid => mid !== id) : [...prev, id]
        );
    };

    const handleAssignLabel = async (labelName) => {
        const updatedIds = new Set(selectedMailIds);

        function extractUrls(text) {
            const urlRegex = /(https?:\/\/[^\s]+|www\.[^\s]+)/g;
            return text.match(urlRegex) || [];
        }

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
                        const urls = extractUrls(`${mail.subject}\n${mail.body}`);

                        if (labelName === 'Spam') {
                            for (const url of urls) {
                                try {
                                    const checkRes = await fetch(`http://localhost:8080/api/blacklist/${encodeURIComponent(url)}`);
                                    const check = await checkRes.json();

                                    if (!check.blacklisted) {
                                        await fetch('http://localhost:8080/api/blacklist', {
                                            method: 'POST',
                                            headers: { 'Content-Type': 'application/json' },
                                            body: JSON.stringify({ url }),
                                        });
                                    }
                                } catch (e) {}
                            }
                        } else {
                            for (const url of urls) {
                                try {
                                    await fetch(`http://localhost:8080/api/blacklist/${encodeURIComponent(url)}`, {
                                        method: 'DELETE',
                                    });
                                } catch (e) {}
                            }
                        }

                        return { ...mail, label: [labelName] };
                    } else {
                        return mail;
                    }
                } catch (err) {
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
                    onDeleteMails={handleDeleteMails}
                />

                {trimmedMails.map(mail => (
                    <div
                        key={mail.id}
                        onClick={() => {
                            if (mail.label.includes('Drafts') && mail.draft && typeof onEditDraft === 'function') {
                                onEditDraft(mail);
                            } else {
                                toggleMailSelection(mail.id);
                            }
                        }}
                        style={{ cursor: 'pointer' }}
                    >
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
