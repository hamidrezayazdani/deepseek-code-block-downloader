// Mapping of popular programming language names to their file extensions
const languageExtensions = {
    'javascript': 'js',
    'python': 'py',
    'java': 'java',
    'c++': 'cpp',
    'c#': 'cs',
    'php': 'php',
    'ruby': 'rb',
    'swift': 'swift',
    'typescript': 'ts',
    'go': 'go',
    'html': 'html',
    'css': 'css',
    'bash': 'sh',
    'shell': 'sh',
    'json': 'json',
    'xml': 'xml',
    'markdown': 'md',
    'yaml': 'yml',
    'dockerfile': 'Dockerfile'
};

// Function to extract the text content from the <pre> tag, skipping HTML tags
function getCodeText(preElement) {
    return preElement.innerText || preElement.textContent;
}

// Function to get the file extension from the language name
function getFileExtension(language) {
    return languageExtensions[language.toLowerCase()] || language.toLowerCase();
}

// Function to extract filename from <h3> tag if it exists
function getFilenameFromH3(codeBlock) {
    const h3 = codeBlock.previousElementSibling;
    if (h3 && h3.tagName === 'H3') {
        const strong = h3.querySelector('strong');
        if (strong) {
            const code = strong.querySelector('code');
            if (code) {
                return code.textContent.trim().split('/').pop();
            }
        }
    }
    return null;
}

// Function to add the download button
function addDownloadButton(codeBlock) {
    const actionDiv = codeBlock.querySelector('.md-code-block-action');
    if (!actionDiv || actionDiv.querySelector('.md-code-block-download-button')) return;

    const downloadButton = document.createElement('div');
    downloadButton.className = 'md-code-block-download-button';
    downloadButton.textContent = 'Download';
    downloadButton.style.cursor = 'pointer';
    downloadButton.style.marginLeft = '10px';

    downloadButton.addEventListener('click', () => {
        const preElement = codeBlock.querySelector('pre');
        const codeText = getCodeText(preElement);
        const language = codeBlock.querySelector('.md-code-block-infostring').textContent.trim();
        const fileExtension = getFileExtension(language);

        let filename = `code.${fileExtension}`;
        const filenameFromH3 = getFilenameFromH3(codeBlock);
        if (filenameFromH3) {
            filename = filenameFromH3;
        }

        // Send a message to the background script to handle the download
        chrome.runtime.sendMessage({ action: 'download', filename: filename, text: codeText });
    });

    actionDiv.appendChild(downloadButton);
}

// Function to observe and handle dynamically added code blocks
function observeCodeBlocks() {
    const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            mutation.addedNodes.forEach((node) => {
                if (node.nodeType === 1 && node.classList.contains('md-code-block')) {
                    addDownloadButton(node);
                }
            });
        });
    });

    observer.observe(document.body, { childList: true, subtree: true });
}

// Initial setup: add download buttons to existing code blocks and start observing
document.querySelectorAll('.md-code-block').forEach(addDownloadButton);
observeCodeBlocks();