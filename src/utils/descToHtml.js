import { stripHtml } from "string-strip-html";

const descToHtml = (desc) => {
    const TAG_REGEX = /<\/?[^>]+(>|$)/g;

    let actualTextLength = 0;
    let result = '';
    let inTag = false;
    let inEntity = false;

    for (let i = 0; i < desc.length; i++) {
        const char = desc[i];

        if (char === '<') {
            inTag = true;
        } else if (char === '&') {
            inEntity = true;
        }

        if (!inTag && !inEntity) {
            actualTextLength++;
        }

        result += char;

        if (char === '>') {
            inTag = false;
        } else if (char === ';' && inEntity) {
            inEntity = false;
        }

        if (actualTextLength >= 60 && !inTag && !inEntity) {
            result += '...';
            break;
        }
    }

    // Ensure that any unclosed tags are properly closed
    let openTags = [];
    const tagMatch = result.match(TAG_REGEX);
    if (tagMatch) {
        tagMatch.forEach(tag => {
            if (tag.startsWith('</')) {
                openTags.pop();
            } else if (!tag.endsWith('/>')) {
                openTags.push(tag);
            }
        });

        while (openTags.length) {
            const openTag = openTags.pop();
            result += `</${openTag.match(/<(\w+)/)[1]}>`;
        }
    }

    return result;
};

export default descToHtml;