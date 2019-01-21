const conf = {
    offsetTime: 1000, //A number of miliseconds that u have to wait to scroll page again
}

class Section {
    constructor(section, index) {
        this.section = section;
        this.index = index;
        this.dataIndex = section.dataset.index;
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

    if (dots[0] === undefined || dots === undefined) areThereDots = false;
    else areThereDots = true;

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
        }).section.dataset.index;

        if (dotToActive != undefined) dataIndex = dotToActive;

        const currentDot = dots.filter(dot => {
            if (dot.dataset.index == dataIndex) return true;
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

    const handleWheelEvent = (e) => {
        if (canBeDone) {
            clicked = false;
            changeSection(e);
            canBeDone = false;

            resolveAfterSomeTime();
        }
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

    let touchClientYStart = 0;
    let touchClientYEnd = 0;

    const touchedStart = (e) => {
        touchClientYStart = e.changedTouches[0].clientY;
    }

    const touchedEnd = (e) => {
        touchClientYEnd = e.changedTouches[0].clientY;

        if (canBeDone) {
            if (touchClientYEnd < touchClientYStart && touchClientYStart - touchClientYEnd > 15) {
                const e = { deltaY: 1 };
                changeSection(e);
            }
            else if (touchClientYEnd > touchClientYStart && touchClientYEnd - touchClientYStart > 15) {
                const e = { deltaY: -1 };
                changeSection(e);
            }
            canBeDone = false;

            resolveAfterSomeTime();
        }
    }


    document.addEventListener('wheel', handleWheelEvent);
    document.addEventListener('touchstart', touchedStart);
    document.addEventListener('touchend', touchedEnd);

    const handleDotClick = (e) => {
        if (canBeDone === true) {
            clicked = true;
            targetDot = e.target.dataset.index;
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
