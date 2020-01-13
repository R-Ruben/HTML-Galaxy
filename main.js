//Settings
var planetAmount = 5;
var sizeX = $('body').width();
var sizeY = $('body').height();

//Declare variables
$star = $('.star');
$entity = $('.entity');
$planet = $('.planet');
$space = $('.space');

//Begin animation
function setup() {



    $space.css("width", sizeX);
    $space.css("height", sizeY);

    //TEMP: Remove when generating stars
    $star.css("display", "block");

    createSystem();

    //loadShadows($star);
}
setup();


function move () {
    for (i = 0;i <= IJ.planets.length - 1; i++) {
        var distance = distanceToStar(IJ.planets[i],IJ.star).distance;
        var angle = angleRadToStar(IJ.planets[i],IJ.star);
        var angleX = angleConvert(angleDegToStar(IJ.planets[i], IJ.star)).x;
        var angleY = angleConvert(angleDegToStar(IJ.planets[i], IJ.star)).y;
        var light = distanceConvert(IJ.planets[i], IJ.star).light;
        var shadow = distanceConvert(IJ.planets[i], IJ.star).shadow;
        IJ.planets[i].y = IJ.star.y + (distance*Math.sin(angle+1/1000*2*Math.PI));
            IJ.planets[i].x = IJ.star.x + (distance*Math.cos(angle+1/1000*2*Math.PI));
    $space.append('<div class="entity planet" id="id' + i + '"></div>');
        $('.planet#id' + i + '').css({
            "display": "block",
            "position": "absolute",
            "background-color": IJ.planets[i].color,
            "top": IJ.planets[i].y - IJ.planets[i].r,
            "left": IJ.planets[i].x - IJ.planets[i].r,
            "width": IJ.planets[i].width,
            "height": IJ.planets[i].height
        });

      $('.planet#id' + i + '').css({
        "background": "radial-gradient(circle at " + angleX + "% " + angleY + "%, #aaa " + light + "%, " + IJ.planets[i].color + " 50%, #000 " + shadow + "%)",
        });
}
setTimeout(function () {
    move();
  }, 40);
}


function SolarSystem(planets, star) {
    this.planets = planets;
    this.star = star;
}




function Star(x, y, width, height, color) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.r = width/2;
    this.color = color;
}

function Planet(x, y, width, height, color) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.r = width/2
    this.color = color;
}


function loadShadows(star) {
    $('.planet').each(function (i) {
        $(this).css({
            background: 'radial-gradient(circle at ' + angleConvert(angleDegToStar($(this), star)).x + '% ' + angleConvert(angleDegToStar($(this), star)).y + '%, #aaa 20%, ' + $(this).css('backgroundColor') + ' 60%, #000 90%)'
        });
    });


    
};


//TO DO: distance vinden tussen planeet en ster en toevoegen als shadow parameter

var IJ;

//Create solarsystem
function createSystem() {
    var planets = new Array();
    var star1 = new Star(400, 400, 100, 100, '#fff');
    $space.append('<div class="entity star" id="id1"></div>');
    $('.star#id1').css({
        "display": "block",
        "position": "absolute",
        "background-color": star1.color,
        "top": star1.y - star1.r,
        "left": star1.x - star1.r,
        "width": star1.width,
        "height": star1.height
    });
    console.log(star1.height);

    for (i = 0; i <= planetAmount - 1; i++) {
        planets.push(new Planet(Math.floor(Math.random() * (sizeX - 50 + 1) + 50), Math.floor(Math.random() * (sizeY - 50 + 1) + 50), 50, 50, getPlanetColor()));
        $space.append('<div class="entity planet" id="id' + i + '"></div>');
        $('.planet#id' + i + '').css({
            "display": "block",
            "position": "absolute",
            "background-color": planets[i].color,
            "top": planets[i].y - planets[i].r,
            "left": planets[i].x - planets[i].r,
            "width": planets[i].width,
            "height": planets[i].height
        });

        $('.planet#id' + i + '').css({
            "background": "radial-gradient(circle at " + angleConvert(angleDegToStar(planets[i], star1)).x + "% " + angleConvert(angleDegToStar(planets[i], star1)).y + "%, #aaa " + distanceConvert(planets[i], star1).light + "%, " + planets[i].color + " 50%, #000 " + distanceConvert(planets[i], star1).shadow + "%)",
        });



    }
    IJ = new SolarSystem(planets, star1);
    $star = $('.star');
    move();
}
//Generate a color string
function getPlanetColor() {
    var letters = '3456789ABCD';
    var color = '#';
    for (var i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 11)];
    }
    return color;
}

function getPos(entity) {
    var x = entity.position();
    return {
        y: x.top,
        x: x.left
    };

};

function distanceToStar(entity, star) {
    var starX = star.x;
    var starY = star.y;
    var entityX = entity.x;
    var entityY = entity.y;
    var xDiff = starX - entityX
    var yDiff = starY - entityY;
    var distance = Math.sqrt(Math.pow(xDiff, 2) + Math.pow(yDiff, 2));
    return {
        y: yDiff,
        x: xDiff,
        distance: distance,
    };


};
function angleRadToStar(entity, star) {
    try {
        var angleRad = Math.atan2(entity.y - star.y, entity.x - star.x);
        
        return angleRad;
    } catch (err) {
        console.log("error: " + err);
    }
};
function angleDegToStar(entity, star) {
    try {
        var angleDeg = Math.atan2(distanceToStar(entity, star).y, distanceToStar(entity, star).x) * 180 / Math.PI;
        return angleDeg;
    } catch (err) {
        console.log("error: " + err);
    }
};

function distanceConvert(entity, star) {
    var distance = distanceToStar(entity, star).distance;
    var shadow = (sizeX - distance) / sizeX * 100+20;
    var light = (sizeX - distance) / sizeX * 100 - 50;

    return {
        light: light,
        shadow: shadow
    };
}

function angleConvert(angle) {

    var x;
    var y;

    if (angle >= -180 & angle <= -90) {
        x = (180 + angle) / 90 * 50;

    } else if (angle > -90 & angle <= 0) {
        x = (90 + angle) / 90 * 50 + 50;

    } else if (angle > 0 & angle <= 90) {
        x = -(angle - 90) / 90 * 50 + 50;

    } else {
        x = (180 - angle) / 90 * 50;

    }

    if (angle >= -180 & angle <= -90) {
        y = (angle + 90) / -90 * 50;

    } else if (angle > -90 & angle <= 0) {
        y = (angle + 90) / 90 * 50;

    } else if (angle > 0 & angle <= 90) {
        y = (angle / 90 * 50) + 50;

    } else {
        y = (180 - angle) / 90 * 50 + 50;

    }
    return {
        y: y,
        x: x
    };
};