'use strict'

const Hapi = require('hapi');
const server = new Hapi.Server();
const kue = require('kue')
  , queue = kue.createQueue();

const Inert = require('inert');


queue.process('user',(job,done)=>{
	setTimeout(()=>{
		console.log('Created User Successfully',job.data.user);
		done();	
	}, 500);
	
});


var adjectives = ["adamant", "adroit", "amatory", "animistic", "antic", "arcadian", "baleful", "bellicose", "bilious", "boorish", "calamitous", "caustic", "cerulean", "comely", "concomitant", "contumacious", "corpulent", "crapulous", "defamatory", "didactic", "dilatory", "dowdy", "efficacious", "effulgent", "egregious", "endemic", "equanimous", "execrable", "fastidious", "feckless", "fecund", "friable", "fulsome", "garrulous", "guileless", "gustatory", "heuristic", "histrionic", "hubristic", "incendiary", "insidious", "insolent", "intransigent", "inveterate", "invidious", "irksome", "jejune", "jocular", "judicious", "lachrymose", "limpid", "loquacious", "luminous", "mannered", "mendacious", "meretricious", "minatory", "mordant", "munificent", "nefarious", "noxious", "obtuse", "parsimonious", "pendulous", "pernicious", "pervasive", "petulant", "platitudinous", "precipitate", "propitious", "puckish", "querulous", "quiescent", "rebarbative", "recalcitant", "redolent", "rhadamanthine", "risible", "ruminative", "sagacious", "salubrious", "sartorial", "sclerotic", "serpentine", "spasmodic", "strident", "taciturn", "tenacious", "tremulous", "trenchant", "turbulent", "turgid", "ubiquitous", "uxorious", "verdant", "voluble", "voracious", "wheedling", "withering", "zealous"];
var nouns = ["ninja", "chair", "pancake", "statue", "unicorn", "rainbows", "laser", "senor", "bunny", "captain", "nibblets", "cupcake", "carrot", "gnomes", "glitter", "potato", "salad", "toejam", "curtains", "beets", "toilet", "exorcism", "stick figures", "mermaid eggs", "sea barnacles", "dragons", "jellybeans", "snakes", "dolls", "bushes", "cookies", "apples", "ice cream", "ukulele", "kazoo", "banjo", "opera singer", "circus", "trampoline", "carousel", "carnival", "locomotive", "hot air balloon", "praying mantis", "animator", "artisan", "artist", "colorist", "inker", "coppersmith", "director", "designer", "flatter", "stylist", "leadman", "limner", "make-up artist", "model", "musician", "penciller", "producer", "scenographer", "set decorator", "silversmith", "teacher", "auto mechanic", "beader", "bobbin boy", "clerk of the chapel", "filling station attendant", "foreman", "maintenance engineering", "mechanic", "miller", "moldmaker", "panel beater", "patternmaker", "plant operator", "plumber", "sawfiler", "shop foreman", "soaper", "stationary engineer", "wheelwright", "woodworkers"];

server.connection({port:3000});

server.route({
    method: 'GET',
    path: '/customer/{customer_id}/users',
    handler: function (request, reply) {
    	var Readable = require('stream').Readable;
        var rs = Readable();
        rs._read= ()=>{};
    	let users = [...new Array(10)].map(item=>adjectives[Math.floor(10*Math.random())]+' '+nouns[Math.floor(10*Math.random())]);
    	console.log(users);
    	let i=0;
    	for(let user of users){
    		let job = queue.create('user',{user:user}).save();
    		// console.log(job);
    		job.on('complete',(r)=>{
    			i++;
    			console.log("Created",i);
    			// reply.event({id: i, name: user});
    			rs.push(JSON.stringify({id: i, name: user}));
    			if(i>= users.length){
    				console.log("Completed");
    				// reply.event(null);
    			}
    		});
    		  
    	}
    	reply.event(rs);
    }
});


server.register([require('susie'),Inert],(err)=>{
	server.route({
	method: 'GET',
	path:'/',
	handler:{
		file:'index.html'
	}
});

	server.start((err)=>{
		console.log("Server-running at "+server.info.uri);
	})
});