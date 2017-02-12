//==========================================================================//
// Seahorse Alvis conversation channel https://alvis.io                     //
// Azure dev.botframework.com Nodejs version for multiple channels          //
// Simple scenario - Team Seahorse #dbh17 Groningen  10 11 12 februari      //
//==========================================================================//

var restify         = require('restify');
var builder         = require('botbuilder');
var fs              = require('fs');
var XMLHttpRequest  = require('xmlhttprequest').XMLHttpRequest;
var QrCode          = require('qrcode-reader');
var request         = require('request').defaults({ encoding: null });
var querystring     = require('querystring');
var async           = require('async');

// Create bytestring in base 64 for reading and usig the QR functionality
function byteString(url) {
  request.get(url, function (error, response, body) {
      if (!error && response.statusCode == 200) {
          data = "data:" + response.headers["content-type"] + ";base64," + new Buffer(body).toString('base64');
      }
})};

// New qr code object
var qrcode = new QrCode();

// New base 64 obejct
function base64(file, callback){
  var coolFile = {};
  function readerOnload(e){
    var base64 = btoa(e.target.result);
    coolFile.base64 = base64;
    callback(coolFile)
  };

  var reader = new FileReader();
  reader.onload = readerOnload;

  var file = file[0].files[0];
  coolFile.filetype = file.type;
  coolFile.size = file.size;
  coolFile.filename = file.name;
  reader.readAsBinaryString(file);
}

// Decode the actual image into readable string
function decodeImageFromBase64(data, callback){
  // set callback
  qrcode.callback = callback;
  // Start decoding
  qrcode.decode(data)
}

// Create simple get request
function httpGet(theUrl) {
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.open( "GET", theUrl, false ); // false for synchronous request
    xmlHttp.send( null );
    console.log(xmlHttp.responseText)
    return xmlHttp.responseText;
}

// Setup Restify Server
var server = restify.createServer();
server.listen(process.env.port || process.env.PORT || 3979, function () {
   console.log('%s listening to %s', server.name, server.url);
});

Array.prototype.randomElement = function () {
    return this[Math.floor(Math.random() * this.length)]
}

// Create chat bot and add azure credentials
var connector = new builder.ChatConnector({
  appId: 'xxxx-xx-xxxx-xx-xxx',
  appPassword: 'xxx'
});

var bot = new builder.UniversalBot(connector);
server.post('/api/messages', connector.listen());

//=========================================================
// Bots Middleware
//=========================================================
var request = require('request');
function sendThis(api_url) {
  var r = request(api_url, function (error, response, body) {
  if (!error && response.statusCode == 200) {
    return response.text // Show the HTML for the Google homepage.
  }
  });
};

// Sleep function to make the waiting balloon get tailor made for the text displayed
function sleep(ms)
{
    return(new Promise(function(resolve, reject) {
        setTimeout(function() { resolve(); }, ms);
    }));
}

// Anytime the major version is incremented any existing conversations will be restarted.
bot.use(builder.Middleware.dialogVersion({ version: 1.0, resetCommand: /^reset/i }));

//=========================================================
// Bots Global Actions
//=========================================================
Array.prototype.contains = function(element){
    return this.indexOf(element) > -1;
};

//=====================================================================//
// quick reply in reaction to Help subjects                            //
//=====================================================================//
function helpButton (session) {
  let replyMessage = new builder.Message(session)
  .text('We have divided our help subjects into the next choices.')
  .sourceEvent({
     facebook: {
         quick_replies: [{
             content_type:"text",
             title:'Seahorse.',
             payload:"Seahorse.",
             image_url:"https://alvis.io/images/blue_oval_2.png"
         },
         {
             content_type:"text",
             title:'Privacy',
             payload:"Privacy",
             image_url:"https://alvis.io/images/blue_oval_3.png"
         },
         {
             content_type:"text",
             title:'GDPR',
             payload:"GDPR",
             image_url:"https://alvis.io/images/blue_oval_4.png"
         },
         {
             content_type:"text",
             title:'Security',
             payload:"Security",
             image_url:"https://alvis.io/images/blue_oval_2.png"
         },
         {
             content_type:"text",
             title:'Decentralized',
             payload:"Decentralized",
             image_url:"https://alvis.io/images/blue_oval_3.png"
         },
         {
             content_type:"text",
             title:'Personal data',
             payload:"Personal data",
             image_url:"https://alvis.io/images/blue_oval_4.png"
         },
         {
             content_type:"text",
             title:'Blockchain',
             payload:"Blockchain",
             image_url:"https://alvis.io/images/blue_oval_2.png"
         },
         {
             content_type:"text",
             title:'The process',
             payload:"The process",
             image_url:"https://alvis.io/images/blue_oval_2.png"
         }]
     }
  });
  console.log(replyMessage)
  return replyMessage;
}

