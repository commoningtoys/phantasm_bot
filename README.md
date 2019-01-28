# 👻 Phantasm Moderator Bot 🤖

For the coming [Transmediale](https://transmediale.de/) the "Thinking 💭 Toys 🧸" team will host a talk at Cafe Stage (📆 02. Feb. 2019 🕚 11:00 – 🕧 12:30)

### 👻 [Phantasms of Decentralization? Conversations about Commoning with Coming Media](https://2019.transmediale.de/content/phantasms-of-decentralization-conversations-about-commoning-with-coming-media-0)

> Commoning as a verb refers to  the joint action of negotiating, regulating, and conducting ways of  living together with the expectation of mutual care, aid, and benefit.  Commoning in the context of emerging alternative urban living projects  are mostly linked with sentiments of de-growth, offline-living, and a  general scepticism towards new technologies. While sympathizing with  such projects, this panel attempts to initiate a speculative  conversation about a more radical commoning using recent and forthcoming  information technologies. The conversation addresses the potential  entanglement of technologies with alternative forms of living together  from different scales and levels, such as networking (goods,  communication), decision making, predicting/modelling, automation driven  post-scarcity economies, tracking, and negotiating situated value. It  also looks at the affective and fantastic ingredients of commoning with  tech—such as the phantasms of decentralization.
>
> With: Viktor Bedö, Michaela Büsse, Yann Martins, Shintaro Miyazaki,  Selena Savic, John Evans (special guest), Cade Diehm (special guest)
>

## The Moderator Bot 🤖

The bot has the task to order the question following a decision tree 🌲:

```bash
 		       			INTRO
        		  		  /\
				________/ if \_________
 			economy				technology
 			politics			personal
 			technology			governance
 			personal			politics
   			   /\			           /\
 			 / if \		                 / if \
 	    communication	technology	politics	economy
            technology		governance	technology	governance
            technology		politics	politics	politics
 
```

_The names are representing the tags of the questions_

### how to change the questions

Assuming that you downloaded the bot and that you are running it locally:

* Locate the `data` folder 📂
* Open the file `data/phantasm_question.json` 
* Make your changes and save them
* Reload the web page paying attention to refresh also the cache

### how to change the speed

Go to the `js/question_bot.js` file and open it

 ```javascript
******************* CONST *******************/
const order = ['intro', 'mid', 'outro'];
const tags = ['politics', 'governance', 'technology', 'commoning', 'personal'];
const path = 'data/phantasm_question.json';

/**
* EDIT HERE TO CHANGE THE SPEED OF THE BOT
*/
const second = 10; <== this is the value that you need to change it is on line 9
/******************************************/

const minute = 60 * second;
const duration = 80;
 ```

You have to change the value of `second`: keep in mind that with value `1000` it will match exactly one second, with value `100` it will be 1/10 of a second.
