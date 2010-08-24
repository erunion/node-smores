/* 
 * More info at: http://phpjs.org
 * 
 * This is version: 3.17
 * php.js is copyright 2010 Kevin van Zonneveld.
 * 
 * Portions copyright Brett Zamir (http://brett-zamir.me), Kevin van Zonneveld
 * (http://kevin.vanzonneveld.net), Onno Marsman, Theriault, Michael White
 * (http://getsprink.com), Waldo Malqui Silva, Paulo Freitas, Jonas Raoni
 * Soares Silva (http://www.jsfromhell.com), Jack, Philip Peterson, Legaev
 * Andrey, Ates Goral (http://magnetiq.com), Alex, Ratheous, Martijn Wieringa,
 * lmeyrick (https://sourceforge.net/projects/bcmath-js/), Nate, Philippe
 * Baumann, Enrique Gonzalez, Webtoolkit.info (http://www.webtoolkit.info/),
 * Jani Hartikainen, Ash Searle (http://hexmen.com/blog/), travc, Ole
 * Vrijenhoek, Carlos R. L. Rodrigues (http://www.jsfromhell.com),
 * http://stackoverflow.com/questions/57803/how-to-convert-decimal-to-hex-in-javascript,
 * Michael Grier, Johnny Mast (http://www.phpvrouwen.nl), stag019, Rafał
 * Kukawski (http://blog.kukawski.pl), pilus, T.Wild, Andrea Giammarchi
 * (http://webreflection.blogspot.com), WebDevHobo
 * (http://webdevhobo.blogspot.com/), GeekFG (http://geekfg.blogspot.com),
 * d3x, Erkekjetter, marrtins, Steve Hilder, Martin
 * (http://www.erlenwiese.de/), Robin, Oleg Eremeev, mdsjack
 * (http://www.mdsjack.bo.it), majak, Mailfaker (http://www.weedem.fr/),
 * David, felix, Mirek Slugen, KELAN, Paul Smith, Marc Palau, Chris, Josh
 * Fraser
 * (http://onlineaspect.com/2007/06/08/auto-detect-a-time-zone-with-javascript/),
 * Breaking Par Consulting Inc
 * (http://www.breakingpar.com/bkp/home.nsf/0/87256B280015193F87256CFB006C45F7),
 * Tim de Koning (http://www.kingsquare.nl), Arpad Ray (mailto:arpad@php.net),
 * Public Domain (http://www.json.org/json2.js), Michael White, Steven
 * Levithan (http://blog.stevenlevithan.com), Joris, gettimeofday, Sakimori,
 * Alfonso Jimenez (http://www.alfonsojimenez.com), Aman Gupta, Caio Ariede
 * (http://caioariede.com), AJ, Diplom@t (http://difane.com/), saulius,
 * Pellentesque Malesuada, Thunder.m, Tyler Akins (http://rumkin.com), Felix
 * Geisendoerfer (http://www.debuggable.com/felix), gorthaur, Imgen Tata
 * (http://www.myipdf.com/), Karol Kowalski, Kankrelune
 * (http://www.webfaktory.info/), Lars Fischer, Subhasis Deb, josh, Frank
 * Forte, Douglas Crockford (http://javascript.crockford.com), Adam Wallner
 * (http://web2.bitbaro.hu/), Marco, paulo kuong, madipta, Gilbert, duncan,
 * ger, mktime, Oskar Larsson Högfeldt (http://oskar-lh.name/), Arno, Nathan,
 * Mateusz "loonquawl" Zalega, ReverseSyntax, Francois, Scott Cariss, Slawomir
 * Kaniecki, Denny Wardhana, sankai, 0m3r, noname, john
 * (http://www.jd-tech.net), Nick Kolosov (http://sammy.ru), Sanjoy Roy,
 * Shingo, nobbler, Fox, marc andreu, T. Wild, class_exists, Jon Hohle,
 * Pyerre, JT, Thiago Mata (http://thiagomata.blog.com), Linuxworld, Ozh,
 * nord_ua, lmeyrick (https://sourceforge.net/projects/bcmath-js/this.),
 * Thomas Beaucourt (http://www.webapp.fr), David Randall, merabi, T0bsn,
 * Soren Hansen, Peter-Paul Koch (http://www.quirksmode.org/js/beat.html),
 * MeEtc (http://yass.meetcweb.com), Bryan Elliott, Tim Wiel, Brad Touesnard,
 * XoraX (http://www.xorax.info), djmix, Hyam Singer
 * (http://www.impact-computing.com/), Paul, J A R, kenneth, Raphael (Ao
 * RUDLER), David James, Steve Clay, Ole Vrijenhoek (http://www.nervous.nl/),
 * Marc Jansen, Francesco, Der Simon (http://innerdom.sourceforge.net/), echo
 * is bad, Lincoln Ramsay, Eugene Bulkin (http://doubleaw.com/), JB, Bayron
 * Guevara, Stoyan Kyosev (http://www.svest.org/), LH, Matt Bradley, date,
 * Kristof Coomans (SCK-CEN Belgian Nucleair Research Centre), Pierre-Luc
 * Paour, Martin Pool, Brant Messenger (http://www.brantmessenger.com/), Kirk
 * Strobeck, Saulo Vallory, Christoph, Wagner B. Soares, Artur Tchernychev,
 * Valentina De Rosa, Jason Wong (http://carrot.org/), Daniel Esteban,
 * strftime, Rick Waldron, Mick@el, Anton Ongson, Simon Willison
 * (http://simonwillison.net), Gabriel Paderni, Philipp Lenssen, Marco van
 * Oort, Bug?, Blues (http://tech.bluesmoon.info/), Tomasz Wesolowski, rezna,
 * Eric Nagel, Bobby Drake, Luke Godfrey, Pul, uestla, Alan C, Zahlii, Ulrich,
 * Yves Sucaet, hitwork, sowberry, johnrembo, Brian Tafoya
 * (http://www.premasolutions.com/), Nick Callen, Steven Levithan
 * (stevenlevithan.com), ejsanders, Scott Baker, Philippe Jausions
 * (http://pear.php.net/user/jausions), Aidan Lister
 * (http://aidanlister.com/), Norman "zEh" Fuchs, Rob, HKM, ChaosNo1, metjay,
 * strcasecmp, strcmp, Taras Bogach, jpfle, Alexander Ermolaev
 * (http://snippets.dzone.com/user/AlexanderErmolaev), DxGx, kilops, Orlando,
 * dptr1988, Le Torbi, Pedro Tainha (http://www.pedrotainha.com), James,
 * penutbutterjelly, Christian Doebler, baris ozdil, Greg Frazier, Tod
 * Gentille, Alexander M Beedie, Ryan W Tenney (http://ryan.10e.us),
 * FGFEmperor, gabriel paderni, Atli Þór, Maximusya, daniel airton wermann
 * (http://wermann.com.br), 3D-GRAF, Yannoo, jakes, Riddler
 * (http://www.frontierwebdev.com/), T.J. Leahy, stensi, Matteo, Billy, vlado
 * houba, Itsacon (http://www.itsacon.net/), Jalal Berrami, Victor, fearphage
 * (http://http/my.opera.com/fearphage/), Luis Salazar
 * (http://www.freaky-media.com/), FremyCompany, Tim de Koning, taith, Cord,
 * Manish, davook, Benjamin Lupton, Garagoth, Andrej Pavlovic, Dino, William,
 * rem, Russell Walker (http://www.nbill.co.uk/), Jamie Beck
 * (http://www.terabit.ca/), setcookie, Michael, YUI Library:
 * http://developer.yahoo.com/yui/docs/YAHOO.util.DateLocale.html, Blues at
 * http://hacks.bluesmoon.info/strftime/strftime.js, DtTvB
 * (http://dt.in.th/2008-09-16.string-length-in-bytes.html), Andreas, meo,
 * Greenseed, Luke Smith (http://lucassmith.name), Kheang Hok Chin
 * (http://www.distantia.ca/), Rival, Diogo Resende, Allan Jensen
 * (http://www.winternet.no), Howard Yeend, Jay Klehr, Amir Habibi
 * (http://www.residence-mixte.com/), mk.keck, Yen-Wei Liu, Leslie Hoare, Ben
 * Bryan, Cagri Ekin, booeyOH
 * 
 * Dual licensed under the MIT (MIT-LICENSE.txt)
 * and GPL (GPL-LICENSE.txt) licenses.
 * 
 * Permission is hereby granted, free of charge, to any person obtaining a
 * copy of this software and associated documentation files (the
 * "Software"), to deal in the Software without restriction, including
 * without limitation the rights to use, copy, modify, merge, publish,
 * distribute, sublicense, and/or sell copies of the Software, and to
 * permit persons to whom the Software is furnished to do so, subject to
 * the following conditions:
 * 
 * The above copyright notice and this permission notice shall be included
 * in all copies or substantial portions of the Software.
 * 
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
 * OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
 * MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
 * IN NO EVENT SHALL KEVIN VAN ZONNEVELD BE LIABLE FOR ANY CLAIM, DAMAGES
 * OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE,
 * ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR
 * OTHER DEALINGS IN THE SOFTWARE.
 */ 


