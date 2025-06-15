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

    function extractUrls(text) {
        const urlRegex = /(https?:\/\/[^\s]+|www\.[^\s]+)/g;
        return text.match(urlRegex) || [];
    }

    console.log(`>>> Assigning label "${labelName}" to selected mails:`, [...updatedIds]);

    const updatedMailList = await Promise.all(
        mails.map(async (mail) => {
            if (!updatedIds.has(mail.id)) return mail;

            console.log(`--- Updating mail ID: ${mail.id}`);

            try {
                const response = await fetch(`http://localhost:8080/api/mails/${mail.id}`, {
                    method: 'PATCH',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ label: [labelName] }),
                });

                if (response.status === 204) {
                    console.log(`✅ Label updated successfully for mail ${mail.id}`);
                    
                    if (labelName === 'Spam') {
                        const urls = extractUrls(`${mail.subject}\n${mail.body}`);
                        console.log(`📨 Mail ID ${mail.id} moved to Spam`);
                        console.log(`🔎 Extracted URLs:`, urls);

                        for (const url of urls) {
                            try {
                                const getUrl = `http://localhost:8080/api/blacklist/${encodeURIComponent(url)}`;
                                console.log(`🌐 [GET] Checking blacklist status for URL: ${url}`);
                                console.log(`➡️ Fetching: ${getUrl}`);

                                const checkRes = await fetch(getUrl);
                                const check = await checkRes.json();

                                console.log(`⬅️ Response from GET ${url}:`, check);

                                if (!check.blacklisted) {
                                    const postUrl = 'http://localhost:8080/api/blacklist';
                                    console.log(`🌐 [POST] Blacklisting URL: ${url}`);
                                    console.log(`➡️ Posting to: ${postUrl} with body:`, { url });

                                    const postRes = await fetch(postUrl, {
                                        method: 'POST',
                                        headers: { 'Content-Type': 'application/json' },
                                        body: JSON.stringify({ url }),
                                    });

                                    const postText = await postRes.text();
                                    if (postRes.ok) {
                                        console.log(`✅ Successfully blacklisted "${url}". Server replied: ${postText}`);
                                    } else {
                                        console.warn(`❌ Failed to POST ${url} to blacklist. Status: ${postRes.status}, Body: ${postText}`);
                                    }
                                } else {
                                    console.log(`ℹ️ "${url}" is already blacklisted. Skipping.`);
                                }
                            } catch (e) {
                                console.error(`❗ Error syncing URL "${url}" to blacklist:`, e);
                            }
                        }
                    }
                    

                    return { ...mail, label: [labelName] };
                } else {
                    console.error(`❌ Failed to update label for mail ${mail.id}. Status: ${response.status}`);
                    return mail;
                }
            } catch (err) {
                console.error('❗ Label update error:', err);
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
                    <div key={mail.id} onClick={() => toggleMailSelection(mail.id)} style={{ cursor: 'pointer' }}>
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