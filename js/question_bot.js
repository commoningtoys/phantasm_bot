/******************* CONST *******************/
const order = ['intro', 'mid', 'outro'];
const tags = ['politics', 'governance', 'technology', 'commoning', 'personal'];
const path = 'data/phantasm_question.json';

/**
 * EDIT HERE TO CHANGE THE SPEED OF THE BOT
 */
const second = 1000;
/******************************************/

const minute = 60 * second;
const duration = 80;
const time = {
    ms: 0,
    s: 0,
    min: 0
};
const question_text = document.querySelector('div#question b');

const synth = window.speechSynthesis;
/******************* VARS *******************/

let questions;
let timer;
let intro = 10;
let mid = 60;
let outro = 10;
let section = order[0];
let bg_rot = 0;
let inc = 0.05;
let first_timer;
let second_timer;
let type_index = 0;
let type_interval;
let question_sequence = [];
let question_idx = 0;
let prev_tag;
let curr_tag;
let initialized = false;
/******************* UTILS *******************/
/**
 * @param {Array} arr
 * @return random element 
 */
function pick_question(arr, tag) {
    // first we filter the array by the tag
    const filtered_arr = arr.filter(result => {
        if (result.tags === tag) return result;
    });
    // console.log(filtered_arr);
    const random_index = Math.floor(Math.random() * filtered_arr.length);
    const result = filtered_arr[random_index];
    // here we need to remove this element from the parent array
    let i = 0;
    for (const el of arr) {
        if (el.question === result.question) {
            arr.splice(i, 1);
        }
        i++;
    }
    // console.log(result);
    if (arr.length <= 0) return { question: 'no more questions 😭' };
    else return result;
}

function pick_random_question() {
    const random_idx = Math.floor(Math.random() * questions['mid'].length);
    const result = questions['mid'][random_idx];
    questions['mid'].splice(random_idx, 1);
    return result;
}

function make_question_sequence(questions) {
    const result = []
    // first element is the intro
    result.push(questions['intro'][0]);
    // here we feed the mid section
    let first_branch = [];
    let second_branch = [];
    let outro_tag = '';
    const branch_economy = ['politics', 'technology', 'personal'];
    const branch_tech = ['personal', 'governance', 'politics'];
    const prob1 = Math.random() * 100;
    if (prob1 < 50) {
        result.push(pick_question(questions['mid'], 'economy'));
        first_branch = branch_economy;
        const prob2 = Math.random() * 100;
        if (prob2 < 50) {
            second_branch = ['politics', 'technology'];
            outro_tag = 'technology'
        } else {
            second_branch = ['economy', 'governance'];
            outro_tag = 'technology'
        }
    } else {
        result.push(pick_question(questions['mid'], 'technology'));
        first_branch = branch_tech;
        const prob2 = Math.random() * 100;
        if (prob2 < 50) {
            second_branch = ['communication', 'technology'];
            outro_tag = 'technology'
        } else {
            second_branch = ['technology', 'governance'];
            outro_tag = 'politics'
        }
    }
    // here we add the three question according to the first_branch
    for (const term of first_branch) {
        result.push(pick_question(questions['mid'], term));
    }
    for (const term of second_branch) {
        result.push(pick_question(questions['mid'], term));
    }
    result.push(pick_question(questions['outro'], outro_tag));
    // console.log(result);
    // while(result.length < 7){

    // }
    return result;
}

function speak(speech_text) {
    // first we check wether the argument is text or an object
    // if it is an object than we use the inner text of the question
    let sp_text = speech_text;
    if (typeof speech_text === 'object') {
        sp_text = question_text.innerText;
    }
    const speech = new SpeechSynthesisUtterance(sp_text);

    const cool_voices_names = ['Bells', 'Bad News', 'Cellos', 'Good News', 'Pipe Organ', 'Trinoids', 'Zarvox']
    const voices_list = synth.getVoices().filter(result =>{
        for (const voice of cool_voices_names) {
            if(result.name === voice)return result;
        }
        // if(result.lang.includes('en'))return result
    });
    const random_idx = Math.floor(Math.random() * voices_list.length);
    const voice = voices_list[random_idx];
    speech.voice = voice;
    // speech.rate = 0.1;
    speech.volume = 1;
    synth.speak(speech);
}

/**
 * stes a gif on the wall of the cube but only on 4 out of 5 leaving one wall empty
 * @param {String} term
 * @returns url to a gif from the giphy library 
 */