//=====================================================================//
// quick reply when been asked about data policy                       //
//=====================================================================//
function quickReplyFirstTime(session) {
  let replyMessage = new builder.Message(session)
  .text('Hi there, do you want to enter your data policy? \n\nIt is part of the EU Data Protection regulation that will be active in 2018. \n\nOr perhaps you want to read more about this subject?')
  .sourceEvent({
     facebook: {
         quick_replies: [{
             content_type:"text",
             title:'Enter data policy',
             payload:"Enter data policy",
             image_url:"https://alvis.io/images/blue_oval_2.png"
         },
         {
             content_type:"text",
             title:'Information',
             payload:"Information",
             image_url:"https://alvis.io/images/blue_oval_4.png"
         }]
     }
  });
  console.log(replyMessage)
  return replyMessage;
}

//=====================================================================//
// quick reply in reaction on the first question                       //
//=====================================================================//
function quickReplyDefault(session) {
  let replyMessage = new builder.Message(session)
  .text('Do you want to store a personal data setting: Right to be forgotten (RTBF)?')
  .sourceEvent({
     facebook: {
         quick_replies: [{
             content_type:"text",
             title:'Yes',
             payload:"Yes",
             image_url:"https://alvis.io/images/blue_oval_2.png"
         },
         {
             content_type:"text",
             title:'No',
             payload:"No",
             image_url:"https://alvis.io/images/blue_oval_3.png"
         },
         {
             content_type:"text",
             title:'Explain this',
             payload:"Explain this",
             image_url:"https://alvis.io/images/blue_oval_4.png"
         }]
     }
  });
  console.log(replyMessage)
  return replyMessage;
}

//=====================================================================//
// quick reply in reaction on the answer No in first question          //
//=====================================================================//
function quickReplyNo(session) {
  let replyMessage = new builder.Message(session)
  replyMessage.text('Do you want to quit?')
  replyMessage.sourceEvent({
     facebook: {
         quick_replies: [{
             content_type:"text",
             title:'Quit',
             payload:"Quit",
             image_url:"https://alvis.io/images/blue_oval_2.png"
         },
         {
             content_type:"text",
             title:'Help',
             payload:"Help",
             image_url:"https://alvis.io/images/blue_oval_3.png"
         },
         {
             content_type:"text",
             title:'Explanation',
             payload:"Explanation",
             image_url:"https://alvis.io/images/blue_oval_4.png"
         }]
     }
  });
  return replyMessage;
}

//=====================================================================//
// quick reply in reaction on the answer No in first question          //
//=====================================================================//
function quickReplyYes(session) {
  let replyMessage = new builder.Message(session)
  replyMessage.text('I will now forward you towards the identification (digital passport) process.')
  replyMessage.sourceEvent({
     facebook: {
         quick_replies: [{
             content_type:"text",
             title:'Start identification',
             payload:'Start identification',
             image_url:'https://alvis.io/images/blue_oval_2.png'
         },
         {
             content_type:"text",
             title:'Digital passport?',
             payload:"Digital passport?",
             image_url:"https://alvis.io/images/blue_oval_3.png"
         }]
     }
  });
  return replyMessage;
}

//=====================================================================//
// quick reply in reaction on the answer No in first question          //
//=====================================================================//
function quickReplyExplain(session) {
  let replyMessage = new builder.Message(session)
  replyMessage.text('Seahorse is giving back your control over your own personal data.')
  replyMessage.sourceEvent({
     facebook: {
         quick_replies: [{
             content_type:"text",
             title:'How',
             payload:'How',
             image_url:'https://alvis.io/images/blue_oval_2.png'
         },
         {
             content_type:"text",
             title:'Why',
             payload:"Why",
             image_url:"https://alvis.io/images/blue_oval_3.png"
         },
         {
             content_type:"text",
             title:'Process',
             payload:"Process",
             image_url:"https://alvis.io/images/blue_oval_4.png"
         },
         {
             content_type:"text",
             title:'RTBF',
             payload:"RTBF",
             image_url:"https://alvis.io/images/blue_oval_2.png"
         }]
     }
  });
  return replyMessage;
}

