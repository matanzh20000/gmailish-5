import { useState, useEffect } from 'react';
import LabelItem from './LabelItem';
import NewLabelModal from './NewLabelModal';
import EditLabelModal from './EditLabelModal';


const LeftMenuItem = ({ darkMode,
    onSelectLabel,
    customLabels,
    setCustomLabels,
    selectedLabel,
    setMails,
    mails,
    themeColors,
    onCompose }) => {

    const primaryButtonClass = darkMode ? 'btn btn-primary-dark' : 'btn btn-primary-light';
    const labelButtonClass = darkMode ? 'btn btn-outline-secondary-dark' : 'btn btn-outline-secondary-light';
    const [showModal, setShowModal] = useState(false);
    const [newLabelName, setNewLabelName] = useState('');
    const [editingLabelId, setEditingLabelId] = useState(null);

    const defaultLabels = [
        { name: 'Inbox', icon: 'bi-inbox' },
        { name: 'Starred', icon: 'bi-star' },
        { name: 'Snoozed', icon: 'bi-clock' },
        { name: 'Sent', icon: 'bi-send' },
        { name: 'Spam', icon: 'bi-exclamation-circle' },
        { name: 'Drafts', icon: 'bi-file-earmark-text' },
    ].map(label => ({
        ...label,

        count: mails.filter(mail =>
            (Array.isArray(mail.label) && mail.label.includes(label.name)) ||
            (typeof mail.label === 'string' && mail.label === label.name)
        ).length

    }));

    useEffect(() => {
        const fetchLabels = async () => {
            try {
                const response = await fetch('http://localhost:8080/api/labels');
                const data = await response.json();
                setCustomLabels(data);
            } catch (err) {
                console.error('Failed to fetch labels:', err);
            }
        };

        fetchLabels();
    }, [setCustomLabels]);

    const handleSubmitNewLabel = async () => {
        if (!newLabelName.trim()) return;

        try {
            const response = await fetch('http://localhost:8080/api/labels', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name: newLabelName, icon: 'bi bi-tag' })
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.error || 'Failed to create label');
            }

            const newLabel = await response.json();
            setCustomLabels(prev => [...prev, newLabel]);
            setNewLabelName('');
            closeNewLabelModal();
        } catch (err) {
            console.error('Failed to create label:', err);
            alert(err.message);
        }
    };

    const handleEditLabel = (labelObj) => {
        setEditingLabelId(labelObj.id);
        setNewLabelName(labelObj.name);
    };

    const submitEditLabel = async () => {
        try {
            const response = await fetch(`http://localhost:8080/api/labels/${editingLabelId}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name: newLabelName })
            });

            if (response.status !== 204) {
                throw new Error('Failed to update label');
            }

            setCustomLabels((prev) =>
                prev.map((l) =>
                    l.id === editingLabelId ? { ...l, name: newLabelName } : l
                )
            );

            setEditingLabelId(null);
            setNewLabelName('');
        } catch (err) {
            console.error(err);
            alert('Label update failed');
        }
    };

    const handleDeleteLabel = async (labelObj) => {
        try {
            const response = await fetch(`http://localhost:8080/api/labels/${labelObj.id}`, {
                method: 'DELETE'
            });

            if (response.status !== 204) {
                throw new Error('Failed to delete label');
            }

            setCustomLabels(prev => prev.filter(l => l.id !== labelObj.id));

            const updatePromises = [];

            setMails(prev =>
                prev.map(mail => {
                    if (
                        (Array.isArray(mail.label) && mail.label.includes(labelObj.name)) ||
                        (typeof mail.label === 'string' && mail.label === labelObj.name)
                    ) {
                        updatePromises.push(
                            fetch(`http://localhost:8080/api/mails/${mail.id}`, {
                                method: 'PATCH',
                                headers: { 'Content-Type': 'application/json' },
                                body: JSON.stringify({ label: ['Inbox'] })
                            })
                        );
                        return { ...mail, label: ['Inbox'] };
                    }
                    return mail;
                })
            );

            await Promise.all(updatePromises);
            setNewLabelName('');
        } catch (err) {
            console.error(err);
            alert('Label deletion failed');
        }
    };

    const closeNewLabelModal = () => {
        setShowModal(false);
        setNewLabelName('');
    };

    const closeEditLabelModal = () => {
        setEditingLabelId(null);
        setShowModal(false);
        setNewLabelName('');
    };

    return (
        <div
            className={`p-3 ps-4 ${themeColors.text} transition-theme`}
            style={{ minWidth: '300px', backgroundColor: themeColors.background }}
        >
            <button className={`${primaryButtonClass} w-100 mb-2`} onClick={onCompose}>
                <i className="bi bi-pen me-2"></i>

                Compose
            </button>


            <div className="mb-3">
                <div className="d-flex justify-content-between align-items-center mb-3">
                    <strong className={`${themeColors.text} fs-5`}>Labels</strong>
                    <button
                        className={`${labelButtonClass} ${themeColors.text}`}
                        style={{ padding: '0.25rem 0.5rem' }}
                        onClick={() => setShowModal(true)}
                    >
                        <i className="bi bi-plus fs-4 fw-bold"></i>
                    </button>
                </div>
                <div className="d-grid gap-2">
                    {defaultLabels.map((label) => (
                        <LabelItem
                            key={label.name} 
                            label={label}
                            darkMode={darkMode}
                            onSelect={() => onSelectLabel(label.name)}
                            isCustom={false}
                            mails={mails}
                            isActive={selectedLabel === label.name}
                        />
                    ))}

                    {customLabels.map((label) => {
                        const count = mails.filter(mail =>
                            (Array.isArray(mail.label) && mail.label.includes(label.name)) ||
                            (typeof mail.label === 'string' && mail.label === label.name)
                        ).length;

                        return (
                            <LabelItem
                                key={label.id}
                                label={{ ...label, count }}
                                darkMode={darkMode}
                                onSelect={() => onSelectLabel(label.name)}
                                onEdit={() => handleEditLabel(label)}
                                onDelete={() => handleDeleteLabel(label)}
                                isCustom={true}
                                mails={mails}
                                isActive={selectedLabel === label.name}
                            />
                        );
                    })}

                    {showModal && (
                        <NewLabelModal
                            darkMode={darkMode}
                            value={newLabelName}
                            onChange={setNewLabelName}
                            onCancel={closeNewLabelModal}
                            onSubmit={handleSubmitNewLabel}
                        />
                    )}

                    <EditLabelModal
                        show={editingLabelId !== null}
                        darkMode={darkMode}
                        value={newLabelName}
                        onChange={setNewLabelName}
                        onCancel={closeEditLabelModal}
                        onSubmit={submitEditLabel}
                    />
                </div>
                <br />
            </div>
        </div>
    );
};

export default LeftMenuItem;
