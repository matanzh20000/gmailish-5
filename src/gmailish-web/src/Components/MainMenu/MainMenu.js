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
        <StylePanel>


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
                color={darkMode ? [0.2, 0.6, 0.75] : [0.75, 0.75, 0.75]}
                speed={0.5}
                amplitude={0.05}
            />

            {/* Foreground content */}
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
        </StylePanel>

    );
};

export default MainMenu;
