// Function to extract the text content from the <pre> tag, skipping HTML tags
function getCodeText(preElement) {
    return preElement.innerText || preElement.textContent;
}

// Function to add the download button
function addDownloadButton(codeBlock) {
    const actionDiv = codeBlock.querySelector('.md-code-block-action');
    if (!actionDiv) return;

    const downloadButton = document.createElement('div');
    downloadButton.className = 'md-code-block-download-button';
    downloadButton.textContent = 'Download';
    downloadButton.style.cursor = 'pointer';
    downloadButton.style.marginLeft = '10px';

    downloadButton.addEventListener('click', () => {
        const preElement = codeBlock.querySelector('pre');
        const codeText = getCodeText(preElement);
        const fileExtension = codeBlock.querySelector('.md-code-block-infostring').textContent.trim();

        const filename = `code.${fileExtension}`;

        // Send a message to the background script to handle the download
        chrome.runtime.sendMessage({ action: 'download', filename: filename, text: codeText });
    });

    actionDiv.appendChild(downloadButton);
}

// Find all code blocks and add the download button
document.querySelectorAll('.md-code-block').forEach(addDownloadButton);