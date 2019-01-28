/******************* CONST *******************/
const order = ['intro', 'mid', 'outro'];
const tags = ['politics', 'governance', 'technology', 'commoning', 'personal'];
const path = 'data/phantasm_question.json';
const second = 1000;
const minute = 60 * second;
const duration = 80;
const time = {
    ms: 0,
    s: 0,
    min: 0
};
const question_text = document.querySelector('div#question b');
const question_tree = [];

const synth = window.speechSynthesis;
/******************* VARS *******************/
// let questions
let question_sequence;
let timer;
let intro = 20;
let mid = 40;
let outro = 20;
let section = order[0];
let bg_rot = 0;
let inc = 0.05;
let first_timer;
let second_timer;

/******************* UTILS *******************/
/**
 * @param {Array} arr
 * @return random element 
 */
function pick_question(arr) {
    // we should improve by taking in consideration the time left and the priority of the question
    console.log(arr);
    const random_index = Math.floor(Math.random() * arr.length);
    const result = arr[random_index];
    arr.splice(random_index, 1);
    console.log(arr);
    if (arr.length <= 0) return { question: 'no more questions 😭' };
    else return result;
}


function speak(speech_text) {
    const speech = new SpeechSynthesisUtterance(speech_text);
    speech.voice = synth.getVoices()[31];
    speech.rate = 0.1;
    speech.volume = 1;
    synth.speak(speech);
}

/**
 * 
 * @param {String} term
 * @returns url to a gif from the giphy library 
 */
function set_BG_gif(terms) {
    const panels = document.getElementsByClassName('panel');
    let i = 0;
    const rnd = Math.floor(Math.random() * panels.length);
    for (const el of panels) {
        if (i != rnd) {
            console.log(i, rnd)
            const random_idx = Math.floor(Math.random() * terms.length);
            const term = terms[random_idx];
            // console.log(term);
            const url = 'https://api.giphy.com/v1/gifs/random?api_key=WjDrZ8vA5Xh8Hrd6EjRaQSNP7y1mv3t4&tag=' + term + '&rating=R'
            const xhr = $.get(url);
            xhr.done(data => {
                // console.log("success got data", data)
                const img_url = data.data.image_original_url;//image_original_url //fixed_width_small_url
                // console.log(img_url)
                // here we set the background gif
                // const BG = $('#background');
                el.style.backgroundImage = 'url(' + img_url + ')';
                // BG.css('background-image', 'url(' + url + ')');
            })
        }else{
            el.style.backgroundImage = null;
            // el.style.backgroundColor = '#00f';
        }
        i++;
    }

}

set_BG_gif(['vaporwave']);

$.ajax({
    dataType: 'json',
    url: path,
    // data: data,
    success: success
})
function success(data) {
    // console.log(data);
    let questions = {};
    for (const term of order) {
        questions[term] = data.filter(result => {
            // console.log(result.order, term);
            if (result.order === term) {
                return result
            }
        })
    }
    // set first button
    console.log(questions);
    question_sequence = questions;
    const btn = document.createElement('div');
    btn.innerText = '🏇🏁⁉️';
    btn.setAttribute('class', 'btn')
    btn.setAttribute('id', 'remove-me');
    btn.addEventListener('click', init);
    const qst = document.getElementById('question');
    qst.insertBefore(btn, qst.firstChild);
    // next_question();
    // make_question_sequence(questions)
}

function init() {
    console.log('initialize');
    /**
     * start the timer here
     */
    setInterval(() => {
        // console.log('timer')

        time.s++;
        if (time.s >= 60) {
            time.s = 0;
            time.min++
        }
        const make_time = time.min + ':' + time.s;
        const dom_timer = document.getElementsByClassName('timer');
        for (const el of dom_timer) {
            el.innerText = make_time;
        }
        // document.getElementById('timer').innerText = make_time;

        // here we set wich part of the question should we look at
        if (time.min == intro) {
            console.log('switch to mid');
            section = 'mid';
        }
        if (time.min == intro + mid) {
            console.log('switch to outro');
            section = 'outro'
        }


        // here we update the question div bg
        const bg_style = 'background: linear-gradient(' + bg_rot + 'turn, #0ff, #ff0, #f0f);'
        document.getElementById('question').style = bg_style;
        bg_rot += inc;
        if (bg_rot >= 1) bg_rot = 0;
    }, second);
    /*********remove start button**********/
    const btn = document.getElementById('remove-me');
    const parent = document.getElementById('question');
    parent.removeChild(btn);
    const next_btn = document.createElement('div');
    next_btn.innerText = '⇥';
    next_btn.setAttribute('class', 'btn')
    next_btn.addEventListener('click', next_question);
    parent.appendChild(next_btn);
    /**************************************************/


    // question_text.innerText = question_sequence[section][0].question;
    // set_BG_gif(question_sequence[section][0].tags);
    // question_timer(question_sequence[section][0].duration);
    set_question(question_sequence[section][0])
    question_sequence[section].splice(0, 1);
}



function next_question() {
    console.log('next question!');
    const question = pick_question(question_sequence[section]);
    console.log(question);
    window.clearTimeout(first_timer);
    window.clearTimeout(second_timer);
    set_question(question);
}

function set_question(question) {
    question_text.innerText = question.question === 'undefined' ? question : question.question;
    console.log(question.keywords.split(' '));
    set_BG_gif(question.keywords.split(' '));
    question_timer(question.duration);
    speak(question.question);
}

function question_timer(minutes) {
    console.log(minutes * minute);
    /**
     * question timer
     */
    first_timer = window.setTimeout(() => {
        // play a melody
        console.log('first alert');

        speak('first alert');
    }, minutes * minute);


    second_timer = window.setTimeout(() => {
        // play a melody
        console.log('second alert');

        speak('second alert');

    }, (minutes + 5) * minute);
}