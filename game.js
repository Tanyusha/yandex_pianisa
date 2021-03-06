(function ($) {
    var exports = window;
    var $game_begin_form = $("#game_begin_form");
    var $count_of_gamer = $("#count_of_gamer");
    var $start_button = $("#start_button");

    var $game_map = $("#game_map");

    var $game_control = $("#game_control");
    var $play_round = $("#play_round");
    var $game_over = $("#game_over");

    var card_game = {
        players: [],
        spor_cards: [],
        spor_players_indexes: [],
        state: ['begin'],
        spor_state: 0,
        inited: false
    };

    function init() {
        $game_map.hide();
        $game_control.hide();
        $start_button.click(function () {
            $game_begin_form.hide();
            var n = Number($count_of_gamer.val());
            start(n);
        });

    }

    function get_card_url_by_id(id) {
        var number = id.slice(0, -1);
        var card_suit = id[id.length - 1];
        var name1 = number;
        var name2 = "";
        var name3 = ".png";
        if (name1 == "11") {
            name1 = "jack";
            name3 = "2.png";
        }
        else if (name1 == "12") {
            name1 = "queen";
            name3 = "2.png";
        }
        else if (name1 == "13") {
            name1 = "king";
            name3 = "2.png";
        }
        else if (name1 == "14") {
            name1 = "ace";
        }

        if (card_suit == "A") {
            name2 = "hearts";
        }
        else if (card_suit == "B") {
            name2 = "diamonds";
        }
        else if (card_suit == "B") {
            name2 = "diamonds";
        }
        else if (card_suit == "C") {
            name2 = "spades";
        }
        else if (card_suit == "D") {
            name2 = "clubs";
        }

        return "img/cards/" + name1 + "_of_" + name2 + name3;
    }

    function create_deck_of_cards() {
        var card;
        var suit;
        var cards = [];
        for (var i = 0; i < 4; i++) {
            if (i == 0) {
                suit = "A";
            }
            else if (i == 1) {
                suit = "B";
            }
            else if (i == 2) {
                suit = "C";
            }
            else if (i == 3) {
                suit = "D";
            }
            for (var j = 2; j < 15; j++) {
                card = j + suit;
                cards.push(card);
            }
        }
        return cards;
    }

    function mix_array(myArray) {
        if (myArray.length == 0) {
            return []
        }
        var index;
        var myArray_copy = myArray.slice(0);
        var new_myArray = [];
        var myItem;
        var count = myArray_copy.length;
        for (var i = 0; i < count; i++) {
            index = Math.floor(Math.random() * 100000000) % (count - i);
            myItem = myArray_copy.splice(index, 1)[0];
            new_myArray.push(myItem);
        }
        return new_myArray;
    }

    /*function mix_cards(cards)
     {
     var index;
     var cards_copy = cards.slice(0);
     var new_cards = [];
     var new_card;
     for (var i=0; i<52; i++)
     {
     index = Math.floor(Math.random()*100)%(52-i);
     new_card = cards_copy.splice(index,1)[0];
     new_cards.push(new_card);
     }
     return new_cards;
     }*/

    function deal_cards(count_of_players, cards) {
        var cards_copy = cards.slice(0);
        var players = [];
        var j = 0;
        var card;
        for (var i = 0; i < count_of_players; i++) {
            players.push([]);
        }

        while (cards_copy.length) {
            card = cards_copy.pop();
            players[j % count_of_players].push(card);
            j++;
        }
        return players;
    }

    function max_in_array(myArray) {

        var a = myArray[0];
        for (var i = 1; i < myArray.length; i++) {
            if (myArray[i] > a) {
                a = myArray[i];
            }
        }
        return a;
    }

    function get_game_state(players, old_state_is_spor) {
        var number;
        var first_cards = [];
        var state = [];
        var max;
        var max_indexes = [];

        for (var i = 0; i < players.length; i++) {
            if (players[i].length == 52) {
                state.push("over", i);
                return state;
            }
        }


        for (var i = 0; i < players.length; i++) {

            if (players[i].length > 0 && !old_state_is_spor) {
                number = Number(players[i][0].slice(0, -1));
            }
            else {
                number = 0;
            }

            first_cards.push(number);
        }

        if (old_state_is_spor) {
            for (var i = 0; i < card_game.spor_players_indexes.length; i++) {
                var index = card_game.spor_players_indexes[i];
                if (players[index].length > 0) {
                    number = Number(players[index][0].slice(0, -1));
                } else {
                    number = 0;
                }
                first_cards[index] = number;
            }
        }

        max = max_in_array(first_cards);

        for (var i = 0; i < first_cards.length; i++) {
            if (first_cards[i] == max) {
                max_indexes.push(i);
            }
        }

        if (max_indexes.length == 1) {
            state.push("win", max_indexes[0]);
            return state;
        }
        else {
            state.push("spor");
            state = state.concat(max_indexes);
            return state;
        }
    }

    function start(count_of_players) {
        var cards = mix_array(create_deck_of_cards());
        //cards = ["6C", "3D", "8A", "9A", "3C", "9D", "3B", "4D", "14D", "12D", "6A", "8D", "5C", "11B", "12A", "10B", "14B", "13D", "3A", "9B", "11C", "11D", "8B", "4A", "13B", "8C", "7D", "12C", "2A", "7A", "10C", "5B", "4B", "13A", "9C", "13C", "6B", "11A", "2D", "12B", "7C", "2C", "7B", "6D", "2B", "4C", "5D", "10D", "10A", "14C", "14A", "5A"];
        console.log(cards);
        var players = card_game.players = deal_cards(count_of_players, cards);
        console.log(players);

        var template;
        for (var i = 0; i < count_of_players; i++) {
            template = '<div class="gamer back_cards">' +
                '<p class ="name">Игрок' + (i + 1) + '</p>' +
                /*'<img class ="one_card" src="'+get_card_url_by_id(players[i][0])+'"/>' +*/
                '<span class="card_count">' + players[i].length + '</span>' +
                '</div>';
            $game_map.append(template);

        }

        $game_map.show(500);
        $game_control.show(500);
        $game_begin_form.hide();
        $play_round.click(play_round);
        $play_round.focus();
        $game_over.click(
            /*function () {
             var state = card_game.state;
             while (state[0] != 'over') {
             var old_state_is_spor = card_game.state[0] == "spor";
             var state = card_game.state = get_game_state(card_game.players, old_state_is_spor);

             $play_round.click();
             }
             }*/
            function () {
                location.reload();
            });

        card_game.inited = true;
        play_round();
    }

    function play_round() {

        if (!card_game.inited)
        {
            throw new Error("Game not started");
        }

        $game_map.find('.one_card').not('.spor > .one_card').remove();

        if (card_game.spor_state == 1) {
            for (var i = 1; i < card_game.state.length; i++) {
                var index = card_game.state[i];
                if (card_game.players[index].length) {
                    $game_map.children().eq(index).append('<img class="add_card" src="img/shrit_cards.png">');
                }
            }
            card_game.spor_state = 2;
            return;
        }
        else if (card_game.spor_state == 2) {
            for (var i = 1; i < card_game.state.length; i++) {
                var index = card_game.state[i];
                if (card_game.players[index].length) {
                    var a = get_card_url_by_id(card_game.players[index][0]);
                    $game_map.children().eq(index).append("<img class=\"one_card\" src=\"" + a + "\">");
                } //nocard.png
            }
        }
        else {
            for (var i = 0; i < card_game.players.length; i++) {
                if (card_game.players[i].length) {
                    var a = get_card_url_by_id(card_game.players[i][0]);
                    $game_map.children().eq(i).append("<img class=\"one_card\" src=\"" + a + "\">")
                }
            }
        }

        var $children = $game_map.children();
        for (var i = 0; i < $children.length; i++) {
            $children.eq(i).removeClass('winner').removeClass('spor');
        }
        if (card_game.spor_state != 2) {
            $('.add_card').remove();
        }

        var old_state_is_spor = card_game.state[0] == "spor";
        var state = card_game.state = get_game_state(card_game.players, old_state_is_spor);

        if (state[0] == "spor") {
            card_game.spor_state = 1;
        } else {
            card_game.spor_state = 0;
        }

        console.log(state);
        if (state[0] == "win") {
            $game_map.children().eq(state[1]).addClass('winner');
        }
        else if (state[0] == "over") {
            //$play_round.hide();
            alert("Выйграл Игорк" + (state[1] + 1));
        }
        else if (state[0] == "spor") {
            for (var i = 1; i < state.length; i++) {
                $game_map.children().eq(state[i]).addClass('spor');
            }
        }

        for (var i = 0; i < card_game.players.length; i++) {
            var count = card_game.players[i].length;
            $children.eq(i).find('.card_count').text(card_game.players[i].length);
            if (count == 0) {
                $children.eq(i).removeClass('back_cards');
            }
        }

        count_cards(state, old_state_is_spor);

    }

    function count_cards(state, old_state_is_spor) {
        if (state[0] == "win") {
            if (old_state_is_spor) {
                for (var i = 0; i < card_game.spor_players_indexes.length; i++) {
                    var index = card_game.spor_players_indexes[i];
                    if (card_game.players[index].length) {
                        var a = card_game.players[index].shift();
                        card_game.spor_cards.push(a);
                    }
                }
                card_game.players[state[1]] = card_game.players[state[1]].concat(card_game.spor_cards);
                card_game.spor_cards = [];
            }
            else {
                for (var i = 0; i < card_game.players.length; i++) {
                    if (card_game.players[i].length) {
                        var a = card_game.players[i].shift();
                        card_game.players[state[1]].push(a);
                    }
                }
            }
        }
        else if (state[0] == "spor") {
            if (old_state_is_spor) {
                for (var i = 0; i < card_game.spor_players_indexes.length; i++) {
                    var index = card_game.spor_players_indexes[i];
                    if (card_game.players[index].length) {
                        var a = card_game.players[index].shift();
                        card_game.spor_cards.push(a);
                    }
                }
            }
            else {
                for (var i = 0; i < card_game.players.length; i++) {
                    if (card_game.players[i].length) {
                        var a = card_game.players[i].shift();
                        card_game.spor_cards.push(a);
                    }
                }
            }

            for (var i = 1; i < state.length; i++) {
                var index = state[i];
                if (card_game.players[index].length) {
                    var a = card_game.players[index].shift();
                    card_game.spor_cards.push(a);
                }
            }
            card_game.spor_players_indexes = state.slice(1);
        }

    }


    function test_get_game_state() {
        /*var cards = mix_array(create_deck_of_cards())
         var players = deal_cards(6, cards)
         console.log(players);
         var state = get_game_state(players);
         console.log(state);*/

        var players = [
            [ "2A", ""],
            ["2B", ''],
            [],
            ["2B", ''],
            ["2B", ''] ,
            ['1h', 'kk']
        ];
        if (get_game_state(players).join('-') == "spor-0-1-3-4") {
            console.log('[OK]');
        } else {
            console.log('[ErrOR]');
            console.log(get_game_state(players));
        }

        players = [
            [ "3A", ""],
            ["2B", ''],
            [],
            ["11f"]
        ];
        if (get_game_state(players).join('-') == "win-3") {
            console.log('[OK]');
        } else {
            console.log('[ErrOR]');
            console.log(get_game_state(players));
        }

        var cards = mix_array(create_deck_of_cards());
        players = [
            [],
            [],
            cards,
            [],
            []
        ];
        if (get_game_state(players).join('-') == "over-2") {
            console.log('[OK]');
        } else {
            console.log('[ErrOR]');
            console.log(get_game_state(players));
        }

    }

    exports.game = {
        init: init,
        status: get_game_state,
        play_round: play_round,
        start: start
    };

})(jQuery);
