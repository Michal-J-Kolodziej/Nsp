const conf = {
    offsetTime: 1000, //A number of miliseconds that u have to wait to scroll page again

    //Change 'true' to 'false' if u don't want one of these option of scrolling to be active
    canScrollWithKey: true,
    canScrollWithMouseWheel: true,
    canScrollWithDotClick: true,
    canScrollWithFingerSlide: true, //mobile

    animationEnabled: true, //If 'true' current section will always have .nsp-animation class so you can use to animate things in this particular section
}

class Section {
    constructor(section, index) {
        this.section = section;
        this.index = index;
        this.dataIndex;
    }

    toggleVisibility() {
        // Hide this section
        this.section.classList.toggle('nsp-hidden');

        Section.slideInto();
    }

    static slideInto() {
        //  If you are using nsp-container-slide this code manages the slide
        if (sections[currentSection].section.classList.contains('nsp-container-slide')) {
            sectionsNode[currentSection].scrollIntoView({
                behavior: 'smooth',
            });
        }
    }
}

let clicked = false;
let canBeDone = true;
let areThereDots;
let currentSection = 0;
let lastSection = 0;
let lastIndex = 0;
let targetDot = 0;



const sectionsNode = document.querySelectorAll('.nsp-container-stacked, .nsp-container-slide'); //collecting all sections from DOM
let sections = [...sectionsNode]; //changing array of node section objects to an array of js objects
const dotsNode = document.querySelectorAll('.nsp-dot'); //collecting all dots(website-navigation) from DOM
let dots = [...dotsNode]; //changing array of node dot objects to an array of js objects

// After refreshing page it automatically scrolls to top
window.onbeforeunload = function () {
    window.scrollTo(0, 0);
}

