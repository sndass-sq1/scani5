import { useState } from 'react';
import { HiClipboardDocumentCheck, HiOutlineClipboardDocument } from 'react-icons/hi2';

const CopyableText = ({ text }) => {
    const [copied, setCopied] = useState(false);

    const handleCopy = () => {
        navigator.clipboard.writeText(text);
        setCopied(true);

        setTimeout(() => {
            setCopied(false);
        }, 1500); // Reset copied state after 1.5 seconds
    };

    return (
        <p className="asset-copyable-text">
            <p className="m-0 assetcard-font-14">{text}</p>

            {copied ? (
                <HiClipboardDocumentCheck className="asset-copy" />
            ) : (
                <HiOutlineClipboardDocument className="copy-able" onClick={handleCopy} />
            )}
        </p>
    );
};

export default CopyableText;