//=====================================================================//
// quick reply in reaction on the answer How in first question          //
//=====================================================================//
function quickReplyHow(session) {
  let replyMessage = new builder.Message(session)
  replyMessage.text('Seahorse is using the blockchain to store permissions and control regarding personal data settings. This prototype has the focus on the right to be forgotten setting.')
  replyMessage.sourceEvent({
     facebook: {
       quick_replies: [{
           content_type:"text",
           title:'Why',
           payload:"Why",
           image_url:"https://alvis.io/images/blue_oval_3.png"
       },
       {
           content_type:"text",
           title:'Process',
           payload:"Process",
           image_url:"https://alvis.io/images/blue_oval_4.png"
       }]
     }
  });
  return replyMessage;
}

//=====================================================================//
// quick reply in reaction on the answer Why in first question          //
//=====================================================================//
function quickReplyWhy(session) {
  let replyMessage = new builder.Message(session)
  replyMessage.text('There is no current service that faciliates a secure and simple way to control personal data.\n\nThe EU data protection regulations that will be supporting all EU citizens in 2018.')
  replyMessage.sourceEvent({
     facebook: {
       quick_replies: [{
           content_type:"text",
           title:'How',
           payload:'How',
           image_url:'https://alvis.io/images/blue_oval_2.png'
       },
       {
           content_type:"text",
           title:'Process',
           payload:"Process",
           image_url:"https://alvis.io/images/blue_oval_3.png"
       }]
     }
  });
  return replyMessage;
}

//=====================================================================//
// quick reply in reaction on the answer Process in first question     //
//=====================================================================//
function quickReplyProcess(session) {
  let replyMessage = new builder.Message(session)
  replyMessage.text('1. Get identified with passport\n\n2. Store, update or view setting (right to be forgotten)\n\n3. Confirmation')
  replyMessage.sourceEvent({
     facebook: {
       quick_replies: [{
           content_type:"text",
           title:'How',
           payload:'How',
           image_url:'https://alvis.io/images/blue_oval_2.png'
       },
       {
           content_type:"text",
           title:'Why',
           payload:"Why",
           image_url:"https://alvis.io/images/blue_oval_3.png"
       },
       {
           content_type:"text",
           title:'Start',
           payload:"Start",
           image_url:"https://alvis.io/images/blue_oval_4.png"
       }]
     }
  });
  return replyMessage;
}

//=====================================================================//
// quick reply in reaction on the answer RTBF in first question     //
//=====================================================================//
function quickReplyRTBF(session) {
  console.log(session);
  var replyMessage = new builder.Message(session);
  replyMessage.text('Do you want to continue?');

  replyMessage.sourceEvent({
     facebook: {
         quick_replies: [{
             content_type:'text',
             title:'Start',
             payload:'Start',
             image_url:'https://alvis.io/images/blue_oval_2.png'
         },
         {
             content_type:"text",
             title:'Help',
             payload:'Help',
             image_url:'https://alvis.io/images/blue_oval_3.png'
         },
         {
             content_type:"text",
             title:'Quit',
             payload:'Quit',
             image_url:'https://alvis.io/images/blue_oval_4.png'
         }]
     }
  });
  console.log(replyMessage)
  return replyMessage;
}

function quickReply(session) {
  let replyMessage = new builder.Message(session)
  .text('Do you want to configure the right to be forgotten?')
  .sourceEvent({
     facebook: {
         quick_replies: [{
             content_type:"text",
             title:'Yes I do',
             payload:"Yes I do",
             image_url:"https://alvis.io/images/blue_oval_2.png"
         },
         {
             content_type:"text",
             title:'No',
             payload:"No",
             image_url:"https://alvis.io/images/blue_oval_3.png"
         },
         {
             content_type:"text",
             title:'Explain this please',
             payload:"Explain this please",
             image_url:'https://alvis.io/images/blue_oval_4.png'
         }]
     }
  });
  console.log(replyMessage)
  return replyMessage;
}

