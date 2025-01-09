chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === 'download') {
        const { filename, text } = message;

        // Create a Blob with the text content
        const blob = new Blob([text], { type: 'text/plain' });

        // Create a URL for the Blob
        const url = URL.createObjectURL(blob);

        // Trigger the download
        chrome.downloads.download({
            url: url,
            filename: filename,
            saveAs: true
        }, () => {
            // Revoke the Blob URL after the download starts
            URL.revokeObjectURL(url);
        });
    }
});