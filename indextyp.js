document.addEventListener('DOMContentLoaded', () => {
    function createTypingEffect(element, text, options = {}) {
        const {
            typingSpeed = 10,  // Speed of typing in milliseconds per character (faster)
            startDelay = 0,    // Delay before typing starts
            wordDelay = 0,     // Delay between each word (faster)
            onComplete = () => {} // Callback function when typing is complete
        } = options;

        const words = text.split(' ');
        let wordIndex = 0;
        element.innerText = '';

        function typeWord() {
            if (wordIndex < words.length) {
                let charIndex = 0;
                const currentWord = words[wordIndex];
                
                function typeCharacter() {
                    if (charIndex < currentWord.length) {
                        element.innerText += currentWord.charAt(charIndex);
                        charIndex++;
                        setTimeout(typeCharacter, typingSpeed);
                    } else {
                        element.innerText += ' '; // Add space after the word
                        wordIndex++;
                        setTimeout(typeWord, wordDelay); // Delay before typing the next word
                    }
                }

                typeCharacter();
            } else {
                onComplete();
            }
        }

        setTimeout(typeWord, startDelay);
    }

    function handleIntersection(entries, observer) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const element = entry.target;
                const text = element.getAttribute('data-text');
                const typingSpeed = parseInt(element.getAttribute('data-speed'), 10) || 10;
                const startDelay = parseInt(element.getAttribute('data-start-delay'), 10) || 0;
                const wordDelay = parseInt(element.getAttribute('data-word-delay'), 10) || 0;

                createTypingEffect(element, text, {
                    typingSpeed,
                    startDelay,
                    wordDelay,
                    onComplete: () => {
                        console.log(`${element.className} typing effect complete`);
                    }
                });

                observer.unobserve(element); // Stop observing after typing starts
            }
        });
    }

    const observer = new IntersectionObserver(handleIntersection, {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    });

    document.querySelectorAll('.typing').forEach(el => {
        const text = el.innerText.trim();
        el.setAttribute('data-text', text);
        el.setAttribute('data-speed', el.getAttribute('data-speed') || 10);
        el.setAttribute('data-start-delay', el.getAttribute('data-start-delay') || 0);
        el.setAttribute('data-word-delay', el.getAttribute('data-word-delay') || 0);
        el.innerText = ''; // Clear the text
        observer.observe(el); // Start observing the element
    });
});