function quickReplyA(session) {
  let replyMessage = new builder.Message(session)
  .text('Get back in control ;) Do you want start storing a personal data setting or prefer to read about one specific setting: the right to be forgotten setting (RTBF)?')
  .sourceEvent({
     facebook: {
         quick_replies: [{
             content_type:'text',
             title:'Start',
             payload:'Start',
             image_url:"https://alvis.io/images/blue_oval_2.png"
         },
         {
             content_type:'text',
             title:'RTBF',
             payload:'RTBF',
             image_url:'https://alvis.io/images/blue_oval_4.png'
         }]
     }
  });
  return replyMessage;
}

function quickReplyB(session) {
  console.log(session);
  var replyMessage = new builder.Message(session);
  replyMessage.text('Do you want to continue?');

  replyMessage.sourceEvent({
     facebook: {
         quick_replies: [{
             content_type:'text',
             title:'Enter data policy',
             payload:'Enter data policy',
             image_url:'https://alvis.io/images/blue_oval_2.png'
         },
         {
             content_type:"text",
             title:'Information',
             payload:'Information',
             image_url:'https://alvis.io/images/blue_oval_4.png'
         }]
     }
  });
  console.log(replyMessage)
  return replyMessage;
}

function quickReplyC(session) {
  let replyMessage = new builder.Message(session)
  .text('Do you want to continue?')
  .sourceEvent({
     facebook: {
         quick_replies: [{
             content_type:"text",
             title:'Yes I do',
             payload:"Yes I do",
             image_url:"https://alvis.io/images/blue_oval_2.png"
         },
         {
             content_type:"text",
             title:'No thanks',
             payload:"No thanks",
             image_url:"https://alvis.io/images/blue_oval_4.png"
         }]
     }
  });
  return replyMessage;
}

function quickReplyD(session) {
  let replyMessage = new builder.Message(session)
  .text('How do you want to get identified?')
  .sourceEvent({
     facebook: {
         quick_replies: [{
             content_type:"text",
             title:'Send QR code',
             payload:"Send QR code",
             image_url:"https://alvis.io/images/blue_oval_2.png"
         },
         {
             content_type:"text",
             title:'Enter Hash',
             payload:"Enter Hash",
             image_url:"https://alvis.io/images/blue_oval_3.png"
         },
         {
             content_type:"text",
             title:'What is this?',
             payload:"What is this?",
             image_url:'https://alvis.io/images/blue_oval_4.png'
         }]
     }
  });
  return replyMessage;
}

function quickReplyE(session) {
  let replyMessage = new builder.Message(session)
  replyMessage.text('Do you want to quit?')
  replyMessage.sourceEvent({
     facebook: {
         quick_replies: [{
             content_type:"text",
             title:'Quit',
             payload:"Quit",
             image_url:"https://alvis.io/images/blue_oval_2.png"
         },
         {
             content_type:"text",
             title:'No please continue',
             payload:"No please continue",
             image_url:"https://alvis.io/images/blue_oval_4.png"
         }]
     }
  });
  return replyMessage;
}

//=====================================================================//
// quick reply in reaction on the answer No in first question          //
//=====================================================================//
function quickReplyF(session) {
  let replyMessage = new builder.Message(session)
  replyMessage.text('Do you want to have more information on Seahorse or about the General Data Protection Regulations (GDPR)?')
  replyMessage.sourceEvent({
     facebook: {
         quick_replies: [{
             content_type:"text",
             title:'Seahorse.',
             payload:"Seahorse.",
             image_url:"https://alvis.io/images/blue_oval_2.png"
         },
         {
             content_type:"text",
             title:'GDPR',
             payload:"GDPR",
             image_url:"https://alvis.io/images/blue_oval_4.png"
         }]
     }
  });
  return replyMessage;
}

//=====================================================================//
// quick reply in reaction on the answer to get more info on seahorse. //
//=====================================================================//
function quickReplyG(session) {
  let replyMessage = new builder.Message(session)
  replyMessage.text('Seahorse = trust + control over personal data settings')
  replyMessage.sourceEvent({
     facebook: {
         quick_replies: [{
             content_type:"text",
             title:'start',
             payload:"start",
             image_url:"https://alvis.io/images/blue_oval_2.png"
         },
         {
             content_type:"text",
             title:'help',
             payload:"help",
             image_url:"https://alvis.io/images/blue_oval_4.png"
         }]
     }
  });
  return replyMessage;
}

