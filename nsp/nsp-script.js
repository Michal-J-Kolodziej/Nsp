const conf = {
    offsetTime: 1000, //A number of miliseconds that u have to wait to scroll page again

    //Change 'true' to 'false' if u don't want one of these option of scrolling to be active
    canScrollWithKey: true,
    canScrollWithMouseWheel: true,
    canScrollWithDotClick: true,
    canScrollWithFingerSlide: true, //mobile
}

class Section {
    constructor(section, index) {
        this.section = section;
        this.index = index;
        this.dataIndex;
    }

    toggleVisibility() {
        this.section.classList.toggle('nsp-hidden');
    }
}

let clicked = false;
let canBeDone = true;
let areThereDots;
let currentSection = 0;
let lastIndex = 0;
let targetDot = 0;



let sections = [...document.querySelectorAll('.nsp-container')]; //collecting all sections from DOM
let dots = [...document.querySelectorAll('.nsp-dot')]; //collecting all dots(website-navigation) from DOM

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
        }


    }

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
            console.log(canBeDone, e);
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
}


// TODO:
// Nowy sposób przewijania - zamiast mienia wszystkich sekcji w jednym miejscu i 'przesuwania' ich jedna po drugiej, cała strona    będzie się przewijać
// 
// 
