//Animacje
document.addEventListener('DOMContentLoaded', () => {
    const audio = new Audio('assets/typing.wav');
    audio.volume = 0.2;
    audio.playbackRate=1.5;
    audio.loop = true;
    const startAudio = () => {
        audio.play().catch(() => {});
        window.removeEventListener('pointerdown', startAudio);
        window.removeEventListener('keydown', startAudio);
        window.removeEventListener('touchstart', startAudio);
    };
    window.addEventListener('pointerdown', startAudio);
    window.addEventListener('keydown', startAudio);
    window.addEventListener('touchstart', startAudio);
    const elements = Array.from(document.querySelectorAll('[data-typing]'));

    const fullTexts = elements.map((element) => element.textContent.trim());

    for (const element of elements) {
        element.textContent = '';
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

    

    (async () => {
        for (let index = 0; index < elements.length; index++) {
            await typeElement(elements[index], fullTexts[index]);
        }
        audio.pause();
        await sleep(1000);
        if (window.location.pathname.endsWith('loading-anim.html')) {
            window.location.href = 'game.html';
        }
    })();
});