//=====================================================================//
// quick reply in reaction on the first question with answer Yes       //
//=====================================================================//
function quickReplyH(session) {
  let replyMessage = new builder.Message(session)
  replyMessage.text('I will now forward you towards the identification (digital passport) process.')
  replyMessage.sourceEvent({
     facebook: {
         quick_replies: [{
             content_type:"text",
             title:'Start identification',
             payload:'Start identification',
             image_url:'https://alvis.io/images/blue_oval_2.png'
         },
         {
             content_type:"text",
             title:'Digital passport?',
             payload:"Digital passport?",
             image_url:"https://alvis.io/images/blue_oval_4.png"
         }]
     }
  });
  return replyMessage;
}

//=====================================================================//
// quick reply in reaction on the first question with answer Yes       //
//=====================================================================//
function quickReplyI(session) {
  let replyMessage = new builder.Message(session)
  replyMessage.text('uPort: a self-sovereign identity system that allows people to own their identity, fully control the flow of their personal information, and authenticate themselves in various contexts.')
  replyMessage.sourceEvent({
     facebook: {
         quick_replies: [{
             content_type:"text",
             title:'Start identification',
             payload:"Start identification",
             image_url:"https://alvis.io/images/blue_oval_2.png"
         },
         {
             content_type:"text",
             title:'Clarify process',
             payload:"Clarify process",
             image_url:"https://alvis.io/images/blue_oval_4.png"
         },
         {
             content_type:"text",
             title:'Sign up at uPort',
             payload:"Sign up at uPort",
             image_url:"https://alvis.io/images/blue_oval_3.png"
         }]
     }
  });
  return replyMessage;
}

function quickReplyDataControl(session) {
  let replyMessage = new builder.Message(session)
  replyMessage.text('Example: What is the impact of having "Right to be Forgotten" setting stored regarding ')
  replyMessage.sourceEvent({
     facebook: {
         quick_replies: [{
             content_type:"text",
             title:'Google',
             payload:'Google'
         },
         {
             content_type:"text",
             title:'Facebook',
             payload:"Facebook"
         },
         {
             content_type:"text",
             title:'Apple',
             payload:"Apple"
         },
         {
             content_type:"text",
             title:'Amazon',
             payload:"Amazon"
         },
         {
             content_type:"text",
             title:'Telegraaf',
             payload:"Telegraaf"
         },
         {
             content_type:"text",
             title:'Explain this please',
             payload:"Explain this please"
         }]
     }
  });
  console.log(replyMessage);
  return replyMessage;
}

//=====================================================================//
// open the link towards seahorse rtbf prototype                       //
//=====================================================================//
function sendSeahorseCTA(session) {
  //session.send('After identification you are able to store your personal data setting.');
  var msg = new builder.Message(session).attachments([
    new builder.ThumbnailCard(session)
    .title('Identify yourself')
    .subtitle('After identification you are able to store your personal data setting.')
    .images([
      builder.CardImage.create(session, 'http://seahorse.alvis.io/files/seahorse_id.png')
    ])
    //.tap(builder.CardAction.openUrl(session, 'http://146.185.167.177:3000'))
    .tap(builder.CardAction.openUrl(session, 'http://localhost:4200'))
    ]);
  session.endDialog(msg);

}