function set_BG_gif(terms) {
    const panels = document.getElementsByClassName('gif-container');
    let i = 0;
    const rnd = 4;
    for (const el of panels) {
        if (i != rnd) {
            // console.log(i, rnd)
            const random_idx = Math.floor(Math.random() * terms.length);
            const term = terms[random_idx];
            // console.log(term);
            const url = 'https://api.giphy.com/v1/gifs/random?api_key=WjDrZ8vA5Xh8Hrd6EjRaQSNP7y1mv3t4&tag=' + term + '&rating=R'
            const xhr = $.get(url);
            xhr.done(data => {
                // console.log("success got data", data)
                const img_url = data.data.image_original_url;//fixed_width_small_url;//image_original_url //fixed_width_small_url
                // console.log(img_url)
                // here we set the background gif
                // const BG = $('#background');
                el.style.backgroundImage = 'url(' + img_url + ')';
                // BG.css('background-image', 'url(' + url + ')');
            })
        } else {
            el.style.backgroundImage = null;
            // el.style.backgroundColor = '#00f';
        }
        i++;
    }

}
// what we do with the JSON
function readJSON(data) {
    // console.log(data);

    // here we filter the questions from the array
    // and we make an array that divides the
    // questions by their order: intro|mid|outro
    questions = {};
    for (const term of order) {
        questions[term] = data.filter(result => {
            // console.log(result.order, term);
            if (result.order === term) {
                return result
            }
        })
    }
    // console.log(questions);
    question_sequence = make_question_sequence(questions);
    // console.log(question_sequence);
    // set first button
    const btn = document.createElement('div');
    btn.innerText = '👻🏁⁉️';
    btn.setAttribute('class', 'btn')
    btn.setAttribute('id', 'remove-me');
    btn.addEventListener('click', init);
    const qst = document.getElementById('question');
    qst.insertBefore(btn, qst.firstChild);
    // next_question();
    // make_question_sequence(questions)
}
/**
 * initialize the phantasm bot
 */
function init() {
    initialized = true;
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
    }, second);
    /*********remove start button
     * add two other buttons
     * speak and next button**********/
    const parent = document.getElementById('question');
    const btn = document.getElementById('remove-me');
    parent.removeChild(btn);
    const next_btn = document.createElement('div');
    next_btn.innerText = '⇥';
    next_btn.setAttribute('class', 'btn')
    next_btn.addEventListener('click', next_question);
    parent.appendChild(next_btn);

    const speak_btn = document.createElement('div');
    speak_btn.innerText = '🗣';
    speak_btn.setAttribute('class', 'btn')
    speak_btn.addEventListener('click', speak);
    parent.appendChild(speak_btn);
    /**************************************************/


    // question_text.innerText = questions[section][0].question;
    // set_BG_gif(questions[section][0].tags);
    // question_timer(questions[section][0].duration);
    // set_question(question_sequence[question_idx]);
    next_question();
    // questions[section].splice(0, 1);
}
/**
 * goes to the next questions
 */
function next_question() {
    // console.log('next question!');
    let question;
    if (question_idx >= question_sequence.length) {
        question = pick_random_question();
    } else {
        question = question_sequence[question_idx];
    }
    question_idx++;
    // console.log(question);
    window.clearTimeout(first_timer);
    window.clearTimeout(second_timer);
    set_question(question);

}
/**
 * sets the question in the question box
 * @param {Object} question 
 */
function set_question(question) {
    // question_text.innerText = question.question === 'undefined' ? question : question.question;
    // console.log(question.keywords.split(' '));
    // here we update the question div bg
    bg_rot = Math.random();
    const bg_style = 'background: linear-gradient(' + bg_rot + 'turn,' + css_rgba_random_color() + ',' + css_rgba_random_color() + ',' + css_rgba_random_color() + ');'
    // console.log(bg_style);
    document.getElementById('question').style = bg_style;
    if (bg_rot >= 1) bg_rot = 0;
    set_BG_gif(question.keywords.split(' '));
    question_timer(question.duration);
    // speak(question.question);
    type_question(question.question);
}
/**
 * sets an alarm that reminds the speaker that 10 minutes have passed
 * @param {Number} minutes an integer representing the minutes
 */
function question_timer(minutes) {
    // console.log(minutes * minute);
    /**
     * question timer
     */
    first_timer = window.setTimeout(() => {
        // play a melody
        console.log('first alert');

        speak(minutes + 'minutes have passed');
    }, minutes * minute);


    second_timer = window.setTimeout(() => {
        // play a melody
        console.log('second alert');

        speak((minutes + 5) + 'minutes have passed');
        next_question();
    }, (minutes + 5) * minute);
}
/**
 * types a sententence in the question box
 * @param {String} term a sentence to be typed as a typewriter
 */
function type_question(term) {
    clearInterval(type_interval);
    const char_array = term.split('');
    type_index = 0;
    question_text.innerText = '';
    type_interval = setInterval(() => {
        const c = char_array[type_index];
        if (c == ' ') question_text.innerHTML += '&nbsp;';
        question_text.innerText += c;
        type_index++;
        if (type_index >= term.length) clearInterval(type_interval);
    }, 50)
}
/**
 * @returns a String containing a random rgba color 
 */
function css_rgba_random_color() {
    const r = Math.floor(Math.random() * 256);
    const g = Math.floor(Math.random() * 256);
    const b = Math.floor(Math.random() * 256);
    const a = 0.75;
    return 'rgba(' + r + ',' + g + ',' + b + ',' + a + ')'
}




set_BG_gif(['vaporwave']);

// get the json from local file
$.ajax({
    dataType: 'json',
    url: path,
    // data: data,
    success: readJSON
})

window.addEventListener('keypress', (event)=>{
    if(event.key === ' ' && initialized){
        next_question();
    }
})