const menuBtn = document.getElementById('menu-btn');
const generateBtn = document.getElementById('generate-btn');
const nameInput = document.getElementById('name-input');
const resultsContainer = document.getElementById('results-container');
const toast = document.getElementById('toast');
const genderChipsContainer = document.getElementById('gender-chips');

const menuPage = document.getElementById('menu-page');
const backBtn = document.getElementById('back-btn');

menuBtn.addEventListener('click', () => menuPage.classList.add('show'));
backBtn.addEventListener('click', () => menuPage.classList.remove('show'));

function handleChipSelection(container) {
    container.addEventListener('click', (e) => {
        if (e.target.classList.contains('chip')) {
            container.querySelectorAll('.chip').forEach(chip => chip.classList.remove('active'));
            e.target.classList.add('active');
        }
    });
}
handleChipSelection(genderChipsContainer);

generateBtn.addEventListener('click', () => {
    const name = nameInput.value.trim().toLowerCase().replace(/ /g, '');
    if (!name) {
        alert('Please enter a name or keyword!');
        return;
    }
    const gender = genderChipsContainer.querySelector('.chip.active').dataset.vibe;
    
    generateBtn.disabled = true;
    generateBtn.textContent = 'Generating...';

    resultsContainer.innerHTML = '';
    setTimeout(() => {
        const usernames = mockAIGenerator(name, gender);
        displayUsernames(usernames);
        generateBtn.disabled = false;
        generateBtn.textContent = 'Generate!';
    }, 300);
});

function displayUsernames(usernames) {
    resultsContainer.innerHTML = '';
    const shuffled = usernames.sort(() => 0.5 - Math.random());
    const usernamesToShow = shuffled.slice(0, 12);

    usernamesToShow.forEach((username, index) => {
        const card = document.createElement('div');
        card.className = 'result-card';
        card.style.animationDelay = `${index * 30}ms`;
        card.innerHTML = `<span class="username">${username}</span><button class="copy-btn" data-username="${username}" aria-label="Copy username"><span class="material-symbols-rounded">content_copy</span></button>`;
        resultsContainer.appendChild(card);
    });
}

resultsContainer.addEventListener('click', (e) => {
    const copyBtn = e.target.closest('.copy-btn');
    if (copyBtn) navigator.clipboard.writeText(copyBtn.dataset.username).then(() => showToast('Copied!'));
});

function showToast(message) {
    toast.textContent = message;
    toast.classList.add('show');
    setTimeout(() => toast.classList.remove('show'), 2000);
}

document.body.addEventListener('click', function(e) {
    const button = e.target.closest('.chip, .generate-btn, .menu-btn, .back-btn, .copy-btn, .icon-link');
    if (button) {
        const circle = document.createElement("span");
        const diameter = Math.max(button.clientWidth, button.clientHeight);
        const radius = diameter / 2;
        
        const existingRipple = button.querySelector(".ripple");
        if (existingRipple) {
            existingRipple.remove();
        }

        circle.style.width = circle.style.height = `${diameter}px`;
        
        const rect = button.getBoundingClientRect();
        circle.style.left = `${e.clientX - rect.left - radius}px`;
        circle.style.top = `${e.clientY - rect.top - radius}px`;
        
        circle.classList.add("ripple");
        button.appendChild(circle);

        setTimeout(() => {
            if (circle.parentElement) {
                circle.remove();
            }
        }, 600);
    }
});