//=========================================================
// Bots Dialogs
//=========================================================
bot.dialog('/',
    function (session, results) {
		var id = new Date().toLocaleString();
    var message = session.message;

    var messageText             = session.message.text;
    var messageAttachments      = session.message.attachments;
    var firsttimer_quotes       = ['hello','hi','about','yo','wassa','hallo', 'get started'];
    var information_quotes      = ['rtbf','information','more info','i want some information','need info','info','i am looking for information'];
    var help_quotes             = ['help','what?','huh','help!','help?','/help'];
    var faul_quotes             = ['nazi','fuck','bitch','idiot', 'nigger'];
    var thank_quotes            = ['thanks','thank you', 'great','awesome', 'appreciated'];
    var bye_quotes              = ['bye bye','bye','later','see ya'];
    var stop_quotes             = ['stop','exit','quit','abort','cancel'];
    var datacontrolllers_quotes = ['google','apple','facebook','amazon','microsoft'];
    var explain_quotes          = ['explain','explanation','explain this','explain please','explain this please'];
    var start_quotes            = ['start','lets go','vamos','start process'];

    if (messageText != '') {

      // add url to perform api call GET
      if (messageText.toLowerCase() == 'test get') {
        session.send(sendThis('http://95.85.32.215:5000/rtbf/get'));
      }

      // if we capture that the payload contains such thing like "hello, hi, get started"
      else if (firsttimer_quotes.contains(messageText.toLowerCase())) {
        session.send('Welcome at Seahorse.')
        session.sendTyping();
        sleep(4000).then(function() {
          var replyMessage = quickReplyDefault(session)
          session.send(replyMessage);
        });
      }

      // if we capture that the payload contains the first "yes"
      else if (messageText.toLowerCase().startsWith('yes')) {
        session.send('Okay clear.')
        session.sendTyping();
        sleep(3000).then(function() {
          var replyMessage = quickReplyYes(session)
          session.send(replyMessage);
        });
      }

      // if we capture that the payload contains the first "no"
      else if (messageText.toLowerCase() == 'no') {
        session.sendTyping();
        sleep(3000).then(function() {
          var replyMessage = quickReplyNo(session)
          session.send(replyMessage)
        });
      }

      // if we capture that the payload contains the first "explain this"
      else if (explain_quotes.contains(messageText.toLowerCase())) {
        session.sendTyping();
        sleep(3000).then(function() {
          var replyMessage = quickReplyExplain(session)
          session.send(replyMessage)
        });
      }

      // if we capture that the payload contains the first "how"
      else if (messageText.toLowerCase() == 'how') {
        session.sendTyping();
        sleep(3000).then(function() {
          var replyMessage = quickReplyHow(session)
          session.send(replyMessage)
        });
      }

      // if we capture that the payload contains the first "why"
      else if (messageText.toLowerCase() == 'why') {
        session.sendTyping();
        sleep(3000).then(function() {
          var replyMessage = quickReplyWhy(session)
          session.send(replyMessage)
        });
      }

      // if we capture that the payload contains the first "process"
      else if (messageText.toLowerCase() == 'process') {
        session.sendTyping();
        sleep(3000).then(function() {
          var replyMessage = quickReplyProcess(session)
          session.send(replyMessage)
        });
      }

      // if we capture that the payload contains such thing like "Google or Facebook"?
      else if (start_quotes.contains(messageText.toLowerCase())) {
        session.sendTyping();
        sleep(2000).then(function() {
          var replyMessage = sendSeahorseCTA(session)
          session.send(replyMessage);
        });
      }

      // add url to perform api call ADD
      else if (messageText.toLowerCase() == 'test add') {
        session.send(addThis('http://95.85.32.215:5000/rtbf/add'));
      }

      // if faul language is send we caputure it and present this
      else if (faul_quotes.contains(messageText.toLowerCase())) {
        var msg = new builder.Message(session)
            .attachments([{
                contentType: "image/gif",
                contentUrl: "https://media.giphy.com/media/8yIngBRXYg8dq/giphy.gif"
            }]);
        session.endDialog(msg);
        session.send('I would like you not to use such language. This conversation has ended.')
      }

      // if people ask for "seahorse"
      else if (messageText.toLowerCase() == 'seahorse') {
        session.send('The seahorse crest is obvious ... why? Each and everyone will trust a Seahorse.');
      }

      // if people type answer about the "digital passport"?
      else if (messageText.toLowerCase().startsWith('digital passport?')) {
        session.sendTyping();
        sleep(6000).then(function() {
          //session.send('uPort: a self-sovereign identity system that allows people to own their identity, fully control the flow of their personal information, and authenticate themselves in various contexts - both on and off blockchain. We like to think of uport as our and the next mobile identity layer.')
          var replyMessage = quickReplyI(session)
          session.send(replyMessage);
        });
      }

      // if people type something which looks like to start the identification
      else if (messageText.toLowerCase().startsWith('start identification')) {
        session.sendTyping();
        sleep(2000).then(function() {
          //session.send('opening uPort ....... one moment')
          var replyMessage = sendSeahorseCTA(session);
          session.send(replyMessage);
        });
      }

      // if people type something which looks like a hashed string
      else if (messageText.toLowerCase().startsWith('0x')) {
        session.send('Thank you for entering the hash.')
      }

      // if we capture that the payload contains such thing like "thanks, thank you"
      else if (thank_quotes.contains(messageText.toLowerCase())) {
        session.sendTyping();
        sleep(2000).then(function() {
          session.send(':D')
          session.send('Much obliged. Thank you for using Seahorse - Right to be Forgotten service.')
        });
      }

      // if we capture that the payload contains such thing like "bye bye"
      else if (bye_quotes.contains(messageText.toLowerCase())) {
        session.sendTyping();
        sleep(2000).then(function() {
          session.send(':wave:, bye bye')
        });
      }

      // if we capture that the payload contains such thing like "/help or help"?
      else if (help_quotes.contains(messageText.toLowerCase())) {
        session.sendTyping();
        sleep(2000).then(function() {
          var replyMessage = helpButton(session)
          session.send(replyMessage)
        });
      }

      // if we capture that the payload contains such thing like "bye bye"
      else if (messageText.toLowerCase() == 'enter data policy') {
        session.sendTyping();
        sleep(2000).then(function() {
          var replyMessage = quickReplyDataControl(session)
          session.send(replyMessage)
        });
      }

      // if we capture that the payload contains such thing like "Google or Facebook"?
      else if (datacontrolllers_quotes.contains(messageText.toLowerCase())) {
        session.sendTyping();
        sleep(2000).then(function() {
          session.endDialog(quickReply(session))
        });
      }

      // if we capture that the payload contains such thing like "privacy"?
      else if (messageText.toLowerCase() == 'privacy') {
        session.sendTyping();
        sleep(3000).then(function() {
          session.send('Better  data  protection  rules  mean  that  you  can  be more confident about how your personal data is treated, particularly online.')
          session.send('These stronger data protection rules will help increase trust in online services.')
          var replyMessage = quickReplyA(session)
          session.send(replyMessage)
        });
      }

      // if we capture that the payload contains such thing like "privacy"?
      else if (messageText.toLowerCase() == 'gdpr') {
        session.sendTyping();
        // first
        sleep(4000).then(function() {
          session.send('GDPR are a set of EU regulations that enables the people to take control over there personal data.')
          // second
          session.sendTyping();
          sleep(5000).then(function() {
            session.send('It is hoped that these modernised and unified rules will allow businesses to make the most of the opportunities of the Digital Single Market by reducing regulation and benefiting from reinforced consumer trust.')
            // third
            session.sendTyping();
            sleep(3000).then(function() {
              var replyMessage = quickReplyA(session)
              session.send(replyMessage)
            });
          });
        });
      }

      // if we capture that the payload contains such thing like "data"?
      else if (messageText.toLowerCase() == 'personal data') {
        session.sendTyping();
        sleep(2000).then(function() {
          session.send('Increased responsibility and accountability for those processing personal data – through data protection risk assessments, data protection officers, and the principles of "data protection by design" and "data protection by default".')
          var replyMessage = quickReplyA(session)
          session.send(replyMessage)
        });
      }

      // if we capture that the payload contains such thing like "info or information"?
      else if (information_quotes.contains(messageText.toLowerCase())) {
        session.sendTyping();
        sleep(3000).then(function() {
          session.send('A right to be forgotten will help you manage data protection risks online. When you no longer want your data to be processed and there are no legitimate grounds for retaining it, the data will be deleted.')
        });
        sleep(8000).then(function() {
          session.send('The rules are about empowering individuals, not about erasing past events, re-writing history or restricting the freedom of the press.')
          session.send(quickReplyRTBF(session))
        });
      }

      // if we capture that the payload contains such thing like "what is this?"?
      else if (messageText.toLowerCase() == 'what is this?') {
        session.sendTyping();
        sleep(2000).then(function() {
          session.send('You can either upload an personal QR code (a barcode that represents you) or enter an personal hash. A hash is a string of characters (starting with 0x) also representing you.')
          var replyMessage = quickReplyC(session)
          session.send(replyMessage)
        });
      }

      // if we capture that the payload contains such thing like "what is seahorse?"?
      else if (messageText.toLowerCase() == 'what is seahorse?') {
        session.sendTyping();
        sleep(2000).then(function() {
          session.send('Seahorse is a simple and secure way to take control over your personal data. Seahorse stores your right to be forgotten setting in a vast ocean of vaults.')
          var replyMessage = quickReplyC(session)
          session.send(replyMessage)
        });
      }

      // if we capture that the payload contains such thing like "seahorse."?
      else if (messageText.toLowerCase() == 'seahorse.') {
        session.sendTyping();
        sleep(2000).then(function() {
          session.send('Seahorse is a simple and secure way to take control over your personal data. Seahorse stores your right to be forgotten setting in a vast ocean of vaults.')
          var replyMessage = quickReplyG(session)
          session.send(replyMessage)
        });
      }

      // if we capture that the payload contains such thing like "yes i do"
      else if (messageText.toLowerCase() == 'yes i do') {
        session.sendTyping();
        sleep(2000).then(function() {
          var replyMessage = quickReplyD(session)
          session.send(replyMessage)
        });
      }

      // if we capture that the payload contains such thing like "explain this please?"
      else if (messageText.toLowerCase() == 'explain this please') {
        session.sendTyping();
        sleep(2000).then(function() {
          session.send('Select the organisation (datacontroller) which will configured with the "Right to be Forgotten" setting. To use this configuration service you will need an QR code or Hash that has been obtained by an local government service.')
          session.sendTyping();
        });
        sleep(5000).then(function() {
          session.send('You will get an response in this channel when the setting has been activated.')
          session.sendTyping();
          var replyMessage = quickReplyDataControl(session)
          session.send(replyMessage)
        });
      }

      // if we capture that the payload contains such thing like "send qr code"
      else if (messageText.toLowerCase() == 'send qr code') {
        session.sendTyping();
        sleep(2000).then(function() {
          session.send('Excellent, please send us the QR image now. \n\nYou can do this by sending us an image (the actual QR code) from your device.')
        });
      }

      // if we capture that the payload contains such thing like "enter hash"
      else if (messageText.toLowerCase() == 'enter hash') {
        session.sendTyping();
        sleep(2000).then(function() {
          session.send('Awesome, please enter the hash string now. \n\nAn hash always starts with 0x')
        });
      }

      // if we capture that the payload contains such thing like "no please continue"
      else if (messageText.toLowerCase() == 'no please continue') {
        session.sendTyping();
        sleep(2000).then(function() {
          var replyMessage = quickReplyD(session)
          session.send(replyMessage)
        });
      }

      // if we capture that the payload contains such thing like "no thanks"
      else if (messageText.toLowerCase() == 'no thanks') {
        session.sendTyping();
        sleep(2000).then(function() {
          var replyMessage = quickReplyE(session)
        });
      }

      // if we capture that the payload contains such thing like stop we present this
      else if (stop_quotes.contains(messageText.toLowerCase())) {
        session.sendTyping();
        sleep(2000).then(function() {
          session.send(':wave: goodbye and have a nice day.')
        });
      }

      // if we capture that the payload contains such thing like "other"
      else if (messageText.toLowerCase() == 'other') {
        session.sendTyping();
        sleep(2000).then(function() {
          session.send('We are very gratefull if you now enter the datacontroller that you want to configure with the "Right to be Forgotten".')
        });
      }

      // if we capture that the payload contains such thing like "leo"
      else if (messageText.toLowerCase() == 'leo') {
        session.sendTyping();
        sleep(2000).then(function() {
          session.send('Got it. That is my master. Do you want to meet him ...')
        });
      }

      // everything else that has been captured and not known will result in this response
      else if (messageText != '') {
        session.send('Sorry my NLP is not up to date. I am just a simple bot, please type /help')
      }

    } else {

      //============================================================//
      // get image                                                  //
      // send towards external qrserver and read api                //
      // present data that comes from api                           //
      //============================================================//

      var URI = encodeURIComponent(message.attachments[0].contentUrl)
      var data = JSON.parse(httpGet('http://api.qrserver.com/v1/read-qr-code/?fileurl=' + URI));

      session.send('One moment please while we quickly process the QR code')
      session.sendTyping();

      sleep(5000).then(function() {
        session.send('This is the hashed code you send us: ')
        session.send(data[0].symbol[0].data);
        session.send('Much obliged the attachment received and processed')
      });
    }
  }
 );
