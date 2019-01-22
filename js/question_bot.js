/******************* CONST *******************/
const order = ['intro', 'mid', 'outro'];
const tags = ['politics', 'governance', 'technology', 'commoning', 'personal'];
const path = 'data/phantasm_question.json';
/******************* VARS *******************/
let questions
/******************* UTILS *******************/
/**
 * @param {Array} arr
 * @return random element 
 */
function pick_random(arr) {
    const random_index = Math.floor(Math.random() * arr.length);
    return arr[random_index];
}


$.ajax({
    dataType: 'json',
    url: path,
    // data: data,
    success: success
})

function success(data){
    // console.log(data);
    let questions = {};
    for (const term of order) {
        questions[term] = data.filter(result => {
            // console.log(result.order, term);
            if(result.order === term){
                console.log('true');
                return result
            }
        })
    }
    console.log(questions);

    make_question_sequence(questions)    
}

function make_question_sequence(questions){
    
}