function mockAIGenerator(name, gender) {
    const results = new Set();
    const aestheticWords = ['luv', 'angel', 'honey', 'star', 'moon', 'coquette', 'c0quette', 'fairy', 'fa1ry', 'he4rt', 'dior', 'pretty', 'softie', 'hugs', 'kisses', 'dreamy'];

    const prefixes = {
        Girl: ['miss', 'thatgurl', 'softiee', 'ur.girl', 'im', 'only', 'urfav', 'just', 'hugsfor', 'reallil'],
        Boy: ['datboii', 'mr', 'its', 'im', 'not', 'juss', 'urfav', 'just', 'hugsfor', 'real'],
        'LGBTQIA+': ['they', 'our', 'urfav', 'they.luv', 'its'],
        Any: ['whos', 'defnot', 'simply', 'allabout', 'imyour', 'obsessedwith', 'gottalove', 'theycallme', 'theyknow', 'notur', 'imnot', 'wasnt', 'lookingfor', 'hidingfrom', 'ur', 'its', 'the', 'not', 'juss', 'only', 'urfav', 'is.it', 'earth.to', 'itsme', 'every1loves', 'urbae', 'sweet', 'hey', 'ily', 'just', 'simply', 'galleryof', 'callme', 'real']
    };

    const suffixes = ['core', 'drafts', 'spams', 'wuzhere', 'was_here', 'szn', 'diaries', '.com', '.jpg', 'wrld', 'irl', 'lmao', 'supremacy', '4you', 'forsure', 'notfound', 'online', '_', 'x', 'z', 'xo', 'ontop'];

    const templates = [
        'hidingfrom(name)', '(name)hasmyheart', 'crazy4(name)', '(name)isdr4fts',
        'totallynot(name)', '(name)luvsu', 'ilove(name)', 'allabout(name)',
        'secretlifeof(name)', 'sleepy(name)', 'another(name)', '(name)talking',
        '(name)archive', 'galleryof(name)', 'sincerely(name)', 'obsessedwith(name)',
        'gottalove(name)', 'theycallme(name)', '(name)yourbae', '(name)diary',
        'simpfor(name)', 'vibeswith(name)', 'not(name)', '(name)offside',
        'spamfrom(name)', 'lookingfor(name)', 'undercover(name)', 'dumpof(name)',
        'itssnot(name)', 'theyknow(name)', 'moreby(name)', 'prettylil(name)',
        'theyluv(name)', 'galaxy.(name)', 'hey.(name)', 'fvcks.(name)',
        'urluv.(name)', 'noturtype.(name)', 'imnot.(name)', 'wbu.(name)',
        'yk.(name)', 'dumb.(name)', 'madeby.(name)', 'whos.(name)', 'callme(name)',
        'is.it(name)', 'earth.to(name)', 'itsme(name)', 'every1loves(name)',
        'urbae(name)', 'sweet(name)', 'h34rtsfor(name)', 'www.(name).com',
        'luvss4(name)', '(name)wbu', '(name)dgaf', 'hugsfrom(name)', 'x(name)x', 'xx(name)xx'
    ];

    const leetMap = { a: '4', e: '3', o: '0', i: '1', s: '5', l: '1', t: '7' };
    const separators = ['.', '_', 'x'];

    const styleFunctions = {
        applyPrefix: (n) => (prefixes[gender] || prefixes['Any'])[Math.floor(Math.random() * (prefixes[gender] || prefixes['Any']).length)] + n,
        applySuffix: (n) => n + suffixes[Math.floor(Math.random() * suffixes.length)],
        applyTemplate: (n) => templates[Math.floor(Math.random() * templates.length)].replace(/\(name\)|\[name\]/g, n),
        applyLeet: (n) => n.split('').map(c => (leetMap[c] && Math.random() < 0.5) ? leetMap[c] : c).join(''),
        applySeparator: (n) => {
            if (n.length < 3 || n.includes('.') || n.includes('_')) return n;
            const sep = separators[Math.floor(Math.random() * separators.length)];
            const pos = Math.floor(Math.random() * (n.length - 2)) + 1;
            return n.slice(0, pos) + sep + n.slice(pos);
        },
        applyLetterRepeat: (n) => {
            if (n.length < 2) return n;
            const i = Math.floor(Math.random() * n.length);
            return n.slice(0, i + 1) + n[i] + n.slice(i + 1);
        },
        applyAestheticWord: (n) => {
            const word = aestheticWords[Math.floor(Math.random() * aestheticWords.length)];
            return Math.random() < 0.5 ? word + n : n + word;
        }
    };

    const baseStyles = [styleFunctions.applyTemplate, styleFunctions.applyPrefix, styleFunctions.applySuffix, styleFunctions.applyAestheticWord];
    const modifiers = [styleFunctions.applyLeet, styleFunctions.applySeparator, styleFunctions.applyLetterRepeat];

    while (results.size < 200) {
        let username = name;
        const baseStyle = baseStyles[Math.floor(Math.random() * baseStyles.length)];
        username = baseStyle(username);

        const numModifiers = Math.floor(Math.random() * 3);
        const shuffledModifiers = modifiers.sort(() => 0.5 - Math.random());
        for (let i = 0; i < numModifiers; i++) {
            username = shuffledModifiers[i](username);
        }

        username = username.toLowerCase().replace(/ /g, '').replace(/[._x]{2,}/g, m => m[0]);
        if (username.length > 2 && username.length < 24) {
            results.add(username);
        }
    }
    return Array.from(results);
}
