//Animacje
document.addEventListener('DOMContentLoaded', () => {
    const elements = Array.from(document.querySelectorAll('[data-typing]'));
    const lineElements = Array.from(document.querySelectorAll('[data-line-typing]'));
    const fullTexts = elements.map((element) => element.textContent.trim());

    for (const element of elements) {
        element.textContent = '';
    }

    for (const element of lineElements) {
        element.classList.add('line-typing');
    }

    const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

    const typeElement = (element, fullText, speed = 35) => {
        return new Promise((resolve) => {
            let charIndex = 0;

            const tick = () => {
                if (charIndex >= fullText.length) {
                    resolve();
                    return;
                }

                element.textContent += fullText[charIndex];
                charIndex++;
                setTimeout(tick, speed);
            };

            tick();
        });
    };

    const showLineElement = async (element, delay = 500) => {
        await sleep(delay);
        element.classList.add('is-visible');
    };

    (async () => {
        for (let index = 0; index < elements.length; index++) {
            await typeElement(elements[index], fullTexts[index]);
        }

        for (const lineElement of lineElements) {
            await showLineElement(lineElement);
        }
        await sleep(1000);
        if (window.location.pathname.endsWith('loading-anim.html')) {
            window.location.href = 'game.html';
        }
    })();
});
