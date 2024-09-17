// ==UserScript==
// @name         File Generator Script
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  A userscript to generate a downloadable file
// @author       You
// @match        http://raser.io*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    // Function to generate and download a file
    function downloadFile(filename, content) {
        // Create a Blob object with the content
        const blob = new Blob([content], { type: 'text/plain' });

        // Create a temporary anchor element
        const link = document.createElement('a');

        // Create a downloadable URL from the Blob
        link.href = URL.createObjectURL(blob);

        // Set the download attribute to trigger the download
        link.download = filename;

        // Append the anchor to the document
        document.body.appendChild(link);

        // Trigger the download
        link.click();

        // Remove the anchor after the download
        document.body.removeChild(link);
    }

    // Example usage: download a text file with some content
    const filename = 'example.txt';
    const content = 'This is the content of the file.';

    // Call the function to download the file
    downloadFile(filename, content);
})();