if (sections[0] === undefined || sections === undefined);
else {

    let zIndex = 50;

    for (let i = 0; i < sections.length; i++) {
        sections[i].style.zIndex = zIndex;
        sections[i].dataIndex = i;
        sections[i].dataset.nspIndex = i;
        zIndex--;
    }


    if (dots[0] === undefined || dots === undefined) areThereDots = false;
    else {
        areThereDots = true;
        dots[0].classList.add('nsp-active');
        dots.forEach((dot, index) => {
            dot.dataset.nspIndex = index;
        })
    }



    //transforming nodes array to array of objects of class Section
    sections = sections.map((section, index) => {
        const newSec = new Section(section, index);
        return newSec;
    });

    //function that is responsible for changing active dot
    const toggleDots = (dotToActive) => {
        if (!areThereDots) return;
        let dataIndex;
        //Clearing all dots
        dots.forEach(dot => {
            dot.classList.remove('nsp-active');
        });

        //Finding first not-hidden section
        dataIndex = sections.find(section => {
            if (!section.section.classList.contains('nsp-hidden')) return true;
        }).section.dataset.nspIndex;

        if (dotToActive != undefined) dataIndex = dotToActive;

        const currentDot = dots.filter((dot) => {
            if (dot.dataset.nspIndex == dataIndex) return true;
        });
        currentDot[0].classList.add('nsp-active');

        if (targetDot != currentSection && clicked) {
            if (targetDot > currentSection) {
                changeSection({ deltaY: 1 });
            }
            else if (targetDot < currentSection) {
                changeSection({ deltaY: -1 });
            }
        }


    }
    const resolveAfterSomeTime = () => {
        setTimeout(() => {
            canBeDone = true;
        }, conf.offsetTime);
    }


    // Function that manages changing sections
    const changeSection = (e) => {
        lastSection = currentSection;
        let changed = false;
        if (e.deltaY > 0) {
            //scrolling down
            if (currentSection < sections.length - 1) {
                lastIndex = currentSection;
                currentSection += 1;

                changed = true;
            }
        }
        else if (e.deltaY < 0) {
            //scrolling up
            if (currentSection > 0) {
                lastIndex = currentSection - 1;
                currentSection -= 1;

                changed = true;
            }
        }

        if (changed) {
            const section = sections.find((section) => {
                if (section.index === lastIndex)
                    return true;
            });
            section.toggleVisibility();
            if (!areThereDots) return;
            toggleDots();
            addAnimationClassToCurrentSection(); //toggling section to animate
        }
    }

    // This code handles dots's titles
    dotsNode.forEach(dot => {
        if (dot.dataset.nspTitle !== undefined && window.screen.width >= 1200) {
            const titleElem = document.createElement('div');
            titleElem.classList.add('nsp-dot-title');
            titleElem.innerText = `${dot.dataset.nspTitle}`;
            const dotPositon = dot.getBoundingClientRect();
            const dotsContainerPositon = dot.parentElement.getBoundingClientRect();

            titleElem.style.top = `${dotPositon.y - dotsContainerPositon.y}px`;
            if (dot.parentElement.classList.contains('nsp-dots-left')) {
                titleElem.style.left = `${dotPositon.x - dotsContainerPositon.x}px`;
            } else if (dot.parentElement.classList.contains('nsp-dots-right')) {
                titleElem.style.left = `${dotPositon.x - dotsContainerPositon.x - 20}px`;
            }


            let titleElements;

            dot.addEventListener('mouseover', () => {
                if (!dot.parentElement.contains(titleElem)) {
                    dot.parentElement.appendChild(titleElem);
                }
                titleElements = [...dot.parentElement.children].filter(child => {
                    if (child.classList.contains('nsp-dot-title')) return true;
                });

                titleElements.forEach(elem => {
                    if (elem.innerText === dot.dataset.nspTitle) {
                        elem.classList.add('active');
                        if (elem.parentElement.classList.contains('nsp-dots-right')) {
                            elem.style.left = `${dotPositon.x - dotsContainerPositon.x - (elem.clientWidth + 15)}px`;
                        } else if (elem.parentElement.classList.contains('nsp-dots-left')) {
                            elem.style.left = `${dotPositon.x - dotsContainerPositon.x + (dot.clientWidth + 15)}px`;
                        }
                    }
                });
            });

            dot.addEventListener('mouseout', () => {
                titleElements.forEach(elem => {
                    if (elem.innerText === dot.dataset.nspTitle) {
                        elem.classList.remove('active');
                        elem.style.left = `${dotPositon.x - dotsContainerPositon.x - 20}px`;
                    }
                });
            });

        }
    });


    //A part of code that handles scrolling the page by using 'finger slide' (mobile)
    if (conf.canScrollWithFingerSlide) {
        let touchClientYStart = 0;
        let touchClientYEnd = 0;

        const touchedStart = (e) => {
            touchClientYStart = e.changedTouches[0].clientY;
        }

        const touchedEnd = (e) => {
            touchClientYEnd = e.changedTouches[0].clientY;

            if (canBeDone) {
                if (touchClientYEnd < touchClientYStart && touchClientYStart - touchClientYEnd > 15) {
                    clicked = false;
                    const e = { deltaY: 1 };
                    changeSection(e);
                }
                else if (touchClientYEnd > touchClientYStart && touchClientYEnd - touchClientYStart > 15) {
                    clicked = false;
                    const e = { deltaY: -1 };
                    changeSection(e);
                }
                canBeDone = false;

                resolveAfterSomeTime();
            }
        }

        document.addEventListener('touchstart', touchedStart);
        document.addEventListener('touchend', touchedEnd);
    }

    //A part of code that handles scrolling the page by using mousewheel
    if (conf.canScrollWithMouseWheel) {
        const handleWheelEvent = (e) => {
            if (canBeDone) {
                clicked = false;
                changeSection(e);
                canBeDone = false;

                resolveAfterSomeTime();
            }
        }

        document.addEventListener('wheel', handleWheelEvent);
    }

    //A part of code that handles scrolling the page by pressing up or down arrow key
    if (conf.canScrollWithKey) {

        const handleKeyDownEvent = (e) => {
            let x;
            if (canBeDone) {
                if (e.keyCode === 38) {
                    clicked = false;
                    x = { deltaY: -1 };
                    changeSection(x);
                    canBeDone = false;
                    resolveAfterSomeTime();
                }
                else if (e.keyCode === 40) {
                    clicked = false;
                    x = { deltaY: 1 };
                    changeSection(x);
                    canBeDone = false;
                    resolveAfterSomeTime();
                }
            }
        }

        document.addEventListener('keydown', handleKeyDownEvent);
    }

    //Part of code that handles scrolling the page by clicking on dots
    if (conf.canScrollWithDotClick) {
        const handleDotClick = (e) => {
            if (canBeDone) {
                clicked = true;
                targetDot = e.target.dataset.nspIndex;
                toggleDots(targetDot);
                canBeDone = false;

                resolveAfterSomeTime()
            }
        }

        if (areThereDots) {
            dots.forEach(dot => {
                dot.addEventListener('click', handleDotClick);
                dot.addEventListener('touchstart', handleDotClick);
            });
        }
    }

    // ---------
    // Animation part
    // ---------
    const addAnimationClassToCurrentSection = () => {
        if (conf.animationEnabled) {
            sectionsNode.forEach(section => {
                section.classList.remove('nsp-animation');
            });
            const intervalIndex = setInterval(() => {
                // Detecting section to animate when using nsp-slide
                if (sections[0].section.classList.contains('nsp-container-slide')) {
                    if (sections[currentSection].section.getBoundingClientRect().y === 0) {
                        sections[currentSection].section.classList.add('nsp-animation');
                        clearInterval(intervalIndex);
                    }
                }
                // Detecting section to animate when using nsp-stacked
                if (sections[0].section.classList.contains('nsp-container-stacked')) {
                    if (currentSection === 0) {
                        if (sections[currentSection].section.getBoundingClientRect().y === 0) {
                            sections[currentSection].section.classList.add('nsp-animation');
                            clearInterval(intervalIndex);
                        }

                    } else if (sections[currentSection - 1].section.getBoundingClientRect().y + sections[currentSection - 1].section.offsetHeight === 0) {
                        if (lastSection > currentSection) {
                            if (sections[currentSection].section.getBoundingClientRect().y === 0) {
                                sections[currentSection].section.classList.add('nsp-animation');
                                clearInterval(intervalIndex);
                            }
                        } else {
                            sections[currentSection].section.classList.add('nsp-animation');
                            clearInterval(intervalIndex);
                        }
                    }
                }
            }, 50)
        }
    }
    addAnimationClassToCurrentSection();
}





// TODO:
// Stworzyć animacje na podstawie keyframes i nsp-animation
// Update readme (animacje)
// chowanie się kropek (np. pc - pojawiają się gdy user najedzie myszką na prawą część strony i przy każdej interakcji z kropakami (scroll itd) mobile - pojawiają się gdy user dotknie ekranu lub scrolluje [w sumie to też dotkniecie])


/*
    Problems:
    Edge:
        1. Nie wyświetlają się tytuły
        2. behavior: smooth nie działa
    Firefox:
        2. Animacja kropek w niektórych kółkach też jej odpierdala

*/