// jslint.com configuration options. See: http://wiki.github.com/kvz/phpjs/jslint-options
/* global window */
/* jslint adsafe: false, bitwise: false, browser: false, cap: false, css: false, debug: false, devel: false, eqeqeq: true, evil: false, forin: false, fragment: false, immed: true, indent: 4, laxbreak: false, maxerr: 100, maxlen: 80, newcap: true, nomen: false, on: true, onevar: false, passfail: false, plusplus: false, regexp: false, rhino: false, safe: false, sidebar: false, strict: false, sub: false, undef: true, white: false, widget: false */

// Our idea with CommonJS is that you can do the following:
// var php = require('php');
// php.md5('test');

exports.in_array = function (needle, haystack, argStrict) {
    // Checks if the given value exists in the array  
    // 
    // version: 1006.1915
    // discuss at: http://phpjs.org/functions/in_array
    // +   original by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
    // +   improved by: vlado houba
    // +   input by: Billy
    // +   bugfixed by: Brett Zamir (http://brett-zamir.me)
    // *     example 1: \php.in_array('van', ['Kevin', 'van', 'Zonneveld']);
    // *     returns 1: true
    // *     example 2: \php.in_array('vlado', {0: 'Kevin', vlado: 'van', 1: 'Zonneveld'});
    // *     returns 2: false
    // *     example 3: \php.in_array(1, ['1', '2', '3']);
    // *     returns 3: true
    // *     example 3: \php.in_array(1, ['1', '2', '3'], false);
    // *     returns 3: true
    // *     example 4: \php.in_array(1, ['1', '2', '3'], true);
    // *     returns 4: false
    var key = '', strict = !!argStrict;

    if (strict) {
        for (key in haystack) {
            if (haystack[key] === needle) {
                return true;
            }
        }
    } else {
        for (key in haystack) {
            if (haystack[key] == needle) {
                return true;
            }
        }
    }

    return false;
};


