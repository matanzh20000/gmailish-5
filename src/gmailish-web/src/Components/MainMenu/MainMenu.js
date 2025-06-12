import { useState, useEffect } from 'react';
import MailItem from './MailItem';
import ToolbarItem from './ToolbarItem';
import Iridescence from '../../Pages/Iridescence';


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

    const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

    useEffect(() => {
        const updateDimensions = () => {
            const ratio = window.innerWidth / window.innerHeight;
            const height = Math.min(window.innerHeight * 0.8, 700);
            const width = (height * ratio) * 0.9;
            setDimensions({ width, height });
        };

        updateDimensions();
        window.addEventListener('resize', updateDimensions);
        return () => window.removeEventListener('resize', updateDimensions);
    }, []);

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

    const handleAssignLabel = (labelName) => {
        setMails(prevMails =>
            prevMails.map(mail =>
                selectedMailIds.includes(mail.id)
                    ? { ...mail, label: labelName }
                    : mail
            )
        );
        setSelectedMailIds([]);
    };

    const trimmedMails = mails.map(mail => ({
        ...mail,
        body: mail.body.length > 50 ? mail.body.slice(0, 50) + '...' : mail.body
    }));

    return (
        <div
            style={{
                position: 'relative',
                zIndex: 1,
                borderRadius: '16px',
                overflow: 'hidden',
                boxShadow: '0 8px 24px rgba(0, 0, 0, 0.15)',
                backdropFilter: 'blur(10px)',
                WebkitBackdropFilter: 'blur(10px)',
                width: `${dimensions.width}px`,
                height: `${dimensions.height}px`,
                maxHeight: '88vh',
                marginTop: '2rem',
                marginLeft: '2rem',
                marginBottom: '2rem',
            }}
        >


            {/* Shader background inside the floating window */}
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
                color={darkMode ? [0.4, 0.4, 0.4] : [0.85, 0.85, 0.85]}
                speed={0.5}
                amplitude={0.05}
            />

            {/* Foreground content */}
            <div
                style={{
                    position: 'relative',
                    zIndex: 1,
                    padding: '2rem',
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
                />

                {trimmedMails.map(mail => (
                    <MailItem
                        key={mail.id}
                        mail={mail}
                        darkMode={darkMode}
                        timestampClass={themeColors.timestamp}
                        isSelected={selectedMailIds.includes(mail.id)}
                        onToggleSelected={() => toggleMailSelection(mail.id)}
                    />
                ))}
            </div>
        </div>

    );
};

export default MainMenu;
