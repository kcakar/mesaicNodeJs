const moment =require('moment');
const db=require('./db');
const uuidv1 = require('uuid/v1');

function getMockData(count){
    let students=[];
    const sampleNames = ["Tandy","Manie","Meg","Portia","Audrey","Svetlana","Kortney","Chantel","Tyrone","Amado","Theda","Earleen","Milton","Tammera","Vernia","Regenia","Agustin","Shirleen","Chandra","Lorenzo","Cira","Toccara","Jana","Miriam","Cecelia","Linnea","Hiroko","Elida","Rodrick","Kelli","Jinny","Mamie","Santina","Bruno","Justa","Rochel","Eileen","Antoinette","Chanelle","Nakia","Nathalie","Dorcas","Wonda","Joette","Meghan","Mike","Jacalyn","Marcella","Annice","Janessa"];
    const sampleSurnames = ["D'amico","De haan","Lindauer","Eberhart","Platt","Cicinelli","Horsley","Yandell","Shleifer","Band","Watowich","Laurabee","Shibuya","Lazonick","Oda","Ridder","Colasanti","Trench","Hayakawa","Mccraw","Glunt","Foulley","Dalzell","Concino","Laperriere","Lutfi","Shiring","Shanker","Hartka","Ansley","Tivnan","Majercik","Walden","Lichtenberg","Wake","Aurelius","Leighton","Maceachern","Borcic","Kemple","Solomon","Liberatore","Eichkern","Quigley","Taggart"];

    for(let i=0;i<count;i++){
        students.push({
            "id":uuidv1(),
            "firstName":sampleNames[Math.floor(Math.random()*sampleNames.length)],
            "lastName":sampleSurnames[Math.floor(Math.random()*sampleSurnames.length)],
            "birthDate":moment(new Date().setFullYear((new Date().getFullYear()-Math.floor(Math.random()*15)+10))).format('YYYY-MM-DD HH:mm:ss'),
            "hobbies":getHobbies(),
            "photoUrl":"/img/default.png",
            "dateCreated":moment(new Date()).format('YYYY-MM-DD HH:mm:ss')
        })
    }
    return students;
}

function getHobbies(){
    const sampleHobbies = [ "Acrobatics", "Acting", "Amateur radio", "Animation", "Aquascaping", "Baking", "Baton twirling", "Beatboxing", "Board/tabletop games", "Book restoration", "Cabaret", "Calligraphy", "Candle making", "Coffee roasting" ];
    let hobbies="";
    const amount=Math.floor(Math.random()*5)+1;
    for(let i=0;i<amount;i++)
    {
        if(i!==0)
        {
            hobbies+=", ";
        }
        hobbies+=sampleHobbies[Math.floor(Math.random()*sampleHobbies.length)]
    }
    return hobbies;
}

//check if db already exists
db.init(getMockData);